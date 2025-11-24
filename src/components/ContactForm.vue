<template>
  <div class="contact-form" :class="variantClass">
    <template v-if="sent">
      <div class="contact-form__header contact-form__thankyou">
        <div class="contact-form__checkmark">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="12" />
            <path d="M17 9 10.5 15.5 7 12" />
          </svg>
        </div>
        <div>
          <div class="contact-form__title">Thanks!</div>
          <div class="contact-form__subtitle">I’ll get back to you soon.</div>
        </div>
      </div>
    </template>
    <form v-else action="javascript:void(0)" @submit.prevent.stop="handleSubmit" novalidate>
      <div class="contact-form__header">
        <div class="contact-form__title">Let’s talk</div>
        <div class="contact-form__subtitle">Tell me about your project.</div>
      </div>

      <label class="contact-form__field">
        <span>Name</span>
        <input v-model.trim="form.name" name="name" type="text" autocomplete="name" required />
      </label>

      <label class="contact-form__field">
        <span>Email</span>
        <input v-model.trim="form.email" name="email" type="email" autocomplete="email" required />
      </label>

      <label class="contact-form__field">
        <span>Project / note</span>
        <textarea
          v-model.trim="form.message"
          name="message"
          rows="3"
          placeholder="What do you need shipped?"
          required
        ></textarea>
      </label>

      <input v-model="form.website" class="contact-form__hp" type="text" name="website" tabindex="-1" autocomplete="off" />
      <input :value="form.startedAt" type="hidden" name="startedAt" />

      <div class="contact-form__actions">
        <button type="submit" :disabled="submitting">{{ submitting ? 'Sending…' : 'Send it over' }}</button>
        <div class="contact-form__status" :class="statusClass">{{ statusText }}</div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'hero'
  }
})

const STORAGE_KEY = 'pf_contact_sent'
const form = reactive({
  name: '',
  email: '',
  message: '',
  website: '',
  startedAt: 0
})

const submitting = ref(false)
const status = ref('idle')
const sent = ref(false)
const onContactSent = () => markSent(false)
const onContactReset = () => clearSent(false)
const statusText = computed(() => {
  if (status.value === 'success') return 'Message sent'
  if (status.value === 'error') return 'Something went wrong'
  if (status.value === 'invalid') return 'Check the fields'
  if (status.value === 'sending') return 'Sending…'
  return ''
})

const variantClass = computed(() => `contact-form--${props.variant}`)
const statusClass = computed(() => (status.value && status.value !== 'idle' ? `is-${status.value}` : ''))

const markSent = (broadcast = false) => {
  if (sent.value) return
  sent.value = true
  status.value = 'success'
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, '1')
      if (broadcast) {
        window.dispatchEvent(new CustomEvent('contact:sent'))
      }
    } catch {
      /* ignore storage errors */
    }
  }
}

const clearSent = (broadcast = false) => {
  sent.value = false
  status.value = 'idle'
  resetForm()
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.removeItem(STORAGE_KEY)
      if (broadcast) {
        window.dispatchEvent(new CustomEvent('contact:reset'))
      }
    } catch {
      /* ignore storage errors */
    }
  }
}

const syncFromStorage = () => {
  if (typeof window === 'undefined') return
  try {
    if (window.localStorage.getItem(STORAGE_KEY) === '1') {
      sent.value = true
      status.value = 'success'
    }
  } catch {
    /* ignore storage errors */
  }
}

const resetForm = () => {
  form.name = ''
  form.email = ''
  form.message = ''
  form.website = ''
  form.startedAt = Date.now()
}

onMounted(() => {
  form.startedAt = Date.now()
  syncFromStorage()
  if (typeof window !== 'undefined') {
    window.addEventListener('contact:sent', onContactSent)
    window.addEventListener('contact:reset', onContactReset)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('contact:sent', onContactSent)
    window.removeEventListener('contact:reset', onContactReset)
  }
})

const handleSubmit = async (event) => {
  if (event?.preventDefault) event.preventDefault()
  if (!form.name || !form.email || !form.message) {
    status.value = 'invalid'
    return
  }
  submitting.value = true
  status.value = 'sending'
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        message: form.message,
        website: form.website,
        startedAt: form.startedAt
      })
    })
    if (!res.ok) throw new Error('Request failed')
    markSent(true)
  } catch (err) {
    console.error(err)
    status.value = 'error'
  } finally {
    submitting.value = false
  }
}
</script>
