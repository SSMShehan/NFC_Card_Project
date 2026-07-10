// ============================================================
//  NEXUS Mobile — Stealth Mode Toggle Component
//  Premium animated switch with haptic feedback that hits the
//  backend privacy endpoint when toggled.
// ============================================================

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Radius, Typography, Shadow } from '../constants/theme';
import { useTogglePrivacy } from '../hooks/useProfile';

interface StealthToggleProps {
  isActive: boolean;  // true = STEALTH, false = ACTIVE
  disabled?: boolean;
}

export function StealthToggle({ isActive, disabled = false }: StealthToggleProps) {
  const { mutate: togglePrivacy, isPending } = useTogglePrivacy();

  // Animated value: 0 = OFF (ACTIVE), 1 = ON (STEALTH)
  const toggleAnim = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(toggleAnim, {
      toValue: isActive ? 1 : 0,
      tension: 120,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [isActive, toggleAnim]);

  // Interpolated thumb position
  const thumbTranslate = toggleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 26], // px offset within the track
  });

  // Track color interpolation
  const trackBg = toggleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255,255,255,0.12)', Colors.primary],
  });

  const handlePress = async () => {
    if (isPending || disabled) return;

    // Haptic feedback — heavier for activating stealth, lighter for deactivating
    if (!isActive) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } else {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    togglePrivacy();
  };

  return (
    <TouchableOpacity
      id="stealth-mode-toggle"
      onPress={handlePress}
      activeOpacity={0.85}
      disabled={isPending || disabled}
      accessible
      accessibilityRole="switch"
      accessibilityState={{ checked: isActive, disabled: isPending || disabled }}
      accessibilityLabel="Stealth Mode toggle"
      accessibilityHint={isActive ? 'Tap to make your profile visible' : 'Tap to hide your profile'}
    >
      <View style={[styles.container, Shadow.md]}>
        {/* Left side: Icon + Labels */}
        <View style={styles.labelContainer}>
          {/* Stealth eye icon */}
          <View style={[
            styles.iconCircle,
            { backgroundColor: isActive ? 'rgba(100,81,250,0.2)' : 'rgba(255,255,255,0.08)' },
          ]}>
            <Text style={styles.icon}>{isActive ? '🥷' : '👁️'}</Text>
          </View>

          <View>
            <Text style={styles.title}>Stealth Mode</Text>
            <Text style={styles.subtitle}>
              {isActive ? 'Your profile is hidden' : 'Your profile is public'}
            </Text>
          </View>
        </View>

        {/* Right side: Toggle Track */}
        {isPending ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : (
          <Animated.View style={[styles.track, { backgroundColor: trackBg }]}>
            <Animated.View
              style={[
                styles.thumb,
                { transform: [{ translateX: thumbTranslate }] },
              ]}
            />
          </Animated.View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgLayer2,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 18,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    marginBottom: 2,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: Typography.xs,
    fontWeight: Typography.regular,
  },
  track: {
    width: 52,
    height: 28,
    borderRadius: Radius.full,
    justifyContent: 'center',
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: Radius.full,
    backgroundColor: '#fff',
    ...Shadow.sm,
  },
});
