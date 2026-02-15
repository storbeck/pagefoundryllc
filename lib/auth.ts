import { cookies } from "next/headers"
import crypto from "crypto"
import { prisma } from "@/lib/prisma"

const SESSION_COOKIE = "pf_session"

export function generateSessionToken() {
  return crypto.randomBytes(32).toString("hex") // 64 chars
}

export async function createSession(userId: string) {
  const cookieJar = await cookies()
  const token = generateSessionToken()
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) // 30 days

  await prisma.session.create({
    data: { userId, token, expiresAt }
  })

  cookieJar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  })

  return token
}

export async function destroySession() {
  const cookieJar = await cookies();
  const token = cookieJar.get(SESSION_COOKIE)?.value

  if (token) {
    await prisma.session.deleteMany({ where: { token }})
  }
  cookieJar.set(SESSION_COOKIE, "", { path: "/", expires: new Date(0) })
}

export async function getCurrentUser() {
  const cookieJar = await cookies();
  const token = cookieJar.get(SESSION_COOKIE)?.value
  if (!token) return null

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true }
  })

  if (!session) return null

  if (session.expiresAt <= new Date()) {
    await prisma.session
      .delete({ where: { token }})
      .catch(() => {})

    return null
  }

  return session.user
}

export async function requireUser() {
  const user = await getCurrentUser()
  if (!user) throw new Error("UNAUTHENTICATED")

  return user;
}