import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { taskService } from '@/services'


export const useTaskStore = defineStore('tasks', () => {
  const tasks = ref([])
  const currentTask = ref(null)
  const isLoading = ref(false)
  const error = ref(null)
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0
  })
  const filters = ref({
    status: 'all', // all, pending, completed
    priority: 'all', // all, low, medium, high
    search: ''
  })

  const pendingTasks = computed(() =>
    tasks.value.filter(task => task.status === 'pending')
  )
  const completedTasks = computed(() =>
    tasks.value.filter(task => task.status === 'completed')
  )
  const highPriorityTasks = computed(() =>
    tasks.value.filter(task => task.priority === 'high')
  )
  const filteredTasks = computed(() => {
    let filtered = tasks.value

    if (filters.value.status !== 'all') {
      filtered = filtered.filter(task => task.status === filters.value.status)
    }

    if (filters.value.priority !== 'all') {
      filtered = filtered.filter(task => task.priority === filters.value.priority)
    }

    if (filters.value.search) {
      const searchTerm = filters.value.search.toLowerCase()
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm) ||
        task.description?.toLowerCase().includes(searchTerm)
      )
    }

    return filtered
  })

const taskStats = computed(() => ({
    total: tasks.value.length,
    pending: pendingTasks.value.length,
    completed: completedTasks.value.length,
    highPriority: highPriorityTasks.value.length
  }))


  async function fetchTasks(params = {}) {
    isLoading.value = true
    error.value = null

    try {
      const result = await taskService.getTasks(params)
      console.log("Data dyali:",result)
      if (result.success) {
        tasks.value = result.data.data || result.data
        pagination.value = {
          current_page: result.data.current_page || 1,
          last_page: result.data.last_page || 1,
          per_page: result.data.per_page || 15,
          total: result.data.total || 0
        }
        return { success: true, data: result.data }
      } else {
        error.value = result.error
        return { success: false, error: result.error }
      }
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      error.value = 'An unexpected error occurred'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  async function fetchTask(taskId) {
    isLoading.value = true
    error.value = null

    try {
      const result = await taskService.getTask(taskId)

      if (result.success) {
        currentTask.value = result.data
        return { success: true, data: result.data }
      } else {
        error.value = result.error
        return { success: false, error: result.error }
      }
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      error.value = 'An unexpected error occurred'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  async function createTask(taskData) {
    isLoading.value = true
    error.value = null

    try {
      const result = await taskService.createTask(taskData)

      if (result.success) {
        tasks.value.unshift(result.data)
        return { success: true, data: result.data, message: result.message }
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


  async function updateTask(taskId, taskData) {
    isLoading.value = true
    error.value = null

    try {
      const result = await taskService.updateTask(taskId, taskData)

      if (result.success) {
        const index = tasks.value.findIndex(task => task.id === taskId)
        if (index !== -1) {
          tasks.value[index] = { ...tasks.value[index], ...taskData }
        }

        if (currentTask.value && currentTask.value.id === taskId) {
          currentTask.value = { ...currentTask.value, ...taskData }
        }

        return { success: true, data: result.data, message: result.message }
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


  async function deleteTask(taskId) {
    isLoading.value = true
    error.value = null

    try {
      const result = await taskService.deleteTask(taskId)

      if (result.success) {
        tasks.value = tasks.value.filter(task => task.id !== taskId)

        if (currentTask.value && currentTask.value.id === taskId) {
          currentTask.value = null
        }

        return { success: true, message: result.message }
      } else {
        error.value = result.error
        return { success: false, error: result.error }
      }
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      error.value = 'Une erreur inattendue s\'est produite'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }


  async function markAsCompleted(taskId) {
    isLoading.value = true
    error.value = null

    try {
      const result = await taskService.markAsCompleted(taskId)

      if (result.success) {
        const index = tasks.value.findIndex(task => task.id === taskId)
        if (index !== -1) {
          tasks.value[index].status = 'completed'
        }

        if (currentTask.value && currentTask.value.id === taskId) {
          currentTask.value.status = 'completed'
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
    } finally {
      isLoading.value = false
    }
  }


  function setFilters(newFilters) {
    filters.value = { ...filters.value, ...newFilters }
  }

  function resetFilters() {
    filters.value = {
      status: 'all',
      priority: 'all',
      search: ''
    }
  }


  function setCurrentTask(task) {
    currentTask.value = task
  }

  function clearCurrentTask() {
    currentTask.value = null
  }


  function clearError() {
    error.value = null
  }


  function reset() {
    tasks.value = []
    currentTask.value = null
    isLoading.value = false
    error.value = null
    pagination.value = {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0
    }
    resetFilters()
  }

  return {
    // state
    tasks,
    currentTask,
    isLoading,
    error,
    pagination,
    filters,
    taskStats,

    // Getters
    pendingTasks,
    completedTasks,
    highPriorityTasks,
    filteredTasks,


    // Actions
    fetchTasks,
    fetchTask,
    createTask,
    updateTask,
    deleteTask,
    markAsCompleted,
    setFilters,
    resetFilters,
    setCurrentTask,
    clearCurrentTask,
    clearError,
    reset
  }
})
