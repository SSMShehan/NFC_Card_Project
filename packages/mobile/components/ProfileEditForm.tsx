// ============================================================
//  NEXUS Mobile — Profile Edit Form Component
//  Smart form that handles:
//  - INSTANT fields: bio, phone, email, company, jobTitle, website
//  - MODERATED fields: displayName, profilePicture, companyLogo
//    → Shows ModerationModal before submitting these fields.
// ============================================================

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Toast from 'react-native-toast-message';
import * as Haptics from 'expo-haptics';

import { Colors, Radius, Typography, Shadow, Spacing } from '../constants/theme';
import { ModerationModal } from './ModerationModal';
import { Profile, useInstantUpdate, useModeratedUpdate } from '../hooks/useProfile';

interface ProfileEditFormProps {
  profile: Profile;
}

interface FormState {
  // Instant update fields
  bio:      string;
  phone:    string;
  email:    string;
  company:  string;
  jobTitle: string;
  website:  string;
  // Moderated fields
  displayName: string;
}

interface ModerationPending {
  field: string;
  displayLabel: string;
}

export function ProfileEditForm({ profile }: ProfileEditFormProps) {
  const [form, setForm] = useState<FormState>({
    bio:         profile.bio ?? '',
    phone:       profile.phone ?? '',
    email:       profile.email ?? '',
    company:     profile.company ?? '',
    jobTitle:    profile.jobTitle ?? '',
    website:     profile.website ?? '',
    displayName: profile.displayName,
  });

  const [moderationPending, setModerationPending] = useState<ModerationPending | null>(null);

  const { mutateAsync: instantUpdate, isPending: isInstantLoading } = useInstantUpdate();
  const { mutateAsync: moderatedUpdate, isPending: isModeratedLoading } = useModeratedUpdate();

  const updateField = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  // ── Submit instant fields ─────────────────────────────────
  const handleInstantSave = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await instantUpdate({
        bio:     form.bio || undefined,
        phone:   form.phone || undefined,
        email:   form.email || undefined,
        company: form.company || undefined,
        jobTitle: form.jobTitle || undefined,
        website: form.website || undefined,
      });
      Toast.show({
        type: 'success',
        text1: 'Profile Updated ✅',
        text2: 'Your changes are now live.',
        position: 'bottom',
      });
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: 'Please check your connection and try again.',
        position: 'bottom',
      });
    }
  };

  // ── Trigger display name moderation flow ─────────────────
  const handleDisplayNameChange = () => {
    if (form.displayName === profile.displayName) {
      Alert.alert('No Change', 'The display name is the same as the current one.');
      return;
    }
    setModerationPending({
      field: 'displayName',
      displayLabel: 'display name',
    });
  };

  // ── Confirm moderated submission ──────────────────────────
  const handleModerationConfirm = async () => {
    if (!moderationPending) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const formData = new FormData();
      if (moderationPending.field === 'displayName') {
        formData.append('displayName', form.displayName);
      }

      const result = await moderatedUpdate(formData);

      setModerationPending(null);

      Toast.show({
        type: 'info',
        text1: '🤖 Under Review',
        text2: result.message,
        position: 'bottom',
        visibilityTime: 5000,
      });
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Submission Failed',
        text2: 'Please try again.',
        position: 'bottom',
      });
    }
  };

  const isLoading = isInstantLoading || isModeratedLoading;

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        {/* ── Moderated Section ───────────────────────────── */}
        <SectionHeader
          title="Identity"
          badge="🔍 AI Reviewed"
          badgeColor={Colors.warningBg}
          badgeTextColor={Colors.warning}
        />

        <FieldGroup>
          <FormField
            label="Display Name"
            value={form.displayName}
            onChangeText={(v) => updateField('displayName', v)}
            placeholder="Your public name"
            autoCapitalize="words"
            isModerated
          />

          {/* Save display name triggers moderation flow */}
          {form.displayName !== profile.displayName && (
            <TouchableOpacity
              id="save-display-name-btn"
              onPress={handleDisplayNameChange}
              style={styles.moderatedSaveBtn}
              disabled={isLoading}
            >
              <Text style={styles.moderatedSaveBtnText}>
                📋  Submit for Review
              </Text>
            </TouchableOpacity>
          )}
        </FieldGroup>

        {/* ── Instant Update Section ───────────────────────── */}
        <SectionHeader
          title="Contact Info"
          badge="⚡ Instant"
          badgeColor={Colors.successBg}
          badgeTextColor={Colors.success}
        />

        <FieldGroup>
          <FormField
            label="Phone"
            value={form.phone}
            onChangeText={(v) => updateField('phone', v)}
            placeholder="+1 555 012-3456"
            keyboardType="phone-pad"
          />
          <FormDivider />
          <FormField
            label="Email"
            value={form.email}
            onChangeText={(v) => updateField('email', v)}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <FormDivider />
          <FormField
            label="Website"
            value={form.website}
            onChangeText={(v) => updateField('website', v)}
            placeholder="https://yoursite.com"
            keyboardType="url"
            autoCapitalize="none"
          />
        </FieldGroup>

        <SectionHeader title="About" />

        <FieldGroup>
          <FormField
            label="Company"
            value={form.company}
            onChangeText={(v) => updateField('company', v)}
            placeholder="Your company or studio"
            autoCapitalize="words"
          />
          <FormDivider />
          <FormField
            label="Job Title"
            value={form.jobTitle}
            onChangeText={(v) => updateField('jobTitle', v)}
            placeholder="Your role or title"
            autoCapitalize="words"
          />
          <FormDivider />
          <FormField
            label="Bio"
            value={form.bio}
            onChangeText={(v) => updateField('bio', v)}
            placeholder="A short description about you..."
            multiline
            numberOfLines={3}
            style={{ minHeight: 80 }}
          />
        </FieldGroup>

        {/* ── Save Instant Fields ──────────────────────────── */}
        <TouchableOpacity
          id="save-instant-btn"
          onPress={handleInstantSave}
          disabled={isLoading}
          style={[styles.saveBtn, isLoading && styles.saveBtnDisabled]}
          accessibilityRole="button"
          accessibilityLabel="Save profile changes"
        >
          {isInstantLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.saveBtnText}>Save Changes</Text>
          )}
        </TouchableOpacity>

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>

      {/* AI Moderation Modal */}
      <ModerationModal
        visible={!!moderationPending}
        fieldName={moderationPending?.displayLabel ?? ''}
        onConfirm={handleModerationConfirm}
        onCancel={() => setModerationPending(null)}
        isSubmitting={isModeratedLoading}
      />
    </>
  );
}

// ── Sub-components ────────────────────────────────────────────

function SectionHeader({
  title,
  badge,
  badgeColor,
  badgeTextColor,
}: {
  title: string;
  badge?: string;
  badgeColor?: string;
  badgeTextColor?: string;
}) {
  return (
    <View style={headerStyles.row}>
      <Text style={headerStyles.title}>{title}</Text>
      {badge && (
        <View style={[headerStyles.badge, { backgroundColor: badgeColor }]}>
          <Text style={[headerStyles.badgeText, { color: badgeTextColor }]}>{badge}</Text>
        </View>
      )}
    </View>
  );
}

function FieldGroup({ children }: { children: React.ReactNode }) {
  return (
    <View style={[fieldGroupStyles.container, Shadow.sm]}>
      {children}
    </View>
  );
}

function FormDivider() {
  return <View style={dividerStyles.line} />;
}

interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'url';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  multiline?: boolean;
  numberOfLines?: number;
  isModerated?: boolean;
  style?: object;
}

function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  multiline = false,
  numberOfLines = 1,
  isModerated = false,
  style,
}: FormFieldProps) {
  return (
    <View style={fieldStyles.wrapper}>
      <View style={fieldStyles.labelRow}>
        <Text style={fieldStyles.label}>{label}</Text>
        {isModerated && (
          <Text style={fieldStyles.moderatedBadge}>🔍 Reviewed</Text>
        )}
      </View>
      <TextInput
        style={[fieldStyles.input, multiline && fieldStyles.inputMultiline, style]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textDisabled}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        numberOfLines={numberOfLines}
        autoCorrect={false}
        selectionColor={Colors.primary}
      />
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container:     { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 8 },
  saveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    ...Shadow.glow,
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: {
    color: '#fff',
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
  },
  moderatedSaveBtn: {
    backgroundColor: Colors.warningBg,
    borderRadius: Radius.lg,
    paddingVertical: 10,
    alignItems: 'center',
    marginHorizontal: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.warning + '40',
  },
  moderatedSaveBtnText: {
    color: Colors.warning,
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
  },
});

const headerStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 4,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  title: {
    color: Colors.textMuted,
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: Typography.semibold,
  },
});

const fieldGroupStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgLayer2,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    overflow: 'hidden',
  },
});

const dividerStyles = StyleSheet.create({
  line: {
    height: 1,
    backgroundColor: Colors.glassBorder,
    marginLeft: 14,
  },
});

const fieldStyles = StyleSheet.create({
  wrapper:       { paddingHorizontal: 14, paddingVertical: 12 },
  labelRow:      { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  label: {
    color: Colors.textSecondary,
    fontSize: Typography.xs,
    fontWeight: Typography.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  moderatedBadge: {
    color: Colors.warning,
    fontSize: 9,
    fontWeight: Typography.semibold,
  },
  input: {
    color: Colors.textPrimary,
    fontSize: Typography.base,
    fontWeight: Typography.regular,
    padding: 0,
    lineHeight: 22,
  },
  inputMultiline: {
    textAlignVertical: 'top',
    paddingTop: 2,
  },
});
