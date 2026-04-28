'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/authStore';
import { FiPackage, FiTrendingUp, FiUser, FiLogOut, FiPlus } from 'react-icons/fi';
import Link from 'next/link';

interface Stats {
  totalProducts?: number;
  totalOrders?: number;
  pendingOrders?: number;
  totalRevenue?: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  buyer?: { firstName: string; lastName: string };
  farmer?: { firstName: string; lastName: string };
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, logout, isLoggedIn } = useAuthStore();

  const [stats, setStats] = useState<Stats>({});
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    fetchDashboardData();
  }, [isLoggedIn]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/orders?role=' + user?.role, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        const orderList = response.data.data.orders;
        setOrders(orderList);

        // Calculate stats
        if (user?.role === 'farmer') {
          setStats({
            totalOrders: orderList.length,
            pendingOrders: orderList.filter((o: Order) => o.status === 'pending').length,
            totalRevenue: orderList
              .filter((o: Order) => o.status === 'delivered')
              .reduce((sum: number, o: Order) => sum + o.totalAmount, 0),
          });
        } else {
          setStats({
            totalOrders: orderList.length,
            pendingOrders: orderList.filter((o: Order) => o.status === 'pending').length,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!isLoggedIn || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-16 z-40">
        <div className="container-custom py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {user.role === 'farmer' ? '🚜' : '🛒'} Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Welcome back, {user.firstName} {user.lastName}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <FiLogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      <div className="container-custom py-12">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b">
          {user.role === 'farmer' ? (
            <>
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-4 font-medium transition ${
                  activeTab === 'overview'
                    ? 'border-b-2 border-primary-600 text-primary-600'
                    : 'text-gray-600'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`pb-4 font-medium transition ${
                  activeTab === 'products'
                    ? 'border-b-2 border-primary-600 text-primary-600'
                    : 'text-gray-600'
                }`}
              >
                My Products
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`pb-4 font-medium transition ${
                  activeTab === 'orders'
                    ? 'border-b-2 border-primary-600 text-primary-600'
                    : 'text-gray-600'
                }`}
              >
                Orders
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-4 font-medium transition ${
                  activeTab === 'overview'
                    ? 'border-b-2 border-primary-600 text-primary-600'
                    : 'text-gray-600'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`pb-4 font-medium transition ${
                  activeTab === 'orders'
                    ? 'border-b-2 border-primary-600 text-primary-600'
                    : 'text-gray-600'
                }`}
              >
                My Orders
              </button>
            </>
          )}
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-4 font-medium transition ${
              activeTab === 'profile'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-600'
            }`}
          >
            Profile
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="card"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Total Orders</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalOrders || 0}</p>
                  </div>
                  <FiPackage size={40} className="text-primary-600 opacity-20" />
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="card"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Pending Orders</p>
                    <p className="text-3xl font-bold text-accent-600">{stats.pendingOrders || 0}</p>
                  </div>
                  <FiTrendingUp size={40} className="text-accent-600 opacity-20" />
                </div>
              </motion.div>

              {user.role === 'farmer' && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="card"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm mb-1">Total Revenue</p>
                      <p className="text-3xl font-bold text-green-600">₹{stats.totalRevenue || 0}</p>
                    </div>
                    <FiTrendingUp size={40} className="text-green-600 opacity-20" />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Quick Actions */}
            {user.role === 'farmer' && (
              <motion.div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                <Link
                  href="/dashboard/add-product"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                >
                  <FiPlus size={20} />
                  Add New Product
                </Link>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Products Tab (Farmers Only) */}
        {user.role === 'farmer' && activeTab === 'products' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">My Products</h2>
              <Link
                href="/dashboard/add-product"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                + Add Product
              </Link>
            </div>
            <p className="text-gray-600">View and manage your listed products here.</p>
          </motion.div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold">
                {user.role === 'farmer' ? 'Orders Received' : 'My Orders'}
              </h2>
            </div>

            {loading ? (
              <div className="p-6 text-center text-gray-600">Loading...</div>
            ) : orders.length === 0 ? (
              <div className="p-6 text-center text-gray-600">No orders yet</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">
                        Order Number
                      </th>
                      {user.role === 'farmer' ? (
                        <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">
                          Buyer
                        </th>
                      ) : (
                        <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">
                          Farmer
                        </th>
                      )}
                      <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">
                        Payment
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-primary-600">
                          {order.orderNumber}
                        </td>
                        <td className="px-6 py-4">
                          {user.role === 'farmer'
                            ? `${order.buyer?.firstName} ${order.buyer?.lastName}`
                            : `${order.farmer?.firstName} ${order.farmer?.lastName}`}
                        </td>
                        <td className="px-6 py-4">₹{order.totalAmount}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              order.status === 'delivered'
                                ? 'bg-green-100 text-green-800'
                                : order.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              order.paymentStatus === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h2 className="text-2xl font-bold mb-6">Profile Information</h2>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-gray-600 text-sm">First Name</p>
                <p className="text-lg font-medium text-gray-900">{user.firstName}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Last Name</p>
                <p className="text-lg font-medium text-gray-900">{user.lastName}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Email</p>
                <p className="text-lg font-medium text-gray-900">{user.email}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Role</p>
                <p className="text-lg font-medium text-gray-900 capitalize">{user.role}</p>
              </div>
            </div>

            <div className="mt-8">
              <Link
                href="/dashboard/edit-profile"
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Edit Profile
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
