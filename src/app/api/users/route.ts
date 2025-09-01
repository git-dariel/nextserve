import {
  parsePaginationParams,
  parseSearchParams,
  successResponse,
  validateRequest,
} from '@/lib/api';
import { HTTP_STATUS, SUCCESS_MESSAGES } from '@/lib/constants';
import { requirePermission, withAuth } from '@/lib/middleware/auth.middleware';
import { UserService } from '@/lib/services';
import { createUserSchema } from '@/lib/validations';
import { UserRole } from '@prisma/client';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// GET /api/users - List users (Admin only)
export const GET = withAuth(
  async request => {
    const { page, limit } = parsePaginationParams(request);
    const { query, sortBy, sortOrder } = parseSearchParams(request);

    const url = new URL(request.url);
    const isActive = url.searchParams.get('isActive');
    const role = url.searchParams.get('role') as UserRole | undefined;

    const filters: any = {};
    if (isActive !== null) filters.isActive = isActive === 'true';
    if (role) filters.role = role;

    const result = await UserService.getAll(
      { page, limit },
      { query, sortBy, sortOrder },
      filters
    );

    return NextResponse.json(
      successResponse(result.users, undefined, result.meta)
    );
  },
  requirePermission('users', 'read')
);

// POST /api/users - Create user (Admin only)
export const POST = withAuth(
  async request => {
    const validation = await validateRequest(request, createUserSchema);

    if (!validation.success) {
      return validation.response;
    }

    const user = await UserService.create(validation.data);

    return NextResponse.json(
      successResponse(user, SUCCESS_MESSAGES.USER_CREATED),
      { status: HTTP_STATUS.CREATED }
    );
  },
  requirePermission('users', 'create')
);
