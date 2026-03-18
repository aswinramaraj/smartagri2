import axios from 'axios'

const API_ROOT = 'https://smartagri2.onrender.com/api' || 'http://localhost:5000/api'

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
