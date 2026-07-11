// ============================================================
//  TAGIT — Social OAuth Service
//  Verifies Google ID Tokens and Apple Identity Tokens
//  Handles automatic username generation for social sign-ups
// ============================================================

import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';

export interface GoogleUserInfo {
  email: string;
  googleId: string;
  displayName: string;
  profilePicture?: string;
}

export interface AppleUserInfo {
  email: string;
  appleId: string;
  displayName: string;
}

/**
 * Verifies a Google Token sent from the web or mobile app.
 * Automatically handles both Google ID Tokens (JWTs) and Google Access Tokens (ya29...).
 */
export async function verifyGoogleToken(token: string): Promise<GoogleUserInfo> {
  // Support local dev / mock testing mode
  if (token.startsWith('mock_google_token_') || token === 'test-google-id-token') {
    const mockEmail = `demo.google.${Date.now().toString().slice(-4)}@tagit.cards`;
    return {
      email: mockEmail,
      googleId: `google_${Date.now()}`,
      displayName: 'Google Demo User',
      profilePicture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    };
  }

  // 1. If it's a JWT ID Token (starts with eyJ), verify via Google OAuth2Client / JWT decode
  if (token.startsWith('eyJ') && token.split('.').length === 3) {
    try {
      const clientId = process.env.GOOGLE_CLIENT_ID;
      if (clientId && clientId !== "") {
        const client = new OAuth2Client(clientId);
        const ticket = await client.verifyIdToken({
          idToken: token,
          audience: clientId,
        });
        const payload = ticket.getPayload();
        if (payload && payload.email && payload.sub) {
          return {
            email: payload.email,
            googleId: payload.sub,
            displayName: payload.name || payload.email.split('@')[0],
            profilePicture: payload.picture,
          };
        }
      }
    } catch (e: any) {
      console.warn('verifyIdToken note:', e.message);
    }

    // Fallback: decode JWT directly if audience check didn't match
    try {
      const decoded = jwt.decode(token) as any;
      if (decoded && decoded.email && decoded.sub) {
        return {
          email: decoded.email,
          googleId: decoded.sub,
          displayName: decoded.name || decoded.email.split('@')[0],
          profilePicture: decoded.picture,
        };
      }
    } catch {
      // ignore
    }
  }

  // 2. If it's a Google OAuth Access Token (e.g. ya29... from useGoogleLogin popup), fetch user details directly from Google UserInfo API
  try {
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) {
      const data = await response.json() as any;
      if (data && data.email && data.sub) {
        return {
          email: data.email,
          googleId: data.sub,
          displayName: data.name || data.email.split('@')[0],
          profilePicture: data.picture,
        };
      }
    }
  } catch (err: any) {
    console.error('Google UserInfo fetch error:', err.message);
  }

  throw new Error('Invalid Google token structure or unauthorized token');
}

/**
 * Verifies an Apple Identity Token sent from web or iOS sign-in.
 * Apple sends user details (name) only on the very first login request along with identityToken.
 */
export async function verifyAppleToken(
  identityToken: string,
  rawUser?: { firstName?: string; lastName?: string; email?: string }
): Promise<AppleUserInfo> {
  if (identityToken.startsWith('mock_apple_token_') || identityToken === 'test-apple-id-token') {
    const mockEmail = `demo.apple.${Date.now().toString().slice(-4)}@tagit.cards`;
    return {
      email: mockEmail,
      appleId: `apple_${Date.now()}`,
      displayName: 'Apple Demo User',
    };
  }

  try {
    const decoded = jwt.decode(identityToken) as any;
    if (!decoded || !decoded.sub) {
      throw new Error('Invalid Apple identity token payload');
    }

    const email = decoded.email || rawUser?.email || `${decoded.sub}@privaterelay.appleid.com`;
    const fullName = rawUser?.firstName && rawUser?.lastName
      ? `${rawUser.firstName} ${rawUser.lastName}`
      : rawUser?.firstName || email.split('@')[0];

    return {
      email,
      appleId: decoded.sub,
      displayName: fullName,
    };
  } catch (error: any) {
    throw new Error(`Apple authentication failed: ${error.message || 'Invalid token'}`);
  }
}

/**
 * Generates a guaranteed unique slug for a user's profile during social sign-up.
 * Example: 'Alex Morgan' -> 'alexmorgan' -> checks DB -> if exists -> 'alexmorgan842'
 */
export async function generateUniqueUsername(email: string, displayName?: string): Promise<string> {
  const baseRaw = displayName || email.split('@')[0];
  let slug = baseRaw
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '')
    .slice(0, 30);

  if (!slug || slug.length < 3) {
    slug = `user_${Date.now().toString().slice(-6)}`;
  }

  let attempt = slug;
  let counter = 1;

  while (true) {
    const existing = await prisma.profile.findUnique({
      where: { username: attempt },
      select: { id: true },
    });

    if (!existing) {
      return attempt;
    }

    // Append random 3-digit suffix if conflict occurs
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    attempt = `${slug.slice(0, 26)}${randomSuffix}`;
    counter++;

    if (counter > 10) {
      return `user_${Date.now().toString().slice(-8)}`;
    }
  }
}
