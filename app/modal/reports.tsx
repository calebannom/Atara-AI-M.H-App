import React, { useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, TrendingUp, Calendar, Award, FileText } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useMood } from '@/context/MoodContext';
import { useJournal } from '@/context/JournalContext';
import MoodBadge from '@/components/MoodBadge';
import { MoodLevel } from '@/constants/theme';

export default function ReportsModal() {
  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { moods, currentStreak, longestStreak } = useMood();
  const { journals } = useJournal();

  // Calculate stats
  const stats = useMemo(() => {
    const last30Days = moods.filter(m => {
      const date = new Date(m.date);
      const now = new Date();
      const diff = (now.getTime() - date.getTime()) / (1000 * 3600 * 24);
      return diff <= 30;
    });

    const moodCounts = last30Days.reduce((acc, m) => {
      acc[m.mood] = (acc[m.mood] || 0) + 1;
      return acc;
    }, {} as Record<MoodLevel, number>);

    const mostCommonMood = (Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'good') as MoodLevel;

    return {
      totalMoods: moods.length,
      totalJournals: journals.length,
      last30DaysMoods: last30Days.length,
      mostCommonMood,
      currentStreak,
      longestStreak,
    };
  }, [moods, journals, currentStreak, longestStreak]);

  const reportSections = [
    {
      icon: TrendingUp,
      title: 'Mood Trends',
      color: theme.primary,
      data: [
        { label: 'Total Check-ins', value: stats.totalMoods.toString() },
        { label: 'Last 30 Days', value: stats.last30DaysMoods.toString() },
      ],
    },
    {
      icon: Award,
      title: 'Streaks',
      color: theme.accent,
      data: [
        { label: 'Current Streak', value: `${stats.currentStreak} days` },
        { label: 'Longest Streak', value: `${stats.longestStreak} days` },
      ],
    },
    {
      icon: Calendar,
      title: 'Journaling',
      color: '#FB923C',
      data: [
        { label: 'Total Entries', value: stats.totalJournals.toString() },
      ],
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.background, paddingTop: insets.top }}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <X size={24} color={theme.textSecondary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Reports</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Summary Card */}
        <View style={[styles.summaryCard, { backgroundColor: theme.primary }]}>
          <FileText size={32} color="#FFFFFF" />
          <Text style={styles.summaryTitle}>Your Progress Report</Text>
          <Text style={styles.summarySubtitle}>Last updated: Today</Text>
        </View>

        {/* Most Common Mood */}
        <View style={[styles.moodCard, { backgroundColor: theme.surface }]}>
          <Text style={[styles.moodCardTitle, { color: theme.textSecondary }]}>MOST COMMON MOOD</Text>
          <View style={styles.moodRow}>
            <MoodBadge mood={stats.mostCommonMood} size="lg" />
            <View style={styles.moodInfo}>
              <Text style={[styles.moodLabel, { color: theme.text }]}>
                {stats.mostCommonMood.charAt(0).toUpperCase() + stats.mostCommonMood.slice(1)}
              </Text>
              <Text style={[styles.moodSubtitle, { color: theme.textSecondary }]}>
                Over the last 30 days
              </Text>
            </View>
          </View>
        </View>

        {/* Report Sections */}
        {reportSections.map((section) => (
          <View key={section.title} style={[styles.sectionCard, { backgroundColor: theme.surface }]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIcon, { backgroundColor: section.color + '22' }]}>
                <section.icon size={20} color={section.color} />
              </View>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>{section.title}</Text>
            </View>
            {section.data.map((item) => (
              <View key={item.label} style={styles.statRow}>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{item.label}</Text>
                <Text style={[styles.statValue, { color: theme.text }]}>{item.value}</Text>
              </View>
            ))}
          </View>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 18, fontFamily: 'Poppins-Bold' },
  content: { padding: 20 },
  summaryCard: {
    borderRadius: 20, padding: 24, marginBottom: 20,
    alignItems: 'center', gap: 8,
  },
  summaryTitle: { color: '#FFFFFF', fontSize: 20, fontFamily: 'Poppins-Bold' },
  summarySubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontFamily: 'Poppins-Regular' },
  moodCard: {
    borderRadius: 16, padding: 20, marginBottom: 20,
  },
  moodCardTitle: { fontSize: 11, fontFamily: 'Poppins-Bold', letterSpacing: 1, marginBottom: 12 },
  moodRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  moodInfo: { gap: 4 },
  moodLabel: { fontSize: 18, fontFamily: 'Poppins-Bold' },
  moodSubtitle: { fontSize: 13, fontFamily: 'Poppins-Regular' },
  sectionCard: {
    borderRadius: 16, padding: 16, marginBottom: 16,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  sectionIcon: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  sectionTitle: { fontSize: 16, fontFamily: 'Poppins-Bold' },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  statLabel: { fontSize: 14, fontFamily: 'Poppins-Regular' },
  statValue: { fontSize: 16, fontFamily: 'Poppins-Bold' },
});
