import api from './api'

class NotificationService {

  async getNotifications(params = {}) {
    try {
      const response = await api.get('/notifications', { params })
      return {
        success: true,
        data: response.data.data,
        unreadCount: response.data.unread_count
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error retreiving notifications'
      }
    }
  }


  async getUnreadCount() {
    try {
      const response = await api.get('/notifications/unread-count')
      return {
        success: true,
        data: response.data.data.unread_count
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération du compteur'
      }
    }
  }


  async markAsRead(notificationId) {
    try {
      const response = await api.patch(`/notifications/${notificationId}/read`)
      return {
        success: true,
        message: response.data.message
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error mark notification'
      }
    }
  }

 
  async markAllAsRead() {
    try {
      const response = await api.post('/notifications/mark-all-read')
      return {
        success: true,
        message: response.data.message
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors du marquage de toutes les notifications'
      }
    }
  }
}

export default new NotificationService()
