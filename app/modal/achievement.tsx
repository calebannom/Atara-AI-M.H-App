import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Lock, CheckCircle2 } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import AchievementBadge from '@/components/AchievementBadge';
import { ACHIEVEMENTS } from '@/constants/achievements';

export default function AchievementModal() {
  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const achievement = ACHIEVEMENTS.find((a) => a.id === Number(id));
  if (!achievement) return null;

  const { title, icon, color, detail, requirement, unlocked, unlockedDate } = achievement;

  return (
    <View style={{ flex: 1, backgroundColor: theme.background, paddingTop: insets.top }}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border, backgroundColor: theme.surface }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Achievement</Text>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <X size={24} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={[styles.hero, { backgroundColor: color + '14' }]}>
          <AchievementBadge icon={icon} color={color} size={120} unlocked={unlocked} />
          <Text style={[styles.heroTitle, { color: theme.text }]}>{title}</Text>

          <View style={[
            styles.pill,
            { backgroundColor: unlocked ? color + '20' : theme.inputBg, borderColor: unlocked ? color : theme.border },
          ]}>
            {unlocked
              ? <CheckCircle2 size={15} color={color} />
              : <Lock size={15} color={theme.textMuted} />
            }
            <Text style={[styles.pillText, { color: unlocked ? color : theme.textMuted }]}>
              {unlocked ? 'Unlocked' : 'Locked'}
            </Text>
          </View>
        </View>

        {/* About */}
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>ABOUT</Text>
          <Text style={[styles.bodyText, { color: theme.text }]}>{detail}</Text>
        </View>

        {/* How to earn */}
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>HOW TO EARN</Text>
          <View style={styles.requirementRow}>
            <View style={[styles.dot, { backgroundColor: unlocked ? color : theme.border }]} />
            <Text style={[styles.bodyText, { color: theme.text, flex: 1 }]}>{requirement}</Text>
          </View>
        </View>

        {/* Earned on */}
        {unlocked && unlockedDate ? (
          <View style={[styles.card, { backgroundColor: theme.surface }]}>
            <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>EARNED ON</Text>
            <Text style={[styles.bodyText, { color: color, fontFamily: 'Poppins-SemiBold' }]}>
              {unlockedDate}
            </Text>
          </View>
        ) : null}

        {/* Progress hint for locked */}
        {!unlocked ? (
          <View style={[styles.card, { backgroundColor: color + '10', borderWidth: 1, borderColor: color + '30' }]}>
            <Text style={[styles.cardLabel, { color: color }]}>KEEP GOING</Text>
            <Text style={[styles.bodyText, { color: theme.textSecondary }]}>
              Stay consistent with your daily check-ins and journaling to unlock this achievement.
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 16, fontFamily: 'Poppins-Bold' },
  content: { padding: 20, gap: 12, paddingBottom: 48 },
  hero: {
    borderRadius: 20, paddingVertical: 36, paddingHorizontal: 24,
    alignItems: 'center', gap: 16,
  },
  heroTitle: { fontSize: 26, fontFamily: 'Poppins-Bold', textAlign: 'center' },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 7,
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1,
  },
  pillText: { fontSize: 13, fontFamily: 'Poppins-SemiBold' },
  card: { borderRadius: 16, padding: 18, gap: 10 },
  cardLabel: { fontSize: 11, fontFamily: 'Poppins-Bold', letterSpacing: 0.8 },
  bodyText: { fontSize: 15, fontFamily: 'Poppins-Regular', lineHeight: 24 },
  requirementRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  dot: { width: 8, height: 8, borderRadius: 4, marginTop: 8 },
});
