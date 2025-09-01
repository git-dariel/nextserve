# Deployment Guide

This guide covers how to deploy the Next.js TypeScript template to various platforms.

## Environment Variables

Before deploying, ensure you have the following environment variables configured:

### Required Variables

```env
# Database
DATABASE_URL=your-mongodb-connection-string
MONGODB_URI=your-mongodb-connection-string

# Authentication
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=12

# Next.js
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-nextauth-secret

# Environment
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Optional Variables

```env
# External Services (if used)
UPLOADCARE_PUBLIC_KEY=your-uploadcare-key
STRIPE_SECRET_KEY=your-stripe-key
SENDGRID_API_KEY=your-sendgrid-key
```

## Platform-Specific Deployments

### Vercel (Recommended)

Vercel is the easiest platform to deploy Next.js applications.

#### Automatic Deployment

1. **Connect your repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your Git repository

2. **Configure environment variables**
   - In the Vercel dashboard, go to your project settings
   - Add all required environment variables
   - Make sure to set `NODE_ENV=production`

3. **Deploy**
   - Vercel automatically builds and deploys your application
   - Your app will be available at `https://your-project.vercel.app`

#### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod

# Follow the prompts to configure your deployment
```

#### vercel.json Configuration

Create a `vercel.json` file for advanced configuration:

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

### Netlify

#### Automatic Deployment

1. **Connect your repository**
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "New site from Git"
   - Connect your repository

2. **Configure build settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: `18`

3. **Environment variables**
   - Go to Site settings > Environment variables
   - Add all required environment variables

#### netlify.toml Configuration

Create a `netlify.toml` file:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "8"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Railway

Railway provides an easy way to deploy with database included.

#### Deployment Steps

1. **Connect your repository**
   - Go to [Railway Dashboard](https://railway.app)
   - Click "New Project" > "Deploy from GitHub repo"

2. **Add MongoDB database**
   - In your project dashboard, click "New"
   - Select "Database" > "MongoDB"
   - Railway will provide a connection string

3. **Configure environment variables**
   - Go to your service settings
   - Add all required environment variables
   - Use the Railway-provided DATABASE_URL

4. **Deploy**
   - Railway automatically builds and deploys your application

### Docker Deployment

#### Dockerfile

Create a `Dockerfile`:

```dockerfile
# Use the official Node.js runtime as base image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### Docker Compose

Create a `docker-compose.yml` for local development:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=mongodb://mongo:27017/nextjs-template
      - JWT_SECRET=your-jwt-secret
    depends_on:
      - mongo

  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    environment:
      - MONGO_INITDB_DATABASE=nextjs-template

volumes:
  mongo_data:
```

#### Build and Run

```bash
# Build the Docker image
docker build -t nextjs-template .

# Run with Docker Compose
docker-compose up -d

# Or run standalone
docker run -p 3000:3000 -e DATABASE_URL=your-mongo-url nextjs-template
```

### Digital Ocean App Platform

1. **Create a new app**
   - Go to [Digital Ocean Apps](https://cloud.digitalocean.com/apps)
   - Click "Create App"
   - Connect your GitHub repository

2. **Configure the app**
   - Build command: `npm run build`
   - Run command: `npm start`
   - Environment: Node.js

3. **Add MongoDB database**
   - Add a MongoDB component to your app
   - Use the provided connection string

4. **Environment variables**
   - Add all required environment variables in the app settings

### AWS (EC2 + MongoDB Atlas)

#### EC2 Setup

1. **Launch EC2 instance**
   - Choose Ubuntu 22.04 LTS
   - At least t3.micro for basic usage
   - Configure security groups (HTTP, HTTPS, SSH)

2. **Install dependencies**
   ```bash
   # Connect to your instance
   ssh -i your-key.pem ubuntu@your-instance-ip

   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install PM2 for process management
   sudo npm install -g pm2

   # Install Nginx for reverse proxy
   sudo apt install nginx -y
   ```

3. **Deploy your application**
   ```bash
   # Clone your repository
   git clone your-repository-url
   cd your-app

   # Install dependencies
   npm install

   # Build the application
   npm run build

   # Start with PM2
   pm2 start npm --name "nextjs-app" -- start
   pm2 startup
   pm2 save
   ```

4. **Configure Nginx**
   ```nginx
   # /etc/nginx/sites-available/your-app
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   ```bash
   # Enable the site
   sudo ln -s /etc/nginx/sites-available/your-app /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

#### MongoDB Atlas Setup

1. **Create a cluster**
   - Go to [MongoDB Atlas](https://cloud.mongodb.com)
   - Create a new cluster
   - Choose your preferred region

2. **Configure database access**
   - Create a database user
   - Whitelist your server's IP address

3. **Get connection string**
   - Use the connection string in your environment variables

## SSL/HTTPS Setup

### Vercel/Netlify
Automatic HTTPS is provided by default.

### Custom Domains
For custom deployments, use Let's Encrypt:

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Database Migration

When deploying, ensure your database is properly set up:

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed the database (optional)
npm run db:seed
```

## Monitoring and Logging

### Application Monitoring

1. **Error Tracking**
   - Integrate with Sentry for error tracking
   - Add `@sentry/nextjs` to your project

2. **Performance Monitoring**
   - Use Vercel Analytics for performance insights
   - Monitor Core Web Vitals

3. **Uptime Monitoring**
   - Set up uptime monitoring with services like UptimeRobot
   - Monitor your `/api/health` endpoint

### Logging

```javascript
// lib/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

export default logger;
```

## Security Considerations

1. **Environment Variables**
   - Never commit secrets to version control
   - Use platform-specific secret management

2. **Database Security**
   - Use strong passwords
   - Enable MongoDB authentication
   - Restrict database access by IP

3. **Application Security**
   - Keep dependencies updated
   - Use HTTPS everywhere
   - Implement proper CORS policies
   - Set security headers

4. **Regular Updates**
   ```bash
   # Check for updates
   npm audit
   npm update

   # Fix vulnerabilities
   npm audit fix
   ```

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Ensure all environment variables are set
   - Review build logs for specific errors

2. **Database Connection Issues**
   - Verify connection string format
   - Check network connectivity
   - Ensure database is running and accessible

3. **Performance Issues**
   - Monitor memory usage
   - Check database query performance
   - Review application metrics

### Getting Help

- Check the [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- Review platform-specific documentation
- Check application logs for error details
- Use the health check endpoint to verify system status

## Backup and Recovery

1. **Database Backups**
   - Set up automated MongoDB backups
   - Test backup restoration procedures

2. **Code Backups**
   - Use Git for version control
   - Maintain multiple deployment environments

3. **Environment Configuration**
   - Document all environment variables
   - Keep configuration templates updated
