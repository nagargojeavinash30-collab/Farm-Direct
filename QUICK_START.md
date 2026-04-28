# 🚀 Quick Start Guide

## Getting Started in 5 Minutes

### 1. Prerequisites Check
```bash
node --version  # Should be 18+
npm --version   # Should be 9+
```

### 2. Clone & Install
```bash
git clone <repository-url>
cd farmdirect
npm install
```

### 3. Setup Environment
```bash
cp .env.local.example .env.local
# Edit .env.local with your MongoDB URI
```

### 4. Start MongoDB
```bash
# Option A: Local MongoDB
mongod

# Option B: MongoDB Atlas (Cloud)
# Just update MONGODB_URI in .env.local
```

### 5. Seed Demo Data
```bash
node scripts/seed.js
```

### 6. Run Application
```bash
npm run dev
```

Visit: http://localhost:3000

---

## 🧪 Testing the Application

### Test Account Login
Go to http://localhost:3000/login

**Farmer Account:**
- Email: `farmer@demo.com`
- Password: `password123`

**Buyer Account:**
- Email: `buyer@demo.com`
- Password: `password123`

**Admin Account:**
- Email: `admin@demo.com`
- Password: `password123`

### Test User Flows

**As a Farmer:**
1. Login with farmer account
2. Go to Dashboard
3. Add a new product
4. View orders received

**As a Buyer:**
1. Login with buyer account
2. Browse Marketplace
3. Add products to cart
4. Checkout and place order
5. View order history in dashboard

**As Admin:**
1. Login with admin account
2. Navigate to /admin
3. View analytics and statistics
4. Monitor orders and users

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:**
1. Ensure MongoDB is running
2. Check MONGODB_URI in .env.local
3. If using MongoDB Atlas, verify connection string
4. Check firewall settings

### Port 3000 Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### Module Not Found Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

### JWT Token Expired
- Clear browser localStorage
- Login again
- Token expires in 7 days by default

### Images Not Loading
- Check placeholder URLs in product cards
- Verify image paths in database
- For production, use Cloudinary or similar service

---

## 📱 Feature Testing Checklist

### Authentication
- [ ] Register as farmer
- [ ] Register as buyer
- [ ] Login successfully
- [ ] Logout functionality
- [ ] Password validation
- [ ] Email validation

### Marketplace
- [ ] View all products
- [ ] Search products
- [ ] Filter by category
- [ ] Filter by price
- [ ] Filter by location
- [ ] View product details
- [ ] Pagination works

### Cart & Checkout
- [ ] Add product to cart
- [ ] View cart items
- [ ] Remove from cart
- [ ] Update quantity
- [ ] Calculate totals
- [ ] Proceed to checkout
- [ ] Enter shipping address
- [ ] Select payment method
- [ ] Place order

### Dashboard (Farmer)
- [ ] View dashboard stats
- [ ] Add new product
- [ ] Edit product
- [ ] Delete product
- [ ] View received orders
- [ ] Update order status
- [ ] View profile

### Dashboard (Buyer)
- [ ] View dashboard stats
- [ ] View my orders
- [ ] Track order status
- [ ] Update profile

### Admin Dashboard
- [ ] View all statistics
- [ ] View orders chart
- [ ] View recent orders
- [ ] Check completion rate

---

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Seed database with demo data
node scripts/seed.js
```

---

## 📊 Database Management

### Access MongoDB
```bash
# Local MongoDB
mongo mongodb://localhost:27017/farmers-market

# MongoDB Atlas
mongo "mongodb+srv://username:password@cluster.mongodb.net/farmers-market"
```

### Common Commands
```bash
# View all collections
show collections

# Count documents
db.users.countDocuments()
db.products.countDocuments()

# Find specific user
db.users.findOne({ email: "farmer@demo.com" })

# Delete all products
db.products.deleteMany({})

# Export data
mongoexport --db farmers-market --collection users --out users.json

# Import data
mongoimport --db farmers-market --collection users --file users.json
```

---

## 🚀 Deployment Guide

### Deploy to Vercel
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy

```bash
vercel
```

### Deploy to Railway
1. Create account at railway.app
2. Connect GitHub repository
3. Set environment variables
4. Deploy

### Deploy to Heroku
```bash
heroku create farmdirect
heroku config:set MONGODB_URI=<your-uri>
git push heroku main
```

---

## 📈 Performance Optimization

### Frontend
- Images lazy-loading enabled
- Code splitting with Next.js
- CSS optimization with Tailwind
- Framer Motion for smooth animations

### Backend
- MongoDB indexing on frequently queried fields
- Pagination for product listings
- API response compression
- JWT caching

### Database
- Indexes on: email, farmer ID, product ID
- Proper field selection in queries
- Connection pooling enabled

---

## 🔐 Security Checklist

- [ ] Change JWT_SECRET in production
- [ ] Use HTTPS in production
- [ ] Set CORS origins properly
- [ ] Validate all user inputs
- [ ] Use environment variables for secrets
- [ ] Enable MongoDB authentication
- [ ] Regular security updates
- [ ] Monitor API endpoints

---

## 📞 Support

**For Issues:**
1. Check troubleshooting section
2. Review console errors
3. Check MongoDB connection
4. Verify environment variables
5. Clear cache and rebuild

**Common Error Solutions:**
- Clear .next folder
- Restart dev server
- Reinstall node_modules
- Check Node.js version

---

## 🎯 Next Steps

1. **Customize**: Update branding, colors, and content
2. **Add Features**: Implement payment gateway, chat, etc.
3. **Scale**: Optimize database, add caching
4. **Deploy**: Push to production server
5. **Monitor**: Setup error tracking and analytics

---

Made with ❤️ for Indian Agriculture 🌾
