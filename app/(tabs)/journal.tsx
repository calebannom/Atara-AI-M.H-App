import React, { useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SectionList, Alert, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus, Trash2 } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useJournal } from '@/context/JournalContext';
import { JournalEntry } from '@/constants/mockData';
import MoodFace from '@/components/MoodFace';
import AppBackground from '@/components/AppBackground';

function groupByMonth(entries: JournalEntry[]) {
  const groups: Record<string, JournalEntry[]> = {};
  entries.forEach((e) => {
    const date = new Date(e.date + 'T12:00:00');
    const key = date.toLocaleDateString('en', { year: 'numeric', month: 'long' });
    if (!groups[key]) groups[key] = [];
    groups[key].push(e);
  });
  return Object.entries(groups).map(([title, data]) => ({ title, data }));
}

export default function JournalScreen() {
  const { theme } = useTheme();
  const { journals, deleteJournal, loading } = useJournal();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const sections = useMemo(() => groupByMonth(journals), [journals]);

  const handleDelete = (id: string, title: string) => {
    Alert.alert('Delete Entry', `Delete "${title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteJournal(id) },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background, paddingTop: insets.top }}>
      <AppBackground />
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.title, { color: theme.text }]}>Journal</Text>
        <TouchableOpacity
          style={[styles.newBtn, { backgroundColor: theme.primary }]}
          onPress={() => router.push('/modal/journal-entry')}
        >
          <Plus size={18} color="#FFFFFF" />
          <Text style={styles.newBtnText}>New</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Loading your entries...</Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderSectionHeader={({ section }) => (
            <View style={[styles.sectionHeader, { backgroundColor: 'transparent' }]}>
              <Text style={[styles.sectionHeaderText, { color: theme.textSecondary }]}>{section.title}</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.entryCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
              onPress={() => router.push({ pathname: '/modal/journal-entry', params: { id: item.id } })}
            >
              <View style={styles.entryLeft}>
                <View style={styles.entryTopRow}>
                  <Text style={[styles.entryTitle, { color: theme.text }]} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <MoodFace mood={item.mood} size={28} />
                </View>
                <Text style={[styles.entryPreview, { color: theme.textSecondary }]} numberOfLines={2}>
                  {item.body}
                </Text>
                <Text style={[styles.entryDate, { color: theme.textMuted }]}>
                  {new Date(item.date + 'T12:00:00').toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                  {item.activities.length > 0 && ` · ${item.activities.slice(0, 2).join(', ')}`}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDelete(item.id, item.title)}
              >
                <Trash2 size={16} color={theme.error} />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>📓</Text>
              <Text style={[styles.emptyTitle, { color: theme.text }]}>No journal entries yet</Text>
              <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
                Start writing to track your thoughts and feelings
              </Text>
              <TouchableOpacity
                style={[styles.emptyCTA, { backgroundColor: theme.primary }]}
                onPress={() => router.push('/modal/journal-entry')}
              >
                <Text style={styles.emptyCTAText}>Write your first entry</Text>
              </TouchableOpacity>
            </View>
          }
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1,
  },
  title: { fontSize: 26, fontFamily: 'Poppins-Bold' },
  newBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  newBtnText: { color: '#FFFFFF', fontSize: 14, fontFamily: 'Poppins-Bold' },
  sectionHeader: { paddingHorizontal: 20, paddingVertical: 8 },
  sectionHeaderText: { fontSize: 13, fontFamily: 'Poppins-Bold', letterSpacing: 0.5 },
  entryCard: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 20, marginBottom: 10,
    borderRadius: 16, borderWidth: 1, padding: 16,
  },
  entryLeft: { flex: 1 },
  entryTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  entryTitle: { fontSize: 16, fontFamily: 'Poppins-Bold', flex: 1, marginRight: 8 },
  entryPreview: { fontSize: 13, fontFamily: 'Poppins-Regular', lineHeight: 19, marginBottom: 6 },
  entryDate: { fontSize: 11, fontFamily: 'Poppins-Regular' },
  deleteBtn: { padding: 8, marginLeft: 4 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40, gap: 12, marginTop: 80 },
  emptyEmoji: { fontSize: 52 },
  emptyTitle: { fontSize: 20, fontFamily: 'Poppins-Bold' },
  emptySubtitle: { fontSize: 14, fontFamily: 'Poppins-Regular', textAlign: 'center', lineHeight: 22 },
  emptyCTA: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 20, marginTop: 8 },
  emptyCTAText: { color: '#FFFFFF', fontFamily: 'Poppins-Bold', fontSize: 15 },
  listContent: { paddingBottom: 120 },
});

