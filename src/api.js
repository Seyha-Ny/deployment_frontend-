import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

const asList = ({ data }) => Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : [])

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
