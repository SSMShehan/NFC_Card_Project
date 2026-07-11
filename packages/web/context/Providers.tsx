"use client";

import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './ThemeContext';

export function Providers({ children }: { children: React.ReactNode }) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "demo-google-client-id.apps.googleusercontent.com";

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <ThemeProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}
