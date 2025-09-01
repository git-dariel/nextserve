import { useState, useEffect, useCallback, useRef } from 'react';
import { AuthUser, LoginCredentials, RegisterData } from '@/types/auth';
import { API_ROUTES, AUTH } from '@/lib/constants';
import { useLocalStorage } from './use-local-storage';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [token, setToken, removeToken] = useLocalStorage<string | null>(
    AUTH.TOKEN_KEY,
    null
  );
  const [user, setUser, removeUser] = useLocalStorage<AuthUser | null>(
    AUTH.USER_KEY,
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const hasValidated = useRef<string | null>(null);
  const isValidating = useRef(false);

  const isAuthenticated = !!token && !!user;

  // Check if current user is still valid
  const validateToken = useCallback(async () => {
    if (!token || isValidating.current) return;

    isValidating.current = true;
    setIsLoading(true);

    try {
      const response = await fetch(API_ROUTES.AUTH.ME, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        removeToken();
        removeUser();
        hasValidated.current = null;
        return;
      }

      const result = await response.json();
      if (result.success && result.data) {
        setUser(result.data);
        hasValidated.current = token;
      } else {
        removeToken();
        removeUser();
        hasValidated.current = null;
      }
    } catch (error) {
      console.error('Token validation failed:', error);
      removeToken();
      removeUser();
      hasValidated.current = null;
    } finally {
      setIsLoading(false);
      isValidating.current = false;
    }
  }, [token, removeToken, removeUser, setUser]);

  // Initialize auth state
  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      hasValidated.current = null;
      return;
    }

    // If we have a token but no user data, validate the token
    if (token && !user && hasValidated.current !== token) {
      validateToken();
    } else if (token && user) {
      // If we have both token and user, we're good to go
      setIsLoading(false);
      hasValidated.current = token;
    }
  }, []); // Run only once on mount

  // Handle token changes
  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      hasValidated.current = null;
      return;
    }

    // Only validate if this is a new token
    if (hasValidated.current !== token) {
      validateToken();
    }
  }, [token, validateToken]);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setIsLoading(true);
      try {
        const response = await fetch(API_ROUTES.AUTH.LOGIN, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Login failed');
        }

        if (result.success && result.data) {
          setToken(result.data.token);
          setUser(result.data.user);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [setToken, setUser]
  );

  const register = useCallback(
    async (data: RegisterData) => {
      setIsLoading(true);
      try {
        const response = await fetch(API_ROUTES.AUTH.REGISTER, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Registration failed');
        }

        if (result.success && result.data) {
          setToken(result.data.token);
          setUser(result.data.user);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [setToken, setUser]
  );

  const logout = useCallback(() => {
    removeToken();
    removeUser();
  }, [removeToken, removeUser]);

  const updateUser = useCallback(
    (updatedUser: Partial<AuthUser>) => {
      if (user) {
        setUser({ ...user, ...updatedUser });
      }
    },
    [user, setUser]
  );

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    validateToken,
  };
}
