// src/api/cart.js
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

export const cartAPI = {
  getCart: () => 
    api.get('/cart/').then(res => res.data),
  
  addToCart: (variantId, quantity) => 
    api.post('/cart/', { variant_id: variantId, quantity }).then(res => res.data),
  
  updateItem: (itemId, quantity) => 
    api.patch(`/cart/${itemId}/`, { quantity }).then(res => res.data),
  
  removeItem: (itemId) => 
    api.delete(`/cart/${itemId}/`).then(res => res.data),
  
  applyCoupon: (code) => 
    api.post('/cart/apply-coupon/', { code }).then(res => res.data),
  
  mergeCart: (guestItems) => 
    api.post('/cart/merge/', { items: guestItems }).then(res => res.data),
}