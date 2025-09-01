import { useState, useEffect, useCallback } from 'react';
import { UseApiState, UseApiMutation, ApiResponse } from '@/types/api';
import { API_ROUTES } from '@/lib/constants';

// Generic API hook for GET requests
export function useApi<T>(
  url: string,
  options: {
    enabled?: boolean;
    deps?: any[];
    token?: string | null | undefined;
  } = {}
): UseApiState<T> {
  const { enabled = true, deps = [], token } = options;
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
    refetch: async () => {},
  });

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers,
      });

      const result: ApiResponse<T> = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'API request failed');
      }

      setState(prev => ({
        ...prev,
        data: result.data || null,
        loading: false,
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
    }
  }, [url, enabled, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData, ...deps]);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  return {
    ...state,
    refetch,
  };
}

// Generic mutation hook for POST, PUT, PATCH, DELETE requests
export function useApiMutation<TData, TVariables = any>(
  url: string,
  options: {
    method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    onSuccess?: (data: TData) => void;
    onError?: (error: string) => void;
    token?: string | null | undefined;
  } = {}
): UseApiMutation<TData, TVariables> {
  const { method = 'POST', onSuccess, onError, token } = options;
  const [state, setState] = useState<{
    data: TData | null;
    loading: boolean;
    error: string | null;
  }>({
    data: null,
    loading: false,
    error: null,
  });

  const mutate = useCallback(
    async (variables: TVariables): Promise<TData> => {
      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };

        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(url, {
          method,
          headers,
          body: JSON.stringify(variables),
        });

        const result: ApiResponse<TData> = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'API request failed');
        }

        const data = result.data!;

        setState(prev => ({
          ...prev,
          data,
          loading: false,
          error: null,
        }));

        onSuccess?.(data);
        return data;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setState(prev => ({
          ...prev,
          data: null,
          loading: false,
          error: errorMessage,
        }));

        onError?.(errorMessage);
        throw error;
      }
    },
    [url, method, onSuccess, onError, token]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    mutate,
    reset,
    ...state,
  };
}

// Specific API hooks
export function useUsers(token?: string | null | undefined) {
  return useApi(API_ROUTES.USERS.BASE, { token: token || undefined });
}

export function useUser(id: string, token?: string | null | undefined) {
  return useApi(API_ROUTES.USERS.BY_ID(id), { 
    enabled: !!id,
    deps: [id],
    token: token || undefined 
  });
}

export function usePosts(params?: { published?: boolean; authorId?: string }) {
  const searchParams = new URLSearchParams();
  if (params?.published !== undefined) searchParams.set('published', String(params.published));
  if (params?.authorId) searchParams.set('authorId', params.authorId);
  
  const url = `${API_ROUTES.POSTS.BASE}?${searchParams.toString()}`;
  return useApi(url);
}

export function usePost(id: string) {
  return useApi(API_ROUTES.POSTS.BY_ID(id), { 
    enabled: !!id,
    deps: [id] 
  });
}

export function usePostBySlug(slug: string) {
  return useApi(API_ROUTES.POSTS.BY_SLUG(slug), { 
    enabled: !!slug,
    deps: [slug] 
  });
}

export function useComments(postId?: string) {
  const searchParams = new URLSearchParams();
  if (postId) searchParams.set('postId', postId);
  
  const url = `${API_ROUTES.COMMENTS.BASE}?${searchParams.toString()}`;
  return useApi(url, { deps: [postId] });
}

// Mutation hooks
export function useCreateUser(token?: string | null | undefined) {
  return useApiMutation(API_ROUTES.USERS.BASE, { token: token || undefined });
}

export function useUpdateUser(id: string, token?: string | null | undefined) {
  return useApiMutation(API_ROUTES.USERS.BY_ID(id), { 
    method: 'PATCH', 
    token: token || undefined 
  });
}

export function useDeleteUser(id: string, token?: string | null | undefined) {
  return useApiMutation(API_ROUTES.USERS.BY_ID(id), { 
    method: 'DELETE', 
    token: token || undefined 
  });
}

export function useCreatePost(token?: string | null | undefined) {
  return useApiMutation(API_ROUTES.POSTS.BASE, { token: token || undefined });
}

export function useUpdatePost(id: string, token?: string | null | undefined) {
  return useApiMutation(API_ROUTES.POSTS.BY_ID(id), { 
    method: 'PATCH', 
    token: token || undefined 
  });
}

export function useDeletePost(id: string, token?: string | null | undefined) {
  return useApiMutation(API_ROUTES.POSTS.BY_ID(id), { 
    method: 'DELETE', 
    token: token || undefined 
  });
}

export function useCreateComment(token?: string | null | undefined) {
  return useApiMutation(API_ROUTES.COMMENTS.BASE, { token: token || undefined });
}

export function useUpdateComment(id: string, token?: string | null | undefined) {
  return useApiMutation(API_ROUTES.COMMENTS.BY_ID(id), { 
    method: 'PATCH', 
    token: token || undefined 
  });
}

export function useDeleteComment(id: string, token?: string | null | undefined) {
  return useApiMutation(API_ROUTES.COMMENTS.BY_ID(id), { 
    method: 'DELETE', 
    token: token || undefined 
  });
}
