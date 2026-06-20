import { reactive } from 'vue'

const notifications = reactive([])
let nextId = 0

export function notify(message, type = 'error') {
  const id = ++nextId
  notifications.push({ id, message, type })
  setTimeout(() => {
    const idx = notifications.findIndex((n) => n.id === id)
    if (idx !== -1) notifications.splice(idx, 1)
  }, 5000)
}

export function useNotifications() {
  return { notifications }
}
