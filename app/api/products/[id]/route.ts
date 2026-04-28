import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { APIResponse } from '@/lib/response';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const product = await Product.findById(params.id).populate(
      'farmer',
      'firstName lastName farmName email phone address'
    );

    if (!product) {
      return APIResponse.notFound('Product not found');
    }

    return APIResponse.success(product);
  } catch (error: any) {
    console.error('Error fetching product:', error);
    return APIResponse.error(error.message || 'Error fetching product', 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { authorization } = Object.fromEntries(request.headers);
    if (!authorization?.startsWith('Bearer ')) {
      return APIResponse.unauthorized();
    }

    const body = await request.json();
    const product = await Product.findByIdAndUpdate(params.id, body, { new: true });

    if (!product) {
      return APIResponse.notFound('Product not found');
    }

    return APIResponse.success(product, 'Product updated successfully');
  } catch (error: any) {
    console.error('Error updating product:', error);
    return APIResponse.error(error.message || 'Error updating product', 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { authorization } = Object.fromEntries(request.headers);
    if (!authorization?.startsWith('Bearer ')) {
      return APIResponse.unauthorized();
    }

    const product = await Product.findByIdAndDelete(params.id);

    if (!product) {
      return APIResponse.notFound('Product not found');
    }

    return APIResponse.success(null, 'Product deleted successfully');
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return APIResponse.error(error.message || 'Error deleting product', 500);
  }
}
