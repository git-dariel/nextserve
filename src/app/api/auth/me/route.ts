import { NextRequest, NextResponse } from 'next/server';
import { AuthService, extractTokenFromHeader } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api';
import { ERROR_MESSAGES, HTTP_STATUS } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const token = extractTokenFromHeader(request.headers.get('authorization'));

    if (!token) {
      return NextResponse.json(errorResponse(ERROR_MESSAGES.UNAUTHORIZED), {
        status: HTTP_STATUS.UNAUTHORIZED,
      });
    }

    const user = await AuthService.getCurrentUser(token);

    if (!user) {
      return NextResponse.json(errorResponse(ERROR_MESSAGES.INVALID_TOKEN), {
        status: HTTP_STATUS.UNAUTHORIZED,
      });
    }

    return NextResponse.json(successResponse(user));
  } catch (error) {
    return NextResponse.json(errorResponse(ERROR_MESSAGES.INTERNAL_ERROR), {
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    });
  }
}
