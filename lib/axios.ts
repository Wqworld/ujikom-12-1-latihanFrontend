import axios from 'axios';
const api = axios.create({
  // pastikan backend kamu jalan 
  baseURL: 'http://localhost:3000/api'
})

api.interceptors.request.use((config) => {
  if (typeof window != undefined ) {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config;
})

export default api;