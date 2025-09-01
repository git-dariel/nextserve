import { NextRequest, NextResponse } from 'next/server';
import { PostService } from '@/lib/services';
import { createPostSchema } from '@/lib/validations';
import {
  successResponse,
  validateRequest,
  apiHandler,
  parsePaginationParams,
  parseSearchParams,
} from '@/lib/api';
import { withAuth, requirePermission } from '@/lib/middleware/auth.middleware';
import { SUCCESS_MESSAGES, HTTP_STATUS } from '@/lib/constants';

// GET /api/posts - List posts
export const GET = apiHandler(async (request: NextRequest) => {
  const { page, limit } = parsePaginationParams(request);
  const { query, sortBy, sortOrder } = parseSearchParams(request);

  const url = new URL(request.url);
  const published = url.searchParams.get('published');
  const authorId = url.searchParams.get('authorId') || undefined;
  const tags = url.searchParams.get('tags')?.split(',') || undefined;

  const filters: any = {};
  if (published !== null) filters.published = published === 'true';
  if (authorId) filters.authorId = authorId;
  if (tags) filters.tags = tags;

  const result = await PostService.getAll(
    { page, limit },
    { query, sortBy, sortOrder },
    filters
  );

  return NextResponse.json(
    successResponse(result.posts, undefined, result.meta)
  );
});

// POST /api/posts - Create post
export const POST = withAuth(
  async request => {
    const validation = await validateRequest(request, createPostSchema);

    if (!validation.success) {
      return validation.response;
    }

    // Check if slug already exists
    const slugExists = await PostService.slugExists(validation.data.slug);
    if (slugExists) {
      return NextResponse.json(
        {
          success: false,
          message: 'A post with this slug already exists',
          errors: { slug: ['Slug must be unique'] },
        },
        { status: HTTP_STATUS.CONFLICT }
      );
    }

    // Set author to current user
    const postData = {
      ...validation.data,
      authorId: request.user!.id,
    };

    console.log('Creating post with data:', postData);
    console.log('User from request:', request.user);

    const post = await PostService.create(postData);

    return NextResponse.json(
      successResponse(post, SUCCESS_MESSAGES.POST_CREATED),
      { status: HTTP_STATUS.CREATED }
    );
  },
  requirePermission('posts', 'create')
);
