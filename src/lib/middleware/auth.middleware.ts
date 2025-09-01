import { NextRequest, NextResponse } from 'next/server';
import { AuthService, extractTokenFromHeader } from '@/lib/auth';
import { UserRole } from '@prisma/client';
import { ROLE_PERMISSIONS, ERROR_MESSAGES, HTTP_STATUS } from '@/lib/constants';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
    role: UserRole;
  };
}

// Authentication middleware
export async function authMiddleware(request: NextRequest): Promise<NextResponse | null> {
  const token = extractTokenFromHeader(request.headers.get('authorization'));

  if (!token) {
    return NextResponse.json(
      {
        success: false,
        message: ERROR_MESSAGES.UNAUTHORIZED,
      },
      { status: HTTP_STATUS.UNAUTHORIZED }
    );
  }

  const payload = AuthService.verifyToken(token);

  if (!payload) {
    return NextResponse.json(
      {
        success: false,
        message: ERROR_MESSAGES.INVALID_TOKEN,
      },
      { status: HTTP_STATUS.UNAUTHORIZED }
    );
  }

  // Add user to request
  (request as AuthenticatedRequest).user = {
    id: payload.userId,
    email: payload.email,
    role: payload.role,
  };

  return null; // Continue to next middleware/handler
}

// Role-based authorization middleware
export function requireRole(allowedRoles: UserRole[]) {
  return async (request: AuthenticatedRequest): Promise<NextResponse | null> => {
    const user = request.user;

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: ERROR_MESSAGES.UNAUTHORIZED,
        },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json(
        {
          success: false,
          message: ERROR_MESSAGES.UNAUTHORIZED,
        },
        { status: HTTP_STATUS.FORBIDDEN }
      );
    }

    return null; // Continue to next middleware/handler
  };
}

// Permission-based authorization middleware
export function requirePermission(resource: string, action: string) {
  return async (request: AuthenticatedRequest): Promise<NextResponse | null> => {
    const user = request.user;

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: ERROR_MESSAGES.UNAUTHORIZED,
        },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    const userPermissions = ROLE_PERMISSIONS[user.role];
    const hasPermission = userPermissions.some(
      permission => permission.resource === resource && permission.action === action
    );

    if (!hasPermission) {
      return NextResponse.json(
        {
          success: false,
          message: ERROR_MESSAGES.UNAUTHORIZED,
        },
        { status: HTTP_STATUS.FORBIDDEN }
      );
    }

    return null; // Continue to next middleware/handler
  };
}

// Resource ownership middleware
export function requireOwnership(getResourceOwnerId: (request: AuthenticatedRequest) => Promise<string | null>) {
  return async (request: AuthenticatedRequest): Promise<NextResponse | null> => {
    const user = request.user;

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: ERROR_MESSAGES.UNAUTHORIZED,
        },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    // Admins can access everything
    if (user.role === UserRole.ADMIN) {
      return null;
    }

    const resourceOwnerId = await getResourceOwnerId(request);

    if (!resourceOwnerId || resourceOwnerId !== user.id) {
      return NextResponse.json(
        {
          success: false,
          message: ERROR_MESSAGES.UNAUTHORIZED,
        },
        { status: HTTP_STATUS.FORBIDDEN }
      );
    }

    return null; // Continue to next middleware/handler
  };
}

// Combine multiple middleware functions
export function combineMiddleware(...middlewares: Array<(request: AuthenticatedRequest) => Promise<NextResponse | null>>) {
  return async (request: NextRequest): Promise<NextResponse | null> => {
    let currentRequest = request as AuthenticatedRequest;

    for (const middleware of middlewares) {
      const result = await middleware(currentRequest);
      if (result) {
        return result; // Return error response
      }
    }

    return null; // Continue to handler
  };
}

// Utility function to create authenticated handler
export function withAuth(
  handler: (request: AuthenticatedRequest) => Promise<NextResponse>,
  ...middlewares: Array<(request: AuthenticatedRequest) => Promise<NextResponse | null>>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    // First run authentication
    const authResult = await authMiddleware(request);
    if (authResult) {
      return authResult;
    }

    // Then run additional middlewares
    const combinedMiddleware = combineMiddleware(...middlewares);
    const middlewareResult = await combinedMiddleware(request);
    if (middlewareResult) {
      return middlewareResult;
    }

    // Finally run the handler
    return await handler(request as AuthenticatedRequest);
  };
}
