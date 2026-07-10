// ============================================================
//  NEXUS Mobile — Profile Edit Screen
//  Tab 3: Smart form for updating profile information.
//         Instant fields update immediately; moderated fields
//         go through AI review (ModerationModal).
// ============================================================

import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Typography, Radius, Shadow } from '../../constants/theme';
import { ProfileEditForm } from '../../components/ProfileEditForm';
import { useMyProfile } from '../../hooks/useProfile';

export default function ProfileScreen() {
  const { data: profile, isLoading, isError, refetch } = useMyProfile();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* ── Header ──────────────────────────────────────── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Edit Profile</Text>
          <Text style={styles.subtitle}>Manage your public card info</Text>
        </View>

        {/* Subscription tier badge */}
        {profile && (
          <View style={[
            styles.tierBadge,
            { backgroundColor: getTierColor(undefined).bg },
          ]}>
            <Text style={[styles.tierText, { color: getTierColor(undefined).text }]}>
              ✦ PREMIUM
            </Text>
          </View>
        )}
      </View>

      {/* ── Content ─────────────────────────────────────── */}
      {isLoading && (
        <View style={styles.centered}>
          <ActivityIndicator color={Colors.primary} size="large" />
          <Text style={styles.loadingText}>Loading your profile...</Text>
        </View>
      )}

      {isError && (
        <View style={styles.centered}>
          <Text style={styles.errorEmoji}>😕</Text>
          <Text style={styles.errorTitle}>Couldn&apos;t load profile</Text>
          <Text style={styles.errorSubtitle}>
            Check your connection and try again.
          </Text>
          <TouchableOpacity
            onPress={() => refetch()}
            style={styles.retryBtn}
            accessibilityRole="button"
          >
            <Text style={styles.retryBtnText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {!isLoading && !isError && profile && (
        <ProfileEditForm profile={profile} />
      )}
    </SafeAreaView>
  );
}

function getTierColor(_tier: string | undefined) {
  return {
    bg:   'rgba(100, 81, 250, 0.15)',
    text: Colors.primaryLight,
  };
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bgBase,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: Typography.xs,
    marginTop: 2,
  },
  tierBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    ...Shadow.sm,
  },
  tierText: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    letterSpacing: 0.5,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 32,
  },
  loadingText: {
    color: Colors.textMuted,
    fontSize: Typography.sm,
    marginTop: 8,
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  errorTitle: {
    color: Colors.textSecondary,
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    textAlign: 'center',
  },
  errorSubtitle: {
    color: Colors.textMuted,
    fontSize: Typography.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
  retryBtn: {
    marginTop: 8,
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    paddingHorizontal: 28,
    paddingVertical: 12,
    ...Shadow.glow,
  },
  retryBtnText: {
    color: '#fff',
    fontWeight: Typography.semibold,
    fontSize: Typography.base,
  },
});
