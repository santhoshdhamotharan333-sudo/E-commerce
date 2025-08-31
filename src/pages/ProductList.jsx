// src/pages/ProductList.jsx
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { productsAPI } from '../api/products'
import ProductCard from '../components/products/ProductCard'

const ProductList = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    category: '',
    min_price: '',
    max_price: '',
    ordering: '',
    search: ''
  })

  const [searchParams, setSearchParams] = useSearchParams()
  const itemsPerPage = 12

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Get filter values from URL
        const category = searchParams.get('category') || ''
        const search = searchParams.get('search') || ''
        const minPrice = searchParams.get('min_price') || ''
        const maxPrice = searchParams.get('max_price') || ''
        const ordering = searchParams.get('ordering') || ''
        const page = searchParams.get('page') || 1

        setFilters({
          category,
          min_price: minPrice,
          max_price: maxPrice,
          ordering,
          search
        })

        setCurrentPage(parseInt(page))

        // Build query params
        const params = {
          page,
          ...(category && { category }),
          ...(search && { search }),
          ...(minPrice && { min_price: minPrice }),
          ...(maxPrice && { max_price: maxPrice }),
          ...(ordering && { ordering })
        }

        const [productsData, categoriesData] = await Promise.all([
          productsAPI.getProducts(params),
          productsAPI.getCategories()
        ])

        // Ensure products is an array
        setProducts(Array.isArray(productsData.results) ? productsData.results : [])
        setTotalCount(productsData.count || 0)

        // Ensure categories is an array
        const categoryArray = Array.isArray(categoriesData)
          ? categoriesData
          : categoriesData?.results || []
        setCategories(categoryArray)

      } catch (error) {
        console.error('Failed to fetch data:', error)
        setProducts([])
        setCategories([])
        setTotalCount(0)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [searchParams])

  const updateFilters = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 }
    setSearchParams(
      Object.fromEntries(
        Object.entries(updatedFilters).filter(([_, value]) => value !== '')
      )
    )
  }

  const handlePageChange = (page) => {
    setSearchParams({ ...filters, page })
  }

  const clearFilters = () => {
    setSearchParams({})
  }

  const totalPages = Math.ceil(totalCount / itemsPerPage)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Filters</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                Clear all
              </button>
            </div>

            {/* Categories Filter */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Categories</h4>
              <div className="space-y-2">
                {categories?.map(category => (
                  <div key={category.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`category-${category.id}`}
                      checked={filters.category === category.slug}
                      onChange={(e) => updateFilters({
                        category: e.target.checked ? category.slug : ''
                      })}
                      className="h-4 w-4 text-indigo-600 rounded"
                    />
                    <label htmlFor={`category-${category.id}`} className="ml-2 text-sm">
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Price Range</h4>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.min_price}
                  onChange={(e) => updateFilters({ min_price: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.max_price}
                  onChange={(e) => updateFilters({ max_price: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>

            {/* Sort Options */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Sort By</h4>
              <select
                value={filters.ordering}
                onChange={(e) => updateFilters({ ordering: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded text-sm"
              >
                <option value="">Default</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="title">Name: A to Z</option>
                <option value="-title">Name: Z to A</option>
                <option value="-created_at">Newest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Header with search and results count */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {filters.search ? `Search: "${filters.search}"` : 'All Products'}
              </h1>
              <p className="text-gray-600">
                {totalCount} {totalCount === 1 ? 'product' : 'products'} found
              </p>
            </div>

            <div className="w-full sm:w-64">
              <input
                type="text"
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => updateFilters({ search: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="h-48 bg-gray-200 animate-pulse"></div>
                  <div className="p-4">
                    <div className="h-6 bg-gray-200 animate-pulse rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Products Grid */}
          {!loading && (
            <>
              {products?.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">😢</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600">Try adjusting your filters or search terms</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products?.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-8">
                      <nav className="flex items-center gap-1">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>

                        {[...Array(totalPages)].map((_, i) => {
                          const page = i + 1
                          if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                          ) {
                            return (
                              <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`px-3 py-1 rounded border ${
                                  currentPage === page
                                    ? 'border-indigo-600 bg-indigo-600 text-white'
                                    : 'border-gray-300'
                                }`}
                              >
                                {page}
                              </button>
                            )
                          } else if (page === currentPage - 2 || page === currentPage + 2) {
                            return <span key={page} className="px-2">...</span>
                          }
                          return null
                        })}

                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductList
