'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/lib/authStore'
import { FiX, FiPlus } from 'react-icons/fi'
import Link from 'next/link'

export default function AddProductPage () {
  const router = useRouter()
  const { token, isLoggedIn, user } = useAuthStore()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Vegetables',
    price: '',
    quantity: '',
    unit: 'kg',
    minOrderQuantity: '1',
    city: '',
    state: ''
  })

  if (!isLoggedIn || user?.role !== 'farmer') {
    return (
      <div className='container-custom py-12 text-center'>
        <h1 className='text-3xl font-bold mb-4'>Access Denied</h1>
        <p className='text-gray-600 mb-6'>Only farmers can add products</p>
        <Link
          href='/login'
          className='px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700'
        >
          Login as Farmer
        </Link>
      </div>
    )
  }

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddImage = () => {
    setImages([...images, ''])
  }

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...images]
    newImages[index] = value
    setImages(newImages)
  }

  const handleFileUpload = async (index: number, file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB')
      return
    }

    setUploadingIndex(index)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await axios.post('/api/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })

      if (response.data.success) {
        handleImageChange(index, response.data.data.url)
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error uploading image')
    } finally {
      setUploadingIndex(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (
        !formData.name ||
        !formData.description ||
        !formData.price ||
        !formData.quantity
      ) {
        setError('Please fill in all required fields')
        setLoading(false)
        return
      }

      if (images.filter(img => img.trim() !== '').length === 0) {
        setError('Please add at least one image')
        setLoading(false)
        return
      }

      const response = await axios.post(
        '/api/products/create',
        {
          name: formData.name,
          description: formData.description,
          category: formData.category,
          price: parseFloat(formData.price),
          quantity: parseFloat(formData.quantity),
          unit: formData.unit,
          images: images.filter(img => img.trim() !== ''),
          city: formData.city,
          state: formData.state,
          minOrderQuantity: parseInt(formData.minOrderQuantity)
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      if (response.data.success) {
        alert('Product added successfully!')
        router.push('/dashboard')
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error adding product')
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    'Vegetables',
    'Fruits',
    'Grains',
    'Spices',
    'Dairy',
    'Others'
  ]
  const units = ['kg', 'liter', 'dozen', 'piece', 'quintal', 'ton']

  return (
    <div className='min-h-screen bg-gray-50 py-12'>
      <div className='max-w-3xl mx-auto px-4'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='bg-white rounded-lg shadow-lg p-8'
        >
          <h1 className='text-4xl font-bold text-gray-900 mb-2'>
            Add New Product
          </h1>
          <p className='text-gray-600 mb-8'>
            List your fresh produce and reach customers directly
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg'
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Basic Information */}
            <div>
              <h2 className='text-xl font-bold text-gray-900 mb-4'>
                Basic Information
              </h2>
              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Product Name *
                  </label>
                  <input
                    type='text'
                    name='name'
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder='e.g., Fresh Tomatoes'
                    className='input-field'
                    required
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Description *
                  </label>
                  <textarea
                    name='description'
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder='Describe your product...'
                    rows={4}
                    className='input-field resize-none'
                    required
                  />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Category *
                    </label>
                    <select
                      name='category'
                      value={formData.category}
                      onChange={handleInputChange}
                      className='input-field'
                      required
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Unit of Sale *
                    </label>
                    <select
                      name='unit'
                      value={formData.unit}
                      onChange={handleInputChange}
                      className='input-field'
                      required
                    >
                      {units.map(unit => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing & Quantity */}
            <div>
              <h2 className='text-xl font-bold text-gray-900 mb-4'>
                Pricing & Quantity
              </h2>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Price per {formData.unit} (₹) *
                  </label>
                  <input
                    type='number'
                    name='price'
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder='0'
                    className='input-field'
                    required
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Available Quantity *
                  </label>
                  <input
                    type='number'
                    name='quantity'
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder='0'
                    className='input-field'
                    required
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Minimum Order Quantity
                  </label>
                  <input
                    type='number'
                    name='minOrderQuantity'
                    value={formData.minOrderQuantity}
                    onChange={handleInputChange}
                    placeholder='1'
                    className='input-field'
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <h2 className='text-xl font-bold text-gray-900 mb-4'>Location</h2>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    City
                  </label>
                  <input
                    type='text'
                    name='city'
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder='City'
                    className='input-field'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    State
                  </label>
                  <input
                    type='text'
                    name='state'
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder='State'
                    className='input-field'
                  />
                </div>
              </div>
            </div>

            {/* Product Images */}
            <div>
              <h2 className='text-xl font-bold text-gray-900 mb-4'>
                Product Images
              </h2>
              <div className='space-y-4'>
                {images.map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className='flex gap-2 items-start'
                  >
                    <div className='flex-1 flex gap-2'>
                      <input
                        type='file'
                        accept='image/*'
                        onChange={e => {
                          if (e.target.files?.[0]) {
                            handleFileUpload(index, e.target.files[0])
                          }
                        }}
                        disabled={uploadingIndex === index}
                        className='flex-1 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer disabled:opacity-50'
                      />
                      <input
                        type='text'
                        value={image}
                        onChange={e => handleImageChange(index, e.target.value)}
                        placeholder='Or paste image URL'
                        className='flex-1 input-field'
                      />
                    </div>
                    {images.length > 1 && (
                      <button
                        type='button'
                        onClick={() => handleRemoveImage(index)}
                        className='mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700'
                      >
                        <FiX size={20} />
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>

              {images.length === 0 && (
                <div className='mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700'>
                  Please add at least one image to your product
                </div>
              )}

              <button
                type='button'
                onClick={handleAddImage}
                className='mt-4 px-4 py-2 border-2 border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 flex items-center gap-2'
              >
                <FiPlus size={20} />
                Add Another Image
              </button>

              <p className='text-sm text-gray-600 mt-2'>
                💡 Upload images (JPG, PNG, GIF - max 5MB) or paste image URLs
              </p>
            </div>

            {/* Submit Button */}
            <motion.div className='flex gap-4'>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type='submit'
                disabled={loading}
                className='flex-1 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-bold disabled:opacity-50 transition'
              >
                {loading ? 'Adding Product...' : 'Add Product'}
              </motion.button>

              <button
                type='button'
                onClick={() => router.back()}
                className='flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-bold transition'
              >
                Cancel
              </button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
