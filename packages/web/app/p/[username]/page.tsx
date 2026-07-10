// ============================================================
//  NEXUS — Public Profile Page (Server Component)
//  Route: /p/[username]
//  Fetches profile data server-side for optimal SEO and performance.
//  Passes data to the ProfileCard client component for interactivity.
// ============================================================

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProfileCard } from './ProfileCard';
import { StealthPlaceholder } from './StealthPlaceholder';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

interface PageProps {
  params: { username: string };
}

/** Shape returned by GET /api/v1/profile/:username */
interface ProfileApiResponse {
  success: boolean;
  data?: {
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
    tapCount: number;
    links: Array<{
      id: string;
      platform: string;
      url: string;
      label: string;
      sortOrder: number;
      isActive: boolean;
    }>;
  };
  error?: string;
  message?: string;
}

/**
 * Fetches the public profile from the backend API.
 * Uses Next.js cache with a 60-second revalidation window.
 * Falls back to null on network errors (handled gracefully in render).
 */
async function fetchProfile(username: string): Promise<ProfileApiResponse['data'] | null | 'stealth' | 'suspended'> {
  try {
    const res = await fetch(`${API_URL}/api/v1/profile/${encodeURIComponent(username)}`, {
      next: {
        revalidate: 60, // Revalidate ISR every 60 seconds
        tags: [`profile-${username}`],
      },
    });

    if (res.status === 404) return null;
    if (res.status === 403) return 'suspended';

    const json: ProfileApiResponse = await res.json();

    if (!json.success) return null;

    // Stealth response: data.status = "STEALTH"
    if (json.data?.status === 'STEALTH') return 'stealth';
    if (json.data?.status === 'SUSPENDED') return 'suspended';

    return json.data ?? null;
  } catch {
    // Network error or backend down — return null for graceful failure
    return null;
  }
}

// ── Dynamic Metadata ──────────────────────────────────────────

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const profile = await fetchProfile(params.username);

  if (!profile || profile === 'stealth' || profile === 'suspended') {
    return {
      title: 'Profile Not Available | TAGIT',
      description: 'This TAGIT digital business card profile is not currently available.',
    };
  }

  const title = `${profile.displayName} — TAGIT Digital Card`;
  const description = profile.bio
    ? `${profile.bio.substring(0, 150)}${profile.bio.length > 150 ? '...' : ''}`
    : `Connect with ${profile.displayName}${profile.company ? ` from ${profile.company}` : ''} via TAGIT NFC Business Card.`;

  return {
    title,
    description,
    openGraph: {
      type: 'profile',
      title,
      description,
      images: profile.profilePicture
        ? [{ url: profile.profilePicture, width: 400, height: 400, alt: profile.displayName }]
        : [],
    },
    twitter: {
      card: 'summary',
      title,
      description,
      images: profile.profilePicture ? [profile.profilePicture] : [],
    },
    // Allow profile pages to be indexed for personal branding SEO
    robots: 'index, follow',
  };
}

// ── Page Component ────────────────────────────────────────────

export default async function ProfilePage({ params }: PageProps) {
  const { username } = params;
  const profile = await fetchProfile(username);

  // Hard 404
  if (profile === null) {
    notFound();
  }

  // STEALTH — show placeholder, don't 404 (privacy is intentional)
  if (profile === 'stealth') {
    return <StealthPlaceholder isSuspended={false} />;
  }

  // SUSPENDED — show placeholder with suspended messaging
  if (profile === 'suspended') {
    return <StealthPlaceholder isSuspended={true} />;
  }

  // ACTIVE — render full glassmorphism card
  return (
    <ProfileCard
      profile={profile as any}
      apiUrl={API_URL}
    />
  );
}
