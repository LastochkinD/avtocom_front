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
  // Предотвращаем кэширование GET запросов
  if (config.method === 'get') {
    config.params = { ...config.params, _: Date.now() }
  }
  // Преобразуем данные в JSON body для POST/PUT/PATCH запросов (кроме авторизации)
  if ((config.method === 'post' || config.method === 'put' || config.method === 'patch') && 
      !config.url.includes('/auth/login')) {
    config.headers['Content-Type'] = 'application/json'
    config.data = JSON.stringify(config.data)
  }
  return config
})

// Перехватчик для обработки ошибок - редирект на логин при 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Удаляем токен из localStorage
      localStorage.removeItem('token')
      localStorage.removeItem('permissions')
      localStorage.removeItem('user')
      
      // Удаляем заголовок Authorization
      delete api.defaults.headers.common['Authorization']
      
      // Перенаправляем на страницу авторизации
      // Используем window.location для гарантированного редиректа
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

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

export const discountCardsApi = {
  getAll(params = {}) {
    return api.get('/discount_cards/', { params })
  }
}

export const carsApi = {
  getAll(params = {}) {
    return api.get('/cars/', { params })
  },
  getById(id) {
    return api.get(`/cars/${id}`)
  },
  create(data) {
    return api.post('/cars/', data)
  },
  update(id, data) {
    return api.put(`/cars/${id}`, data)
  },
  delete(id) {
    return api.delete(`/cars/${id}`)
  }
}

export const nomenclatureApi = {
  getAll(params = {}) {
    return api.get('/parts_nom/', { params })
  },
  getById(id) {
    return api.get(`/parts_nom/${id}`)
  },
  create(data) {
    return api.post('/parts_nom/', data)
  },
  update(id, data) {
    return api.put(`/parts_nom/${id}`, data)
  },
  delete(id) {
    return api.delete(`/parts_nom/${id}`)
  }
}

export const marksApi = {
  getAll(params = {}) {
    return api.get('/marks/', { params })
  }
}

export const modelsApi = {
  getAll(params = {}) {
    return api.get('/models/', { params })
  }
}

export const colorsApi = {
  getAll(params = {}) {
    return api.get('/colors/', { params })
  }
}

export const prihodApi = {
  getAll(params = {}) {
    return api.get('/prihod/', { params })
  },
  getById(id) {
    return api.get(`/prihod/${id}`)
  },
  create(data) {
    return api.post('/prihod/', data)
  },
  update(id, data) {
    return api.put(`/prihod/${id}`, data)
  },
  delete(id) {
    return api.delete(`/prihod/${id}`)
  }
}

export const rashodApi = {
  getAll(params = {}) {
    return api.get('/rashod/', { params })
  },
  getById(id) {
    return api.get(`/rashod/${id}`)
  },
  create(data) {
    return api.post('/rashod/', data)
  },
  update(id, data) {
    return api.put(`/rashod/${id}`, data)
  },
  delete(id) {
    return api.delete(`/rashod/${id}`)
  }
}

export const docsApi = {
  getAll(params = {}) {
    return api.get('/docs/', { params })
  },
  getById(id) {
    return api.get(`/docs/${id}`)
  },
  create(data) {
    return api.post('/docs/', data)
  },
  update(id, data) {
    return api.put(`/docs/${id}`, data)
  },
  delete(id) {
    return api.delete(`/docs/${id}`)
  }
}
