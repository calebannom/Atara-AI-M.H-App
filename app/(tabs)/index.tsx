import React, { useMemo, Fragment } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Brain, Pencil, Wind, MessageSquare, Check } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useMood } from '@/context/MoodContext';
import { useJournal } from '@/context/JournalContext';
import { MoodLevel } from '@/constants/theme';
import { DAILY_QUOTES, ARTICLES } from '@/constants/mockData';
import MoodBadge from '@/components/MoodBadge';
import MoodFace from '@/components/MoodFace';
import AppBackground from '@/components/AppBackground';

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning ☀️';
  if (h < 17) return 'Good afternoon 🌤️';
  return 'Good evening 🌙';
}

// "Days in a Row" streak card matching the reference design
function DaysInARowCard({ moods, currentStreak, longestStreak }: {
  moods: { date: string; mood: MoodLevel }[];
  currentStreak: number;
  longestStreak: number;
}) {
  const { theme } = useTheme();
  const today = new Date().toISOString().split('T')[0];
  const moodDateSet = new Set(moods.map((m) => m.date));

  // Show last 5 days including today (matching the image layout)
  const days = Array.from({ length: 5 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (4 - i));
    const dateStr = d.toISOString().split('T')[0];
    const isToday = dateStr === today;
    const label = isToday
      ? 'Today'
      : d.toLocaleDateString('en', { weekday: 'short' });
    const logged = moodDateSet.has(dateStr);
    return { dateStr, label, isToday, logged };
  });

  return (
    <View style={[streakStyles.card, { backgroundColor: theme.surface }]}>
      <Text style={[streakStyles.title, { color: theme.text }]}>Days in a Row</Text>

      {/* Row: interleaved connectors between circles + oval pill */}
      <View style={streakStyles.row}>
        {days.map((day, i) => {
          const circleColor = day.isToday && !day.logged
            ? theme.primary
            : day.logged
            ? theme.accent
            : theme.border;
          const bgColor = day.logged ? theme.accent + '22' : theme.surfaceElevated;
          return (
            <Fragment key={day.dateStr}>
              {i > 0 && (
                <View style={[streakStyles.connector, { backgroundColor: theme.border }]} />
              )}
              <View style={streakStyles.dayWrapper}>
                <View style={[streakStyles.circle, { borderColor: circleColor, backgroundColor: bgColor }]}>
                  {day.logged ? (
                    <Check size={16} color={theme.accent} strokeWidth={3} />
                  ) : day.isToday ? (
                    <Text style={[streakStyles.circleText, { color: theme.primary }]}>?</Text>
                  ) : (
                    <Text style={[streakStyles.circleText, { color: theme.textMuted }]}>+</Text>
                  )}
                </View>
                <Text style={[streakStyles.dayLabel, { color: day.isToday ? theme.primary : theme.textMuted }]}>
                  {day.label}
                </Text>
              </View>
            </Fragment>
          );
        })}

        {/* Connector + oval streak count pill */}
        <View style={[streakStyles.connector, { backgroundColor: theme.border }]} />
        <View style={streakStyles.pillWrapper}>
          <View style={[streakStyles.countPill, { backgroundColor: theme.primary + '18', borderColor: theme.primary }]}>
            <Text style={[streakStyles.countText, { color: theme.primary }]}>{currentStreak}</Text>
          </View>
        </View>
      </View>

      <View style={[streakStyles.divider, { backgroundColor: theme.border }]} />
      <View style={streakStyles.longestRow}>
        <Text style={streakStyles.trophy}>🏆</Text>
        <Text style={[streakStyles.longestText, { color: theme.textSecondary }]}>
          Longest Chain: <Text style={{ color: theme.text, fontFamily: 'Poppins-Bold' }}>{longestStreak}</Text>
        </Text>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { moods, currentStreak, longestStreak } = useMood();
  const { journals } = useJournal();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const today = new Date().toISOString().split('T')[0];
  const todaysMood = moods.find((m) => m.date === today);

  const quote = DAILY_QUOTES[new Date().getDate() % DAILY_QUOTES.length];
  const recentJournal = journals[0];

  const quickActions = [
    { icon: Brain, label: 'Check-in', color: '#00C9A7', route: '/modal/mood-checkin' },
    { icon: Pencil, label: 'Journal', color: '#60A5FA', route: '/modal/journal-entry' },
    { icon: Wind, label: 'Breathe', color: '#FB923C', route: '/modal/discover' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.background, paddingTop: insets.top }}>
      <AppBackground />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: theme.text }]}>
            {getGreeting()} {user?.displayName?.split(' ')[0]}
          </Text>
          <Text style={[styles.date, { color: theme.textSecondary }]}>
            {new Date().toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.streakBadge, { backgroundColor: theme.surface }]}
          onPress={() => router.push('/(tabs)/stats')}
        >
          <Text style={styles.streakFire}>🔥</Text>
          <Text style={[styles.streakCount, { color: theme.text }]}>{currentStreak}</Text>
        </TouchableOpacity>
      </View>

      {/* Days in a Row streak card */}
      <DaysInARowCard moods={moods} currentStreak={currentStreak} longestStreak={longestStreak} />

      {/* Daily Quote */}
      <LinearGradient
        colors={[theme.primary, theme.primary + 'CC']}
        style={styles.quoteCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.quoteIcon}>✦</Text>
        <Text style={styles.quoteText}>&quot;{quote.text}&quot;</Text>
        <Text style={styles.quoteAuthor}>— {quote.author}</Text>
      </LinearGradient>

      {/* Today's Mood */}
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>TODAY&apos;S MOOD</Text>
        {todaysMood ? (
          <View style={styles.todayMood}>
            <MoodBadge mood={todaysMood.mood} size="lg" />
            {todaysMood.notes ? (
              <Text style={[styles.moodNote, { color: theme.textSecondary }]} numberOfLines={2}>
                &quot;{todaysMood.notes}&quot;
              </Text>
            ) : null}
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.moodCTA, { borderColor: theme.primary, borderStyle: 'dashed' }]}
            onPress={() => router.push('/modal/mood-tracker')}
          >
            <MoodFace mood="good" size={40} />
            <Text style={[styles.moodCTAText, { color: theme.primary }]}>How are you feeling today?</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Quick Actions */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Quick Actions</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.quickScroll}
        contentContainerStyle={styles.quickScrollContent}
      >
        {quickActions.map((a) => (
          <TouchableOpacity
            key={a.label}
            style={[styles.quickCard, { backgroundColor: theme.surface }]}
            onPress={() => router.push(a.route as any)}
          >
            <View style={[styles.quickIcon, { backgroundColor: a.color + '22' }]}>
              <a.icon size={22} color={a.color} />
            </View>
            <Text style={[styles.quickLabel, { color: theme.text }]}>{a.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Atara Chat Card */}
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={() => router.push('/modal/chat' as any)}
        style={styles.ataraCard}
      >
        <LinearGradient
          colors={[theme.primary, theme.accent]}
          style={styles.ataraGradient}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
        >
          <View style={styles.ataraLeft}>
            <Text style={styles.ataraTitle}>Chat with Atara</Text>
            <Text style={styles.ataraSubtitle}>Your AI mental wellness companion</Text>
          </View>
          <View style={styles.ataraIconWrap}>
            <MessageSquare size={30} color="rgba(255,255,255,0.9)" />
          </View>
        </LinearGradient>
      </TouchableOpacity>

      {/* Recent Journal */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Journal</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/journal')}>
          <Text style={[styles.seeAll, { color: theme.primary }]}>See all</Text>
        </TouchableOpacity>
      </View>

      {recentJournal ? (
        <TouchableOpacity
          style={[styles.journalCard, { backgroundColor: theme.surface }]}
          onPress={() => router.push({ pathname: '/modal/journal-entry', params: { id: recentJournal.id } })}
        >
          <View style={styles.journalCardHeader}>
            <Text style={[styles.journalTitle, { color: theme.text }]} numberOfLines={1}>
              {recentJournal.title}
            </Text>
            <MoodBadge mood={recentJournal.mood} showLabel={false} size="sm" />
          </View>
          <Text style={[styles.journalPreview, { color: theme.textSecondary }]} numberOfLines={2}>
            {recentJournal.body}
          </Text>
          <Text style={[styles.journalDate, { color: theme.textMuted }]}>
            {new Date(recentJournal.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.emptyState, { borderColor: theme.border }]}
          onPress={() => router.push('/modal/journal-entry')}
        >
          <Text style={styles.emptyEmoji}>📝</Text>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>Start your first journal entry</Text>
        </TouchableOpacity>
      )}

      {/* Discover Preview */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Discover</Text>
        <TouchableOpacity onPress={() => router.push('/modal/discover')}>
          <Text style={[styles.seeAll, { color: theme.primary }]}>See all</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.articlesScroll}>
        {ARTICLES.map((a) => (
          <TouchableOpacity key={a.id} style={styles.articleCard} onPress={() => router.push('/modal/discover')}>
            <Image source={{ uri: a.image }} style={styles.articleImage} />
            <View style={[styles.articleOverlay, { backgroundColor: a.color + 'AA' }]}>
              <Text style={styles.articleCat}>{a.category}</Text>
              <Text style={styles.articleTitle} numberOfLines={2}>{a.title}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const streakStyles = StyleSheet.create({
  card: {
    borderRadius: 16, padding: 16, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  title: { fontSize: 16, fontFamily: 'Poppins-Bold', marginBottom: 16 },
  // alignItems: 'flex-start' so connector marginTop aligns with circle center
  row: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14 },
  // connector sits at the midpoint of a 38px circle (marginTop: 18 = half of 38)
  connector: { flex: 1, height: 2, marginTop: 18 },
  dayWrapper: { alignItems: 'center', gap: 5 },
  circle: {
    width: 38, height: 38, borderRadius: 19, borderWidth: 2,
    justifyContent: 'center', alignItems: 'center',
  },
  circleText: { fontSize: 15, fontFamily: 'Poppins-Bold' },
  dayLabel: { fontSize: 11, fontFamily: 'Poppins-SemiBold' },
  // marginTop: 1 aligns the pill center (height 36) with the circle center (height 38)
  pillWrapper: { marginTop: 1 },
  countPill: {
    paddingHorizontal: 16, height: 36, borderRadius: 18, borderWidth: 2,
    minWidth: 62, justifyContent: 'center', alignItems: 'center',
  },
  countText: { fontSize: 18, fontFamily: 'Poppins-Bold' },
  divider: { height: 1, marginBottom: 10 },
  longestRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  trophy: { fontSize: 16 },
  longestText: { fontSize: 14, fontFamily: 'Poppins-SemiBold' },
});

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 110 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  greeting: { fontSize: 22, fontFamily: 'Poppins-Bold' },
  date: { fontSize: 14, fontFamily: 'Poppins-Regular', marginTop: 2 },
  streakBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  streakFire: { fontSize: 16 },
  streakCount: { fontSize: 15, fontFamily: 'Poppins-Bold' },
  card: {
    borderRadius: 16, padding: 16, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  sectionLabel: { fontSize: 11, fontFamily: 'Poppins-Bold', letterSpacing: 1, marginBottom: 12 },
  todayMood: { alignItems: 'center', paddingVertical: 8, gap: 12 },
  moodNote: { fontSize: 14, fontFamily: 'Poppins-Regular', fontStyle: 'italic', textAlign: 'center' },
  moodCTA: {
    borderWidth: 1.5, borderRadius: 12, padding: 20,
    alignItems: 'center', gap: 8,
  },
  moodCTAText: { fontSize: 15, fontFamily: 'Poppins-SemiBold' },
  sectionTitle: { fontSize: 18, fontFamily: 'Poppins-Bold', marginBottom: 12 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  seeAll: { fontSize: 14, fontFamily: 'Poppins-SemiBold' },
  quickScroll: { marginBottom: 12 },
  quickScrollContent: { paddingVertical: 10, paddingLeft: 4 },
  quickCard: {
    width: 125, marginRight: 12, borderRadius: 16, padding: 16,
    alignItems: 'flex-start', gap: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  quickIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  quickLabel: { fontSize: 14, fontFamily: 'Poppins-SemiBold' },
  ataraCard: {
    borderRadius: 20, overflow: 'hidden', marginBottom: 24,
    shadowColor: '#4C3BCF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 12, elevation: 6,
  },
  ataraGradient: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 18 },
  ataraLeft: { flex: 1, gap: 4 },
  ataraTitle: { color: '#FFFFFF', fontSize: 17, fontFamily: 'Poppins-Bold' },
  ataraSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontFamily: 'Poppins-Regular' },
  ataraIconWrap: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center',
  },
  journalCard: {
    borderRadius: 16, padding: 16, marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  journalCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  journalTitle: { fontSize: 16, fontFamily: 'Poppins-Bold', flex: 1, marginRight: 8 },
  journalPreview: { fontSize: 14, fontFamily: 'Poppins-Regular', lineHeight: 20, marginBottom: 8 },
  journalDate: { fontSize: 12, fontFamily: 'Poppins-Regular' },
  emptyState: {
    borderWidth: 1.5, borderStyle: 'dashed', borderRadius: 16, padding: 24,
    alignItems: 'center', gap: 8, marginBottom: 20,
  },
  emptyEmoji: { fontSize: 32 },
  emptyText: { fontSize: 14, fontFamily: 'Poppins-Regular' },
  quoteCard: { borderRadius: 20, padding: 24, marginBottom: 24 },
  quoteIcon: { color: 'rgba(255,255,255,0.6)', fontSize: 20, marginBottom: 8 },
  quoteText: { color: '#FFFFFF', fontSize: 16, fontFamily: 'Poppins-Regular', lineHeight: 26, marginBottom: 12 },
  quoteAuthor: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontFamily: 'Poppins-SemiBold' },
  articlesScroll: { marginBottom: 4 },
  articleCard: { width: 160, height: 110, borderRadius: 16, overflow: 'hidden', marginRight: 12 },
  articleImage: { width: '100%', height: '100%' },
  articleOverlay: {
    ...StyleSheet.absoluteFillObject, padding: 10, justifyContent: 'flex-end',
  },
  articleCat: { color: 'rgba(255,255,255,0.8)', fontSize: 10, fontFamily: 'Poppins-Bold', letterSpacing: 0.5, textTransform: 'uppercase' },
  articleTitle: { color: '#FFFFFF', fontSize: 13, fontFamily: 'Poppins-Bold' },
});
