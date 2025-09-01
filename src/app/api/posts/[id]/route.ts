import { NextRequest, NextResponse } from 'next/server';
import { PostService } from '@/lib/services';
import { updatePostSchema } from '@/lib/validations';
import { successResponse, errorResponse, validateRequest, extractIdFromPath } from '@/lib/api';
import { withAuth, requirePermission, requireOwnership } from '@/lib/middleware/auth.middleware';
import { SUCCESS_MESSAGES, ERROR_MESSAGES, HTTP_STATUS } from '@/lib/constants';
import { UserRole } from '@prisma/client';

// GET /api/posts/[id] - Get post by ID
export async function GET(request: NextRequest) {
  const id = extractIdFromPath(request);
  
  const url = new URL(request.url);
  const includeAuthor = url.searchParams.get('includeAuthor') === 'true';
  const includeComments = url.searchParams.get('includeComments') === 'true';

  const post = await PostService.getById(id, {
    includeAuthor,
    includeComments,
  });

  if (!post) {
    return NextResponse.json(
      errorResponse(ERROR_MESSAGES.POST_NOT_FOUND),
      { status: HTTP_STATUS.NOT_FOUND }
    );
  }

  return NextResponse.json(successResponse(post));
}

// PATCH /api/posts/[id] - Update post
export const PATCH = withAuth(
  async (request) => {
    const id = extractIdFromPath(request);
    
    const validation = await validateRequest(request, updatePostSchema);
    
    if (!validation.success) {
      return validation.response;
    }

    // Check if post exists
    const existingPost = await PostService.getById(id);
    if (!existingPost) {
      return NextResponse.json(
        errorResponse(ERROR_MESSAGES.POST_NOT_FOUND),
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    // Check slug uniqueness if slug is being updated
    if (validation.data.slug && validation.data.slug !== existingPost.slug) {
      const slugExists = await PostService.slugExists(validation.data.slug, id);
      if (slugExists) {
        return NextResponse.json(
          errorResponse(ERROR_MESSAGES.SLUG_ALREADY_EXISTS),
          { status: HTTP_STATUS.CONFLICT }
        );
      }
    }

    const post = await PostService.update(id, validation.data);

    return NextResponse.json(
      successResponse(post, SUCCESS_MESSAGES.POST_UPDATED)
    );
  },
  // Allow post authors to update their own posts, or require permission
  async (request) => {
    const user = request.user!;
    const id = extractIdFromPath(request);
    
    if (user.role === UserRole.ADMIN) {
      return null; // Admins can update any post
    }

    const post = await PostService.getById(id);
    if (post && post.authorId === user.id) {
      return null; // Authors can update their own posts
    }
    
    return requirePermission('posts', 'update')(request);
  }
);

// DELETE /api/posts/[id] - Delete post
export const DELETE = withAuth(
  async (request) => {
    const id = extractIdFromPath(request);

    // Check if post exists
    const existingPost = await PostService.getById(id);
    if (!existingPost) {
      return NextResponse.json(
        errorResponse(ERROR_MESSAGES.POST_NOT_FOUND),
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    await PostService.delete(id);

    return NextResponse.json(
      successResponse(null, SUCCESS_MESSAGES.POST_DELETED),
      { status: HTTP_STATUS.NO_CONTENT }
    );
  },
  // Allow post authors to delete their own posts, or require permission
  async (request) => {
    const user = request.user!;
    const id = extractIdFromPath(request);
    
    if (user.role === UserRole.ADMIN) {
      return null; // Admins can delete any post
    }

    const post = await PostService.getById(id);
    if (post && post.authorId === user.id) {
      return null; // Authors can delete their own posts
    }
    
    return requirePermission('posts', 'delete')(request);
  }
);
