// src/contexts/CartContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'
import { cartAPI } from '../api/cart'
import { useAuth } from './AuthContext'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      loadCart()
    } else {
      // Load from localStorage for guest users
      const guestCart = localStorage.getItem('guestCart')
      if (guestCart) {
        setItems(JSON.parse(guestCart))
      }
    }
  }, [isAuthenticated])

  const loadCart = async () => {
    if (!isAuthenticated) return
    
    setLoading(true)
    try {
      const cartData = await cartAPI.getCart()
      setItems(cartData.items || [])
    } catch (error) {
      console.error('Failed to load cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (variantId, quantity = 1) => {
    if (isAuthenticated) {
      try {
        await cartAPI.addToCart(variantId, quantity)
        await loadCart() // Reload cart from server
      } catch (error) {
        console.error('Failed to add to cart:', error)
        throw error
      }
    } else {
      // For guest users, update local storage
      const newItems = [...items]
      const existingItemIndex = newItems.findIndex(item => item.variant.id === variantId)
      
      if (existingItemIndex >= 0) {
        newItems[existingItemIndex].quantity += quantity
      } else {
        // In a real app, you'd need to fetch variant details
        newItems.push({
          variant: { id: variantId },
          quantity,
          id: Date.now() // Temporary ID for guest items
        })
      }
      
      setItems(newItems)
      localStorage.setItem('guestCart', JSON.stringify(newItems))
    }
  }

  const updateQuantity = async (itemId, quantity) => {
    if (isAuthenticated) {
      try {
        await cartAPI.updateItem(itemId, quantity)
        await loadCart()
      } catch (error) {
        console.error('Failed to update cart:', error)
        throw error
      }
    } else {
      const newItems = items.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      ).filter(item => item.quantity > 0)
      
      setItems(newItems)
      localStorage.setItem('guestCart', JSON.stringify(newItems))
    }
  }

  const removeFromCart = async (itemId) => {
    if (isAuthenticated) {
      try {
        await cartAPI.removeItem(itemId)
        await loadCart()
      } catch (error) {
        console.error('Failed to remove from cart:', error)
        throw error
      }
    } else {
      const newItems = items.filter(item => item.id !== itemId)
      setItems(newItems)
      localStorage.setItem('guestCart', JSON.stringify(newItems))
    }
  }

  const clearCart = () => {
    setItems([])
    if (!isAuthenticated) {
      localStorage.removeItem('guestCart')
    }
  }

  const getCartCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getCartTotal = () => {
    return items.reduce((total, item) => {
      return total + (item.variant.price * item.quantity)
    }, 0)
  }

  const value = {
    items,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartCount,
    getCartTotal,
    refreshCart: loadCart
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}