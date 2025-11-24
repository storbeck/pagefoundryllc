import 'dotenv/config'
import crypto from 'node:crypto'
import { createClient } from 'redis'

// Basic config
const MESSAGE_LIST_KEY = 'contact:messages'
const MAX_MESSAGES = 200
const MIN_FORM_TIME_MS = 0

const redisUrl = process.env.REDIS_URL
const redisClient = redisUrl ? createClient({ url: redisUrl }) : null
let redisReady = false
const redisReadyPromise = redisClient
  ? redisClient
      .connect()
      .then(() => {
        redisReady = true
      })
      .catch((err) => {
        console.warn('Redis connection failed, using memory store', err)
        return null
      })
  : Promise.resolve(null)

const memoryStore = {
  data: [],
  counts: new Map()
}

const allowedOrigins = () => {
  const env = process.env.ALLOWED_ORIGINS || ''
  return env
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean)
}

const maskIp = (ip = '') => {
  if (!ip) return 'unknown'
  // mask ipv4/ipv6 to last two segments
  if (ip.includes(':')) {
    const parts = ip.split(':').filter(Boolean)
    return `***:${parts.slice(-2).join(':')}`
  }
  const parts = ip.split('.')
  return `${parts[0] || '*'}.*.*.${parts[3] || '*'}`
}

const removeMessage = async (selector) => {
  const { id, createdAt, email } = selector || {}
  if (!id && !createdAt) return false

  const matches = (parsed) => {
    if (!parsed) return false
    if (id && parsed.id === id) return true
    if (createdAt && parsed.createdAt === Number(createdAt)) {
      if (email && parsed.email !== email) return false
      return true
    }
    return false
  }

  await redisReadyPromise
  if (redisClient && redisReady) {
    const items = await redisClient.lRange(MESSAGE_LIST_KEY, 0, MAX_MESSAGES)
    const target = items.find((raw) => {
      try {
        const parsed = JSON.parse(raw)
        return matches(parsed)
      } catch {
        return false
      }
    })
    if (!target) return false
    await redisClient.lRem(MESSAGE_LIST_KEY, 1, target)
    return true
  }
  const idx = memoryStore.data.findIndex((raw) => {
    try {
      const parsed = JSON.parse(raw)
      return matches(parsed)
    } catch {
      return false
    }
  })
  if (idx === -1) return false
  memoryStore.data.splice(idx, 1)
  return true
}

const normalizeBody = (body) => {
  if (!body) return {}
  if (typeof body === 'string') {
    try {
      return JSON.parse(body)
    } catch {
      return {}
    }
  }
  return body
}

const validatePayload = (rawBody) => {
  const body = normalizeBody(rawBody)
  const errors = []
  const { name = '', email = '', message = '', website = '' } = body || {}

  if (website && website.toString().trim()) {
    errors.push('honeypot')
  }

  if (!name || name.length > 160) errors.push('name')
  const emailOk = email && /.+@.+\..+/.test(email) && email.length <= 200
  if (!emailOk) errors.push('email')
  if (!message || message.length < 1 || message.length > 5000) errors.push('message')

  return errors
}

const sameOriginOk = (req) => {
  const origin = req.headers.origin || req.headers.referer || ''
  if (!origin) return true
  const host = req.headers.host
  const list = allowedOrigins()
  const allowed = list.length ? list.some((o) => origin.startsWith(o)) : origin.includes(host)
  return allowed
}

const requireAdmin = (req) => {
  const token = process.env.CONTACT_ADMIN_TOKEN
  if (!token) return false
  const header = req.headers.authorization || ''
  if (header.startsWith('Bearer ')) return header.slice(7) === token
  if (header.startsWith('Basic ')) {
    const decoded = Buffer.from(header.slice(6), 'base64').toString('utf8')
    const [, pass] = decoded.split(':')
    return pass === token
  }
  const queryToken = req.query?.token
  return queryToken === token
}

const rateLimit = async (ip) => {
  const key = `rl:${ip}`
  if (redisClient && redisReady) {
    const count = await redisClient.incr(key)
    if (count === 1) {
      await redisClient.expire(key, 60) // 1 minute window
    }
    return count > 10
  }
  // fallback in-memory for local dev only
  const now = Date.now()
  const entry = memoryStore.counts.get(key) || { count: 0, reset: now + 60000 }
  if (now > entry.reset) {
    entry.count = 0
    entry.reset = now + 60000
  }
  entry.count += 1
  memoryStore.counts.set(key, entry)
  return entry.count > 10
}

export default async function handler(req, res) {
  console.log('[contact]', req.method, req.url)
  if (req.method === 'GET') {
    if (!requireAdmin(req)) {
      return res.status(401).json({ error: 'unauthorized' })
    }
    try {
      await redisReadyPromise
      const raw =
        redisClient && redisReady
          ? await redisClient.lRange(MESSAGE_LIST_KEY, 0, MAX_MESSAGES)
          : memoryStore.data.slice(0, MAX_MESSAGES)
      const messages = raw.map((r) => {
        try {
          return JSON.parse(r)
        } catch {
          return null
        }
      }).filter(Boolean)
      return res.status(200).json({ messages })
    } catch (error) {
      console.error('Fetch messages failed', error)
      return res.status(500).json({ error: 'failed to fetch' })
    }
  }

  if (req.method === 'DELETE') {
    if (!requireAdmin(req)) {
      return res.status(401).json({ error: 'unauthorized' })
    }
    const body = normalizeBody(req.body)
    const selector = {
      id: req.query?.id || body?.id,
      createdAt: req.query?.createdAt || body?.createdAt,
      email: req.query?.email || body?.email
    }
    if (!selector.id && !selector.createdAt) {
      return res.status(400).json({ error: 'missing selector' })
    }
    try {
      const removed = await removeMessage(selector)
      if (!removed) return res.status(404).json({ error: 'not found' })
      return res.status(200).json({ ok: true })
    } catch (err) {
      console.error('Delete failed', err)
      return res.status(500).json({ error: 'delete failed' })
    }
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, GET, DELETE')
    return res.status(405).end()
  }

  // Origin relaxed for simplicity

  const errors = validatePayload(req.body)
  if (errors.includes('honeypot')) {
    return res.status(204).end()
  }
  if (errors.length) {
    return res.status(400).json({ ok: false, errors })
  }

  const ip = (req.headers['x-forwarded-for'] || req.connection?.remoteAddress || '').toString().split(',')[0].trim()
  try {
    if (await rateLimit(ip)) {
      return res.status(429).json({ ok: false })
    }
  } catch (err) {
    console.warn('Rate limit check failed', err)
  }

  const { name, email, message } = req.body
  const record = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
    createdAt: Date.now(),
    ip: maskIp(ip)
  }

  try {
    await redisReadyPromise
    if (redisClient && redisReady) {
      await redisClient.lPush(MESSAGE_LIST_KEY, JSON.stringify(record))
      await redisClient.lTrim(MESSAGE_LIST_KEY, 0, MAX_MESSAGES - 1)
    } else {
      memoryStore.data.unshift(JSON.stringify(record))
      memoryStore.data = memoryStore.data.slice(0, MAX_MESSAGES)
    }
  } catch (error) {
    console.error('Store message failed', error)
    return res.status(500).json({ ok: false })
  }

  return res.status(200).json({ ok: true })
}
