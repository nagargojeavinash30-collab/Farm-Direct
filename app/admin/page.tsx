'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/authStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Stats {
  totalUsers: number;
  totalFarmers: number;
  totalBuyers: number;
  totalProducts: number;
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  totalRevenue: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  buyer: { firstName: string; lastName: string };
  farmer: { firstName: string; lastName: string };
  createdAt: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user, token, isLoggedIn } = useAuthStore();

  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [ordersByStatus, setOrdersByStatus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn || user?.role !== 'admin') {
      router.push('/');
      return;
    }
    fetchAnalytics();
  }, [isLoggedIn, user]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/analytics', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setStats(response.data.data.stats);
        setRecentOrders(response.data.data.recentOrders);

        // Format order status data for chart
        const formatted = response.data.data.ordersByStatus.map((item: any) => ({
          status: item._id,
          count: item.count,
        }));
        setOrdersByStatus(formatted);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container-custom py-12 text-center">Loading...</div>;
  }

  if (!stats) {
    return <div className="container-custom py-12 text-center">Error loading data</div>;
  }

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: 'bg-blue-100 text-blue-600' },
    { label: 'Total Farmers', value: stats.totalFarmers, icon: '🚜', color: 'bg-green-100 text-green-600' },
    { label: 'Total Buyers', value: stats.totalBuyers, icon: '🛒', color: 'bg-primary-100 text-primary-600' },
    { label: 'Total Products', value: stats.totalProducts, icon: '📦', color: 'bg-yellow-100 text-yellow-600' },
    { label: 'Total Orders', value: stats.totalOrders, icon: '📋', color: 'bg-purple-100 text-purple-600' },
    { label: 'Total Revenue', value: `₹${stats.totalRevenue}`, icon: '💰', color: 'bg-green-100 text-green-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-16 z-40">
        <div className="container-custom py-6">
          <h1 className="text-3xl font-bold text-gray-900">📊 Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">System overview and management</p>
        </div>
      </div>

      <div className="container-custom py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {statCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-lg shadow-md p-6 ${card.color}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-75 mb-1">{card.label}</p>
                  <p className="text-3xl font-bold">{card.value}</p>
                </div>
                <div className="text-4xl">{card.icon}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Orders by Status */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h2 className="text-xl font-bold mb-6">Orders by Status</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ordersByStatus}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Key Metrics */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h2 className="text-xl font-bold mb-6">Key Metrics</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-700">Order Completion Rate</span>
                  <span className="text-lg font-bold text-primary-600">
                    {stats.totalOrders > 0
                      ? ((stats.completedOrders / stats.totalOrders) * 100).toFixed(1)
                      : 0}
                    %
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${stats.totalOrders > 0 ? (stats.completedOrders / stats.totalOrders) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-700">Pending Orders</span>
                  <span className="text-lg font-bold text-accent-600">{stats.pendingOrders}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-accent-500 h-2 rounded-full transition-all"
                    style={{
                      width: `${stats.totalOrders > 0 ? (stats.pendingOrders / stats.totalOrders) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-gray-600 mb-2">Average Order Value</p>
                <p className="text-3xl font-bold text-gray-900">
                  ₹{stats.totalOrders > 0 ? (stats.totalRevenue / stats.totalOrders).toFixed(2) : 0}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">Recent Orders</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">
                    Order Number
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">
                    Farmer
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">
                    Buyer
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-primary-600">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4">
                      {order.farmer?.firstName} {order.farmer?.lastName}
                    </td>
                    <td className="px-6 py-4">
                      {order.buyer?.firstName} {order.buyer?.lastName}
                    </td>
                    <td className="px-6 py-4 font-bold">₹{order.totalAmount}</td>
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
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
