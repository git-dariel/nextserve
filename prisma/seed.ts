import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  console.log('👥 Creating users...');
  
  const adminPassword = await bcrypt.hash('admin123', 12);
  const userPassword = await bcrypt.hash('user123', 12);
  const moderatorPassword = await bcrypt.hash('moderator123', 12);

  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      age: 30,
      role: UserRole.ADMIN,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    },
  });

  const moderator = await prisma.user.create({
    data: {
      name: 'Moderator User',
      email: 'moderator@example.com',
      password: moderatorPassword,
      age: 28,
      role: UserRole.MODERATOR,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=moderator',
    },
  });

  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john@example.com',
        password: userPassword,
        age: 25,
        role: UserRole.USER,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: userPassword,
        age: 32,
        role: UserRole.USER,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Bob Johnson',
        email: 'bob@example.com',
        password: userPassword,
        age: 45,
        role: UserRole.USER,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Alice Brown',
        email: 'alice@example.com',
        password: userPassword,
        age: 29,
        role: UserRole.USER,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
      },
    }),
  ]);

  console.log(`✅ Created ${users.length + 2} users`);

  // Create posts
  console.log('📝 Creating posts...');
  
  const posts = await Promise.all([
    prisma.post.create({
      data: {
        title: 'Getting Started with Next.js 14',
        content: `# Getting Started with Next.js 14

Next.js 14 brings exciting new features and improvements that make building React applications even better. In this post, we'll explore the key features and how to get started.

## What's New in Next.js 14

- **Turbopack**: The new Rust-based bundler for faster development
- **Server Actions**: Simplified server-side operations
- **Partial Prerendering**: Better performance for dynamic content
- **Improved TypeScript Support**: Enhanced developer experience

## Setting Up Your Project

To create a new Next.js 14 project, run:

\`\`\`bash
npx create-next-app@latest my-app
cd my-app
npm run dev
\`\`\`

## Key Features

### App Router
The new App Router provides a more intuitive way to organize your application with layout support and nested routing.

### Server Components
Server Components allow you to render components on the server, reducing the JavaScript bundle size and improving performance.

## Conclusion

Next.js 14 continues to push the boundaries of what's possible with React applications. Start building today!`,
        slug: 'getting-started-with-nextjs-14',
        published: true,
        publishedAt: new Date('2023-12-01T10:00:00Z'),
        tags: ['nextjs', 'react', 'javascript', 'tutorial'],
        authorId: admin.id,
      },
    }),
    prisma.post.create({
      data: {
        title: 'Building Modern APIs with TypeScript and Prisma',
        content: `# Building Modern APIs with TypeScript and Prisma

Creating robust, type-safe APIs is crucial for modern web applications. This guide will show you how to build APIs using TypeScript and Prisma.

## Why TypeScript + Prisma?

- **Type Safety**: End-to-end type safety from database to client
- **Developer Experience**: Excellent IntelliSense and autocompletion
- **Performance**: Optimized queries and efficient data access
- **Maintainability**: Easier refactoring and debugging

## Setting Up Prisma

First, install Prisma and initialize your project:

\`\`\`bash
npm install prisma @prisma/client
npx prisma init
\`\`\`

## Defining Your Schema

Create your database schema in \`prisma/schema.prisma\`:

\`\`\`prisma
model User {
  id    String @id @default(auto()) @map("_id") @db.ObjectId
  email String @unique
  name  String
  posts Post[]
}

model Post {
  id       String @id @default(auto()) @map("_id") @db.ObjectId
  title    String
  content  String
  author   User   @relation(fields: [authorId], references: [id])
  authorId String @db.ObjectId
}
\`\`\`

## Creating API Routes

With Next.js App Router, create API routes in the \`app/api\` directory:

\`\`\`typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const users = await prisma.user.findMany({
    include: { posts: true }
  });
  
  return NextResponse.json(users);
}
\`\`\`

## Best Practices

1. **Use type-safe validators** like Zod for input validation
2. **Implement proper error handling** with consistent error responses
3. **Add authentication and authorization** for protected routes
4. **Use database transactions** for complex operations
5. **Implement pagination** for large datasets

## Conclusion

TypeScript and Prisma provide an excellent foundation for building modern, type-safe APIs. Start building your next API with confidence!`,
        slug: 'building-modern-apis-typescript-prisma',
        published: true,
        publishedAt: new Date('2023-12-05T14:30:00Z'),
        tags: ['typescript', 'prisma', 'api', 'database'],
        authorId: moderator.id,
      },
    }),
    prisma.post.create({
      data: {
        title: 'Mastering Tailwind CSS: Tips and Tricks',
        content: `# Mastering Tailwind CSS: Tips and Tricks

Tailwind CSS has revolutionized how we write CSS. Here are some advanced tips and tricks to level up your Tailwind game.

## Advanced Composition Patterns

### Using @apply for Complex Components

\`\`\`css
.btn-primary {
  @apply px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300;
}
\`\`\`

### Custom Utilities

Create custom utilities for your design system:

\`\`\`css
.text-shadow {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}
\`\`\`

## Responsive Design Best Practices

### Mobile-First Approach

Always start with mobile styles and add larger breakpoints:

\`\`\`html
<div class="w-full md:w-1/2 lg:w-1/3">
  <!-- Content -->
</div>
\`\`\`

### Container Queries

Use container queries for component-based responsive design:

\`\`\`html
<div class="@container">
  <div class="@lg:grid @lg:grid-cols-2">
    <!-- Content -->
  </div>
</div>
\`\`\`

## Dark Mode Implementation

Implement dark mode with Tailwind's built-in support:

\`\`\`html
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  <!-- Content -->
</div>
\`\`\`

## Performance Optimization

### Purging Unused CSS

Configure your \`tailwind.config.js\` properly:

\`\`\`javascript
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  // ...
}
\`\`\`

### JIT Mode

Use Just-in-Time mode for faster builds:

\`\`\`javascript
module.exports = {
  mode: 'jit',
  // ...
}
\`\`\`

## Advanced Layout Techniques

### Grid Template Areas

Use CSS Grid template areas for complex layouts:

\`\`\`html
<div class="grid grid-areas-layout">
  <header class="grid-in-header">Header</header>
  <nav class="grid-in-nav">Navigation</nav>
  <main class="grid-in-main">Main Content</main>
  <footer class="grid-in-footer">Footer</footer>
</div>
\`\`\`

## Conclusion

Tailwind CSS provides endless possibilities for creating beautiful, responsive designs. Master these techniques to build better user interfaces!`,
        slug: 'mastering-tailwind-css-tips-tricks',
        published: true,
        publishedAt: new Date('2023-12-10T09:15:00Z'),
        tags: ['css', 'tailwind', 'design', 'frontend'],
        authorId: users[0].id,
      },
    }),
    prisma.post.create({
      data: {
        title: 'Authentication Best Practices in 2024',
        content: `# Authentication Best Practices in 2024

Security is paramount in modern web applications. Here are the latest best practices for implementing authentication in 2024.

## JWT vs Sessions: Making the Right Choice

### When to Use JWTs

- **Stateless architecture**: Perfect for microservices
- **Mobile applications**: Easy token management
- **Third-party integrations**: Standard format for APIs

### When to Use Sessions

- **Server-side rendered apps**: Better security for traditional web apps
- **Sensitive applications**: Easier to revoke access
- **Simple architecture**: Less complexity for monolithic apps

## Implementing Secure Authentication

### Password Security

\`\`\`typescript
import bcrypt from 'bcryptjs';

// Hash password with high cost factor
const hashedPassword = await bcrypt.hash(password, 12);

// Verify password
const isValid = await bcrypt.compare(password, hashedPassword);
\`\`\`

### JWT Best Practices

\`\`\`typescript
import jwt from 'jsonwebtoken';

// Short-lived access tokens
const accessToken = jwt.sign(
  { userId, role },
  process.env.JWT_SECRET,
  { expiresIn: '15m' }
);

// Long-lived refresh tokens
const refreshToken = jwt.sign(
  { userId },
  process.env.REFRESH_SECRET,
  { expiresIn: '7d' }
);
\`\`\`

## Multi-Factor Authentication (MFA)

Implement MFA for enhanced security:

1. **SMS-based OTP**: Quick but less secure
2. **Time-based OTP (TOTP)**: Apps like Google Authenticator
3. **Hardware tokens**: Highest security level
4. **Biometric authentication**: Convenient for mobile apps

## OAuth 2.0 and OpenID Connect

### Social Login Integration

\`\`\`typescript
// Example with Google OAuth
const googleConfig = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: '/api/auth/google/callback',
  scope: ['openid', 'email', 'profile']
};
\`\`\`

## Security Headers and CSRF Protection

### Essential Security Headers

\`\`\`typescript
// Next.js middleware
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return response;
}
\`\`\`

### CSRF Protection

\`\`\`typescript
import { createToken, verifyToken } from 'csrf';

// Generate CSRF token
const csrfToken = createToken(secret);

// Verify CSRF token
const isValid = verifyToken(secret, token);
\`\`\`

## Rate Limiting and Brute Force Protection

### Implement Rate Limiting

\`\`\`typescript
import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});
\`\`\`

## Conclusion

Authentication security is constantly evolving. Stay updated with the latest best practices and always prioritize user security in your applications.`,
        slug: 'authentication-best-practices-2024',
        published: true,
        publishedAt: new Date('2023-12-15T16:45:00Z'),
        tags: ['security', 'authentication', 'jwt', 'oauth'],
        authorId: users[1].id,
      },
    }),
    prisma.post.create({
      data: {
        title: 'Draft: Upcoming Features in React 19',
        content: `# Upcoming Features in React 19

This is a draft post about the exciting features coming in React 19. Still working on the content...

## Concurrent Features

More details coming soon...

## Server Components Improvements

To be written...`,
        slug: 'upcoming-features-react-19',
        published: false,
        tags: ['react', 'javascript', 'draft'],
        authorId: users[2].id,
      },
    }),
  ]);

  console.log(`✅ Created ${posts.length} posts`);

  // Create comments
  console.log('💬 Creating comments...');
  
  const comments = await Promise.all([
    // Comments for first post
    prisma.comment.create({
      data: {
        content: 'Great introduction to Next.js 14! The Turbopack improvements are really impressive.',
        authorId: users[0].id,
        postId: posts[0].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'Thanks for this tutorial. The server actions feature looks really promising for simplifying data mutations.',
        authorId: users[1].id,
        postId: posts[0].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'I\'ve been using Next.js 13 and was hesitant to upgrade. This post convinced me to give 14 a try!',
        authorId: moderator.id,
        postId: posts[0].id,
      },
    }),
    // Comments for second post
    prisma.comment.create({
      data: {
        content: 'The TypeScript + Prisma combination is indeed powerful. We\'ve been using it in production for 6 months now.',
        authorId: admin.id,
        postId: posts[1].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'Could you add more examples about handling complex relations? That would be super helpful.',
        authorId: users[2].id,
        postId: posts[1].id,
      },
    }),
    // Comments for third post
    prisma.comment.create({
      data: {
        content: 'These Tailwind tips are gold! The @apply directive has been a game-changer for our component library.',
        authorId: users[3].id,
        postId: posts[2].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'The dark mode implementation guide is exactly what I needed. Clean and simple approach.',
        authorId: admin.id,
        postId: posts[2].id,
      },
    }),
    // Comments for fourth post
    prisma.comment.create({
      data: {
        content: 'Security is so important but often overlooked. Thanks for highlighting these best practices.',
        authorId: users[0].id,
        postId: posts[3].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'The rate limiting example is particularly useful. We implemented something similar after reading this.',
        authorId: users[2].id,
        postId: posts[3].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'Would love to see a follow-up post about implementing OAuth with popular providers.',
        authorId: users[3].id,
        postId: posts[3].id,
      },
    }),
  ]);

  console.log(`✅ Created ${comments.length} comments`);

  // Print summary
  console.log('\n🎉 Database seeded successfully!');
  console.log('\n📊 Summary:');
  console.log(`   👥 Users: ${users.length + 2} (1 admin, 1 moderator, ${users.length} regular users)`);
  console.log(`   📝 Posts: ${posts.length} (${posts.filter(p => p.published).length} published, ${posts.filter(p => !p.published).length} drafts)`);
  console.log(`   💬 Comments: ${comments.length}`);
  
  console.log('\n🔐 Test Accounts:');
  console.log('   Admin: admin@example.com / admin123');
  console.log('   Moderator: moderator@example.com / moderator123');
  console.log('   User: john@example.com / user123');
  console.log('   User: jane@example.com / user123');
  console.log('   User: bob@example.com / user123');
  console.log('   User: alice@example.com / user123');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
