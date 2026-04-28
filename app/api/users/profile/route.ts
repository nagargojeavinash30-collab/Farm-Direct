import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
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

    const user = await User.findById(decoded.id);
    if (!user) {
      return APIResponse.notFound('User not found');
    }

    const userResponse = user.toObject();
    delete (userResponse as any).password;

    return APIResponse.success(userResponse);
  } catch (error: any) {
    console.error('Error fetching profile:', error);
    return APIResponse.error(error.message || 'Error fetching profile', 500);
  }
}

export async function PUT(request: NextRequest) {
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

    const body = await request.json();

    // Don't allow password change via this endpoint
    delete body.password;
    delete body.email; // Email should not be changed
    delete body.role; // Role should not be changed

    const user = await User.findByIdAndUpdate(decoded.id, body, { new: true });
    if (!user) {
      return APIResponse.notFound('User not found');
    }

    const userResponse = user.toObject();
    delete (userResponse as any).password;

    return APIResponse.success(userResponse, 'Profile updated successfully');
  } catch (error: any) {
    console.error('Error updating profile:', error);
    return APIResponse.error(error.message || 'Error updating profile', 500);
  }
}
