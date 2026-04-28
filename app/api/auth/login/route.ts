import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { APIResponse } from '@/lib/response';
import { generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    // Validation
    if (!email || !password) {
      return APIResponse.validationError('Email and password are required');
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return APIResponse.error('Invalid credentials', 401);
    }

    // Check password
    const isPasswordMatch = await user.matchPassword(password);
    if (!isPasswordMatch) {
      return APIResponse.error('Invalid credentials', 401);
    }

    // Generate token
    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role as any,
    });

    const userResponse = user.toObject();
    delete (userResponse as any).password;

    return APIResponse.success({ user: userResponse, token }, 'Login successful');
  } catch (error: any) {
    console.error('Login error:', error);
    return APIResponse.error(error.message || 'Login failed', 500);
  }
}
