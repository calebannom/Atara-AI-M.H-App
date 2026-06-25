import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, Animated, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, ChevronRight, ChevronLeft } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useMood } from '@/context/MoodContext';
import { moodColors, moodLabels, MoodLevel } from '@/constants/theme';
import { ACTIVITIES, THINKING_TRAPS, MOCK_AI_RESPONSES } from '@/constants/mockData';
import ActivityChip from '@/components/ActivityChip';
import MoodFace from '@/components/MoodFace';

const MOODS: MoodLevel[] = ['rad', 'good', 'meh', 'bad', 'awful'];
const TOTAL_STEPS = 6;

export default function MoodCheckinModal() {
  const { theme } = useTheme();
  const { addMood } = useMood();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [step, setStep] = useState(0);
  const [selectedMood, setSelectedMood] = useState<MoodLevel | null>(null);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [thoughts, setThoughts] = useState('');
  const [selectedTraps, setSelectedTraps] = useState<string[]>([]);
  const [challenge, setChallenge] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);

  const progressAnim = useRef(new Animated.Value(0)).current;

  const scaleAnims = useRef(MOODS.map(() => new Animated.Value(1))).current;

  const animateProgress = (nextStep: number) => {
    Animated.timing(progressAnim, {
      toValue: (nextStep + 1) / TOTAL_STEPS,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const goNext = async () => {
    if (step === 4) {
      setLoadingAI(true);
      await new Promise((r) => setTimeout(r, 1500));
      const resp = MOCK_AI_RESPONSES[Math.floor(Math.random() * MOCK_AI_RESPONSES.length)];
      setAiResponse(resp);
      setLoadingAI(false);
    }
    animateProgress(step + 1);
    setStep((s) => s + 1);
  };

  const goBack = () => {
    if (step === 0) { router.back(); return; }
    animateProgress(step - 1);
    setStep((s) => s - 1);
  };

  const handleSave = () => {
    if (selectedMood) {
      addMood(selectedMood, selectedActivities, thoughts);
    }
    router.back();
  };

  const toggleActivity = (a: string) => {
    setSelectedActivities((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]);
  };

  const toggleTrap = (t: string) => {
    setSelectedTraps((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const canContinue = () => {
    if (step === 0) return !!selectedMood;
    return true;
  };

  const stepTitles = ['How are you feeling?', 'What did you do today?', 'What\'s on your mind?', 'Any thinking traps?', 'Challenge your thoughts', 'Atara\'s Perspective'];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background, paddingTop: insets.top }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={goBack}>
          <ChevronLeft size={24} color={theme.textSecondary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Check-In</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <X size={22} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View style={[styles.progressBg, { backgroundColor: theme.border }]}>
        <Animated.View style={[styles.progressFill, { width: progressWidth, backgroundColor: theme.accent }]} />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={[styles.stepIndicator, { color: theme.textMuted }]}>Step {step + 1} of {TOTAL_STEPS}</Text>
        <Text style={[styles.stepTitle, { color: theme.text }]}>{stepTitles[step]}</Text>

        {/* Step 1: Mood */}
        {step === 0 && (
          <View style={styles.moodRow}>
            {MOODS.map((mood, idx) => (
              <TouchableOpacity key={mood} onPress={() => {
                setSelectedMood(mood);
                Animated.sequence([
                  Animated.timing(scaleAnims[idx], { toValue: 1.25, duration: 100, useNativeDriver: true }),
                  Animated.timing(scaleAnims[idx], { toValue: 1, duration: 100, useNativeDriver: true }),
                ]).start();
              }}>
                <Animated.View style={[styles.moodItem, { transform: [{ scale: scaleAnims[idx] }] }]}>
                  <MoodFace mood={mood} size={56} selected={selectedMood === mood} />
                </Animated.View>
                <Text style={[styles.moodLabel, { color: selectedMood === mood ? moodColors[mood] : theme.textMuted }]}>
                  {moodLabels[mood]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Step 2: Activities */}
        {step === 1 && (
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
        )}

        {/* Step 3: Thoughts */}
        {step === 2 && (
          <TextInput
            style={[styles.textArea, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
            value={thoughts}
            onChangeText={setThoughts}
            multiline
            numberOfLines={6}
            placeholder="Write freely about what's going through your mind..."
            placeholderTextColor={theme.textMuted}
          />
        )}

        {/* Step 4: Thinking Traps */}
        {step === 3 && (
          <View>
            <Text style={[styles.helpText, { color: theme.textSecondary }]}>
              Thinking traps are patterns of distorted thinking. Tap any that apply to your current thoughts.
            </Text>
            <View style={styles.chips}>
              {THINKING_TRAPS.map((t) => (
                <ActivityChip
                  key={t}
                  label={t}
                  selected={selectedTraps.includes(t)}
                  onPress={() => toggleTrap(t)}
                />
              ))}
            </View>
          </View>
        )}

        {/* Step 5: Challenge */}
        {step === 4 && (
          <View>
            {selectedTraps.length > 0 && (
              <View style={[styles.trapHighlight, { backgroundColor: theme.primary + '22', borderColor: theme.primary }]}>
                <Text style={[styles.trapHighlightTitle, { color: theme.primary }]}>You identified:</Text>
                <Text style={[styles.trapHighlightText, { color: theme.text }]}>{selectedTraps.join(', ')}</Text>
              </View>
            )}
            <Text style={[styles.helpText, { color: theme.textSecondary }]}>
              What evidence supports or contradicts these thoughts? What might you say to a friend in this situation?
            </Text>
            <TextInput
              style={[styles.textArea, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
              value={challenge}
              onChangeText={setChallenge}
              multiline
              numberOfLines={5}
              placeholder="Challenge those thoughts here..."
              placeholderTextColor={theme.textMuted}
            />
          </View>
        )}

        {/* Step 6: AI Response */}
        {step === 5 && (
          <View>
            {loadingAI ? (
              <View style={styles.aiLoading}>
                <ActivityIndicator size="large" color={theme.accent} />
                <Text style={[styles.aiLoadingText, { color: theme.textSecondary }]}>Atara is thinking...</Text>
              </View>
            ) : (
              <View style={[styles.aiCard, { backgroundColor: theme.surface, borderColor: theme.accent }]}>
                <View style={styles.aiCardHeader}>
                  <View style={[styles.aiAvatar, { backgroundColor: theme.accent + '33' }]}>
                    <Text style={styles.aiAvatarText}>🧠</Text>
                  </View>
                  <View>
                    <Text style={[styles.aiName, { color: theme.text }]}>Atara</Text>
                    <Text style={[styles.aiSubtitle, { color: theme.textMuted }]}>✦ Atara&apos;s Perspective</Text>
                  </View>
                </View>
                <Text style={[styles.aiText, { color: theme.text }]}>{aiResponse}</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
        {step < TOTAL_STEPS - 1 ? (
          <TouchableOpacity
            style={[styles.nextBtn, { backgroundColor: canContinue() ? theme.primary : theme.border }]}
            onPress={goNext}
            disabled={!canContinue()}
          >
            <Text style={styles.nextBtnText}>Continue</Text>
            <ChevronRight size={18} color="#FFFFFF" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.nextBtn, { backgroundColor: theme.accent }]}
            onPress={handleSave}
          >
            <Text style={styles.nextBtnText}>Save Check-In</Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 16, fontFamily: 'Poppins-Bold' },
  progressBg: { height: 4 },
  progressFill: { height: 4 },
  content: { padding: 24, paddingBottom: 40 },
  stepIndicator: { fontSize: 12, fontFamily: 'Poppins-SemiBold', marginBottom: 8 },
  stepTitle: { fontSize: 22, fontFamily: 'Poppins-Bold', marginBottom: 28, lineHeight: 32 },
  moodRow: { flexDirection: 'row', justifyContent: 'space-between' },
  moodItem: { marginBottom: 6, alignItems: 'center' },
  moodLabel: { fontSize: 11, fontFamily: 'Poppins-SemiBold', textAlign: 'center' },
  chips: { flexDirection: 'row', flexWrap: 'wrap' },
  textArea: {
    borderWidth: 1.5, borderRadius: 12, padding: 14,
    fontSize: 15, fontFamily: 'Poppins-Regular', minHeight: 140,
    textAlignVertical: 'top', lineHeight: 22,
  },
  helpText: { fontSize: 14, fontFamily: 'Poppins-Regular', lineHeight: 22, marginBottom: 16 },
  trapHighlight: { borderWidth: 1, borderRadius: 12, padding: 14, marginBottom: 16 },
  trapHighlightTitle: { fontSize: 12, fontFamily: 'Poppins-Bold', marginBottom: 4 },
  trapHighlightText: { fontSize: 14, fontFamily: 'Poppins-Regular' },
  aiLoading: { alignItems: 'center', paddingVertical: 60, gap: 16 },
  aiLoadingText: { fontSize: 15, fontFamily: 'Poppins-Regular' },
  aiCard: { borderRadius: 16, borderWidth: 1.5, padding: 20, gap: 12 },
  aiCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  aiAvatar: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  aiAvatarText: { fontSize: 22 },
  aiName: { fontSize: 15, fontFamily: 'Poppins-Bold' },
  aiSubtitle: { fontSize: 12, fontFamily: 'Poppins-Regular' },
  aiText: { fontSize: 15, fontFamily: 'Poppins-Regular', lineHeight: 24 },
  footer: { padding: 20, borderTopWidth: 1 },
  nextBtn: { borderRadius: 16, paddingVertical: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6 },
  nextBtnText: { color: '#FFFFFF', fontSize: 16, fontFamily: 'Poppins-Bold' },
});

