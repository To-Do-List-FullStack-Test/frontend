import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userFullName = computed(() => user.value?.full_name || '')
  const userEmail = computed(() => user.value?.email || '')
  const userImage = computed(() => user.value?.image_url || null)


  function initializeAuth() {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      token.value = storedToken
      user.value = JSON.parse(storedUser)
    }
  }


  async function login(credentials) {
    isLoading.value = true
    error.value = null

    try {
      const result = await authService.login(credentials)

      if (result.success) {
        token.value = result.data.token
        user.value = result.data.user

        localStorage.setItem('token', result.data.token)
        localStorage.setItem('user', JSON.stringify(result.data.user))

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


  async function register(userData) {
    isLoading.value = true
    error.value = null

    try {
      const result = await authService.register(userData)

      if (result.success) {
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


  async function logout() {
    isLoading.value = true
    error.value = null

    try {
      const result = await authService.logout()

      user.value = null
      token.value = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')

      return { success: true, message: result.message }
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      user.value = null
      token.value = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')

      return { success: true, message: 'Logout with sucess' }
    } finally {
      isLoading.value = false
    }
  }


  async function fetchProfile() {
    isLoading.value = true
    error.value = null

    try {
      const result = await authService.getProfile()

      if (result.success) {
        user.value = result.data
        localStorage.setItem('user', JSON.stringify(result.data))
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


  async function updateProfile(profileData) {
    isLoading.value = true
    error.value = null

    try {
      const result = await authService.updateProfile(profileData)

      if (result.success) {
        user.value = result.data.user
        localStorage.setItem('user', JSON.stringify(result.data.user))
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


  function clearError() {
    error.value = null
  }


  function checkAuth() {
    return authService.isAuthenticated()
  }

  return {
    //state
    user,
    token,
    isLoading,
    error,

    // Getters
    isAuthenticated,
    userFullName,
    userEmail,
    userImage,

    // Actions
    initializeAuth,
    login,
    register,
    logout,
    fetchProfile,
    updateProfile,
    clearError,
    checkAuth
  }
})
