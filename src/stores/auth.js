import { defineStore } from 'pinia'
import api from '../services/api'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    permissions: JSON.parse(localStorage.getItem('permissions') || 'null') || null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    hasPermission: (state) => (permission) => {
      if (!state.permissions) return false
      return state.permissions[permission] === true
    }
  },

  actions: {
    async login(username, password) {
      this.loading = true
      this.error = null

      try {
        const formData = new URLSearchParams()
        formData.append('username', username)
        formData.append('password', password)

        const response = await api.post('/auth/login', formData)
        
        // Получаем токен из ответа
        const accessToken = response.data.access_token
        
        // Сохраняем токен для следующего запроса
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
        
        // Получаем права пользователя через /api/v1/auth/me
        const userResponse = await api.get('/auth/me')
        
        const { id, username: userName, permissions } = userResponse.data
        
        this.user = { id, username: userName }
        this.permissions = permissions
        this.token = accessToken
        
        localStorage.setItem('token', this.token)
        localStorage.setItem('permissions', JSON.stringify(permissions))
        localStorage.setItem('user', JSON.stringify(this.user))

        return true
      } catch (err) {
        this.error = err.response?.data?.detail || 'Ошибка авторизации'
        return false
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.user = null
      this.token = null
      this.permissions = null
      
      localStorage.removeItem('token')
      localStorage.removeItem('permissions')
      localStorage.removeItem('user')
      
      // Удаляем заголовок Authorization
      delete api.defaults.headers.common['Authorization']
    },

    checkAuth() {
      const token = localStorage.getItem('token')
      const permissions = localStorage.getItem('permissions')
      const user = localStorage.getItem('user')

      if (token && permissions && user) {
        this.token = token
        this.permissions = JSON.parse(permissions)
        this.user = JSON.parse(user)
        
        // Восстанавливаем заголовок Authorization
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        return true
      }
      return false
    }
  }
})
