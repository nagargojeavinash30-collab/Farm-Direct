import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import User from '@/models/User';
import { APIResponse } from '@/lib/response';
import { verifyToken } from '@/lib/auth';

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

    // Check if user is farmer
    const user = await User.findById(decoded.id);
    if (!user || user.role !== 'farmer') {
      return APIResponse.error('Only farmers can add products', 403);
    }

    const body = await request.json();
    const {
      name,
      description,
      category,
      price,
      quantity,
      unit,
      images,
      city,
      state,
      minOrderQuantity,
    } = body;

    // Validation
    if (!name || !description || !category || !price || !quantity) {
      return APIResponse.validationError('Missing required fields');
    }

    // Create product
    const product = await Product.create({
      name,
      description,
      category,
      price,
      quantity,
      unit: unit || 'kg',
      images: images || ['https://via.placeholder.com/400'],
      farmer: decoded.id,
      farmerDetails: {
        name: `${user.firstName} ${user.lastName}`,
        farmName: user.farmName,
        location: user.address?.city,
      },
      location: {
        city: city || user.address?.city,
        state: state || user.address?.state,
        zipCode: user.address?.zipCode,
      },
      minOrderQuantity: minOrderQuantity || 1,
    });

    return APIResponse.success(product, 'Product added successfully', 201);
  } catch (error: any) {
    console.error('Error creating product:', error);
    return APIResponse.error(error.message || 'Error creating product', 500);
  }
}
