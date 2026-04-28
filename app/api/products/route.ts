import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import User from '@/models/User';
import { APIResponse } from '@/lib/response';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const minPrice = parseFloat(searchParams.get('minPrice') || '0');
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '999999');
    const city = searchParams.get('city') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    // Build query
    const query: any = { isAvailable: true };

    if (search) {
      query.$or = [{ name: { $regex: search, $options: 'i' } }];
    }

    if (category) {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = minPrice;
      if (maxPrice) query.price.$lte = maxPrice;
    }

    if (city) {
      query['location.city'] = { $regex: city, $options: 'i' };
    }

    // Fetch products
    const skip = (page - 1) * limit;
    const products = await Product.find(query)
      .populate('farmer', 'firstName lastName farmName address')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);

    const formattedProducts = products.map((product: any) => ({
      ...product.toObject(),
      farmerDetails: {
        name: `${product.farmer?.firstName} ${product.farmer?.lastName}`,
        farmName: product.farmer?.farmName,
        location: product.farmer?.address?.city,
      },
    }));

    return APIResponse.success({
      products: formattedProducts,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return APIResponse.error(error.message || 'Error fetching products', 500);
  }
}
