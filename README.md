# 🌾 FarmDirect - Direct Market Access for Farmers

A comprehensive full-stack web application connecting farmers directly with buyers, eliminating middlemen and enabling fair pricing for agricultural products.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Features Breakdown](#features-breakdown)
- [Demo Accounts](#demo-accounts)

## ✨ Features

### Core Features
- **🏠 Home Page**: Modern landing page with hero section and CTA buttons
- **👨‍🌾 Farmer Module**: Registration, profile creation, product management, order tracking
- **🛒 Buyer Module**: Signup, product browsing, cart management, order placement
- **📦 Product Listing**: Farmers can add products with images, quantity, price, location
- **🛍️ Marketplace**: Grid-based product display with filters (category, price, location) and search
- **💬 Price Negotiation**: Direct communication system between farmers and buyers
- **📦 Order Management**: Full order lifecycle from cart to delivery
- **💳 Payment Integration**: UI for UPI, Card, and Cash on Delivery
- **🧑‍💼 Admin Dashboard**: Analytics, user management, order tracking

### Advanced Features
- **📊 Analytics Dashboard**: Charts and statistics for admins
- **🌦️ Weather Widget**: (Ready for integration)
- **🌱 Farmer Tips**: Blog section with agricultural articles
- **🌐 Multi-language Support**: English, Hindi, Marathi (Ready for integration)
- **📱 Fully Responsive**: Mobile-first design

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 with React 18
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: React Icons
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js (Next.js API Routes)
- **Database**: MongoDB with Mongoose ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

### DevOps & Tools
- **Package Manager**: npm/yarn
- **Version Control**: Git
- **Environment**: .env.local

## 📁 Project Structure

```
farmdirect/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── register/
│   │   │   └── login/
│   │   ├── products/
│   │   │   ├── route.ts (GET all products)
│   │   │   ├── create/
│   │   │   └── [id]/
│   │   ├── orders/
│   │   │   ├── route.ts (GET orders)
│   │   │   ├── create/
│   │   │   └── [id]/
│   │   ├── cart/
│   │   │   └── route.ts (GET, POST, DELETE)
│   │   ├── users/
│   │   │   └── profile/
│   │   └── admin/
│   │       └── analytics/
│   ├── (pages)
│   │   ├── page.tsx (Home)
│   │   ├── register/
│   │   ├── login/
│   │   ├── marketplace/
│   │   ├── cart/
│   │   ├── dashboard/
│   │   ├── contact/
│   │   └── admin/
│   ├── layout.tsx (Root layout)
│   └── globals.css
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── HeroSection.tsx
│   └── ProductCard.tsx
├── lib/
│   ├── db.ts (MongoDB connection)
│   ├── auth.ts (JWT utilities)
│   ├── response.ts (API response utilities)
│   ├── authStore.ts (Auth Zustand store)
│   └── cartStore.ts (Cart Zustand store)
├── models/
│   ├── User.ts
│   ├── Product.ts
│   ├── Order.ts
│   └── Cart.ts
├── types/
│   └── index.ts
├── public/
├── .env.local.example
├── tailwind.config.js
├── postcss.config.js
├── next.config.js
├── package.json
└── README.md
```

## 🚀 Installation

### Prerequisites
- Node.js 18+ and npm/yarn
- MongoDB (local or MongoDB Atlas)
- Git

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/farmdirect.git
cd farmdirect
```

### Step 2: Install Dependencies
```bash
npm install
# or
yarn install
```

### Step 3: Set Up Environment Variables
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your configuration:
```env
MONGODB_URI=mongodb://localhost:27017/farmers-market
JWT_SECRET=your-secret-key-here
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Step 4: Start MongoDB
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env.local
```

### Step 5: Run Development Server
```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:3000` in your browser.

## ⚙️ Configuration

### MongoDB Setup

**Local MongoDB:**
```bash
# Install MongoDB Community Edition
# macOS (with Homebrew):
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB:
brew services start mongodb-community

# Connect:
mongo mongodb://localhost:27017
```

**MongoDB Atlas (Cloud):**
1. Create account at [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env.local`

### JWT Secret
Generate a strong secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🎮 Running the Application

### Development Mode
```bash
npm run dev
```
- Access: http://localhost:3000
- Hot reload enabled
- Debug friendly

### Production Build
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Products
- `GET /api/products` - Get all products with filters
- `POST /api/products/create` - Create product (Farmers only)
- `GET /api/products/[id]` - Get product details
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders/create` - Create order
- `GET /api/orders/[id]` - Get order details
- `PUT /api/orders/[id]` - Update order status

### Cart
- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add to cart
- `DELETE /api/cart?productId=xxx` - Remove from cart

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile

### Admin
- `GET /api/admin/analytics` - Get system analytics

## 📊 Database Schema

### User Model
```typescript
{
  firstName: string
  lastName: string
  email: string (unique)
  password: string (hashed)
  phone: string
  role: 'farmer' | 'buyer' | 'admin'
  avatar: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  // Farmer specific
  farmName?: string
  farmSize?: number
  cropsGrown?: string[]
  registrationNumber?: string
  bankDetails?: { accountHolder, accountNumber, ifscCode }
  // Buyer specific
  companyName?: string
  businessType?: 'individual' | 'retailer' | 'wholesaler'
  isVerified: boolean
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
```

### Product Model
```typescript
{
  name: string
  description: string
  category: string (enum)
  subcategory?: string
  price: number
  quantity: number
  unit: string (kg, liter, dozen, etc.)
  images: string[]
  farmer: ObjectId (ref: User)
  location: { city, state, zipCode }
  harvestDate?: Date
  expiryDate?: Date
  certifications?: string[]
  minOrderQuantity: number
  rating: number
  reviews: Array<{ buyer, rating, comment, createdAt }>
  isAvailable: boolean
  tags?: string[]
  createdAt: Date
  updatedAt: Date
}
```

### Order Model
```typescript
{
  orderNumber: string (unique)
  buyer: ObjectId (ref: User)
  farmer: ObjectId (ref: User)
  items: Array<{ product, productName, quantity, price, subtotal }>
  totalAmount: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  paymentMethod: 'upi' | 'card' | 'cod' | 'bank_transfer'
  paymentStatus: 'pending' | 'completed' | 'failed'
  deliveryAddress: { street, city, state, zipCode }
  deliveryDate?: Date
  notes?: string
  trackingNumber?: string
  createdAt: Date
  updatedAt: Date
}
```

### Cart Model
```typescript
{
  buyer: ObjectId (ref: User, unique)
  items: Array<{ product, quantity, price, farmer }>
  totalItems: number
  totalPrice: number
  createdAt: Date
  updatedAt: Date
}
```

## 🎯 Features Breakdown

### 1. Authentication System
- JWT-based authentication
- Role-based access (farmer, buyer, admin)
- Password hashing with bcryptjs
- Session management with Zustand

### 2. Product Management (Farmers)
- Add products with images
- Edit and delete listings
- Track inventory
- View product performance

### 3. Marketplace (Buyers)
- Browse all products
- Filter by category, price, location
- Search functionality
- Wishlist (ready to implement)

### 4. Order Management
- Create orders from cart
- Track order status
- View order history
- Order cancellation

### 5. Payment Integration UI
- UPI integration ready
- Card payment interface
- Cash on Delivery option
- Payment status tracking

### 6. Admin Dashboard
- User analytics
- Order statistics
- Revenue tracking
- System health monitoring

## 👥 Demo Accounts

### Farmer Demo Account
```
Email: farmer@demo.com
Password: password123
Role: Farmer
```

### Buyer Demo Account
```
Email: buyer@demo.com
Password: password123
Role: Buyer
```

### Admin Demo Account
```
Email: admin@demo.com
Password: password123
Role: Admin
```

To create demo accounts, seed the database:
```bash
node scripts/seed.js
```

## 🔒 Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT token-based authentication
- ✅ CORS protection ready
- ✅ Environment variable protection
- ✅ SQL injection prevention (MongoDB)
- ✅ XSS protection with React

## 📈 Future Enhancements

- [ ] Real-time chat system
- [ ] Video call between farmers and buyers
- [ ] Weather API integration
- [ ] Blog system with farming tips
- [ ] Multi-language support (Hindi, Marathi)
- [ ] Notification system
- [ ] Advanced analytics
- [ ] Mobile app (React Native)
- [ ] Payment gateway integration (Stripe, Razorpay)
- [ ] Ratings and reviews system
- [ ] Wishlist feature
- [ ] Subscription plans for farmers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 💬 Support

For support, email support@farmdirect.in or open an issue on GitHub.

## 👨‍💻 Author

Developed as a comprehensive FarmTech solution for direct farmer-to-buyer marketplace platform.

---

**Made with ❤️ for Indian Agriculture** 🌾
