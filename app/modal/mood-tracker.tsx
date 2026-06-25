import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  Animated, KeyboardAvoidingView, Platform, SectionList, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useMood } from '@/context/MoodContext';
import { moodColors, moodLabels, MoodLevel } from '@/constants/theme';
import { ACTIVITIES } from '@/constants/mockData';
import ActivityChip from '@/components/ActivityChip';
import MoodFace from '@/components/MoodFace';

const MOODS: MoodLevel[] = ['rad', 'good', 'meh', 'bad', 'awful'];

function groupByDate(moods: ReturnType<typeof useMood>['moods']) {
  const groups: Record<string, typeof moods> = {};
  moods.forEach((m) => {
    if (!groups[m.date]) groups[m.date] = [];
    groups[m.date].push(m);
  });
  return Object.entries(groups)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, data]) => ({
      title: new Date(date + 'T12:00:00').toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' }),
      data,
    }));
}

export default function MoodTrackerModal() {
  const { theme } = useTheme();
  const { moods, addMood, loading } = useMood();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [selectedMood, setSelectedMood] = useState<MoodLevel | null>(null);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const scaleAnims = useRef(MOODS.map(() => new Animated.Value(1))).current;

  const selectMood = (mood: MoodLevel, idx: number) => {
    setSelectedMood(mood);
    Animated.sequence([
      Animated.timing(scaleAnims[idx], { toValue: 1.2, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnims[idx], { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const toggleActivity = (a: string) => {
    setSelectedActivities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );
  };

  const handleSave = () => {
    if (!selectedMood) return;
    addMood(selectedMood, selectedActivities, notes);
    router.back();
  };

  const sections = groupByDate(moods);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background, paddingTop: insets.top }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.modalHeader, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <Text style={[styles.modalTitle, { color: theme.text }]}>Log Mood</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <X size={24} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.logSection}>
            <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>HOW ARE YOU FEELING?</Text>

            {/* Mood Faces */}
            <View style={styles.moodRow}>
              {MOODS.map((mood, idx) => (
                <TouchableOpacity
                  key={mood}
                  onPress={() => selectMood(mood, idx)}
                  style={styles.moodBtn}
                >
                  <Animated.View style={{ transform: [{ scale: scaleAnims[idx] }] }}>
                    <MoodFace mood={mood} size={56} selected={selectedMood === mood} />
                  </Animated.View>
                  <Text style={[styles.moodLabel, { color: selectedMood === mood ? moodColors[mood] : theme.textMuted }]}>
                    {moodLabels[mood]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Activities */}
            <Text style={[styles.sectionLabel, { color: theme.textSecondary, marginTop: 20 }]}>ACTIVITIES</Text>
            <View style={styles.chips}>
              {ACTIVITIES.map((a) => (
                <ActivityChip
                  key={a}
                  label={a}
                  selected={selectedActivities.includes(a)}
                  onPress={() => toggleActivity(a)}
                />
              ))}
            </View>

            {/* Notes */}
            <Text style={[styles.sectionLabel, { color: theme.textSecondary, marginTop: 8 }]}>NOTES</Text>
            <TextInput
              style={[styles.notesInput, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
              placeholder="How was your day? (optional)"
              placeholderTextColor={theme.textMuted}
            />

            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: selectedMood ? theme.primary : theme.border }]}
              onPress={handleSave}
              disabled={!selectedMood}
            >
              <Text style={styles.saveBtnText}>Save Mood</Text>
            </TouchableOpacity>

            <Text style={[styles.historyLabel, { color: theme.text }]}>Past Entries</Text>
          </View>
        }
        renderSectionHeader={({ section }) => (
          <View style={[styles.sectionHeader, { backgroundColor: theme.background }]}>
            <Text style={[styles.sectionHeaderText, { color: theme.textSecondary }]}>{section.title}</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={[styles.entryCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <MoodFace mood={item.mood} size={40} />
            <View style={styles.entryInfo}>
              <Text style={[styles.entryMoodText, { color: moodColors[item.mood] }]}>{moodLabels[item.mood]}</Text>
              {item.activities.length > 0 && (
                <Text style={[styles.entryActivities, { color: theme.textSecondary }]} numberOfLines={1}>
                  {item.activities.join(' · ')}
                </Text>
              )}
              {item.notes ? (
                <Text style={[styles.entryNotes, { color: theme.textMuted }]} numberOfLines={2}>
                  {item.notes}
                </Text>
              ) : null}
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>📊</Text>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No mood entries yet</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1,
  },
  modalTitle: { fontSize: 18, fontFamily: 'Poppins-Bold' },
  logSection: { padding: 20 },
  sectionLabel: { fontSize: 11, fontFamily: 'Poppins-Bold', letterSpacing: 1, marginBottom: 12 },
  moodRow: { flexDirection: 'row', justifyContent: 'space-between' },
  moodBtn: { alignItems: 'center', gap: 6 },
  moodLabel: { fontSize: 11, fontFamily: 'Poppins-SemiBold' },
  chips: { flexDirection: 'row', flexWrap: 'wrap' },
  notesInput: {
    borderWidth: 1.5, borderRadius: 12, padding: 14,
    fontSize: 14, fontFamily: 'Poppins-Regular', minHeight: 80,
    textAlignVertical: 'top', marginBottom: 20,
  },
  saveBtn: { borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginBottom: 28 },
  saveBtnText: { color: '#FFFFFF', fontSize: 16, fontFamily: 'Poppins-Bold' },
  historyLabel: { fontSize: 18, fontFamily: 'Poppins-Bold', marginBottom: 4 },
  sectionHeader: { paddingHorizontal: 20, paddingVertical: 8 },
  sectionHeaderText: { fontSize: 13, fontFamily: 'Poppins-Bold' },
  entryCard: {
    flexDirection: 'row', alignItems: 'flex-start',
    marginHorizontal: 20, marginBottom: 10,
    borderRadius: 12, borderWidth: 1, padding: 14, gap: 12,
  },
  entryInfo: { flex: 1 },
  entryMoodText: { fontSize: 15, fontFamily: 'Poppins-Bold', marginBottom: 2 },
  entryActivities: { fontSize: 12, fontFamily: 'Poppins-Regular', marginBottom: 2 },
  entryNotes: { fontSize: 13, fontFamily: 'Poppins-Regular', fontStyle: 'italic' },
  empty: { alignItems: 'center', padding: 40, gap: 8 },
  emptyEmoji: { fontSize: 40 },
  emptyText: { fontSize: 15, fontFamily: 'Poppins-Regular' },
  listContent: { paddingBottom: 40 },
});

