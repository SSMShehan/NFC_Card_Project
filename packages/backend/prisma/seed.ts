// ============================================================
//  NEXUS — Prisma Seed Script
//  Run: npm run db:seed (from packages/backend)
//  Creates a demo user + profile + links for local development.
// ============================================================

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('🌱 Seeding NEXUS database...');

  // ── Cleanup previous seed data ──────────────────────────────
  await prisma.verificationRequest.deleteMany();
  await prisma.link.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  // ── Create demo user ────────────────────────────────────────
  const passwordHash = await bcrypt.hash('nexus-demo-2024', 12);

  const user = await prisma.user.create({
    data: {
      email: 'demo@nexus.cards',
      passwordHash,
      subscriptionTier: "PREMIUM",
      profile: {
        create: {
          username: 'alexmorgan',
          displayName: 'Alex Morgan',
          bio: 'Product Designer & Creative Director. Crafting digital experiences that leave a mark.',
          phone: '+1 (555) 012-3456',
          email: 'alex@nexus.cards',
          company: 'NEXUS Creative Studio',
          jobTitle: 'Creative Director',
          website: 'https://alexmorgan.design',
          profilePicture: null, // Will be set after image upload in production
          companyLogo: null,
          tapCount: 142,
          links: {
            createMany: {
              data: [
                {
                  platform: "LINKEDIN",
                  url: 'https://linkedin.com/in/alexmorgan',
                  label: 'LinkedIn',
                  sortOrder: 0,
                  isActive: true,
                },
                {
                  platform: "GITHUB",
                  url: 'https://github.com/alexmorgan',
                  label: 'GitHub',
                  sortOrder: 1,
                  isActive: true,
                },
                {
                  platform: "INSTAGRAM",
                  url: 'https://instagram.com/alexmorgan.design',
                  label: 'Instagram',
                  sortOrder: 2,
                  isActive: true,
                },
                {
                  platform: "WHATSAPP",
                  url: 'https://wa.me/15550123456',
                  label: 'WhatsApp',
                  sortOrder: 3,
                  isActive: false, // Demo of inactive link
                },
                {
                  platform: "WEBSITE",
                  url: 'https://alexmorgan.design/portfolio',
                  label: 'Portfolio',
                  sortOrder: 4,
                  isActive: true,
                },
              ],
            },
          },
        },
      },
    },
    include: {
      profile: {
        include: { links: true },
      },
    },
  });

  console.log('✅ Demo user created:', user.email);
  console.log('✅ Profile username:', user.profile?.username);
  console.log('✅ Links created:', user.profile?.links.length);
  console.log('\n🎉 Seed complete! Visit: http://localhost:3000/p/alexmorgan');
}

main()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
