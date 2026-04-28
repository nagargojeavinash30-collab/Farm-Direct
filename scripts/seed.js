const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/farmers-market'

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  phone: String,
  role: String,
  farmName: String,
  address: {
    city: String,
    state: String,
    zipCode: String
  }
})

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  category: String,
  price: Number,
  quantity: Number,
  unit: String,
  images: [String],
  farmer: mongoose.Schema.Types.ObjectId,
  location: {
    city: String,
    state: String
  },
  rating: Number,
  isAvailable: Boolean
})

const User = mongoose.model('User', userSchema)
const Product = mongoose.model('Product', productSchema)

async function seedDatabase () {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Clear existing data
    await User.deleteMany({})
    await Product.deleteMany({})
    console.log('🧹 Cleared existing data')

    // Create farmers
    const salt = await bcryptjs.genSalt(10)
    const hashedPassword = await bcryptjs.hash('password123', salt)

    const farmers = await User.create([
      {
        firstName: 'Rajesh',
        lastName: 'Kumar',
        email: 'farmer@demo.com',
        password: hashedPassword,
        phone: '9876543210',
        role: 'farmer',
        farmName: 'Green Valley Farm',
        address: {
          city: 'Pune',
          state: 'Maharashtra',
          zipCode: '411001'
        }
      },
      {
        firstName: 'Priya',
        lastName: 'Sharma',
        email: 'farmer2@demo.com',
        password: hashedPassword,
        phone: '9876543211',
        role: 'farmer',
        farmName: 'Organic Farms',
        address: {
          city: 'Bangalore',
          state: 'Karnataka',
          zipCode: '560001'
        }
      }
    ])

    // Create buyers
    const buyers = await User.create([
      {
        firstName: 'Amita',
        lastName: 'Desai',
        email: 'buyer@demo.com',
        password: hashedPassword,
        phone: '8765432109',
        role: 'buyer',
        address: {
          city: 'Pune',
          state: 'Maharashtra',
          zipCode: '411002'
        }
      },
      {
        firstName: 'Vikram',
        lastName: 'Singh',
        email: 'buyer2@demo.com',
        password: hashedPassword,
        phone: '8765432108',
        role: 'buyer',
        address: {
          city: 'Bangalore',
          state: 'Karnataka',
          zipCode: '560002'
        }
      }
    ])

    // Create admin
    await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@demo.com',
      password: hashedPassword,
      phone: '9999999999',
      role: 'admin',
      address: {
        city: 'Bangalore',
        state: 'Karnataka',
        zipCode: '560001'
      }
    })

    console.log('👥 Created users')

    // Create products
    const products = await Product.create([
      {
        name: 'Fresh Tomatoes',
        description: 'Organic, pesticide-free tomatoes from our farm',
        category: 'Vegetables',
        price: 40,
        quantity: 100,
        unit: 'kg',
        images: ['https://via.placeholder.com/400'],
        farmer: farmers[0]._id,
        location: {
          city: 'Pune',
          state: 'Maharashtra'
        },
        rating: 4.5,
        isAvailable: true
      },
      {
        name: 'Onions',
        description: 'Golden onions, fresh harvest',
        category: 'Vegetables',
        price: 30,
        quantity: 150,
        unit: 'kg',
        images: ['https://via.placeholder.com/400'],
        farmer: farmers[0]._id,
        location: {
          city: 'Pune',
          state: 'Maharashtra'
        },
        rating: 4.2,
        isAvailable: true
      },
      {
        name: 'Mangoes',
        description: 'Sweet, juicy mangoes - King of fruits',
        category: 'Fruits',
        price: 80,
        quantity: 50,
        unit: 'kg',
        images: ['https://via.placeholder.com/400'],
        farmer: farmers[1]._id,
        location: {
          city: 'Bangalore',
          state: 'Karnataka'
        },
        rating: 4.8,
        isAvailable: true
      },
      {
        name: 'Bananas',
        description: 'Fresh yellow bananas, ready to eat',
        category: 'Fruits',
        price: 50,
        quantity: 200,
        unit: 'dozen',
        images: ['https://via.placeholder.com/400'],
        farmer: farmers[1]._id,
        location: {
          city: 'Bangalore',
          state: 'Karnataka'
        },
        rating: 4.3,
        isAvailable: true
      },
      {
        name: 'Organic Rice',
        description: 'Pure organic basmati rice',
        category: 'Grains',
        price: 120,
        quantity: 500,
        unit: 'kg',
        images: ['https://via.placeholder.com/400'],
        farmer: farmers[0]._id,
        location: {
          city: 'Pune',
          state: 'Maharashtra'
        },
        rating: 4.6,
        isAvailable: true
      },
      {
        name: 'Wheat Flour',
        description: 'Fresh ground wheat flour',
        category: 'Grains',
        price: 45,
        quantity: 300,
        unit: 'kg',
        images: ['https://via.placeholder.com/400'],
        farmer: farmers[1]._id,
        location: {
          city: 'Bangalore',
          state: 'Karnataka'
        },
        rating: 4.4,
        isAvailable: true
      }
    ])

    console.log('📦 Created products')

    console.log('\n✅ Database seeding completed successfully!\n')
    console.log('Demo Accounts:')
    console.log('Farmer: farmer@demo.com / password123')
    console.log('Buyer: buyer@demo.com / password123')
    console.log('Admin: admin@demo.com / password123')

    await mongoose.disconnect()
  } catch (error) {
    console.error('❌ Seeding error:', error)
    process.exit(1)
  }
}

seedDatabase()
