import { prisma } from '@/lib/db';
import { 
  CreateCommentData, 
  UpdateCommentData, 
  CommentQueryOptions,
  CommentWithAuthor,
  CommentWithPost 
} from '@/types/database';
import { PaginationParams, SearchParams } from '@/types/common';
import { calculatePagination } from '@/lib/utils';

export class CommentService {
  // Create a new comment
  static async create(data: CreateCommentData) {
    return await prisma.comment.create({
      data,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
          },
        },
        post: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });
  }

  // Get comment by ID
  static async getById(id: string, options: CommentQueryOptions = {}) {
    const { includeAuthor = false, includePost = false } = options;

    return await prisma.comment.findUnique({
      where: { id },
      include: {
        author: includeAuthor ? {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
          },
        } : false,
        post: includePost ? {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        } : false,
      },
    });
  }

  // Get all comments with pagination and filtering
  static async getAll(
    pagination: PaginationParams = {},
    search: SearchParams = {},
    filters: { postId?: string; authorId?: string } = {}
  ) {
    const { page = 1, limit = 10 } = pagination;
    const { query, sortBy = 'createdAt', sortOrder = 'desc' } = search;
    const { postId, authorId } = filters;

    const offset = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (query) {
      where.content = { contains: query, mode: 'insensitive' };
    }

    if (postId) {
      where.postId = postId;
    }

    if (authorId) {
      where.authorId = authorId;
    }

    // Get total count
    const total = await prisma.comment.count({ where });

    // Get comments
    const comments = await prisma.comment.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
          },
        },
        post: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    const meta = calculatePagination(page, limit, total);

    return {
      comments,
      meta,
    };
  }

  // Update comment
  static async update(id: string, data: UpdateCommentData) {
    return await prisma.comment.update({
      where: { id },
      data,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
          },
        },
        post: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });
  }

  // Delete comment
  static async delete(id: string) {
    return await prisma.comment.delete({
      where: { id },
    });
  }

  // Get comments by post
  static async getByPost(
    postId: string,
    pagination: PaginationParams = {},
    search: SearchParams = {}
  ) {
    return this.getAll(pagination, search, { postId });
  }

  // Get comments by author
  static async getByAuthor(
    authorId: string,
    pagination: PaginationParams = {},
    search: SearchParams = {}
  ) {
    return this.getAll(pagination, search, { authorId });
  }

  // Get comment with author
  static async getCommentWithAuthor(id: string): Promise<CommentWithAuthor | null> {
    return await prisma.comment.findUnique({
      where: { id },
      include: {
        author: true,
      },
    });
  }

  // Get comment with post
  static async getCommentWithPost(id: string): Promise<CommentWithPost | null> {
    return await prisma.comment.findUnique({
      where: { id },
      include: {
        post: true,
      },
    });
  }

  // Get recent comments
  static async getRecent(limit = 10) {
    return await prisma.comment.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        post: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });
  }

  // Search comments
  static async search(query: string, limit = 10) {
    return await prisma.comment.findMany({
      where: {
        content: { contains: query, mode: 'insensitive' },
      },
      take: limit,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        post: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get comment count by post
  static async getCountByPost(postId: string): Promise<number> {
    return await prisma.comment.count({
      where: { postId },
    });
  }

  // Get comment count by author
  static async getCountByAuthor(authorId: string): Promise<number> {
    return await prisma.comment.count({
      where: { authorId },
    });
  }
}
