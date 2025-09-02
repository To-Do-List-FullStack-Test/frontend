import api from './api'


class AuthService {

  async register(userData) {
    try {
      const formData = new FormData()

      Object.keys(userData).forEach(key => {
        if (userData[key] !== null && userData[key] !== undefined) {
          formData.append(key, userData[key])
        }
      })

      const response = await api.post('/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error in registration'
      }
    }
  }


  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials)

      //console.log("Debugging:",response)
      if (response.data.data.token) {
        localStorage.setItem('token', response.data.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.data.user))
      }

      return {
        success: true,
        data: response.data.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error in Login'
      }
    }
  }


  async logout() {
    try {
      await api.post('/logout')

      localStorage.removeItem('token')
      localStorage.removeItem('user')

      return {
        success: true,
        message: 'Logout with success'
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')

      return {
        success: true,
        message: 'Logout with success'
      }
    }
  }


  async getProfile() {
    try {
      const response = await api.get('/profile')
      return {
        success: true,
        data: response.data.user
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error retreiving user'
      }
    }
  }


  async updateProfile(profileData) {
    try {
      const formData = new FormData()

      Object.keys(profileData).forEach(key => {
        if (profileData[key] !== null && profileData[key] !== undefined) {
          formData.append(key, profileData[key])
        }
      })

      const response = await api.put('/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user))
      }

      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error update profile'
      }
    }
  }


  isAuthenticated() {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    return !!(token && user)
  }


  getCurrentUser() {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  }

  getToken() {
    return localStorage.getItem('token')
  }
}

export default new AuthService()
