import axios from 'axios'
import { notify } from './notifications.js'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  headers: { Accept: 'application/json' },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status
      const data = error.response.data
      const message =
        data?.message ||
        (status === 422
          ? Object.values(data?.errors || {}).flat().join('. ')
          : null) ||
        `Request failed (${status})`
      notify(message, 'error')
    } else if (error.request) {
      notify('Server is unreachable. Check your connection.', 'error')
    } else {
      notify(error.message, 'error')
    }
    return Promise.reject(error)
  },
)

const asList = ({ data }) =>
  Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : []

export const categoriesApi = {
  index: () => api.get('/categories').then(asList),
  show: (id) => api.get(`/categories/${id}`),
  store: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  destroy: (id) => api.delete(`/categories/${id}`),
}

export const productsApi = {
  index: () => api.get('/products').then(asList),
  show: (id) => api.get(`/products/${id}`),
  store: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  destroy: (id) => api.delete(`/products/${id}`),
}

export default api
