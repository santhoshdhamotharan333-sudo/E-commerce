// src/api/auth.js
import axios from 'axios'

const API_BASE = 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE,
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authAPI = {
  login: (email, password) => 
    api.post('/auth/login/', { email, password }).then(res => res.data),
  
  register: (userData) => 
    api.post('/auth/register/', userData).then(res => res.data),
  
  getProfile: () => 
    api.get('/auth/profile/').then(res => res.data),
  
  updateProfile: (userData) => 
    api.patch('/auth/profile/', userData).then(res => res.data),
  
  getAddresses: () => 
    api.get('/auth/addresses/').then(res => res.data),
  
  addAddress: (addressData) => 
    api.post('/auth/addresses/', addressData).then(res => res.data),
  
  updateAddress: (id, addressData) => 
    api.put(`/auth/addresses/${id}/`, addressData).then(res => res.data),
  
  deleteAddress: (id) => 
    api.delete(`/auth/addresses/${id}/`).then(res => res.data),
}