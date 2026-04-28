import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  price: number;
  quantity: number;
  unit: string;
  images: string[];
  farmer: mongoose.Types.ObjectId;
  farmerDetails?: {
    name: string;
    location: string;
    farmName: string;
  };
  location: {
    city: string;
    state: string;
    zipCode: string;
  };
  harvestDate?: Date;
  expiryDate?: Date;
  certifications?: string[];
  minOrderQuantity: number;
  rating: number;
  reviews: Array<{
    buyer: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
  }>;
  isAvailable: boolean;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Vegetables', 'Fruits', 'Grains', 'Spices', 'Dairy', 'Others'],
    },
    subcategory: String,
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
    },
    unit: {
      type: String,
      required: true,
      enum: ['kg', 'liter', 'dozen', 'piece', 'quintal', 'ton'],
      default: 'kg',
    },
    images: [
      {
        type: String,
        default: 'https://via.placeholder.com/400',
      },
    ],
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    farmerDetails: {
      name: String,
      location: String,
      farmName: String,
    },
    location: {
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      zipCode: String,
    },
    harvestDate: Date,
    expiryDate: Date,
    certifications: [String],
    minOrderQuantity: {
      type: Number,
      default: 1,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: [
      {
        buyer: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        comment: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isAvailable: {
      type: Boolean,
      default: true,
    },
    tags: [String],
  },
  { timestamps: true }
);

// Index for search optimization
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ category: 1, price: 1 });
ProductSchema.index({ farmer: 1 });
ProductSchema.index({ 'location.city': 1 });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
