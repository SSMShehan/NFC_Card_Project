// ============================================================
//  NEXUS Mobile — Link Management Screen
//  Tab 2: FlatList of all links with instant toggle & delete.
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import * as Haptics from 'expo-haptics';

import { Colors, Spacing, Radius, Typography, Shadow } from '../../constants/theme';
import { LinkRow } from '../../components/LinkRow';
import { useLinks, useCreateLink } from '../../hooks/useLinks';
import type { ProfileLink } from '../../hooks/useProfile';

const PLATFORM_OPTIONS = [
  'LINKEDIN', 'GITHUB', 'INSTAGRAM', 'WHATSAPP',
  'TWITTER', 'FACEBOOK', 'YOUTUBE', 'TIKTOK',
  'TELEGRAM', 'PHONE', 'EMAIL', 'WEBSITE', 'CUSTOM',
];

export default function LinksScreen() {
  const { data: links = [], isLoading, isRefetching, refetch } = useLinks();
  const { mutateAsync: createLink, isPending: isCreating } = useCreateLink();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newLink, setNewLink] = useState({
    platform: 'WEBSITE',
    url: '',
    label: '',
  });

  const activeLinks   = links.filter((l) => l.isActive);
  const inactiveLinks = links.filter((l) => !l.isActive);

  const handleCreate = async () => {
    if (!newLink.url.trim() || !newLink.label.trim()) {
      Toast.show({ type: 'error', text1: 'Please fill in all fields', position: 'bottom' });
      return;
    }

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await createLink({
        platform: newLink.platform,
        url: newLink.url.trim(),
        label: newLink.label.trim(),
        sortOrder: links.length,
      });
      setShowAddModal(false);
      setNewLink({ platform: 'WEBSITE', url: '', label: '' });
      Toast.show({ type: 'success', text1: '✅ Link Added', position: 'bottom' });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Failed to add link';
      Toast.show({ type: 'error', text1: 'Error', text2: msg, position: 'bottom' });
    }
  };

  const renderItem = ({ item }: { item: ProfileLink }) => (
    <LinkRow link={item} />
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* ── Header ──────────────────────────────────────── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My Links</Text>
          <Text style={styles.subtitle}>
            {activeLinks.length} active · {inactiveLinks.length} hidden
          </Text>
        </View>
        <TouchableOpacity
          id="add-link-btn"
          onPress={() => setShowAddModal(true)}
          style={styles.addBtn}
          accessibilityRole="button"
          accessibilityLabel="Add a new link"
        >
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* ── Link List ────────────────────────────────────── */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={Colors.primary} size="large" />
        </View>
      ) : (
        <FlatList
          data={links}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={Colors.primary}
            />
          }
          ListHeaderComponent={
            links.length > 0 ? (
              <Text style={styles.sectionLabel}>
                {activeLinks.length} ACTIVE · {inactiveLinks.length} HIDDEN
              </Text>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🔗</Text>
              <Text style={styles.emptyTitle}>No links yet</Text>
              <Text style={styles.emptySubtitle}>
                Tap "+ Add" to add your first social or portfolio link.
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* ── Add Link Modal ───────────────────────────────── */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={modalStyles.backdrop}>
          <View style={[modalStyles.sheet, Shadow.lg]}>
            <Text style={modalStyles.title}>Add New Link</Text>

            {/* Platform Selector */}
            <Text style={modalStyles.fieldLabel}>Platform</Text>
            <View style={modalStyles.platformGrid}>
              {PLATFORM_OPTIONS.map((platform) => (
                <TouchableOpacity
                  key={platform}
                  onPress={() => setNewLink((prev) => ({ ...prev, platform }))}
                  style={[
                    modalStyles.platformChip,
                    newLink.platform === platform && modalStyles.platformChipSelected,
                  ]}
                >
                  <Text
                    style={[
                      modalStyles.platformChipText,
                      newLink.platform === platform && modalStyles.platformChipTextSelected,
                    ]}
                  >
                    {platform}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Label */}
            <Text style={modalStyles.fieldLabel}>Label</Text>
            <TextInput
              style={modalStyles.input}
              value={newLink.label}
              onChangeText={(v) => setNewLink((prev) => ({ ...prev, label: v }))}
              placeholder="e.g. LinkedIn"
              placeholderTextColor={Colors.textDisabled}
              selectionColor={Colors.primary}
            />

            {/* URL */}
            <Text style={modalStyles.fieldLabel}>URL</Text>
            <TextInput
              style={modalStyles.input}
              value={newLink.url}
              onChangeText={(v) => setNewLink((prev) => ({ ...prev, url: v }))}
              placeholder="https://linkedin.com/in/you"
              placeholderTextColor={Colors.textDisabled}
              keyboardType="url"
              autoCapitalize="none"
              selectionColor={Colors.primary}
            />

            {/* Actions */}
            <View style={modalStyles.actions}>
              <TouchableOpacity
                id="cancel-add-link-btn"
                onPress={() => setShowAddModal(false)}
                style={modalStyles.cancelBtn}
              >
                <Text style={modalStyles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                id="confirm-add-link-btn"
                onPress={handleCreate}
                style={[modalStyles.confirmBtn, isCreating && { opacity: 0.6 }]}
                disabled={isCreating}
              >
                {isCreating ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={modalStyles.confirmBtnText}>Add Link</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea:         { flex: 1, backgroundColor: Colors.bgBase },
  header:           { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  title:            { color: Colors.textPrimary, fontSize: Typography.xl, fontWeight: Typography.bold },
  subtitle:         { color: Colors.textMuted, fontSize: Typography.xs, marginTop: 2 },
  addBtn:           { backgroundColor: Colors.primary, borderRadius: Radius.lg, paddingHorizontal: 16, paddingVertical: 8, ...Shadow.glow },
  addBtnText:       { color: '#fff', fontSize: Typography.sm, fontWeight: Typography.semibold },
  listContent:      { paddingHorizontal: 16, paddingBottom: 80 },
  sectionLabel:     { color: Colors.textMuted, fontSize: Typography.xs, fontWeight: Typography.bold, letterSpacing: 1, textTransform: 'uppercase', paddingVertical: 12, paddingHorizontal: 4 },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyState:       { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyEmoji:       { fontSize: 48 },
  emptyTitle:       { color: Colors.textSecondary, fontSize: Typography.lg, fontWeight: Typography.semibold },
  emptySubtitle:    { color: Colors.textMuted, fontSize: Typography.sm, textAlign: 'center', maxWidth: 260 },
});

const modalStyles = StyleSheet.create({
  backdrop:         { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  sheet:            { backgroundColor: Colors.bgLayer1, borderTopLeftRadius: Radius.xxl, borderTopRightRadius: Radius.xxl, borderWidth: 1, borderColor: Colors.glassBorder, padding: 24, paddingBottom: 40 },
  title:            { color: Colors.textPrimary, fontSize: Typography.lg, fontWeight: Typography.bold, marginBottom: 16, textAlign: 'center' },
  fieldLabel:       { color: Colors.textMuted, fontSize: Typography.xs, fontWeight: Typography.bold, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  platformGrid:     { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 16 },
  platformChip:     { paddingHorizontal: 10, paddingVertical: 5, borderRadius: Radius.full, backgroundColor: Colors.bgLayer2, borderWidth: 1, borderColor: Colors.glassBorder },
  platformChipSelected: { backgroundColor: Colors.primary + '30', borderColor: Colors.primary },
  platformChipText: { color: Colors.textMuted, fontSize: Typography.xs, fontWeight: Typography.medium },
  platformChipTextSelected: { color: Colors.primary },
  input:            { backgroundColor: Colors.bgLayer2, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.glassBorder, color: Colors.textPrimary, fontSize: Typography.base, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 16 },
  actions:          { flexDirection: 'row', gap: 10, marginTop: 4 },
  cancelBtn:        { flex: 1, backgroundColor: Colors.bgLayer2, borderRadius: Radius.xl, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: Colors.glassBorder },
  cancelBtnText:    { color: Colors.textSecondary, fontSize: Typography.base, fontWeight: Typography.medium },
  confirmBtn:       { flex: 1, backgroundColor: Colors.primary, borderRadius: Radius.xl, paddingVertical: 14, alignItems: 'center' },
  confirmBtnText:   { color: '#fff', fontSize: Typography.base, fontWeight: Typography.semibold },
});
