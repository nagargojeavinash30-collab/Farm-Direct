'use client'

import Image from 'next/image'
import Link from 'next/link'
import { FiShoppingCart, FiMapPin, FiStar } from 'react-icons/fi'
import { useState } from 'react'

interface ProductCardProps {
  id: string
  name: string
  price: number
  image: string
  rating: number
  farmerName: string
  location: string
  category: string
  unit: string
  onAddToCart: (id: string) => void
}

export default function ProductCard ({
  id,
  name,
  price,
  image,
  rating,
  farmerName,
  location,
  category,
  unit,
  onAddToCart
}: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = async () => {
    setIsAdding(true)
    await onAddToCart(id)
    setIsAdding(false)
  }

  return (
    <div className='card overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2'>
      {/* Image */}
      <Link href={`/product/${id}`}>
        <div className='relative h-48 w-full bg-gray-200 overflow-hidden rounded-lg cursor-pointer'>
          <Image
            src={image || 'https://via.placeholder.com/400'}
            alt={name}
            width={400}
            height={192}
            className='w-full h-full object-cover hover:scale-110 transition-transform duration-300'
          />
          <div className='absolute top-2 right-2 bg-accent-500 text-white px-2 py-1 rounded text-xs font-bold'>
            {category}
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className='pt-4'>
        <Link href={`/product/${id}`}>
          <h3 className='font-bold text-lg text-gray-800 hover:text-primary-600 transition line-clamp-2 cursor-pointer'>
            {name}
          </h3>
        </Link>

        {/* Rating */}
        <div className='flex items-center gap-1 my-2'>
          <FiStar size={16} className='text-accent-500' />
          <span className='text-sm text-gray-600'>{rating.toFixed(1)}</span>
        </div>

        {/* Farmer & Location */}
        <div className='text-sm text-gray-600 mb-3'>
          <p className='font-medium text-primary-600'>{farmerName}</p>
          <div className='flex items-center gap-1'>
            <FiMapPin size={14} />
            <span>{location}</span>
          </div>
        </div>

        {/* Price */}
        <div className='flex items-end justify-between mb-4'>
          <div>
            <p className='text-2xl font-bold text-primary-600'>₹{price}</p>
            <p className='text-xs text-gray-500'>per {unit}</p>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className='w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition flex items-center justify-center gap-2 disabled:opacity-50'
        >
          <FiShoppingCart size={18} />
          <span>{isAdding ? 'Adding...' : 'Add to Cart'}</span>
        </button>
      </div>
    </div>
  )
}
