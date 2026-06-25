import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Sparkles } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useJournal } from '@/context/JournalContext';
import { moodColors, moodLabels, MoodLevel } from '@/constants/theme';
import { ACTIVITIES } from '@/constants/mockData';
import ActivityChip from '@/components/ActivityChip';
import MoodFace from '@/components/MoodFace';

const MOODS: MoodLevel[] = ['rad', 'good', 'meh', 'bad', 'awful'];

const WRITING_PROMPTS = [
  'What made you smile today, even briefly?',
  'What are three things you\'re grateful for right now?',
  'Describe a moment today when you felt most like yourself.',
  'What would you tell your past self from one year ago?',
  'If this week were a color, what would it be and why?',
  'What\'s one thing you\'d like to let go of?',
  'Describe something beautiful you noticed today.',
  'What are you learning about yourself lately?',
];

export default function JournalEntryModal() {
  const { theme } = useTheme();
  const { journals, addJournal, updateJournal } = useJournal();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const existing = id ? journals.find((j) => j.id === id) : null;

  const [title, setTitle] = useState(existing?.title ?? '');
  const [body, setBody] = useState(existing?.body ?? '');
  const [mood, setMood] = useState<MoodLevel>(existing?.mood ?? 'good');
  const [activities, setActivities] = useState<string[]>(existing?.activities ?? []);
  const [loadingPrompts, setLoadingPrompts] = useState(false);
  const [prompts, setPrompts] = useState<string[]>([]);

  const toggleActivity = (a: string) => {
    setActivities((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]);
  };

  const handleSave = () => {
    if (!title.trim()) return;
    if (existing && id) {
      // preserve the original date — do not overwrite it with today
      updateJournal(id, { title, body, mood, activities });
    } else {
      const date = new Date().toISOString().split('T')[0];
      addJournal({ title, body, mood, activities, date });
    }
    router.back();
  };

  const handleGetPrompts = async () => {
    setLoadingPrompts(true);
    await new Promise((r) => setTimeout(r, 1500));
    // Fisher-Yates shuffle for unbiased random selection
    const arr = [...WRITING_PROMPTS];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setPrompts(arr.slice(0, 3));
    setLoadingPrompts(false);
  };

  const applyPrompt = (p: string) => {
    setBody((prev) => prev ? `${prev}\n\n${p}\n` : `${p}\n`);
    setPrompts([]);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background, paddingTop: insets.top }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <X size={24} color={theme.textSecondary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          {existing ? 'Edit Entry' : 'New Entry'}
        </Text>
        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: title.trim() ? theme.primary : theme.border }]}
          onPress={handleSave}
          disabled={!title.trim()}
        >
          <Text style={styles.saveBtnText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
      >
        {/* Title */}
        <TextInput
          style={[styles.titleInput, { color: theme.text }]}
          value={title}
          onChangeText={setTitle}
          placeholder="Entry title..."
          placeholderTextColor={theme.textMuted}
          multiline={false}
        />

        {/* Mood Selector */}
        <View style={styles.moodRow}>
          {MOODS.map((m) => (
            <TouchableOpacity
              key={m}
              onPress={() => setMood(m)}
              style={styles.moodBtn}
            >
              <MoodFace mood={m} size={48} selected={mood === m} />
              <Text style={[styles.moodLabel, { color: mood === m ? moodColors[m] : theme.textMuted }]}>
                {moodLabels[m]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Activities */}
        <Text style={[styles.subLabel, { color: theme.textSecondary }]}>Activities</Text>
        <View style={styles.chips}>
          {ACTIVITIES.map((a) => (
            <ActivityChip key={a} label={a} selected={activities.includes(a)} onPress={() => toggleActivity(a)} />
          ))}
        </View>

        {/* Body */}
        <Text style={[styles.subLabel, { color: theme.textSecondary }]}>Your thoughts</Text>
        <TextInput
          style={[styles.bodyInput, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
          value={body}
          onChangeText={setBody}
          multiline
          textAlignVertical="top"
          placeholder="Write about your day, thoughts, feelings..."
          placeholderTextColor={theme.textMuted}
        />

        {/* Writing Prompts */}
        <TouchableOpacity
          style={[styles.promptsBtn, { borderColor: theme.primary }]}
          onPress={handleGetPrompts}
          disabled={loadingPrompts}
        >
          {loadingPrompts ? (
            <ActivityIndicator size="small" color={theme.primary} />
          ) : (
            <Sparkles size={16} color={theme.primary} />
          )}
          <Text style={[styles.promptsBtnText, { color: theme.primary }]}>
            {loadingPrompts ? 'Getting prompts...' : '✨ Get Writing Prompts'}
          </Text>
        </TouchableOpacity>

        {prompts.length > 0 && (
          <View style={styles.promptsList}>
            {prompts.map((p, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.promptChip, { backgroundColor: theme.surface, borderColor: theme.border }]}
                onPress={() => applyPrompt(p)}
              >
                <Text style={[styles.promptText, { color: theme.text }]}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={{ height: 80 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 16, fontFamily: 'Poppins-Bold' },
  saveBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  saveBtnText: { color: '#FFFFFF', fontSize: 14, fontFamily: 'Poppins-Bold' },
  content: { padding: 20 },
  titleInput: {
    fontSize: 24, fontFamily: 'Poppins-Bold',
    marginBottom: 20, borderBottomWidth: 1, borderBottomColor: 'transparent',
    paddingBottom: 8,
  },
  moodRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  moodBtn: { flex: 1, marginHorizontal: 2, paddingVertical: 6, alignItems: 'center', gap: 4 },
  moodLabel: { fontSize: 10, fontFamily: 'Poppins-SemiBold' },
  subLabel: { fontSize: 12, fontFamily: 'Poppins-Bold', letterSpacing: 0.5, marginBottom: 10, textTransform: 'uppercase' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  bodyInput: {
    borderWidth: 1.5, borderRadius: 12, padding: 16,
    minHeight: 200, fontSize: 15, fontFamily: 'Poppins-Regular', lineHeight: 24,
    marginBottom: 16,
  },
  promptsBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderRadius: 12, paddingVertical: 12, gap: 8, marginBottom: 16,
  },
  promptsBtnText: { fontSize: 14, fontFamily: 'Poppins-SemiBold' },
  promptsList: { gap: 8 },
  promptChip: { borderWidth: 1, borderRadius: 12, padding: 14 },
  promptText: { fontSize: 14, fontFamily: 'Poppins-Regular', lineHeight: 20 },
});

