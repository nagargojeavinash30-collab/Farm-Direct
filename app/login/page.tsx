'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { useAuthStore } from '@/lib/authStore';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email || !password) {
        setError('Please enter email and password');
        setLoading(false);
        return;
      }

      const response = await axios.post('/api/auth/login', {
        email,
        password,
      });

      if (response.data.success) {
        login(response.data.data.user, response.data.data.token);
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full mx-auto bg-white rounded-lg shadow-lg p-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🌾</div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Login to your FarmDirect account</p>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input-field"
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <Link href="/forgot-password" className="text-primary-600 text-sm hover:underline">
                Forgot?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-field"
              required
            />
          </div>

          {/* Remember Me */}
          <label className="flex items-center">
            <input type="checkbox" className="w-4 h-4" />
            <span className="ml-2 text-sm text-gray-600">Remember me</span>
          </label>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 text-lg font-bold disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </motion.button>
        </form>

        {/* Divider */}
        <div className="my-6 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>

        {/* Demo Accounts */}
        <div className="space-y-2">
          <p className="text-xs text-gray-600 text-center font-medium">Demo Accounts:</p>
          <div className="grid grid-cols-2 gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              type="button"
              onClick={() => {
                setEmail('farmer@demo.com');
                setPassword('password123');
              }}
              className="text-xs py-2 border border-primary-600 text-primary-600 rounded hover:bg-primary-50"
            >
              Demo Farmer
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              type="button"
              onClick={() => {
                setEmail('buyer@demo.com');
                setPassword('password123');
              }}
              className="text-xs py-2 border border-primary-600 text-primary-600 rounded hover:bg-primary-50"
            >
              Demo Buyer
            </motion.button>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link href="/register" className="text-primary-600 font-bold hover:underline">
              Register now
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
