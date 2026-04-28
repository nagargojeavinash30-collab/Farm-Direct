'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { motion } from 'framer-motion'
import ProductCard from '@/components/ProductCard'
import { useAuthStore } from '@/lib/authStore'
import { FiSearch, FiSliders } from 'react-icons/fi'

interface Product {
  _id: string
  name: string
  price: number
  images: string[]
  category: string
  unit: string
  rating: number
  farmerDetails: {
    name: string
    location: string
  }
}

export default function MarketplacePage () {
  const router = useRouter()
  const { token, isLoggedIn } = useAuthStore()

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [city, setCity] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [searchTerm, category, minPrice, maxPrice, city, page])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (category) params.append('category', category)
      if (minPrice) params.append('minPrice', minPrice)
      if (maxPrice) params.append('maxPrice', maxPrice)
      if (city) params.append('city', city)
      params.append('page', page.toString())

      const response = await axios.get(`/api/products?${params}`)
      console.log('API Response:', response.data)
      console.log('Products:', response.data.data.products)
      setProducts(response.data.data.products)
      setTotal(response.data.data.pagination.total)
    } catch (error: any) {
      console.error('Error fetching products:', error)
      console.error('Error response:', error.response?.data)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async (productId: string) => {
    if (!isLoggedIn) {
      router.push('/login')
      return
    }

    try {
      const response = await axios.post(
        '/api/cart',
        {
          productId,
          quantity: 1
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      if (response.data.success) {
        alert('Product added to cart!')
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error adding to cart')
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
  }

  const resetFilters = () => {
    setSearchTerm('')
    setCategory('')
    setMinPrice('')
    setMaxPrice('')
    setCity('')
    setPage(1)
  }

  const categories = [
    'Vegetables',
    'Fruits',
    'Grains',
    'Spices',
    'Dairy',
    'Others'
  ]

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12'>
        <div className='container-custom'>
          <h1 className='text-4xl font-bold mb-4'>Fresh from Farm</h1>
          <p className='text-xl text-primary-100'>
            Browse and buy fresh produce directly from farmers
          </p>
        </div>
      </div>

      <div className='container-custom py-12'>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
          {/* Sidebar Filters */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`lg:block ${showFilters ? 'block' : 'hidden'}`}
          >
            <div className='bg-white rounded-lg shadow-md p-6 sticky top-24'>
              <div className='flex justify-between items-center mb-6'>
                <h3 className='text-lg font-bold'>Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className='lg:hidden text-gray-600'
                >
                  ✕
                </button>
              </div>

              {/* Category Filter */}
              <div className='mb-6'>
                <h4 className='font-bold text-gray-900 mb-3'>Category</h4>
                <div className='space-y-2'>
                  <label className='flex items-center'>
                    <input
                      type='radio'
                      name='category'
                      value=''
                      checked={category === ''}
                      onChange={e => {
                        setCategory(e.target.value)
                        setPage(1)
                      }}
                      className='w-4 h-4'
                    />
                    <span className='ml-2 text-gray-700'>All Categories</span>
                  </label>
                  {categories.map(cat => (
                    <label key={cat} className='flex items-center'>
                      <input
                        type='radio'
                        name='category'
                        value={cat}
                        checked={category === cat}
                        onChange={e => {
                          setCategory(e.target.value)
                          setPage(1)
                        }}
                        className='w-4 h-4'
                      />
                      <span className='ml-2 text-gray-700'>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className='mb-6'>
                <h4 className='font-bold text-gray-900 mb-3'>Price Range</h4>
                <div className='space-y-2'>
                  <input
                    type='number'
                    placeholder='Min Price'
                    value={minPrice}
                    onChange={e => {
                      setMinPrice(e.target.value)
                      setPage(1)
                    }}
                    className='input-field text-sm'
                  />
                  <input
                    type='number'
                    placeholder='Max Price'
                    value={maxPrice}
                    onChange={e => {
                      setMaxPrice(e.target.value)
                      setPage(1)
                    }}
                    className='input-field text-sm'
                  />
                </div>
              </div>

              {/* City Filter */}
              <div className='mb-6'>
                <h4 className='font-bold text-gray-900 mb-3'>City</h4>
                <input
                  type='text'
                  placeholder='Enter city'
                  value={city}
                  onChange={e => {
                    setCity(e.target.value)
                    setPage(1)
                  }}
                  className='input-field text-sm'
                />
              </div>

              {/* Reset Button */}
              <button
                onClick={resetFilters}
                className='w-full py-2 border-2 border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition font-medium'
              >
                Reset Filters
              </button>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className='lg:col-span-3'>
            {/* Search Bar */}
            <form onSubmit={handleSearch} className='mb-8'>
              <div className='flex gap-2 bg-white rounded-lg shadow-md p-2'>
                <input
                  type='text'
                  placeholder='Search products...'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className='flex-1 px-4 py-2 outline-none'
                />
                <button
                  type='submit'
                  className='px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700'
                >
                  <FiSearch size={20} />
                </button>
                <button
                  type='button'
                  onClick={() => setShowFilters(!showFilters)}
                  className='lg:hidden px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50'
                >
                  <FiSliders size={20} />
                </button>
              </div>
            </form>

            {/* Products Grid */}
            {loading ? (
              <div className='text-center py-12'>
                <div className='text-gray-600 text-lg'>Loading products...</div>
              </div>
            ) : products.length === 0 ? (
              <div className='text-center py-12'>
                <div className='text-gray-600 text-lg'>No products found</div>
              </div>
            ) : (
              <>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
                  {products.map((product, index) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <ProductCard
                        id={product._id}
                        name={product.name}
                        price={product.price}
                        image={product.images[0]}
                        rating={product.rating}
                        farmerName={product.farmerDetails.name}
                        location={product.farmerDetails.location}
                        category={product.category}
                        unit={product.unit}
                        onAddToCart={handleAddToCart}
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                <div className='flex justify-center gap-2 mt-8'>
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className='px-4 py-2 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 disabled:opacity-50'
                  >
                    Previous
                  </button>
                  <span className='px-4 py-2'>Page {page}</span>
                  <button
                    disabled={page * 12 >= total}
                    onClick={() => setPage(page + 1)}
                    className='px-4 py-2 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 disabled:opacity-50'
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
