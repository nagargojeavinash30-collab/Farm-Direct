import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { APIResponse } from '@/lib/response';
import { generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { firstName, lastName, email, password, phone, role, ...extraData } = body;

    // Validation
    if (!firstName || !lastName || !email || !password || !phone || !role) {
      return APIResponse.validationError('Missing required fields');
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return APIResponse.error('Email already registered', 400);
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      phone,
      role,
      ...extraData,
    });

    // Generate token
    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role as any,
    });

    const userResponse = user.toObject();
    delete (userResponse as any).password;

    return APIResponse.success(
      { user: userResponse, token },
      'User registered successfully',
      201
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    return APIResponse.error(error.message || 'Registration failed', 500);
  }
}
