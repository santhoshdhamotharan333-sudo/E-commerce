// src/api/products.js
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE,
});

export const productsAPI = {
  // Fetch all products (with optional query params)
  getProducts: (params = {}) =>
    api.get('/products/', { params }).then((res) => res.data),

  // Fetch a single product by slug
  getProduct: (slug) =>
    api.get(`/products/${slug}/`).then((res) => res.data),

  // Fetch all categories
  getCategories: () =>
    api.get('/products/categories/').then((res) => res.data),

  // Fetch a single category by slug
  getCategory: (slug) =>
    api.get(`/products/categories/${slug}/`).then((res) => res.data),
};
