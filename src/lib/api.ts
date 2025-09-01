import { NextRequest, NextResponse } from 'next/server';
import { ZodSchema, ZodError } from 'zod';
import { ApiResponse, ApiError } from '@/types/api';
import { HTTP_STATUS, ERROR_MESSAGES } from './constants';

// API response helpers
export function successResponse<T>(
  data: T,
  message?: string,
  meta?: any
): ApiResponse<T> {
  const response: ApiResponse<T> = {
    success: true,
    data,
  };
  
  if (message) response.message = message;
  if (meta) response.meta = meta;
  
  return response;
}

export function errorResponse(
  message: string,
  errors?: Record<string, string[]>,
  statusCode?: number
): ApiError {
  return {
    success: false,
    message,
    errors,
    statusCode,
  };
}

// Validation helper
export async function validateRequest<T>(
  request: NextRequest,
  schema: ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; response: NextResponse }> {
  try {
    let body: any = {};
    
    if (request.method !== 'GET' && request.method !== 'DELETE') {
      const contentType = request.headers.get('content-type');
      
      if (contentType?.includes('application/json')) {
        body = await request.json();
      } else if (contentType?.includes('application/x-www-form-urlencoded')) {
        const formData = await request.formData();
        body = Object.fromEntries(formData.entries());
      }
    }

    // Parse URL parameters
    const url = new URL(request.url);
    const params = Object.fromEntries(url.searchParams.entries());

    // Combine body and params for validation
    const dataToValidate = { ...body, ...params };

    const validatedData = schema.parse(dataToValidate);
    
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof ZodError) {
      const errors: Record<string, string[]> = {};
      error.errors.forEach(err => {
        const path = err.path.join('.');
        if (!errors[path]) {
          errors[path] = [];
        }
        errors[path].push(err.message);
      });

      return {
        success: false,
        response: NextResponse.json(
          errorResponse(ERROR_MESSAGES.VALIDATION_ERROR, errors),
          { status: HTTP_STATUS.UNPROCESSABLE_ENTITY }
        ),
      };
    }

    return {
      success: false,
      response: NextResponse.json(
        errorResponse(ERROR_MESSAGES.INTERNAL_ERROR),
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
      ),
    };
  }
}

// Error handler wrapper
export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error);

  if (error instanceof Error) {
    // Handle specific known errors
    if (error.message.includes('not found')) {
      return NextResponse.json(
        errorResponse(error.message),
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    if (error.message.includes('already exists')) {
      return NextResponse.json(
        errorResponse(error.message),
        { status: HTTP_STATUS.CONFLICT }
      );
    }

    if (error.message.includes('unauthorized') || error.message.includes('Invalid credentials')) {
      return NextResponse.json(
        errorResponse(error.message),
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    return NextResponse.json(
      errorResponse(error.message),
      { status: HTTP_STATUS.BAD_REQUEST }
    );
  }

  return NextResponse.json(
    errorResponse(ERROR_MESSAGES.INTERNAL_ERROR),
    { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
  );
}

// Async handler wrapper with error handling
export function apiHandler<T = any>(
  handler: (request: NextRequest) => Promise<NextResponse | ApiResponse<T>>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      const result = await handler(request);
      
      // If handler returns NextResponse, return it directly
      if (result instanceof NextResponse) {
        return result;
      }

      // If handler returns ApiResponse, convert to NextResponse
      return NextResponse.json(result, {
        status: result.success ? HTTP_STATUS.OK : HTTP_STATUS.BAD_REQUEST,
      });
    } catch (error) {
      return handleApiError(error);
    }
  };
}

// CORS helper
export function withCors(response: NextResponse): NextResponse {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Max-Age', '86400');
  
  return response;
}

// Options handler for CORS preflight
export function handleOptions(): NextResponse {
  const response = new NextResponse(null, { status: 200 });
  return withCors(response);
}

// Parse pagination parameters
export function parsePaginationParams(request: NextRequest) {
  const url = new URL(request.url);
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '10')));
  
  return { page, limit };
}

// Parse search parameters
export function parseSearchParams(request: NextRequest) {
  const url = new URL(request.url);
  const query = url.searchParams.get('query') || undefined;
  const sortBy = url.searchParams.get('sortBy') || 'createdAt';
  const sortOrder = (url.searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';
  
  return { query, sortBy, sortOrder };
}

// Extract ID from URL path
export function extractIdFromPath(request: NextRequest): string {
  const url = new URL(request.url);
  const pathSegments = url.pathname.split('/');
  return pathSegments[pathSegments.length - 1];
}
