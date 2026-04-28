# 🚀 FarmDirect - Deployment Guide

## Pre-Deployment Checklist

- [ ] All features tested locally
- [ ] Environment variables configured
- [ ] Database backup taken
- [ ] Security review completed
- [ ] Performance optimized
- [ ] All dependencies updated

---

## 1️⃣ Deploy to Vercel (Recommended)

### Easiest & Fastest Option

**Step 1: Prepare Repository**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/farmdirect.git
git push -u origin main
```

**Step 2: Connect to Vercel**
1. Visit [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project settings

**Step 3: Set Environment Variables**
In Vercel Dashboard → Settings → Environment Variables
```
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret_key
NEXT_PUBLIC_API_URL=https://your-domain.vercel.app
```

**Step 4: Deploy**
```bash
vercel
```

**Advantages:**
- Free tier available
- Automatic deployments
- Built-in scaling
- Zero-config
- Global CDN
- Automatic SSL

---

## 2️⃣ Deploy to Railway

### Simple Alternative to Heroku

**Step 1: Create Railway Account**
Visit [railway.app](https://railway.app)

**Step 2: Create New Project**
1. Click "New Project"
2. Select "Deploy from GitHub"
3. Choose your repository
4. Authorize Railway

**Step 3: Add MongoDB Add-on**
1. In project, click "Add Service"
2. Select "Database"
3. Choose "MongoDB"
4. Railway creates connection string

**Step 4: Set Environment Variables**
```bash
MONGODB_URI=${{Mongo.MONGODB_URI}}
JWT_SECRET=your_secret
NEXT_PUBLIC_API_URL=https://your-app.up.railway.app
```

**Step 5: Deploy**
- Railway auto-deploys on git push

---

## 3️⃣ Deploy to Heroku

### Traditional Node.js Hosting

**Step 1: Install Heroku CLI**
```bash
# macOS
brew tap heroku/brew && brew install heroku

# Windows
Download from heroku.com/windows

# Linux
sudo snap install --classic heroku
```

**Step 2: Login to Heroku**
```bash
heroku login
```

**Step 3: Create Heroku App**
```bash
heroku create farmdirect-app
```

**Step 4: Add Procfile**
Create `Procfile`:
```
web: npm start
```

**Step 5: Set Environment Variables**
```bash
heroku config:set MONGODB_URI=your_uri
heroku config:set JWT_SECRET=your_secret
heroku config:set NEXT_PUBLIC_API_URL=https://farmdirect-app.herokuapp.com
```

**Step 6: Deploy**
```bash
git push heroku main
```

**Step 7: Monitor**
```bash
heroku logs --tail
heroku ps
```

---

## 4️⃣ Deploy to AWS

### Enterprise-Grade Solution

**Option A: AWS Elastic Beanstalk**

```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init -p node.js-18 farmdirect

# Create environment
eb create farmdirect-env

# Set environment variables
eb setenv MONGODB_URI=your_uri JWT_SECRET=your_secret

# Deploy
eb deploy

# Open app
eb open
```

**Option B: AWS EC2 + Load Balancer**

```bash
# Launch EC2 instance (Ubuntu 22.04)
# Connect via SSH

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repository
git clone <your-repo>
cd farmdirect

# Install dependencies
npm install

# Build
npm run build

# Install PM2 for process management
npm install -g pm2

# Start application
pm2 start "npm start" --name "farmdirect"
pm2 startup
pm2 save

# Install and configure Nginx
sudo apt-get install nginx
# Configure reverse proxy to port 3000

# Setup SSL with Let's Encrypt
sudo apt-get install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d yourdomain.com
```

---

## 5️⃣ Deploy to DigitalOcean App Platform

### User-Friendly Cloud

**Step 1: Connect GitHub**
1. Visit [digitalocean.com/app-platform](https://digitalocean.com/app-platform)
2. Click "Create App"
3. Select your GitHub repository

**Step 2: Configure**
- Set build command: `npm install && npm run build`
- Set run command: `npm start`
- Set HTTP port: 3000

**Step 3: Set Environment Variables**
- MONGODB_URI
- JWT_SECRET
- NEXT_PUBLIC_API_URL

**Step 4: Deploy**
Click "Deploy" and DigitalOcean handles the rest

---

## 6️⃣ Deploy to Docker

### Containerized Deployment

**Create Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

**Create docker-compose.yml:**
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      MONGODB_URI: mongodb://mongo:27017/farmers-market
      JWT_SECRET: your_secret
    depends_on:
      - mongo

  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

**Deploy:**
```bash
docker-compose up -d
```

---

## MongoDB Setup for Production

### Option 1: MongoDB Atlas (Cloud)

**Recommended for production**

1. Visit [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create account
3. Create cluster (Free tier available)
4. Create database user
5. Get connection string
6. Update MONGODB_URI

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/farmers-market?retryWrites=true&w=majority
```

### Option 2: Self-Hosted MongoDB

```bash
# Install MongoDB
sudo apt-get install mongodb

# Start service
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Create admin user
mongo
> use admin
> db.createUser({user: "admin", pwd: "password", roles: ["root"]})
> use farmers-market
> db.createUser({user: "app", pwd: "password", roles: ["readWrite"]})
```

---

## Domain & SSL Setup

### 1. Domain Configuration
1. Purchase domain (Namecheap, GoDaddy, Route53)
2. Point DNS to hosting provider
3. Update DNS records:
   - A record → Your app's IP
   - CNAME → Your app's domain

### 2. SSL Certificate
```bash
# Free SSL with Let's Encrypt
sudo apt-get install certbot
sudo certbot certonly --standalone -d yourdomain.com
```

### 3. Nginx Configuration
```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

---

## Post-Deployment Checklist

- [ ] Health check passing
- [ ] Database connected
- [ ] Emails working (if configured)
- [ ] APIs responding correctly
- [ ] Static files loading
- [ ] Redirects working
- [ ] SSL certificate valid
- [ ] Performance acceptable
- [ ] Monitoring configured
- [ ] Backups scheduled

---

## Monitoring & Maintenance

### Real-time Monitoring
```bash
# PM2 Monitoring
pm2 monit

# View logs
pm2 logs

# Dashboard
pm2 web  # Access at localhost:9615
```

### Automated Backups
```bash
# MongoDB backup script
#!/bin/bash
DATE=$(date +%Y-%m-%d)
mongodump --uri="mongodb+srv://..." --out=/backups/farmers-$DATE
```

### Performance Monitoring
- **Vercel**: Built-in analytics
- **Railway**: Dashboard monitoring
- **Heroku**: Metrics dashboard
- **AWS CloudWatch**: Logs and metrics
- **New Relic**: APM monitoring

---

## Security in Production

### Essential Security Steps
1. ✅ Enable HTTPS/SSL
2. ✅ Set strong JWT_SECRET
3. ✅ Configure CORS properly
4. ✅ Enable rate limiting
5. ✅ Setup firewall rules
6. ✅ Regular security updates
7. ✅ Database authentication
8. ✅ API key rotation

### Environment Variables
```env
# Production only
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://yourdomain.com
JWT_SECRET=<generate-strong-secret>
MONGODB_URI=<secure-connection-string>
```

### Rate Limiting
```javascript
// Install: npm install express-rate-limit
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use('/api/', limiter);
```

---

## Scaling Strategy

### Horizontal Scaling
- Load balancer (Nginx, HAProxy)
- Multiple app instances
- Session storage (Redis)

### Vertical Scaling
- Upgrade server resources
- Optimize code
- Cache strategies

### Database Scaling
- Indexing
- Sharding
- Read replicas

---

## Troubleshooting Deployment

### Common Issues

**Issue: MongoDB Connection Error**
```
Solution:
- Verify connection string
- Check IP whitelist (MongoDB Atlas)
- Ensure database exists
- Test connection locally
```

**Issue: Port Already in Use**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm start
```

**Issue: Build Fails**
```bash
# Clear cache
rm -rf .next
npm cache clean --force

# Rebuild
npm run build
```

**Issue: Slow Performance**
```
Solution:
- Enable caching
- Optimize images
- Minify CSS/JS
- Use CDN
- Monitor database queries
```

---

## Cost Estimation (Monthly)

| Service | Cost | Best For |
|---------|------|----------|
| Vercel | $0-20 | Small to Medium |
| Railway | $5-50 | Small projects |
| Heroku | $50+ | Hobby apps |
| DigitalOcean | $5+ | Developers |
| AWS | Varies | Enterprise |
| MongoDB Atlas | $0-57 | Database |

---

## Production Checklist

```
Deployment
  ✓ Code committed
  ✓ Tests passing
  ✓ Env variables set
  ✓ Database migrated
  ✓ SSL certificate
  ✓ Domain configured

Monitoring
  ✓ Health checks
  ✓ Error tracking
  ✓ Performance monitoring
  ✓ Log aggregation
  ✓ Uptime monitoring

Backup & Recovery
  ✓ Automated backups
  ✓ Recovery tested
  ✓ Disaster plan
  ✓ Data retention policy

Security
  ✓ Dependencies updated
  ✓ Secrets secured
  ✓ CORS configured
  ✓ Rate limiting
  ✓ Security headers
```

---

## Support Resources

- **Vercel Docs**: vercel.com/docs
- **Next.js Docs**: nextjs.org/docs
- **MongoDB Docs**: mongodb.com/docs
- **Node.js Docs**: nodejs.org/docs
- **Docker Docs**: docker.com/get-started

---

## Rollback Procedure

```bash
# Vercel
vercel --prod --no-confirm  # Redeploy previous version

# Git
git revert HEAD  # Revert last commit
git push origin main

# Docker
docker-compose down
docker-compose up -d  # With previous image
```

---

## Final Notes

✅ **Recommended Deployment Path:**
1. Start with **Vercel** (easiest)
2. Scale to **DigitalOcean** (when needed)
3. Migrate to **AWS** (enterprise)

✅ **Database Recommendation:**
- Use **MongoDB Atlas** for simplicity
- Self-host only if you have DevOps expertise

✅ **Monitoring Recommendation:**
- Vercel: Built-in (free)
- Add: Sentry for error tracking
- Add: LogRocket for user experience

---

**🎉 Your app is now production-ready!**

Made with ❤️ for Indian Agriculture 🌾
