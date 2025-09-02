import api from './api'


class TaskService {

  async getTasks(params = {}) {
    try {
      const response = await api.get('/tasks', { params })
      return {
        success: true,
        data: response.data.tasks
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error retreiving tasks'
      }
    }
  }


  async getTask(taskId) {
    try {
      const response = await api.get(`/tasks/${taskId}`)
      return {
        success: true,
        data: response.data.task
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error retreiving a task'
      }
    }
  }


  async createTask(taskData) {
    try {
      const response = await api.post('/tasks', taskData)
      return {
        success: true,
        data: response.data.task,
        message: response.data.message
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error creating a task'
      }
    }
  }


  async updateTask(taskId, taskData) {
    try {
      const response = await api.put(`/tasks/${taskId}`, taskData)
      return {
        success: true,
        data: response.data,
        message: response.data.message
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error updating a task'
      }
    }
  }


  async deleteTask(taskId) {
    try {
      const response = await api.delete(`/tasks/${taskId}`)
      return {
        success: true,
        message: response.data.message
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error deleting a task'
      }
    }
  }


  async markAsCompleted(taskId) {
    try {
      const response = await api.patch(`/tasks/${taskId}/complete`)
      return {
        success: true,
        message: response.data.message
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors du marquage de la tâche'
      }
    }
  }


  
}

export default new TaskService()
