import { NextRequest, NextResponse } from 'next/server';
import { CommentService } from '@/lib/services';
import { createCommentSchema } from '@/lib/validations';
import { successResponse, validateRequest, parsePaginationParams, parseSearchParams } from '@/lib/api';
import { withAuth, requirePermission } from '@/lib/middleware/auth.middleware';
import { SUCCESS_MESSAGES, HTTP_STATUS } from '@/lib/constants';

// GET /api/comments - List comments
export async function GET(request: NextRequest) {
  const { page, limit } = parsePaginationParams(request);
  const { query, sortBy, sortOrder } = parseSearchParams(request);
  
  const url = new URL(request.url);
  const postId = url.searchParams.get('postId') || undefined;
  const authorId = url.searchParams.get('authorId') || undefined;
  
  const filters: any = {};
  if (postId) filters.postId = postId;
  if (authorId) filters.authorId = authorId;

  const result = await CommentService.getAll(
    { page, limit },
    { query, sortBy, sortOrder },
    filters
  );

  return NextResponse.json(successResponse(result.comments, undefined, result.meta));
}

// POST /api/comments - Create comment
export const POST = withAuth(
  async (request) => {
    const validation = await validateRequest(request, createCommentSchema);
    
    if (!validation.success) {
      return validation.response;
    }

    // Set author to current user
    const commentData = {
      ...validation.data,
      authorId: request.user!.id,
    };

    const comment = await CommentService.create(commentData);

    return NextResponse.json(
      successResponse(comment, SUCCESS_MESSAGES.COMMENT_CREATED),
      { status: HTTP_STATUS.CREATED }
    );
  },
  requirePermission('comments', 'create')
);
