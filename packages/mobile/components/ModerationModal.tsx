// ============================================================
//  NEXUS Mobile — AI Moderation Warning Modal
//  Displayed when the user attempts to change their display name,
//  profile picture, or company logo. Warns that the change will
//  undergo AI safety review before going live.
// ============================================================

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Radius, Typography, Shadow } from '../constants/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ModerationModalProps {
  visible: boolean;
  fieldName: string;        // e.g. "profile photo", "display name"
  onConfirm: () => void;    // Proceed with the moderated update
  onCancel:  () => void;    // Dismiss without submitting
  isSubmitting?: boolean;
}

export function ModerationModal({
  visible,
  fieldName,
  onConfirm,
  onCancel,
  isSubmitting = false,
}: ModerationModalProps) {
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 100,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, backdropOpacity]);

  const handleConfirm = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onConfirm();
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onCancel} />
      </Animated.View>

      {/* Sheet */}
      <Animated.View
        style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}
      >
        {/* Drag handle */}
        <View style={styles.handle} />

        {/* Warning Icon */}
        <View style={styles.iconWrapper}>
          <Text style={styles.warningEmoji}>🤖</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>AI Safety Review Required</Text>

        {/* Body */}
        <Text style={styles.body}>
          You&apos;re updating your{' '}
          <Text style={styles.fieldHighlight}>{fieldName}</Text>.
          {'\n\n'}
          This type of change undergoes an automatic AI safety moderation scan before
          going live on your public card. The review typically completes within a few
          moments.
        </Text>

        {/* Info Cards */}
        <View style={styles.infoGrid}>
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>⚡</Text>
            <Text style={styles.infoText}>Instant scan</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>🔒</Text>
            <Text style={styles.infoText}>Privacy safe</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>✅</Text>
            <Text style={styles.infoText}>Auto-approved</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            id="moderation-modal-confirm-btn"
            onPress={handleConfirm}
            disabled={isSubmitting}
            style={[styles.confirmBtn, isSubmitting && styles.btnDisabled]}
            accessibilityRole="button"
            accessibilityLabel="Confirm and submit for review"
          >
            <Text style={styles.confirmBtnText}>
              {isSubmitting ? 'Submitting...' : '✓  Submit for Review'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            id="moderation-modal-cancel-btn"
            onPress={onCancel}
            disabled={isSubmitting}
            style={styles.cancelBtn}
            accessibilityRole="button"
            accessibilityLabel="Cancel"
          >
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.bgLayer1,
    borderTopLeftRadius: Radius.xxl,
    borderTopRightRadius: Radius.xxl,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 12,
    alignItems: 'center',
    ...Shadow.lg,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: Radius.full,
    backgroundColor: Colors.glassBorder,
    marginBottom: 24,
  },
  iconWrapper: {
    width: 72,
    height: 72,
    borderRadius: Radius.full,
    backgroundColor: Colors.warningBg,
    borderWidth: 1,
    borderColor: Colors.warning + '40',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  warningEmoji: {
    fontSize: 32,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    textAlign: 'center',
    marginBottom: 12,
  },
  body: {
    color: Colors.textSecondary,
    fontSize: Typography.sm,
    lineHeight: Typography.sm * Typography.relaxed,
    textAlign: 'center',
    marginBottom: 20,
  },
  fieldHighlight: {
    color: Colors.accent,
    fontWeight: Typography.semibold,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 28,
    width: '100%',
  },
  infoCard: {
    flex: 1,
    backgroundColor: Colors.bgLayer2,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 6,
  },
  infoIcon: {
    fontSize: 18,
  },
  infoText: {
    color: Colors.textMuted,
    fontSize: Typography.xs,
    fontWeight: Typography.medium,
    textAlign: 'center',
  },
  actions: {
    width: '100%',
    gap: 10,
  },
  confirmBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    paddingVertical: 16,
    alignItems: 'center',
    ...Shadow.glow,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  confirmBtnText: {
    color: '#fff',
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
  },
  cancelBtn: {
    backgroundColor: Colors.bgLayer2,
    borderRadius: Radius.xl,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  cancelBtnText: {
    color: Colors.textSecondary,
    fontSize: Typography.base,
    fontWeight: Typography.medium,
  },
});
