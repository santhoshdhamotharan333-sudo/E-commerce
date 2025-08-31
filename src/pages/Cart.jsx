// src/pages/Cart.jsx
import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'

const Cart = () => {
  const { items, updateQuantity, removeFromCart, getCartTotal, loading } = useCart()
  const { isAuthenticated } = useAuth()

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
          <Link
            to="/products"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="divide-y divide-gray-200">
              {items.map((item) => (
                <div key={item.id} className="p-4 flex items-center">
                  {/* Product Image */}
                  <div className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-md overflow-hidden">
                    {item.variant?.product?.images?.[0] ? (
                      <img
                        src={item.variant.product.images[0].image}
                        alt={item.variant.product.images[0].alt_text || item.variant.product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No image
                      </div>
                    )}
                  </div>
                  
                  {/* Product Details */}
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      {item.variant?.product?.title || 'Product'}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {item.variant?.option_text || 'Variant'}
                    </p>
                    <p className="text-indigo-600 font-bold">
                      ₹{item.variant?.price || 0}
                    </p>
                  </div>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100"
                    >
                      -
                    </button>
                    
                    <span className="w-10 text-center">{item.quantity}</span>
                    
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= (item.variant?.stock || 0)}
                      className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                  
                  {/* Item Total and Remove */}
                  <div className="ml-4 text-right">
                    <p className="text-lg font-bold text-gray-900">
                      ₹{(item.variant?.price || 0) * item.quantity}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 text-sm hover:text-red-800 mt-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{getCartTotal()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₹{getCartTotal() > 0 ? 50 : 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>₹{(getCartTotal() * 0.18).toFixed(2)}</span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mb-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{(getCartTotal() + (getCartTotal() > 0 ? 50 : 0) + (getCartTotal() * 0.18)).toFixed(2)}</span>
              </div>
            </div>
            
            {isAuthenticated ? (
              <Link
                to="/checkout"
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-indigo-700 text-center block"
              >
                Proceed to Checkout
              </Link>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/login"
                  state={{ from: { pathname: '/checkout' } }}
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-indigo-700 text-center block"
                >
                  Login to Checkout
                </Link>
                <p className="text-sm text-gray-600 text-center">
                  Or <Link to="/register" className="text-indigo-600 hover:text-indigo-800">create an account</Link>
                </p>
              </div>
            )}
            
            <Link
              to="/products"
              className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-md font-semibold hover:bg-gray-50 text-center block mt-3"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart