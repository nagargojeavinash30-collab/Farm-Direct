'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import HeroSection from '@/components/HeroSection'
import Link from 'next/link'
import { FiTrendingUp, FiShield, FiZap, FiUsers } from 'react-icons/fi'
import { useAuthStore } from '@/lib/authStore'

export default function Home () {
  const router = useRouter()
  const { isLoggedIn } = useAuthStore()

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/dashboard')
    }
  }, [isLoggedIn, router])

  if (isLoggedIn) {
    return null
  }

  const features = [
    {
      icon: <FiTrendingUp size={32} />,
      title: 'Fair Prices',
      description:
        'Get better prices by cutting out middlemen and selling directly to buyers.'
    },
    {
      icon: <FiShield size={32} />,
      title: 'Secure Transactions',
      description:
        'All transactions are secured with encryption and verified payment methods.'
    },
    {
      icon: <FiZap size={32} />,
      title: 'Quick Process',
      description:
        'Simple listing and ordering process that takes just minutes to get started.'
    },
    {
      icon: <FiUsers size={32} />,
      title: 'Community',
      description:
        'Join thousands of farmers and buyers supporting sustainable agriculture.'
    }
  ]

  return (
    <>
      <HeroSection />

      {/* Features Section */}
      <section className='py-20 bg-gray-50'>
        <div className='container-custom'>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className='text-center mb-16'
          >
            <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
              Why Choose <span className='text-primary-600'>FarmDirect?</span>
            </h2>
            <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
              We're committed to creating a fair and transparent marketplace for
              agriculture.
            </p>
          </motion.div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className='card text-center hover:bg-primary-50 transition'
              >
                <div className='text-primary-600 mx-auto mb-4 flex justify-center'>
                  {feature.icon}
                </div>
                <h3 className='text-xl font-bold text-gray-900 mb-2'>
                  {feature.title}
                </h3>
                <p className='text-gray-600'>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className='py-20'>
        <div className='container-custom'>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className='text-center mb-16'
          >
            <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
              How It <span className='text-primary-600'>Works</span>
            </h2>
          </motion.div>

          <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
            {[
              {
                number: '1',
                title: 'Register',
                description: 'Create your account as a farmer or buyer'
              },
              {
                number: '2',
                title: 'List/Browse',
                description: 'Farmers list products, buyers browse'
              },
              {
                number: '3',
                title: 'Connect',
                description: 'Direct communication and negotiation'
              },
              {
                number: '4',
                title: 'Transact',
                description: 'Secure payment and delivery'
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className='relative'
              >
                <div className='bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-full w-16 h-16 flex items-center justify-center text-3xl font-bold mx-auto mb-4'>
                  {step.number}
                </div>
                <h3 className='text-xl font-bold text-center text-gray-900 mb-2'>
                  {step.title}
                </h3>
                <p className='text-gray-600 text-center'>{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20 bg-gradient-to-r from-primary-600 to-primary-700'>
        <div className='container-custom text-center'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className='text-4xl md:text-5xl font-bold text-white mb-6'>
              Ready to Transform Your Agriculture Business?
            </h2>
            <p className='text-xl text-white mb-8 max-w-2xl mx-auto'>
              Join FarmDirect today and start connecting directly with buyers
              and sellers.
            </p>
            <div className='flex gap-4 justify-center flex-wrap'>
              <Link
                href='/register?role=farmer'
                className='px-8 py-4 bg-white text-primary-600 rounded-lg font-bold hover:bg-gray-100 transition inline-block'
              >
                Register as Farmer
              </Link>
              <Link
                href='/register?role=buyer'
                className='px-8 py-4 bg-accent-500 text-white rounded-lg font-bold hover:bg-accent-600 transition inline-block'
              >
                Register as Buyer
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
