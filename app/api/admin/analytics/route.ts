import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Product from '@/models/Product';
import Order from '@/models/Order';
import { APIResponse } from '@/lib/response';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return APIResponse.unauthorized();
    }

    const token = authHeader.slice(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return APIResponse.unauthorized();
    }

    // Check if user is admin
    const user = await User.findById(decoded.id);
    if (!user || user.role !== 'admin') {
      return APIResponse.error('Only admins can access this', 403);
    }

    // Get statistics
    const totalUsers = await User.countDocuments();
    const totalFarmers = await User.countDocuments({ role: 'farmer' });
    const totalBuyers = await User.countDocuments({ role: 'buyer' });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const completedOrders = await Order.countDocuments({ status: 'delivered' });
    const pendingOrders = await Order.countDocuments({ status: 'pending' });

    const totalRevenue = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    // Recent orders
    const recentOrders = await Order.find()
      .populate('buyer', 'firstName lastName email')
      .populate('farmer', 'firstName lastName farmName')
      .sort({ createdAt: -1 })
      .limit(10);

    // Orders by status
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    return APIResponse.success({
      stats: {
        totalUsers,
        totalFarmers,
        totalBuyers,
        totalProducts,
        totalOrders,
        completedOrders,
        pendingOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
      },
      recentOrders,
      ordersByStatus,
    });
  } catch (error: any) {
    console.error('Error fetching analytics:', error);
    return APIResponse.error(error.message || 'Error fetching analytics', 500);
  }
}
