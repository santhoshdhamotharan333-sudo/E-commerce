// src/pages/Checkout.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { authAPI } from '../api/auth'

const Checkout = () => {
  const [step, setStep] = useState(1) // 1: Address, 2: Payment, 3: Review
  const [addresses, setAddresses] = useState([])
  const [selectedAddress, setSelectedAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  
  const { user, isAuthenticated } = useAuth()
  const { items, getCartTotal, clearCart } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } })
      return
    }

    if (items.length === 0) {
      navigate('/cart')
      return
    }

    loadAddresses()
  }, [isAuthenticated, items, navigate])

  const loadAddresses = async () => {
    try {
      const addressesData = await authAPI.getAddresses()
      setAddresses(addressesData)
      
      // Select default address if available
      const defaultAddress = addressesData.find(addr => addr.is_default)
      if (defaultAddress) {
        setSelectedAddress(defaultAddress.id)
      }
    } catch (error) {
      console.error('Failed to load addresses:', error)
    }
  }

  const handleAddressSubmit = () => {
    if (!selectedAddress) {
      setErrors({ address: 'Please select an address' })
      return
    }
    setStep(2)
    setErrors({})
  }

  const handlePaymentSubmit = () => {
    if (!paymentMethod) {
      setErrors({ payment: 'Please select a payment method' })
      return
    }
    setStep(3)
    setErrors({})
  }

  const handlePlaceOrder = async () => {
    setLoading(true)
    try {
      // In a real implementation, you would call your order API here
      // For now, we'll simulate a successful order
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Clear cart after successful order
      clearCart()
      
      // Navigate to order success page
      navigate('/order/success', { 
        state: { 
          orderId: Math.random().toString(36).substr(2, 9).toUpperCase(),
          total: getCartTotal()
        }
      })
    } catch (error) {
      console.error('Failed to place order:', error)
      setErrors({ general: 'Failed to place order. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated || items.length === 0) {
    return null
  }

  const subtotal = getCartTotal()
  const shipping = subtotal > 0 ? 50 : 0
  const tax = subtotal * 0.18
  const total = subtotal + shipping + tax

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>
      
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= stepNumber 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {stepNumber}
              </div>
              {stepNumber < 3 && (
                <div className={`w-16 h-1 mx-2 ${
                  step > stepNumber ? 'bg-indigo-600' : 'bg-gray-200'
                }`}></div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span className="ml-4">Address</span>
          <span>Payment</span>
          <span className="mr-4">Review</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
              {errors.general}
            </div>
          )}

          {/* Step 1: Address Selection */}
          {step === 1 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Shipping Address</h2>
              
              {addresses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">No addresses found</p>
                  <button
                    onClick={() => navigate('/account/addresses')}
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Add a new address
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className={`border rounded-lg p-4 cursor-pointer ${
                        selectedAddress === address.id
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onClick={() => setSelectedAddress(address.id)}
                    >
                      <div className="flex items-start">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 mt-1 ${
                          selectedAddress === address.id
                            ? 'border-indigo-600 bg-indigo-600'
                            : 'border-gray-300'
                        }`}>
                          {selectedAddress === address.id && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{address.full_name}</p>
                          <p className="text-gray-600">{address.line1}</p>
                          {address.line2 && (
                            <p className="text-gray-600">{address.line2}</p>
                          )}
                          <p className="text-gray-600">
                            {address.city}, {address.state} {address.postal_code}
                          </p>
                          <p className="text-gray-600">{address.country}</p>
                          <p className="text-gray-600">Phone: {address.phone}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {errors.address && (
                    <p className="text-red-600 text-sm">{errors.address}</p>
                  )}
                  
                  <div className="flex justify-between mt-6">
                    <button
                      onClick={() => navigate('/cart')}
                      className="text-gray-600 hover:text-gray-800 font-medium"
                    >
                      ← Back to Cart
                    </button>
                    <button
                      onClick={handleAddressSubmit}
                      className="bg-indigo-600 text-white px-6 py-2 rounded-md font-medium hover:bg-indigo-700"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Payment Method */}
          {step === 2 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Payment Method</h2>
              
              <div className="space-y-4">
                <div
                  className={`border rounded-lg p-4 cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onClick={() => setPaymentMethod('cod')}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                      paymentMethod === 'cod'
                        ? 'border-indigo-600 bg-indigo-600'
                        : 'border-gray-300'
                    }`}>
                      {paymentMethod === 'cod' && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">Cash on Delivery</p>
                      <p className="text-gray-600 text-sm">Pay when you receive your order</p>
                    </div>
                  </div>
                </div>
                
                <div
                  className={`border rounded-lg p-4 cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                      paymentMethod === 'card'
                        ? 'border-indigo-600 bg-indigo-600'
                        : 'border-gray-300'
                    }`}>
                      {paymentMethod === 'card' && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">Credit/Debit Card</p>
                      <p className="text-gray-600 text-sm">Pay securely with your card</p>
                    </div>
                  </div>
                </div>
                
                {errors.payment && (
                  <p className="text-red-600 text-sm">{errors.payment}</p>
                )}
                
                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => setStep(1)}
                    className="text-gray-600 hover:text-gray-800 font-medium"
                  >
                    ← Back to Address
                  </button>
                  <button
                    onClick={handlePaymentSubmit}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-md font-medium hover:bg-indigo-700"
                  >
                    Continue to Review
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Order Review */}
          {step === 3 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Review</h2>
              
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Shipping Address</h3>
                {selectedAddress && (
                  <div className="text-gray-600">
                    <p>{addresses.find(a => a.id === selectedAddress)?.full_name}</p>
                    <p>{addresses.find(a => a.id === selectedAddress)?.line1}</p>
                    {addresses.find(a => a.id === selectedAddress)?.line2 && (
                      <p>{addresses.find(a => a.id === selectedAddress)?.line2}</p>
                    )}
                    <p>
                      {addresses.find(a => a.id === selectedAddress)?.city}, {' '}
                      {addresses.find(a => a.id === selectedAddress)?.state} {' '}
                      {addresses.find(a => a.id === selectedAddress)?.postal_code}
                    </p>
                    <p>{addresses.find(a => a.id === selectedAddress)?.country}</p>
                    <p>Phone: {addresses.find(a => a.id === selectedAddress)?.phone}</p>
                  </div>
                )}
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Payment Method</h3>
                <p className="text-gray-600">
                  {paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit/Debit Card'}
                </p>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Order Items</h3>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span className="text-gray-600">
                        {item.quantity} × {item.variant?.product?.title || 'Product'}
                      </span>
                      <span className="text-gray-900">
                        ₹{(item.variant?.price || 0) * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setStep(2)}
                  className="text-gray-600 hover:text-gray-800 font-medium"
                >
                  ← Back to Payment
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-md font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₹{shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (18%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mb-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              <p>By completing your purchase, you agree to our Terms of Service and Privacy Policy.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout