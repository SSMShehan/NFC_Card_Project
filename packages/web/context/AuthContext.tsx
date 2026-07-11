"use client";

// ============================================================
//  TAGIT Web — Global Authentication Context
//  Provides user state, session checking, and login/register actions.
// ============================================================

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { apiClient, persistTokens, clearTokens, getAccessToken, ApiResponse, googleLoginApi, appleLoginApi } from '../services/api';

export interface Profile {
  id: string;
  username: string;
  displayName: string;
  bio?: string | null;
  phone?: string | null;
  email?: string | null;
  company?: string | null;
  jobTitle?: string | null;
  website?: string | null;
  profilePicture?: string | null;
  companyLogo?: string | null;
  status: 'ACTIVE' | 'SUSPENDED' | 'STEALTH';
  tapCount?: number;
}

export interface User {
  id: string;
  email: string;
  subscriptionTier: 'FREE' | 'PREMIUM' | 'CORPORATE';
  profile?: Profile | null;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterPayload {
  email: string;
  password?: string;
  username: string;
  displayName: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  register: (payload: RegisterPayload) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (idToken: string) => Promise<{ success: boolean; error?: string }>;
  loginWithApple: (identityToken: string, user?: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /** Check existing session on initial application mount */
  const checkSession = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await apiClient.get<ApiResponse<User>>('/auth/me');
      if (res.data && res.data.success && res.data.data) {
        setUser(res.data.data);
      } else {
        clearTokens();
        setUser(null);
      }
    } catch {
      clearTokens();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  /** Login handler */
  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
      if (res.data.success && res.data.data) {
        const { accessToken, refreshToken, user: userData } = res.data.data;
        persistTokens(accessToken, refreshToken);
        setUser(userData);
        return { success: true };
      }
      return { success: false, error: res.data.error || res.data.message || 'Login failed.' };
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        'Failed to connect to authentication server.';
      return { success: false, error: errorMessage };
    }
  };

  /** Registration handler */
  const register = async (payload: RegisterPayload): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', payload);
      if (res.data.success && res.data.data) {
        const { accessToken, refreshToken, user: userData } = res.data.data;
        persistTokens(accessToken, refreshToken);
        setUser(userData);
        return { success: true };
      }
      return { success: false, error: res.data.error || res.data.message || 'Registration failed.' };
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        'Failed to create account.';
      return { success: false, error: errorMessage };
    }
  };

  /** Google OAuth login handler */
  const loginWithGoogle = async (idToken: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await googleLoginApi(idToken);
      if (res.success && res.data) {
        const { accessToken, refreshToken, user: userData } = res.data;
        persistTokens(accessToken, refreshToken);
        setUser(userData);
        return { success: true };
      }
      return { success: false, error: res.error || res.message || 'Google authentication failed.' };
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        'Failed to connect to authentication server for Google Sign-In.';
      return { success: false, error: errorMessage };
    }
  };

  /** Apple OAuth login handler */
  const loginWithApple = async (identityToken: string, rawUser?: any): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await appleLoginApi(identityToken, rawUser);
      if (res.success && res.data) {
        const { accessToken, refreshToken, user: userData } = res.data;
        persistTokens(accessToken, refreshToken);
        setUser(userData);
        return { success: true };
      }
      return { success: false, error: res.error || res.message || 'Apple authentication failed.' };
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        'Failed to connect to authentication server for Apple Sign-In.';
      return { success: false, error: errorMessage };
    }
  };

  /** Logout handler */
  const logout = () => {
    clearTokens();
    setUser(null);
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  /** Refresh profile data on demand */
  const refreshProfile = async () => {
    const token = getAccessToken();
    if (!token) return;
    try {
      const res = await apiClient.get<ApiResponse<User>>('/auth/me');
      if (res.data.success && res.data.data) {
        setUser(res.data.data);
      }
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        loginWithGoogle,
        loginWithApple,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
