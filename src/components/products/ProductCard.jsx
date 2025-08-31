// src/components/products/ProductCard.jsx
import { Link } from 'react-router-dom'
import { useCart } from '../../contexts/CartContext'

const ProductCard = ({ product }) => {
  const { addToCart } = useCart()

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (product.variants && product.variants.length > 0) {
      addToCart(product.variants[0].id, 1)
    }
  }

  const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0]
  const price = product.variants?.[0]?.price || product.base_price
  const mrp = product.variants?.[0]?.mrp || price
  const hasDiscount = mrp > price

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <Link to={`/product/${product.slug}`}>
        <div className="h-48 bg-gray-200 flex items-center justify-center">
          {primaryImage ? (
            <img 
              src={primaryImage.image} 
              alt={primaryImage.alt_text || product.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-gray-400">No image</span>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold mb-2 line-clamp-2 h-12">{product.title}</h3>
          
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-indigo-600 font-bold text-lg">₹{price}</span>
              {hasDiscount && (
                <span className="text-gray-500 text-sm line-through ml-2">₹{mrp}</span>
              )}
            </div>
            
            {hasDiscount && (
              <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                {Math.round((1 - price / mrp) * 100)}% off
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{product.category?.name}</span>
            <span>{product.variants?.[0]?.stock || 0} in stock</span>
          </div>
        </div>
      </Link>
      
      <div className="px-4 pb-4">
        <button
          onClick={handleAddToCart}
          disabled={!product.variants || product.variants.length === 0 || product.variants[0].stock === 0}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {!product.variants || product.variants.length === 0 
            ? 'No variants' 
            : product.variants[0].stock === 0 
              ? 'Out of stock' 
              : 'Add to Cart'
          }
        </button>
      </div>
    </div>
  )
}

export default ProductCard