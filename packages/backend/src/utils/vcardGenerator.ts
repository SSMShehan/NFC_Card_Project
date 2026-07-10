// ============================================================
//  NEXUS — vCard (VCF) Generator
//  Converts a Profile record into a RFC 6350 compliant VCF buffer
//  that mobile browsers can save directly to their contacts app.
// ============================================================

import { Profile, Link, LinkPlatform } from '@prisma/client';

export type ProfileWithLinks = Profile & { links: Link[] };

/**
 * Escapes special characters required by the VCF specification:
 * backslash, comma, semicolon, and newline.
 */
function vcfEscape(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
    .replace(/\n/g, '\\n');
}

/**
 * Generates a VCF 3.0 formatted string from a NEXUS profile.
 * Includes name, org, title, phone, email, website, photo URL,
 * and all active social/portfolio links as X-SOCIALPROFILE entries.
 *
 * @param profile - Profile with eager-loaded links
 * @returns UTF-8 encoded VCF string
 */
export function generateVCard(profile: ProfileWithLinks): string {
  const lines: string[] = [];

  lines.push('BEGIN:VCARD');
  lines.push('VERSION:3.0');
  lines.push(`FN:${vcfEscape(profile.displayName)}`);

  // Structured name — split displayName into parts
  const nameParts = profile.displayName.trim().split(' ');
  const lastName = nameParts.length > 1 ? (nameParts.pop() ?? '') : '';
  const firstName = nameParts.join(' ');
  lines.push(`N:${vcfEscape(lastName)};${vcfEscape(firstName)};;;`);

  if (profile.company) {
    lines.push(`ORG:${vcfEscape(profile.company)}`);
  }

  if (profile.jobTitle) {
    lines.push(`TITLE:${vcfEscape(profile.jobTitle)}`);
  }

  if (profile.phone) {
    lines.push(`TEL;TYPE=CELL:${vcfEscape(profile.phone)}`);
  }

  if (profile.email) {
    lines.push(`EMAIL;TYPE=WORK:${vcfEscape(profile.email)}`);
  }

  if (profile.website) {
    lines.push(`URL:${vcfEscape(profile.website)}`);
  }

  if (profile.profilePicture) {
    // Reference the hosted image URL — mobile vCard parsers will fetch it
    lines.push(`PHOTO;VALUE=URI:${profile.profilePicture}`);
  }

  if (profile.bio) {
    lines.push(`NOTE:${vcfEscape(profile.bio)}`);
  }

  // ── Active Social Links ───────────────────────────────────
  const platformTypeMap: Partial<Record<LinkPlatform, string>> = {
    [LinkPlatform.LINKEDIN]: 'linkedin',
    [LinkPlatform.GITHUB]: 'github',
    [LinkPlatform.TWITTER]: 'twitter',
    [LinkPlatform.INSTAGRAM]: 'instagram',
    [LinkPlatform.FACEBOOK]: 'facebook',
    [LinkPlatform.YOUTUBE]: 'youtube',
    [LinkPlatform.TIKTOK]: 'tiktok',
    [LinkPlatform.WHATSAPP]: 'whatsapp',
    [LinkPlatform.TELEGRAM]: 'telegram',
  };

  const activeLinks = profile.links.filter((link) => link.isActive);

  for (const link of activeLinks) {
    const type = platformTypeMap[link.platform];
    if (type) {
      lines.push(`X-SOCIALPROFILE;TYPE=${type}:${vcfEscape(link.url)}`);
    } else if (link.platform === LinkPlatform.WEBSITE || link.platform === LinkPlatform.CUSTOM) {
      // Additional website or custom link
      lines.push(`URL;TYPE=${vcfEscape(link.label)}:${vcfEscape(link.url)}`);
    }
  }

  // Metadata
  lines.push(`X-NEXUS-USERNAME:${profile.username}`);
  lines.push(`REV:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`);
  lines.push('END:VCARD');

  return lines.join('\r\n');
}

/**
 * Returns the vCard content as a Buffer for HTTP streaming.
 */
export function generateVCardBuffer(profile: ProfileWithLinks): Buffer {
  return Buffer.from(generateVCard(profile), 'utf-8');
}
