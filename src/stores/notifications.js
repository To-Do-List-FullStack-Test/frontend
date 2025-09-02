import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { notificationService, listenToUserNotifications } from '@/services'
// import { useAuthStore } from './auth'


export const useNotificationStore = defineStore('notifications', () => {

  const notifications = ref([])
  const unreadCount = ref(0)
  const isLoading = ref(false)
  const error = ref(null)
  const isListening = ref(false)
  const echoChannel = ref(null)


  const unreadNotifications = computed(() =>
    notifications.value.filter(notification => !notification.is_read)
  )
  const readNotifications = computed(() =>
    notifications.value.filter(notification => notification.is_read)
  )
  const notificationsByType = computed(() => {
    const grouped = {}
    notifications.value.forEach(notification => {
      if (!grouped[notification.type]) {
        grouped[notification.type] = []
      }
      grouped[notification.type].push(notification)
    })
    return grouped
  })


  async function fetchNotifications(params = {}) {
    isLoading.value = true
    error.value = null

    try {
      const result = await notificationService.getNotifications(params)

      if (result.success) {
        notifications.value = result.data
        unreadCount.value = result.unreadCount || 0
        return { success: true, data: result.data }
      } else {
        error.value = result.error
        return { success: false, error: result.error }
      }
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      error.value = 'Error'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }


  async function fetchUnreadCount() {
    try {
      const result = await notificationService.getUnreadCount()

      if (result.success) {
        unreadCount.value = result.data
        return { success: true, data: result.data }
      } else {
        return { success: false, error: result.error }
      }
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      return { success: false, error: 'Error' }
    }
  }

  async function markAsRead(notificationId) {
    try {
      const result = await notificationService.markAsRead(notificationId)

      if (result.success) {
        const index = notifications.value.findIndex(n => n.id === notificationId)
        if (index !== -1) {
          notifications.value[index].is_read = true
          notifications.value[index].read_at = new Date().toISOString()
        }

        if (unreadCount.value > 0) {
          unreadCount.value--
        }

        return { success: true, message: result.message }
      } else {
        error.value = result.error
        return { success: false, error: result.error }
      }
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      error.value = 'Error'
      return { success: false, error: error.value }
    }
  }

  async function markAllAsRead() {
    try {
      const result = await notificationService.markAllAsRead()

      if (result.success) {
        notifications.value.forEach(notification => {
          notification.is_read = true
          notification.read_at = new Date().toISOString()
        })

        unreadCount.value = 0

        return { success: true, message: result.message }
      } else {
        error.value = result.error
        return { success: false, error: result.error }
      }
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      error.value = 'Error'
      return { success: false, error: error.value }
    }
  }


  function addNotification(notification) {
    const exists = notifications.value.some(n => n.id === notification.id)
    if (!exists) {
      notifications.value.unshift(notification)

      if (!notification.is_read) {
        unreadCount.value++
      }
    }
  }


  function startListening(userId) {
    if (isListening.value) {
      return
    }

    try {
      echoChannel.value = listenToUserNotifications(userId, (data) => {
        switch (data.type) {
          case 'task.created':
            addNotification({
              id: Date.now(),
              title: 'new task created',
              message: data.message,
              type: 'success',
              is_read: false,
              data: data.task,
              created_at: new Date().toISOString()
            })
            break
          case 'task.updated':
            addNotification({
              id: Date.now(),
              title: 'new task updated',
              message: data.message,
              type: 'info',
              is_read: false,
              data: data.task,
              created_at: new Date().toISOString()
            })
            break
          case 'task.deleted':
            addNotification({
              id: Date.now(),
              title: ' task deleted',
              message: data.message,
              type: 'warning',
              is_read: false,
              data: data.task,
              created_at: new Date().toISOString()
            })
            break
          case 'task.completed':
            addNotification({
              id: Date.now(),
              title: 'task completed',
              message: data.message,
              type: 'success',
              is_read: false,
              data: data.task,
              created_at: new Date().toISOString()
            })
            break
        }
      })

      isListening.value = true
    } catch (err) {
      console.error('Error:', err)
    }
  }


  function stopListening() {
    if (echoChannel.value) {
      stopListening(echoChannel.value)
      echoChannel.value = null
      isListening.value = false
    }
  }


  function clearError() {
    error.value = null
  }


  function reset() {
    notifications.value = []
    unreadCount.value = 0
    isLoading.value = false
    error.value = null
    stopListening()
  }

  return {
    // State
    notifications,
    unreadCount,
    isLoading,
    error,
    isListening,

    // Getters
    unreadNotifications,
    readNotifications,
    notificationsByType,

    // Actions
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    addNotification,
    startListening,
    stopListening,
    clearError,
    reset
  }
})
