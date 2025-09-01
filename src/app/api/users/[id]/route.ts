import { errorResponse, extractIdFromPath, successResponse, validateRequest } from '@/lib/api';
import { ERROR_MESSAGES, HTTP_STATUS, SUCCESS_MESSAGES } from '@/lib/constants';
import { requirePermission, withAuth } from '@/lib/middleware/auth.middleware';
import { UserService } from '@/lib/services';
import { updateUserSchema } from '@/lib/validations';
import { NextResponse } from 'next/server';

// GET /api/users/[id] - Get user by ID
export const GET = withAuth(
  async (request) => {
    const id = extractIdFromPath(request);
    
    const url = new URL(request.url);
    const includePosts = url.searchParams.get('includePosts') === 'true';
    const includeComments = url.searchParams.get('includeComments') === 'true';

    const user = await UserService.getById(id, {
      includePosts,
      includeComments,
    });

    if (!user) {
      return NextResponse.json(
        errorResponse(ERROR_MESSAGES.USER_NOT_FOUND),
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    return NextResponse.json(successResponse(user));
  },
  requirePermission('users', 'read')
);

// PATCH /api/users/[id] - Update user
export const PATCH = withAuth(
  async (request) => {
    const id = extractIdFromPath(request);
    
    const validation = await validateRequest(request, updateUserSchema);
    
    if (!validation.success) {
      return validation.response;
    }

    // Check if user exists
    const existingUser = await UserService.getById(id);
    if (!existingUser) {
      return NextResponse.json(
        errorResponse(ERROR_MESSAGES.USER_NOT_FOUND),
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    // Check email uniqueness if email is being updated
    if (validation.data.email && validation.data.email !== existingUser.email) {
      const emailExists = await UserService.emailExists(validation.data.email, id);
      if (emailExists) {
        return NextResponse.json(
          errorResponse(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS),
          { status: HTTP_STATUS.CONFLICT }
        );
      }
    }

    const user = await UserService.update(id, validation.data);

    return NextResponse.json(
      successResponse(user, SUCCESS_MESSAGES.USER_UPDATED)
    );
  },
  // Allow users to update their own profile, or require admin permission
  async (request) => {
    const user = request.user!;
    const id = extractIdFromPath(request);
    
    // Users can update their own profile
    if (user.id === id) {
      return null;
    }
    
    // Otherwise require admin permission
    return requirePermission('users', 'update')(request);
  }
);

// DELETE /api/users/[id] - Delete user (Admin only)
export const DELETE = withAuth(
  async (request) => {
    const id = extractIdFromPath(request);
    
    const url = new URL(request.url);
    const hardDelete = url.searchParams.get('hard') === 'true';

    // Check if user exists
    const existingUser = await UserService.getById(id);
    if (!existingUser) {
      return NextResponse.json(
        errorResponse(ERROR_MESSAGES.USER_NOT_FOUND),
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    if (hardDelete) {
      await UserService.delete(id);
    } else {
      await UserService.softDelete(id);
    }

    return NextResponse.json(
      successResponse(null, SUCCESS_MESSAGES.USER_DELETED),
      { status: HTTP_STATUS.NO_CONTENT }
    );
  },
  requirePermission('users', 'delete')
);
