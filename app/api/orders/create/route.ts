import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import Cart from '@/models/Cart';
import Product from '@/models/Product';
import User from '@/models/User';
import { APIResponse } from '@/lib/response';
import { verifyToken } from '@/lib/auth';

function generateOrderNumber() {
  return 'ORD-' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { items, paymentMethod, deliveryAddress } = body;

    // Validate
    if (!items || items.length === 0 || !paymentMethod || !deliveryAddress) {
      return APIResponse.validationError('Missing required fields');
    }

    // Calculate totals and get farmers
    let totalAmount = 0;
    const farmersMap = new Map();

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return APIResponse.error(`Product ${item.productId} not found`, 404);
      }

      const subtotal = product.price * item.quantity;
      totalAmount += subtotal;

      if (!farmersMap.has(product.farmer.toString())) {
        farmersMap.set(product.farmer.toString(), {
          farmer: product.farmer,
          items: [],
        });
      }

      farmersMap.get(product.farmer.toString()).items.push({
        product: product._id,
        productName: product.name,
        quantity: item.quantity,
        price: product.price,
        subtotal,
      });
    }

    // Create orders for each farmer
    const orders = [];
    for (const [farmerId, data] of farmersMap) {
      const order = await Order.create({
        orderNumber: generateOrderNumber(),
        buyer: decoded.id,
        farmer: farmerId,
        items: data.items,
        totalAmount: data.items.reduce((sum: number, item: any) => sum + item.subtotal, 0),
        paymentMethod,
        deliveryAddress,
      });

      orders.push(order);
    }

    // Clear cart
    await Cart.deleteOne({ buyer: decoded.id });

    return APIResponse.success({ orders }, 'Orders created successfully', 201);
  } catch (error: any) {
    console.error('Error creating order:', error);
    return APIResponse.error(error.message || 'Error creating order', 500);
  }
}
