'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { useAuthStore } from '@/lib/authStore';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore((state) => state.login);

  const [role, setRole] = useState<'farmer' | 'buyer'>(
    (searchParams.get('role') as 'farmer' | 'buyer') || 'buyer'
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    // Address
    city: '',
    state: '',
    zipCode: '',
    // Farmer specific
    farmName: '',
    farmSize: '',
    cropsGrown: '',
    // Buyer specific
    companyName: '',
    businessType: 'individual',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validation
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      const payload: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role,
        address: {
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        },
      };

      if (role === 'farmer') {
        payload.farmName = formData.farmName;
        payload.farmSize = formData.farmSize ? parseInt(formData.farmSize) : 0;
        payload.cropsGrown = formData.cropsGrown
          ? formData.cropsGrown.split(',').map((c) => c.trim())
          : [];
      } else {
        payload.companyName = formData.companyName;
        payload.businessType = formData.businessType;
      }

      const response = await axios.post('/api/auth/register', payload);

      if (response.data.success) {
        login(response.data.data.user, response.data.data.token);
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-lg shadow-lg p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Join FarmDirect</h1>
            <p className="text-gray-600">Create your account to get started</p>
          </div>

          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setRole('farmer')}
              className={`p-4 rounded-lg border-2 transition ${
                role === 'farmer'
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-primary-300'
              }`}
            >
              <div className="text-3xl mb-2">🚜</div>
              <div className="font-bold text-gray-900">Farmer</div>
              <div className="text-sm text-gray-600">Sell your produce</div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setRole('buyer')}
              className={`p-4 rounded-lg border-2 transition ${
                role === 'buyer'
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-primary-300'
              }`}
            >
              <div className="text-3xl mb-2">🛒</div>
              <div className="font-bold text-gray-900">Buyer</div>
              <div className="text-sm text-gray-600">Buy fresh products</div>
            </motion.button>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                placeholder="First Name *"
                value={formData.firstName}
                onChange={handleChange}
                className="input-field"
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name *"
                value={formData.lastName}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <input
              type="email"
              name="email"
              placeholder="Email *"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              required
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number (10 digits) *"
              value={formData.phone}
              onChange={handleChange}
              className="input-field"
              pattern="\d{10}"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                type="password"
                name="password"
                placeholder="Password *"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                required
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password *"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            {/* Address Fields */}
            <div className="grid grid-cols-3 gap-4">
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                className="input-field"
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
                className="input-field"
              />
              <input
                type="text"
                name="zipCode"
                placeholder="Zip Code"
                value={formData.zipCode}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            {/* Role-Specific Fields */}
            {role === 'farmer' ? (
              <>
                <input
                  type="text"
                  name="farmName"
                  placeholder="Farm Name"
                  value={formData.farmName}
                  onChange={handleChange}
                  className="input-field"
                />
                <input
                  type="number"
                  name="farmSize"
                  placeholder="Farm Size (in hectares)"
                  value={formData.farmSize}
                  onChange={handleChange}
                  className="input-field"
                />
                <input
                  type="text"
                  name="cropsGrown"
                  placeholder="Crops Grown (comma separated)"
                  value={formData.cropsGrown}
                  onChange={handleChange}
                  className="input-field"
                />
              </>
            ) : (
              <>
                <input
                  type="text"
                  name="companyName"
                  placeholder="Company Name (Optional)"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="input-field"
                />
                <select
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="individual">Individual Buyer</option>
                  <option value="retailer">Retailer</option>
                  <option value="wholesaler">Wholesaler</option>
                </select>
              </>
            )}

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-lg font-bold disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Register Now'}
            </motion.button>
          </form>

          {/* Already have account */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-primary-600 font-bold hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
