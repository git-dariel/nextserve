# Next.js TypeScript Template with MongoDB & Prisma

A production-ready Next.js 14 TypeScript template with MongoDB database integration using Prisma ORM. Built with modern development tools and best practices for scalable web applications.

## 🚀 Features

### Core Technologies
- **Next.js 14** with App Router and TypeScript
- **MongoDB** with Prisma ORM for type-safe database operations
- **Tailwind CSS** for utility-first styling
- **JWT Authentication** with bcrypt for secure user management
- **Zod** for schema validation and type safety
- **Jest & Testing Library** for comprehensive testing

### Architecture & Design
- ✅ **Clean Architecture** with separation of concerns
- ✅ **Type Safety** with comprehensive TypeScript coverage
- ✅ **RESTful APIs** with consistent response patterns
- ✅ **Error Handling** with proper validation and error boundaries
- ✅ **Security** with JWT auth, password hashing, and CSRF protection
- ✅ **Performance** optimized queries, pagination, and caching
- ✅ **Scalability** with modular structure ready for growth

### Development Experience
- 🔧 **ESLint & Prettier** for code quality and formatting
- 🧪 **Jest Testing** with React Testing Library
- 📝 **TypeScript Strict Mode** with path aliases
- 🔄 **Hot Reload** and fast refresh for rapid development
- 📦 **Modern Build Tools** with optimized bundles

## 📁 Project Structure

```
next-prisma/
├── README.md
├── next.config.js
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── jest.config.js
├── jest.setup.js
├── .env.example
├── .env.local
├── .gitignore
├── .eslintrc.json
├── .prettierrc
├── public/
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── auth/         # Authentication endpoints
│   │   │   ├── users/        # User management
│   │   │   ├── posts/        # Content management
│   │   │   ├── comments/     # Comment system
│   │   │   └── health/       # Health check
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Home page
│   │   ├── loading.tsx       # Loading UI
│   │   ├── error.tsx         # Error boundaries
│   │   └── not-found.tsx     # 404 page
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # Base UI components
│   │   └── layout/           # Layout components
│   ├── lib/                   # Utilities and configurations
│   │   ├── db.ts             # Database connection
│   │   ├── auth.ts           # Authentication logic
│   │   ├── validations.ts    # Zod schemas
│   │   ├── utils.ts          # Helper functions
│   │   ├── constants.ts      # App constants
│   │   ├── api.ts            # API utilities
│   │   ├── middleware/       # Auth middleware
│   │   └── services/         # Business logic layer
│   ├── hooks/                 # Custom React hooks
│   │   ├── use-api.ts        # API state management
│   │   ├── use-auth.ts       # Authentication state
│   │   └── use-local-storage.ts
│   ├── types/                 # TypeScript definitions
│   │   ├── api.ts            # API types
│   │   ├── auth.ts           # Auth types
│   │   ├── database.ts       # Database types
│   │   └── common.ts         # Common types
│   └── styles/
│       └── globals.css       # Global styles
├── __tests__/                 # Test files
└── docs/                     # Documentation
```

## 🛠️ Quick Start

### Prerequisites

- Node.js 18+ and npm 8+
- MongoDB database (local or MongoDB Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd next-prisma
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your database URL and secrets:
   ```env
   DATABASE_URL="mongodb://localhost:27017/nextjs-template"
   JWT_SECRET="your-super-secret-jwt-key"
   JWT_EXPIRES_IN="7d"
   BCRYPT_ROUNDS="12"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Seed the database with sample data
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Schema

### User Model
- **Fields**: id, name, email, password, age, avatar, role, isActive, timestamps
- **Roles**: USER, ADMIN, MODERATOR
- **Relations**: hasMany Posts, hasMany Comments

### Post Model
- **Fields**: id, title, content, slug, published, publishedAt, tags, timestamps
- **Relations**: belongsTo User (author), hasMany Comments

### Comment Model
- **Fields**: id, content, timestamps
- **Relations**: belongsTo User (author), belongsTo Post

## 🔐 Authentication

### Test Accounts
After running the seed script, you can use these test accounts:

- **Admin**: `admin@example.com` / `admin123`
- **Moderator**: `moderator@example.com` / `moderator123`
- **User**: `john@example.com` / `user123`

### Authentication Flow
1. **Register**: `POST /api/auth/register`
2. **Login**: `POST /api/auth/login`
3. **Get Profile**: `GET /api/auth/me`

### Role-Based Access Control
- **USER**: Can read posts/comments, create comments
- **MODERATOR**: Can create/edit posts and comments
- **ADMIN**: Full access to all resources

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - List users (Admin only)
- `POST /api/users` - Create user (Admin only)
- `GET /api/users/[id]` - Get user details
- `PATCH /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

### Posts
- `GET /api/posts` - List posts (with filtering)
- `POST /api/posts` - Create post
- `GET /api/posts/[id]` - Get post details
- `GET /api/posts/slug/[slug]` - Get post by slug
- `PATCH /api/posts/[id]` - Update post
- `DELETE /api/posts/[id]` - Delete post

### Comments
- `GET /api/comments` - List comments
- `POST /api/comments` - Create comment
- `GET /api/comments/[id]` - Get comment details
- `PATCH /api/comments/[id]` - Update comment
- `DELETE /api/comments/[id]` - Delete comment

### Utility
- `GET /api/health` - Health check endpoint

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure
- **Unit Tests**: Components and utility functions
- **Integration Tests**: API endpoints and services
- **E2E Tests**: Full user workflows (setup required)

## 🚀 Deployment

### Environment Variables
Set the following environment variables in production:

```env
NODE_ENV=production
DATABASE_URL=your-production-mongodb-url
JWT_SECRET=your-production-jwt-secret
NEXTAUTH_URL=your-production-domain
```

### Build and Deploy

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Deployment Platforms
This template works out of the box with:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Railway**
- **Docker** (configuration included)

## 📚 Scripts Reference

### Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server

### Code Quality
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking

### Database
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio
- `npm run db:reset` - Reset database

### Testing
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage

## 🔧 Configuration

### TypeScript
- Strict mode enabled
- Path aliases configured (`@/` points to `src/`)
- Modern ES modules support

### ESLint & Prettier
- TypeScript-aware linting
- Automatic code formatting
- Import organization
- Tailwind CSS class sorting

### Tailwind CSS
- Custom design system with CSS variables
- Dark mode support
- Responsive design utilities
- Component-friendly configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Maintain consistent code style
- Update documentation as needed

## 📖 Additional Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

### Learning Resources
- [Next.js Learn Course](https://nextjs.org/learn)
- [Prisma Tutorials](https://www.prisma.io/learn)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js Team](https://nextjs.org) for the amazing framework
- [Prisma Team](https://prisma.io) for the excellent ORM
- [Tailwind CSS Team](https://tailwindcss.com) for the utility-first CSS framework
- [Vercel](https://vercel.com) for the deployment platform

---

**Built with ❤️ using Next.js, TypeScript, and modern web technologies.**
