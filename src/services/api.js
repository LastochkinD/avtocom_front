import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

// Добавляем interceptor для добавления токена в запросы
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api

// Методы для работы с API
export const clientsApi = {
  getAll(params = {}) {
    return api.get('/clients/', { params })
  },
  getById(id) {
    return api.get(`/clients/${id}`)
  },
  create(data) {
    return api.post('/clients/', data)
  },
  update(id, data) {
    return api.put(`/clients/${id}`, data)
  },
  delete(id) {
    return api.delete(`/clients/${id}`)
  }
}
