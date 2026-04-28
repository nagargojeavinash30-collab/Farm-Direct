import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import { APIResponse } from '@/lib/response';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Verify token
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return APIResponse.unauthorized();
    }

    const token = authHeader.slice(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return APIResponse.unauthorized();
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role') || 'buyer'; // 'buyer' or 'farmer'
    const status = searchParams.get('status');

    let query: any = {};

    if (role === 'buyer') {
      query.buyer = decoded.id;
    } else if (role === 'farmer') {
      query.farmer = decoded.id;
    }

    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('buyer', 'firstName lastName email phone')
      .populate('farmer', 'firstName lastName farmName')
      .sort({ createdAt: -1 });

    return APIResponse.success({ orders });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return APIResponse.error(error.message || 'Error fetching orders', 500);
  }
}
