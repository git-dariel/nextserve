import { prisma } from '@/lib/db';
import {
  CreatePostData,
  UpdatePostData,
  PostQueryOptions,
  PostWithAuthor,
  PostWithComments,
  PostWithRelations,
} from '@/types/database';
import { PaginationParams, SearchParams } from '@/types/common';
import { calculatePagination } from '@/lib/utils';

export class PostService {
  // Create a new post
  static async create(data: CreatePostData) {
    console.log('PostService.create called with data:', data);

    // First verify that the author exists
    const author = await prisma.user.findUnique({
      where: { id: data.authorId },
      select: { id: true, name: true, email: true },
    });

    console.log('Found author:', author);

    if (!author) {
      throw new Error(`Author not found with ID: ${data.authorId}`);
    }

    try {
      const post = await prisma.post.create({
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
        },
      });

      console.log('Post created successfully:', post.id);
      return post;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }

  // Get post by ID
  static async getById(id: string, options: PostQueryOptions = {}) {
    const { includeAuthor = false, includeComments = false } = options;

    return await prisma.post.findUnique({
      where: { id },
      include: {
        author: includeAuthor
          ? {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                role: true,
              },
            }
          : false,
        comments: includeComments
          ? {
              include: {
                author: {
                  select: {
                    id: true,
                    name: true,
                    avatar: true,
                  },
                },
              },
              orderBy: { createdAt: 'desc' },
            }
          : false,
      },
    });
  }

  // Get post by slug
  static async getBySlug(slug: string, options: PostQueryOptions = {}) {
    const { includeAuthor = false, includeComments = false } = options;

    return await prisma.post.findUnique({
      where: { slug },
      include: {
        author: includeAuthor
          ? {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                role: true,
              },
            }
          : false,
        comments: includeComments
          ? {
              include: {
                author: {
                  select: {
                    id: true,
                    name: true,
                    avatar: true,
                  },
                },
              },
              orderBy: { createdAt: 'desc' },
            }
          : false,
      },
    });
  }

  // Get all posts with pagination and filtering
  static async getAll(
    pagination: PaginationParams = {},
    search: SearchParams = {},
    filters: { published?: boolean; authorId?: string; tags?: string[] } = {}
  ) {
    const { page = 1, limit = 10 } = pagination;
    const { query, sortBy = 'createdAt', sortOrder = 'desc' } = search;
    const { published, authorId, tags } = filters;

    const offset = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
      ];
    }

    if (published !== undefined) {
      where.published = published;
    }

    if (authorId) {
      where.authorId = authorId;
    }

    if (tags && tags.length > 0) {
      where.tags = {
        hasSome: tags,
      };
    }

    // Get total count
    const total = await prisma.post.count({ where });

    // Get posts
    const posts = await prisma.post.findMany({
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
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    const meta = calculatePagination(page, limit, total);

    return {
      posts,
      meta,
    };
  }

  // Update post
  static async update(id: string, data: UpdatePostData) {
    return await prisma.post.update({
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
      },
    });
  }

  // Delete post
  static async delete(id: string) {
    return await prisma.post.delete({
      where: { id },
    });
  }

  // Get post with full relations
  static async getPostWithRelations(
    id: string
  ): Promise<PostWithRelations | null> {
    return await prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        comments: {
          include: {
            author: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  // Check if slug exists
  static async slugExists(slug: string, excludeId?: string): Promise<boolean> {
    const where: any = { slug };

    if (excludeId) {
      where.id = { not: excludeId };
    }

    const post = await prisma.post.findFirst({ where });
    return !!post;
  }

  // Get published posts
  static async getPublished(
    pagination: PaginationParams = {},
    search: SearchParams = {}
  ) {
    return this.getAll(pagination, search, { published: true });
  }

  // Get posts by author
  static async getByAuthor(
    authorId: string,
    pagination: PaginationParams = {},
    options: { published?: boolean } = {}
  ) {
    const { published } = options;
    const filters: any = { authorId };
    if (published !== undefined) filters.published = published;

    return this.getAll(pagination, {}, filters);
  }

  // Get posts by tags
  static async getByTags(
    tags: string[],
    pagination: PaginationParams = {},
    options: { published?: boolean } = {}
  ) {
    const { published = true } = options;

    return this.getAll(pagination, {}, { tags, published });
  }

  // Get popular tags
  static async getPopularTags(limit = 10) {
    const posts = await prisma.post.findMany({
      where: { published: true },
      select: { tags: true },
    });

    // Count tag frequency
    const tagCount: Record<string, number> = {};
    posts.forEach(post => {
      post.tags.forEach(tag => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });

    // Sort and limit
    return Object.entries(tagCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([tag, count]) => ({ tag, count }));
  }

  // Search posts
  static async search(query: string, limit = 10) {
    return await prisma.post.findMany({
      where: {
        AND: [
          { published: true },
          {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { content: { contains: query, mode: 'insensitive' } },
              { tags: { hasSome: [query] } },
            ],
          },
        ],
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
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Publish/unpublish post
  static async togglePublish(id: string) {
    const post = await prisma.post.findUnique({
      where: { id },
      select: { published: true },
    });

    if (!post) {
      throw new Error('Post not found');
    }

    const published = !post.published;

    return await prisma.post.update({
      where: { id },
      data: {
        published,
        publishedAt: published ? new Date() : null,
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
      },
    });
  }
}
