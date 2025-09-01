import { NextRequest, NextResponse } from 'next/server';
import { CommentService } from '@/lib/services';
import { updateCommentSchema } from '@/lib/validations';
import { successResponse, errorResponse, validateRequest, extractIdFromPath } from '@/lib/api';
import { withAuth, requirePermission } from '@/lib/middleware/auth.middleware';
import { SUCCESS_MESSAGES, ERROR_MESSAGES, HTTP_STATUS } from '@/lib/constants';
import { UserRole } from '@prisma/client';

// GET /api/comments/[id] - Get comment by ID
export async function GET(request: NextRequest) {
  const id = extractIdFromPath(request);
  
  const url = new URL(request.url);
  const includeAuthor = url.searchParams.get('includeAuthor') === 'true';
  const includePost = url.searchParams.get('includePost') === 'true';

  const comment = await CommentService.getById(id, {
    includeAuthor,
    includePost,
  });

  if (!comment) {
    return NextResponse.json(
      errorResponse(ERROR_MESSAGES.COMMENT_NOT_FOUND),
      { status: HTTP_STATUS.NOT_FOUND }
    );
  }

  return NextResponse.json(successResponse(comment));
}

// PATCH /api/comments/[id] - Update comment
export const PATCH = withAuth(
  async (request) => {
    const id = extractIdFromPath(request);
    
    const validation = await validateRequest(request, updateCommentSchema);
    
    if (!validation.success) {
      return validation.response;
    }

    // Check if comment exists
    const existingComment = await CommentService.getById(id);
    if (!existingComment) {
      return NextResponse.json(
        errorResponse(ERROR_MESSAGES.COMMENT_NOT_FOUND),
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    const comment = await CommentService.update(id, validation.data);

    return NextResponse.json(
      successResponse(comment, SUCCESS_MESSAGES.COMMENT_UPDATED)
    );
  },
  // Allow comment authors to update their own comments, or require permission
  async (request) => {
    const user = request.user!;
    const id = extractIdFromPath(request);
    
    if (user.role === UserRole.ADMIN || user.role === UserRole.MODERATOR) {
      return null; // Admins and moderators can update any comment
    }

    const comment = await CommentService.getById(id);
    if (comment && comment.authorId === user.id) {
      return null; // Authors can update their own comments
    }
    
    return requirePermission('comments', 'update')(request);
  }
);

// DELETE /api/comments/[id] - Delete comment
export const DELETE = withAuth(
  async (request) => {
    const id = extractIdFromPath(request);

    // Check if comment exists
    const existingComment = await CommentService.getById(id);
    if (!existingComment) {
      return NextResponse.json(
        errorResponse(ERROR_MESSAGES.COMMENT_NOT_FOUND),
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    await CommentService.delete(id);

    return NextResponse.json(
      successResponse(null, SUCCESS_MESSAGES.COMMENT_DELETED),
      { status: HTTP_STATUS.NO_CONTENT }
    );
  },
  // Allow comment authors to delete their own comments, or require permission
  async (request) => {
    const user = request.user!;
    const id = extractIdFromPath(request);
    
    if (user.role === UserRole.ADMIN || user.role === UserRole.MODERATOR) {
      return null; // Admins and moderators can delete any comment
    }

    const comment = await CommentService.getById(id);
    if (comment && comment.authorId === user.id) {
      return null; // Authors can delete their own comments
    }
    
    return requirePermission('comments', 'delete')(request);
  }
);
