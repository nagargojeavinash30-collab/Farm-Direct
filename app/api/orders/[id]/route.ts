import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import { APIResponse } from '@/lib/response';
import { verifyToken } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { status, paymentStatus } = await request.json();

    const order = await Order.findById(params.id);
    if (!order) {
      return APIResponse.notFound('Order not found');
    }

    // Check authorization
    if (order.farmer.toString() !== decoded.id && order.buyer.toString() !== decoded.id) {
      return APIResponse.error('Unauthorized', 403);
    }

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();

    return APIResponse.success(order, 'Order updated successfully');
  } catch (error: any) {
    console.error('Error updating order:', error);
    return APIResponse.error(error.message || 'Error updating order', 500);
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const order = await Order.findById(params.id)
      .populate('buyer', 'firstName lastName email phone')
      .populate('farmer', 'firstName lastName farmName email phone')
      .populate('items.product');

    if (!order) {
      return APIResponse.notFound('Order not found');
    }

    return APIResponse.success(order);
  } catch (error: any) {
    console.error('Error fetching order:', error);
    return APIResponse.error(error.message || 'Error fetching order', 500);
  }
}
