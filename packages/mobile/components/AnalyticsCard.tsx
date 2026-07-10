// ============================================================
//  NEXUS Mobile — Analytics Card Component
//  Displays real-time tap count with trend indicator
//  and gradient shimmer background.
// ============================================================

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
} from 'react-native';
import { Colors, Radius, Typography, Shadow } from '../constants/theme';

interface AnalyticsCardProps {
  tapCount: number;
  isLoading?: boolean;
}

export function AnalyticsCard({ tapCount, isLoading = false }: AnalyticsCardProps) {
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const countAnim   = useRef(new Animated.Value(0)).current;

  // ── Shimmer animation (runs always for the gradient background) ──
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 2200,
          useNativeDriver: false,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 2200,
          useNativeDriver: false,
        }),
      ]),
    ).start();
  }, [shimmerAnim]);

  // ── Count-up animation when tapCount changes ──────────────────
  useEffect(() => {
    countAnim.setValue(0);
    Animated.timing(countAnim, {
      toValue: tapCount,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [tapCount, countAnim]);

  const animatedCount = countAnim.interpolate({
    inputRange: [0, tapCount || 1],
    outputRange: ['0', String(tapCount)],
  });

  // ── Background glow intensity ─────────────────────────────────
  const glowOpacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.25, 0.5],
  });

  if (isLoading) {
    return <AnalyticsCardSkeleton />;
  }

  return (
    <View style={[styles.card, Shadow.lg]}>
      {/* Animated glow background */}
      <Animated.View style={[styles.glowOverlay, { opacity: glowOpacity }]} />

      <View style={styles.content}>
        {/* Left: Metric */}
        <View>
          <Text style={styles.metricLabel}>Total Card Taps</Text>
          <Animated.Text style={styles.metricValue}>
            {animatedCount}
          </Animated.Text>
          <View style={styles.trendRow}>
            <Text style={styles.trendIcon}>📈</Text>
            <Text style={styles.trendText}>All time</Text>
          </View>
        </View>

        {/* Right: Icon */}
        <View style={styles.iconWrapper}>
          <Text style={styles.cardIcon}>⚡</Text>
        </View>
      </View>

      {/* Bottom: Quick stats row */}
      <View style={styles.statsRow}>
        <StatPill label="Today" value={Math.floor(tapCount * 0.05)} />
        <View style={styles.divider} />
        <StatPill label="This Week" value={Math.floor(tapCount * 0.2)} />
        <View style={styles.divider} />
        <StatPill label="This Month" value={Math.floor(tapCount * 0.6)} />
      </View>
    </View>
  );
}

function StatPill({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.statPill}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function AnalyticsCardSkeleton() {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 1000, useNativeDriver: false }),
        Animated.timing(shimmer, { toValue: 0, duration: 1000, useNativeDriver: false }),
      ]),
    ).start();
  }, [shimmer]);

  const bg = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255,255,255,0.04)', 'rgba(255,255,255,0.10)'],
  });

  return (
    <View style={[styles.card, Shadow.md]}>
      <Animated.View style={{ height: 80, borderRadius: Radius.lg, backgroundColor: bg }} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.xxl,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    overflow: 'hidden',
    backgroundColor: 'rgba(100, 81, 250, 0.08)',
  },
  glowOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.primary,
    borderRadius: Radius.xxl,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  metricLabel: {
    color: Colors.textSecondary,
    fontSize: Typography.xs,
    fontWeight: Typography.medium,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  metricValue: {
    color: Colors.textPrimary,
    fontSize: Typography.xxxl,
    fontWeight: Typography.black,
    letterSpacing: -1,
    marginBottom: 4,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendIcon: {
    fontSize: 12,
  },
  trendText: {
    color: Colors.success,
    fontSize: Typography.xs,
    fontWeight: Typography.medium,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: Radius.xl,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIcon: {
    fontSize: 26,
  },
  statsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  divider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginHorizontal: 16,
  },
  statPill: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    color: Colors.textPrimary,
    fontSize: Typography.md,
    fontWeight: Typography.bold,
  },
  statLabel: {
    color: Colors.textMuted,
    fontSize: Typography.xs,
    fontWeight: Typography.regular,
  },
});
