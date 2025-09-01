import { prisma } from '@/lib/db';
import { 
  CreateUserData, 
  UpdateUserData, 
  UserQueryOptions,
  UserWithPosts,
  UserWithComments 
} from '@/types/database';
import { PaginationParams, SearchParams } from '@/types/common';
import { calculatePagination } from '@/lib/utils';
import { UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

export class UserService {
  // Create a new user
  static async create(data: CreateUserData) {
    const hashedPassword = await bcrypt.hash(data.password, 12);
    
    return await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        age: true,
        avatar: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  // Get user by ID
  static async getById(id: string, options: UserQueryOptions = {}) {
    const { includePosts = false, includeComments = false } = options;

    return await prisma.user.findUnique({
      where: { id },
      include: {
        posts: includePosts,
        comments: includeComments,
      },
    });
  }

  // Get user by email
  static async getByEmail(email: string, includePassword = false) {
    return await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: includePassword,
        age: true,
        avatar: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  // Get all users with pagination and filtering
  static async getAll(
    pagination: PaginationParams = {},
    search: SearchParams = {},
    filters: { isActive?: boolean; role?: UserRole } = {}
  ) {
    const { page = 1, limit = 10 } = pagination;
    const { query, sortBy = 'createdAt', sortOrder = 'desc' } = search;
    const { isActive, role } = filters;

    const offset = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
      ];
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (role) {
      where.role = role;
    }

    // Get total count
    const total = await prisma.user.count({ where });

    // Get users
    const users = await prisma.user.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
      select: {
        id: true,
        name: true,
        email: true,
        age: true,
        avatar: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            posts: true,
            comments: true,
          },
        },
      },
    });

    const meta = calculatePagination(page, limit, total);

    return {
      users,
      meta,
    };
  }

  // Update user
  static async update(id: string, data: UpdateUserData) {
    // Hash password if provided
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 12);
    }

    return await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        age: true,
        avatar: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  // Soft delete user (set isActive to false)
  static async softDelete(id: string) {
    return await prisma.user.update({
      where: { id },
      data: { isActive: false },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
      },
    });
  }

  // Hard delete user
  static async delete(id: string) {
    return await prisma.user.delete({
      where: { id },
    });
  }

  // Get user with posts
  static async getUserWithPosts(id: string): Promise<UserWithPosts | null> {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        posts: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  // Get user with comments
  static async getUserWithComments(id: string): Promise<UserWithComments | null> {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        comments: {
          orderBy: { createdAt: 'desc' },
          include: {
            post: {
              select: {
                id: true,
                title: true,
                slug: true,
              },
            },
          },
        },
      },
    });
  }

  // Check if email exists
  static async emailExists(email: string, excludeId?: string): Promise<boolean> {
    const where: any = { email };
    
    if (excludeId) {
      where.id = { not: excludeId };
    }

    const user = await prisma.user.findFirst({ where });
    return !!user;
  }

  // Verify password
  static async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Get user stats
  static async getUserStats(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        _count: {
          select: {
            posts: true,
            comments: true,
          },
        },
      },
    });

    if (!user) return null;

    const publishedPosts = await prisma.post.count({
      where: { authorId: id, published: true },
    });

    return {
      totalPosts: user._count.posts,
      publishedPosts,
      totalComments: user._count.comments,
    };
  }

  // Search users
  static async search(query: string, limit = 10) {
    return await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
        isActive: true,
      },
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
      },
      orderBy: { name: 'asc' },
    });
  }
}
