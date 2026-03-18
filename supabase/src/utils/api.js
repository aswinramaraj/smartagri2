import axios from 'axios'

const API_ROOT = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_ROOT,
  timeout: 8000
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('smartagri_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api