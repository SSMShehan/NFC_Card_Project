// ============================================================
//  NEXUS Mobile — Link Row Component
//  Individual row in the Link Management Matrix FlatList.
//  Instant toggle with optimistic UI — no loading state visible.
// ============================================================

import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Alert,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Radius, Typography, Shadow } from '../constants/theme';
import { ProfileLink } from '../hooks/useProfile';
import { useToggleLink, useDeleteLink } from '../hooks/useLinks';

/** Returns an emoji icon for a platform */
function getPlatformEmoji(platform: string): string {
  const map: Record<string, string> = {
    LINKEDIN: '💼', GITHUB: '💻', INSTAGRAM: '📸', WHATSAPP: '💬',
    TWITTER: '🐦', FACEBOOK: '📘', YOUTUBE: '🎥', TIKTOK: '🎵',
    TELEGRAM: '✈️', PHONE: '📞', EMAIL: '📧', WEBSITE: '🌐', CUSTOM: '🔗',
  };
  return map[platform.toUpperCase()] ?? '🔗';
}

/** Returns the platform brand color from theme */
function getPlatformColor(platform: string): string {
  const map = Colors.platforms as Record<string, string>;
  return map[platform.toLowerCase()] ?? Colors.platforms.custom;
}

interface LinkRowProps {
  link: ProfileLink;
}

export function LinkRow({ link }: LinkRowProps) {
  const { mutate: toggleLink } = useToggleLink();
  const { mutate: deleteLink, isPending: isDeleting } = useDeleteLink();

  // Scale animation for press feedback
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const animatePress = (callback: () => void) => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.96, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start(callback);
  };

  const handleToggle = () => {
    animatePress(() => {
      Haptics.selectionAsync();
      toggleLink(link.id);
    });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Link',
      `Are you sure you want to delete "${link.label}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            deleteLink(link.id);
          },
        },
      ],
    );
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <View style={[styles.row, isDeleting && styles.rowDeleting]}>
        {/* Left: Platform Icon */}
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: getPlatformColor(link.platform) },
          ]}
        >
          <Text style={styles.icon} accessibilityLabel={link.platform}>
            {getPlatformEmoji(link.platform)}
          </Text>
        </View>

        {/* Center: Label + URL */}
        <View style={styles.labelContainer}>
          <Text style={styles.label} numberOfLines={1}>
            {link.label}
          </Text>
          <Text style={styles.url} numberOfLines={1}>
            {link.url}
          </Text>
        </View>

        {/* Right: Toggle + Delete */}
        <View style={styles.actions}>
          {/* Delete button */}
          <TouchableOpacity
            onPress={handleDelete}
            style={styles.deleteBtn}
            accessibilityLabel={`Delete ${link.label}`}
            accessibilityRole="button"
          >
            <Text style={styles.deleteBtnText}>✕</Text>
          </TouchableOpacity>

          {/* Active toggle pill */}
          <TouchableOpacity
            id={`toggle-link-${link.id}`}
            onPress={handleToggle}
            style={[
              styles.togglePill,
              link.isActive ? styles.togglePillActive : styles.togglePillInactive,
            ]}
            accessibilityRole="switch"
            accessibilityState={{ checked: link.isActive }}
            accessibilityLabel={`${link.isActive ? 'Disable' : 'Enable'} ${link.label}`}
          >
            <Text style={styles.togglePillText}>
              {link.isActive ? 'ON' : 'OFF'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgLayer2,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 12,
    ...Shadow.sm,
  },
  rowDeleting: {
    opacity: 0.5,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  icon: {
    fontSize: 20,
  },
  labelContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  label: {
    color: Colors.textPrimary,
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    marginBottom: 2,
  },
  url: {
    color: Colors.textMuted,
    fontSize: Typography.xs,
    fontWeight: Typography.regular,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  deleteBtn: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    backgroundColor: Colors.dangerBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnText: {
    color: Colors.danger,
    fontSize: 11,
    fontWeight: Typography.bold,
  },
  togglePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    minWidth: 44,
    alignItems: 'center',
  },
  togglePillActive: {
    backgroundColor: Colors.successBg,
    borderWidth: 1,
    borderColor: Colors.success,
  },
  togglePillInactive: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  togglePillText: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    letterSpacing: 0.5,
  },
});
