// src/pages/ProductDetail.jsx
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { productsAPI } from '../api/products'

const ProductDetail = () => {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState(false)
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await productsAPI.getProduct(slug)
        setProduct(productData)
        // Set the first variant as default selection
        if (productData.variants && productData.variants.length > 0) {
          setSelectedVariant(productData.variants[0])
        }
      } catch (error) {
        console.error('Failed to fetch product:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [slug])

  const handleAddToCart = async () => {
    if (!selectedVariant) return
    
    setAddingToCart(true)
    try {
      await addToCart(selectedVariant.id, quantity)
      // Show success message (you could use a toast notification here)
      alert('Product added to cart successfully!')
    } catch (error) {
      console.error('Failed to add to cart:', error)
      alert('Failed to add product to cart. Please try again.')
    } finally {
      setAddingToCart(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Product not found</h2>
          <p className="text-gray-600">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {product.images && product.images.length > 0 ? (
              <img 
                src={product.images[0].image} 
                alt={product.images[0].alt_text || product.title}
                className="w-full h-96 object-cover"
              />
            ) : (
              <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 mt-4">
              {product.images.slice(1).map((image, index) => (
                <img 
                  key={index}
                  src={image.image} 
                  alt={image.alt_text || `${product.title} ${index + 2}`}
                  className="w-full h-20 object-cover rounded cursor-pointer border-2 border-transparent hover:border-indigo-500"
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400 mr-2">
              {/* Star ratings would go here */}
              {'★'.repeat(4) + '☆'.repeat(1)}
            </div>
            <span className="text-gray-600">(42 reviews)</span>
          </div>

          <div className="mb-6">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-indigo-600">
                ₹{selectedVariant?.price || product.base_price}
              </span>
              {selectedVariant?.mrp > selectedVariant?.price && (
                <span className="text-lg text-gray-500 line-through">
                  ₹{selectedVariant.mrp}
                </span>
              )}
              {selectedVariant?.mrp > selectedVariant?.price && (
                <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                  {Math.round((1 - selectedVariant.price / selectedVariant.mrp) * 100)}% off
                </span>
              )}
            </div>
          </div>

          <div className="mb-6">
            <p className="text-gray-700">{product.description}</p>
          </div>

          {/* Variant Selection */}
          {product.variants && product.variants.length > 1 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Options</h3>
              <div className="flex flex-wrap gap-2">
                {product.variants.map(variant => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-4 py-2 border rounded-md ${
                      selectedVariant?.id === variant.id
                        ? 'border-indigo-600 bg-indigo-100 text-indigo-800'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {variant.option_text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity and Add to Cart */}
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <span className="mr-3 font-semibold">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-4 py-1">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={addingToCart || !selectedVariant || selectedVariant.stock === 0}
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {addingToCart ? 'Adding to Cart...' : 
               selectedVariant?.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>

          {/* Product Details */}
          <div className="border-t pt-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-semibold">Category:</span>
                <span className="ml-2">{product.category?.name}</span>
              </div>
              <div>
                <span className="font-semibold">SKU:</span>
                <span className="ml-2">{selectedVariant?.sku || 'N/A'}</span>
              </div>
              <div>
                <span className="font-semibold">Stock:</span>
                <span className="ml-2">
                  {selectedVariant?.stock > 0 ? `${selectedVariant.stock} available` : 'Out of stock'}
                </span>
              </div>
              {product.brand && (
                <div>
                  <span className="font-semibold">Brand:</span>
                  <span className="ml-2">{product.brand}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail