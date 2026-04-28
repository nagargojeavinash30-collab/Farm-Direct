'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center py-20">
      <div className="container-custom">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Content */}
          <motion.div variants={itemVariants}>
            <motion.div className="inline-block mb-4" variants={itemVariants}>
              <span className="bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold">
                🌱 Direct from Farm to Your Table
              </span>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
              variants={itemVariants}
            >
              Empowering Farmers, <span className="text-primary-600">Connecting Markets</span>
            </motion.h1>

            <motion.p
              className="text-xl text-gray-600 mb-8 leading-relaxed"
              variants={itemVariants}
            >
              Eliminate middlemen and get fair prices. FarmDirect connects farmers directly with
              buyers, ensuring fresh produce reaches your doorstep while supporting local agriculture.
            </motion.p>

            <motion.div className="flex gap-4 flex-wrap" variants={itemVariants}>
              <Link
                href="/register?role=farmer"
                className="btn-primary inline-block rounded-lg"
              >
                🚜 Sell Produce
              </Link>
              <Link
                href="/register?role=buyer"
                className="btn-secondary inline-block rounded-lg"
              >
                🛒 Buy Fresh Products
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div className="grid grid-cols-3 gap-4 mt-12" variants={itemVariants}>
              <div>
                <p className="text-3xl font-bold text-primary-600">5000+</p>
                <p className="text-gray-600">Active Farmers</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary-600">50000+</p>
                <p className="text-gray-600">Happy Customers</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary-600">₹100 Cr+</p>
                <p className="text-gray-600">Transactions</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div className="relative h-96 md:h-full" variants={itemVariants}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-accent-400 rounded-3xl opacity-20 blur-3xl" />
            <div className="relative bg-gradient-to-br from-primary-100 to-accent-100 rounded-3xl p-8 text-center flex flex-col justify-center h-full">
              <div className="text-9xl mb-4">🌾</div>
              <p className="text-xl font-bold text-primary-700">Fresh from Farm</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
