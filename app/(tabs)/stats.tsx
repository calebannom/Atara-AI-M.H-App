import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useMood } from '@/context/MoodContext';
import { moodColors, moodLabels, MoodLevel } from '@/constants/theme';
import MoodFace from '@/components/MoodFace';
import AchievementBadge from '@/components/AchievementBadge';
import { ACHIEVEMENTS } from '@/constants/achievements';
import AppBackground from '@/components/AppBackground';

const MOOD_SCORE: Record<MoodLevel, number> = { rad: 5, good: 4, meh: 3, bad: 2, awful: 1 };
const MOODS: MoodLevel[] = ['rad', 'good', 'meh', 'bad', 'awful'];
const DAY_HEADERS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function MoodCalendar() {
  const { theme } = useTheme();
  const { moods } = useMood();
  const [monthOffset, setMonthOffset] = useState(0);

  const today = new Date();
  const viewDate = new Date(today.getFullYear(), today.getMonth() - monthOffset, 1);
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthLabel = viewDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const moodMap = useMemo(() => {
    const map: Record<string, MoodLevel> = {};
    moods.forEach((m) => { map[m.date] = m.mood; });
    return map;
  }, [moods]);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDow = new Date(year, month, 1).getDay();
  const todayStr = today.toISOString().split('T')[0];

  const cells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <StatCard>
      <View style={styles.cardHeader}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>Mood Calendar</Text>
        <View style={styles.calNav}>
          <TouchableOpacity
            onPress={() => setMonthOffset((o) => o + 1)}
            hitSlop={8}
          >
            <ChevronLeft size={20} color={theme.textSecondary} />
          </TouchableOpacity>
          <Text style={[styles.calMonth, { color: theme.textSecondary }]}>{monthLabel}</Text>
          <TouchableOpacity
            onPress={() => setMonthOffset((o) => Math.max(0, o - 1))}
            hitSlop={8}
            style={{ opacity: monthOffset === 0 ? 0.3 : 1 }}
            disabled={monthOffset === 0}
          >
            <ChevronRight size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Day headers */}
      <View style={styles.calDayHeaders}>
        {DAY_HEADERS.map((d) => (
          <Text key={d} style={[styles.calDayHeader, { color: theme.textMuted }]}>{d}</Text>
        ))}
      </View>

      {/* Day grid */}
      <View style={styles.calGrid}>
        {cells.map((day, i) => {
          if (!day) return <View key={`e-${i}`} style={styles.calCell} />;
          const dateStr = `${year}-${pad(month + 1)}-${pad(day)}`;
          const isToday = dateStr === todayStr;
          const mood = moodMap[dateStr];
          return (
            <View
              key={dateStr}
              style={[
                styles.calCell,
                mood
                  ? { backgroundColor: moodColors[mood] + '55' }
                  : { backgroundColor: theme.inputBg },
                isToday && { borderWidth: 2, borderColor: theme.primary },
              ]}
            >
              <Text
                style={[
                  styles.calDayNum,
                  { color: mood ? moodColors[mood] : theme.textMuted },
                  isToday && { fontFamily: 'Poppins-Bold', color: theme.primary },
                ]}
              >
                {day}
              </Text>
              {mood ? <View style={[styles.calDot, { backgroundColor: moodColors[mood] }]} /> : null}
            </View>
          );
        })}
      </View>

      {/* Legend */}
      <View style={styles.calLegend}>
        {MOODS.map((m) => (
          <View key={m} style={styles.calLegendItem}>
            <View style={[styles.calLegendDot, { backgroundColor: moodColors[m] }]} />
            <Text style={[styles.calLegendText, { color: theme.textMuted }]}>{moodLabels[m]}</Text>
          </View>
        ))}
      </View>
    </StatCard>
  );
}

function StatCard({ children, style }: { children: React.ReactNode; style?: object }) {
  const { theme } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: theme.surface }, style]}>
      {children}
    </View>
  );
}

const SCORE_TO_MOOD: Record<number, MoodLevel> = { 5: 'rad', 4: 'good', 3: 'meh', 2: 'bad', 1: 'awful' };

function HorizontalBarChart({ data }: { data: { mood: MoodLevel; value: number; color: string }[] }) {
  const { theme } = useTheme();
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <View style={styles.hBarChart}>
      {data.map((item) => (
        <View key={item.mood} style={styles.hBarRow}>
          <MoodFace mood={item.mood} size={26} />
          <View style={[styles.hBarTrack, { backgroundColor: theme.border }]}>
            <View
              style={[
                styles.hBarFill,
                { width: `${(item.value / max) * 100}%`, backgroundColor: item.color },
              ]}
            />
          </View>
          <Text style={[styles.hBarValue, { color: item.color }]}>{item.value}</Text>
        </View>
      ))}
    </View>
  );
}

function MoodLineChart({ data, color }: { data: { day: string; score: number }[]; color: string }) {
  const { theme } = useTheme();
  const chartW = 280;
  const chartH = 96;
  const FACE = 22;
  const PAD_H = FACE / 2 + 4;
  const PAD_V = FACE / 2 + 2;

  const validCount = data.filter((d) => d.score > 0).length;
  if (validCount < 2) {
    return (
      <View style={{ height: chartH + 24, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={[styles.lineLabelText, { color: theme.textMuted }]}>Not enough data yet</Text>
      </View>
    );
  }

  const pts = data.map((d, i) => {
    const x = data.length > 1
      ? (i / (data.length - 1)) * (chartW - 2 * PAD_H) + PAD_H
      : chartW / 2;
    const y = d.score > 0
      ? PAD_V + ((5 - d.score) / 4) * (chartH - 2 * PAD_V)
      : null;
    return { ...d, x, y };
  });

  const validPts = pts.filter((p): p is typeof p & { y: number } => p.y !== null);
  const linePath = validPts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <View>
      <View style={{ width: chartW, height: chartH }}>
        <Svg width={chartW} height={chartH} style={{ position: 'absolute', top: 0, left: 0 }}>
          <Path d={linePath} stroke={color + '70'} strokeWidth={2.5}
            fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
        {validPts.map((p, i) => (
          <View key={i} style={{ position: 'absolute', left: p.x - FACE / 2, top: p.y - FACE / 2 }}>
            <MoodFace mood={SCORE_TO_MOOD[p.score]} size={FACE} />
          </View>
        ))}
      </View>
      <View style={styles.lineLabels}>
        {pts.filter((_, i) => i % 2 === 0).map((p) => (
          <Text key={p.day} style={[styles.lineLabelText, { color: theme.textMuted }]}>{p.day}</Text>
        ))}
      </View>
    </View>
  );
}

function MoodArcChart({ moodCounts }: { moodCounts: Record<MoodLevel, number> }) {
  const { theme } = useTheme();
  const total = MOODS.reduce((s, m) => s + moodCounts[m], 0);

  const cx = 140, cy = 152, R = 118, r = 76;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const pt = (radius: number, deg: number) => ({
    x: +(cx + radius * Math.cos(toRad(deg))).toFixed(3),
    y: +(cy + radius * Math.sin(toRad(deg))).toFixed(3),
  });

  const bgPath = [
    `M ${pt(R, 180).x} ${pt(R, 180).y}`,
    `A ${R} ${R} 0 0 1 ${pt(R, 360).x} ${pt(R, 360).y}`,
    `L ${pt(r, 360).x} ${pt(r, 360).y}`,
    `A ${r} ${r} 0 0 0 ${pt(r, 180).x} ${pt(r, 180).y}`,
    'Z',
  ].join(' ');

  let cumAngle = 0;
  const segments = MOODS.map((mood) => {
    const count = moodCounts[mood];
    if (!count || !total) return null;
    const sweepDeg = (count / total) * 180;
    const startDeg = 180 + cumAngle;
    const endDeg = startDeg + sweepDeg;
    cumAngle += sweepDeg;
    const oS = pt(R, startDeg), oE = pt(R, endDeg);
    const iE = pt(r, endDeg),   iS = pt(r, startDeg);
    const large = sweepDeg > 180 ? 1 : 0;
    const d = [
      `M ${oS.x} ${oS.y}`,
      `A ${R} ${R} 0 ${large} 1 ${oE.x} ${oE.y}`,
      `L ${iE.x} ${iE.y}`,
      `A ${r} ${r} 0 ${large} 0 ${iS.x} ${iS.y}`,
      'Z',
    ].join(' ');
    return { mood, d };
  }).filter(Boolean);

  return (
    <View>
      <View style={{ position: 'relative', width: 280, height: 155, alignSelf: 'center' }}>
        <Svg width={280} height={155} viewBox="0 0 280 155">
          <Path d={bgPath} fill={theme.border} />
          {segments.map((seg) => seg && (
            <Path key={seg.mood} d={seg.d} fill={moodColors[seg.mood as MoodLevel]} />
          ))}
        </Svg>
        <View style={styles.arcCenter}>
          <Text style={[styles.arcTotal, { color: theme.text }]}>{total}</Text>
          <Text style={[styles.arcTotalSub, { color: theme.textMuted }]}>entries</Text>
        </View>
      </View>

      <View style={[styles.arcDivider, { backgroundColor: theme.border }]} />

      <View style={styles.arcRow}>
        {MOODS.map((m) => (
          <View key={m} style={styles.arcItem}>
            <View>
              <MoodFace mood={m} size={38} />
              <View style={[styles.arcBadge, { backgroundColor: moodColors[m] }]}>
                <Text style={styles.arcBadgeText}>{moodCounts[m]}</Text>
              </View>
            </View>
            <Text style={[styles.arcLabel, { color: theme.textMuted }]}>{moodLabels[m]}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function StatsScreen() {
  const { theme } = useTheme();
  const { moods, currentStreak, longestStreak } = useMood();
  const router = useRouter();
  const [chartType, setChartType] = useState<'line' | 'bar'>('bar');
  const insets = useSafeAreaInsets();

  const stats = useMemo(() => {
    const moodCounts: Record<MoodLevel, number> = { rad: 0, good: 0, meh: 0, bad: 0, awful: 0 };
    const activityCounts: Record<string, number> = {};
    let totalScore = 0;

    moods.forEach((m) => {
      moodCounts[m.mood]++;
      totalScore += MOOD_SCORE[m.mood];
      m.activities.forEach((a) => {
        activityCounts[a] = (activityCounts[a] || 0) + 1;
      });
    });

    const avg = moods.length ? totalScore / moods.length : 0;

    const last7 = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dateStr = d.toISOString().split('T')[0];
      const dayMood = moods.find((m) => m.date === dateStr);
      return {
        day: d.toLocaleDateString('en', { weekday: 'short' }).slice(0, 2),
        score: dayMood ? MOOD_SCORE[dayMood.mood] : 0,
      };
    });

    const topActivities = Object.entries(activityCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8);

    return { moodCounts, avg, last7, topActivities };
  }, [moods]);

  const moodBarData = MOODS.map((m) => ({
    mood: m,
    value: stats.moodCounts[m],
    color: moodColors[m],
  }));


  return (
    <View style={{ flex: 1, backgroundColor: theme.background, paddingTop: insets.top }}>
      <AppBackground />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
      <Text style={[styles.pageTitle, { color: theme.text }]}>Your Insights</Text>

      {/* Streak */}
      <StatCard>
        <View style={styles.streakRow}>
          <View>
            <Text style={[styles.bigNumber, { color: theme.primary }]}>{currentStreak}</Text>
            <Text style={[styles.bigLabel, { color: theme.textSecondary }]}>Days in a Row 🔥</Text>
          </View>
          <View style={[styles.streakBadge, { backgroundColor: theme.primary + '22' }]}>
            <Text style={[styles.streakBadgeText, { color: theme.primary }]}>Current Streak</Text>
          </View>
        </View>
      </StatCard>

      {/* Mood Calendar */}
      <MoodCalendar />

      {/* Mood Chart */}
      <StatCard>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Mood Trend</Text>
          <View style={[styles.toggle, { backgroundColor: theme.inputBg }]}>
            <TouchableOpacity
              style={[styles.toggleBtn, chartType === 'bar' && { backgroundColor: theme.primary }]}
              onPress={() => setChartType('bar')}
            >
              <Text style={[styles.toggleText, { color: chartType === 'bar' ? '#fff' : theme.textSecondary }]}>Bar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleBtn, chartType === 'line' && { backgroundColor: theme.primary }]}
              onPress={() => setChartType('line')}
            >
              <Text style={[styles.toggleText, { color: chartType === 'line' ? '#fff' : theme.textSecondary }]}>Line</Text>
            </TouchableOpacity>
          </View>
        </View>
        {chartType === 'bar' ? (
          <HorizontalBarChart data={moodBarData} />
        ) : (
          <MoodLineChart data={stats.last7} color={theme.primary} />
        )}
      </StatCard>

      {/* Achievements */}
      <StatCard>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Achievements</Text>
          <Text style={[styles.achCount, { color: theme.textSecondary }]}>
            {ACHIEVEMENTS.filter((a) => a.unlocked).length}/{ACHIEVEMENTS.length}
          </Text>
        </View>
        <View style={styles.achGrid}>
          {ACHIEVEMENTS.map((a) => (
            <TouchableOpacity
              key={a.id}
              activeOpacity={0.75}
              onPress={() => router.push({ pathname: '/modal/achievement', params: { id: String(a.id) } })}
              style={[
                styles.achBadge,
                {
                  backgroundColor: a.unlocked ? a.color + '14' : theme.inputBg,
                  borderColor: a.unlocked ? a.color + '60' : theme.border,
                },
              ]}
            >
              <AchievementBadge icon={a.icon} color={a.color} size={62} unlocked={a.unlocked} />
              <Text style={[styles.achTitle, { color: theme.text }]}>{a.title}</Text>
              <Text style={[styles.achDesc, { color: theme.textMuted }]}>{a.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </StatCard>

      {/* Mood Distribution */}
      <StatCard>
        <Text style={[styles.cardTitle, { color: theme.text, marginBottom: 16 }]}>Mood Distribution</Text>
        <MoodArcChart moodCounts={stats.moodCounts} />
      </StatCard>

      {/* Activity Grid */}
      <StatCard>
        <Text style={[styles.cardTitle, { color: theme.text }]}>Activity Count</Text>
        {stats.topActivities.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🏃</Text>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No activities logged yet</Text>
          </View>
        ) : (
          <View style={styles.activityGrid}>
            {stats.topActivities.map(([act, count]) => (
              <View key={act} style={[styles.activityItem, { backgroundColor: theme.inputBg }]}>
                <Text style={[styles.activityName, { color: theme.text }]}>{act}</Text>
                <Text style={[styles.activityCount, { color: theme.primary }]}>{count}×</Text>
              </View>
            ))}
          </View>
        )}
      </StatCard>

      {/* Average Daily Mood */}
      <StatCard>
        <Text style={[styles.cardTitle, { color: theme.text }]}>Average Daily Mood</Text>
        <View style={styles.avgRow}>
          <Text style={[styles.avgScore, { color: theme.accent }]}>{stats.avg.toFixed(1)}</Text>
          <Text style={[styles.avgMax, { color: theme.textMuted }]}>/5.0</Text>
        </View>
        <View style={[styles.avgBar, { backgroundColor: theme.border }]}>
          <View style={[styles.avgFill, { width: `${(stats.avg / 5) * 100}%`, backgroundColor: theme.accent }]} />
        </View>
      </StatCard>

      <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 110 },
  pageTitle: { fontSize: 26, fontFamily: 'Poppins-Bold', marginBottom: 20 },
  card: {
    borderRadius: 16, padding: 20, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  cardTitle: { fontSize: 16, fontFamily: 'Poppins-Bold' },
  streakRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bigNumber: { fontSize: 48, fontFamily: 'Poppins-Bold', lineHeight: 52 },
  bigLabel: { fontSize: 14, fontFamily: 'Poppins-SemiBold' },
  streakBadge: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  streakBadgeText: { fontSize: 13, fontFamily: 'Poppins-Bold' },
  toggle: { flexDirection: 'row', borderRadius: 8, overflow: 'hidden' },
  toggleBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  toggleText: { fontSize: 13, fontFamily: 'Poppins-SemiBold' },
  // Horizontal bar chart
  hBarChart: { gap: 10, marginTop: 4 },
  hBarRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  hBarTrack: { flex: 1, height: 16, borderRadius: 8, overflow: 'hidden' },
  hBarFill: { height: '100%', borderRadius: 8 },
  hBarValue: { fontSize: 13, fontFamily: 'Poppins-Bold', width: 22, textAlign: 'right' },
  // Line chart
  lineLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  lineLabelText: { fontSize: 10, fontFamily: 'Poppins-Regular' },
  // Arc chart
  arcCenter: { position: 'absolute', left: 0, right: 0, top: 86, alignItems: 'center' },
  arcTotal: { fontSize: 36, fontFamily: 'Poppins-Bold', lineHeight: 40 },
  arcTotalSub: { fontSize: 11, fontFamily: 'Poppins-Regular', marginTop: 2 },
  arcDivider: { height: 1, marginVertical: 14 },
  arcRow: { flexDirection: 'row', justifyContent: 'space-around' },
  arcItem: { alignItems: 'center', gap: 6 },
  arcBadge: {
    position: 'absolute', top: -4, right: -6,
    width: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center',
  },
  arcBadgeText: { color: '#FFF', fontSize: 10, fontFamily: 'Poppins-Bold' },
  arcLabel: { fontSize: 11, fontFamily: 'Poppins-Regular' },
  achCount: { fontSize: 14, fontFamily: 'Poppins-SemiBold' },
  achGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  achBadge: { width: '30%', borderRadius: 16, borderWidth: 1, padding: 10, alignItems: 'center', gap: 6 },
  achTitle: { fontSize: 11, fontFamily: 'Poppins-Bold', textAlign: 'center' },
  achDesc: { fontSize: 9, fontFamily: 'Poppins-Regular', textAlign: 'center' },
  activityGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  activityItem: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 6 },
  activityName: { fontSize: 13, fontFamily: 'Poppins-Regular' },
  activityCount: { fontSize: 13, fontFamily: 'Poppins-Bold' },
  avgRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4, marginBottom: 12 },
  avgScore: { fontSize: 40, fontFamily: 'Poppins-Bold' },
  avgMax: { fontSize: 18, fontFamily: 'Poppins-Regular' },
  avgBar: { height: 10, borderRadius: 5, overflow: 'hidden' },
  avgFill: { height: '100%', borderRadius: 5 },
  empty: { alignItems: 'center', padding: 20, gap: 8 },
  emptyEmoji: { fontSize: 32 },
  emptyText: { fontSize: 14, fontFamily: 'Poppins-Regular' },
  // Calendar
  calNav: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  calMonth: { fontSize: 12, fontFamily: 'Poppins-SemiBold' },
  calDayHeaders: { flexDirection: 'row', marginBottom: 6 },
  calDayHeader: { flex: 1, textAlign: 'center', fontSize: 11, fontFamily: 'Poppins-Bold' },
  calGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  calCell: {
    width: `${100 / 7}%`, aspectRatio: 1,
    borderRadius: 8, alignItems: 'center', justifyContent: 'center', padding: 2,
  },
  calDayNum: { fontSize: 11, fontFamily: 'Poppins-Regular' },
  calDot: { width: 4, height: 4, borderRadius: 2, marginTop: 1 },
  calLegend: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14, justifyContent: 'center' },
  calLegendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  calLegendDot: { width: 8, height: 8, borderRadius: 4 },
  calLegendText: { fontSize: 11, fontFamily: 'Poppins-Regular' },
});
