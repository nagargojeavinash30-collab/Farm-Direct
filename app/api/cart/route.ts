import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Cart from '@/models/Cart';
import Product from '@/models/Product';
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

    let cart = await Cart.findOne({ buyer: decoded.id }).populate('items.product').populate('items.farmer');
    
    if (!cart) {
      cart = await Cart.create({ buyer: decoded.id, items: [], totalItems: 0, totalPrice: 0 });
    }

    return APIResponse.success(cart);
  } catch (error: any) {
    console.error('Error fetching cart:', error);
    return APIResponse.error(error.message || 'Error fetching cart', 500);
  }
}

export async function POST(request: NextRequest) {
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

    const { productId, quantity } = await request.json();

    if (!productId || !quantity) {
      return APIResponse.validationError('Product ID and quantity are required');
    }

    const product = await Product.findById(productId);
    if (!product) {
      return APIResponse.notFound('Product not found');
    }

    let cart = await Cart.findOne({ buyer: decoded.id });

    if (!cart) {
      cart = await Cart.create({
        buyer: decoded.id,
        items: [
          {
            product: productId,
            quantity,
            price: product.price,
            farmer: product.farmer,
          },
        ],
        totalItems: quantity,
        totalPrice: product.price * quantity,
      });
    } else {
      const existingItem = cart.items.findIndex((item: any) => item.product.toString() === productId);

      if (existingItem > -1) {
        cart.items[existingItem].quantity += quantity;
      } else {
        cart.items.push({
          product: productId,
          quantity,
          price: product.price,
          farmer: product.farmer,
        });
      }

      // Recalculate totals
      cart.totalItems = cart.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
      cart.totalPrice = cart.items.reduce(
        (sum: number, item: any) => sum + item.price * item.quantity,
        0
      );

      await cart.save();
    }

    const updatedCart = await Cart.findOne({ buyer: decoded.id })
      .populate('items.product')
      .populate('items.farmer');

    return APIResponse.success(updatedCart, 'Item added to cart', 201);
  } catch (error: any) {
    console.error('Error adding to cart:', error);
    return APIResponse.error(error.message || 'Error adding to cart', 500);
  }
}

export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return APIResponse.validationError('Product ID is required');
    }

    const cart = await Cart.findOne({ buyer: decoded.id });
    if (!cart) {
      return APIResponse.notFound('Cart not found');
    }

    cart.items = cart.items.filter((item: any) => item.product.toString() !== productId);

    // Recalculate totals
    cart.totalItems = cart.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
    cart.totalPrice = cart.items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    await cart.save();

    const updatedCart = await Cart.findOne({ buyer: decoded.id })
      .populate('items.product')
      .populate('items.farmer');

    return APIResponse.success(updatedCart, 'Item removed from cart');
  } catch (error: any) {
    console.error('Error removing from cart:', error);
    return APIResponse.error(error.message || 'Error removing from cart', 500);
  }
}
