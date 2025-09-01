import { PaginationMeta } from './common';

// Generic API response structure
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
  meta?: PaginationMeta;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}

// Paginated response
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta;
}

// API endpoint methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiRequestConfig {
  method: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string | number | boolean>;
}

// Hook return types
export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseApiMutation<TData, TVariables = any> {
  mutate: (variables: TVariables) => Promise<TData>;
  data: TData | null;
  loading: boolean;
  error: string | null;
  reset: () => void;
}

// Validation error structure
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// API endpoint types
export interface HealthCheckResponse {
  status: 'ok' | 'error';
  timestamp: string;
  database: 'connected' | 'disconnected';
  version: string;
}

// Request/Response types for specific endpoints
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
  token: string;
  expiresIn: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  age?: number;
  avatar?: string;
  role?: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  age?: number;
  avatar?: string;
  role?: string;
  isActive?: boolean;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  slug: string;
  published?: boolean;
  tags?: string[];
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  slug?: string;
  published?: boolean;
  tags?: string[];
}

export interface CreateCommentRequest {
  content: string;
  postId: string;
}
