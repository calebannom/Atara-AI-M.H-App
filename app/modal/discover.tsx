import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Play } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from 'expo-linking';
import { useTheme } from '@/context/ThemeContext';
import { DAILY_QUOTES, ARTICLES, VIDEOS } from '@/constants/mockData';

type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'idle';

const PHASE_DURATION: Record<BreathPhase, number> = {
  inhale: 4000,
  hold: 4000,
  exhale: 4000,
  idle: 0,
};

const PHASE_LABELS: Record<BreathPhase, string> = {
  inhale: 'Inhale',
  hold: 'Hold',
  exhale: 'Exhale',
  idle: 'Tap to begin',
};

function BreathingCircle() {
  const { theme } = useTheme();
  const [phase, setPhase] = useState<BreathPhase>('idle');
  const [running, setRunning] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runPhase = (p: BreathPhase) => {
    setPhase(p);
    const toScale = p === 'inhale' ? 1.5 : p === 'exhale' ? 1 : undefined;

    if (toScale !== undefined) {
      Animated.timing(scaleAnim, {
        toValue: toScale,
        duration: PHASE_DURATION[p],
        useNativeDriver: true,
      }).start();
    }

    timerRef.current = setTimeout(() => {
      const next: BreathPhase = p === 'inhale' ? 'hold' : p === 'hold' ? 'exhale' : 'inhale';
      runPhase(next);
    }, PHASE_DURATION[p]);
  };

  const toggleBreathing = () => {
    if (running) {
      setRunning(false);
      setPhase('idle');
      if (timerRef.current) clearTimeout(timerRef.current);
      Animated.timing(scaleAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    } else {
      setRunning(true);
      runPhase('inhale');
    }
  };

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const circleColor = phase === 'inhale' ? theme.accent : phase === 'hold' ? theme.primary : '#60A5FA';

  return (
    <View style={styles.breathingContainer}>
      <TouchableOpacity onPress={toggleBreathing} activeOpacity={0.9}>
        <Animated.View
          style={[
            styles.breathCircleOuter,
            { borderColor: circleColor + '44', transform: [{ scale: scaleAnim }] },
          ]}
        >
          <View style={[styles.breathCircleInner, { backgroundColor: circleColor + '33', borderColor: circleColor }]}>
            <Text style={[styles.breathPhaseText, { color: circleColor }]}>{PHASE_LABELS[phase]}</Text>
            {running && phase !== 'idle' && (
              <Text style={[styles.breathSeconds, { color: circleColor + 'AA' }]}>4s</Text>
            )}
          </View>
        </Animated.View>
      </TouchableOpacity>
      <Text style={[styles.breathHint, { color: theme.textMuted }]}>
        {running ? '4-4-4 breathing pattern' : 'Tap the circle to start'}
      </Text>
    </View>
  );
}

export default function DiscoverModal() {
  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const quote = DAILY_QUOTES[new Date().getDate() % DAILY_QUOTES.length];

  return (
    <View style={{ flex: 1, backgroundColor: theme.background, paddingTop: insets.top }}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Discover</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <X size={24} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Daily Quote */}
        <LinearGradient
          colors={[theme.primary, theme.primary + 'BB']}
          style={styles.quoteCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.quoteIcon}>✦</Text>
          <Text style={styles.quoteText}>&quot;{quote.text}&quot;</Text>
          <Text style={styles.quoteAuthor}>— {quote.author}</Text>
        </LinearGradient>

        {/* Breathing Exercise */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Breathing Exercise</Text>
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          <BreathingCircle />
        </View>

        {/* Articles */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Articles</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hScroll}>
          {ARTICLES.map((a) => (
            <TouchableOpacity
              key={a.id}
              style={styles.articleCard}
              activeOpacity={0.8}
              onPress={() => Linking.openURL(a.url)}
            >
              <Image source={{ uri: a.image }} style={styles.articleImg} />
              <View style={[styles.articleOverlay, { backgroundColor: a.color + 'CC' }]}>
                <Text style={styles.articleCat}>{a.category}</Text>
                <Text style={styles.articleTitle} numberOfLines={2}>{a.title}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Videos */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Videos</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hScroll}>
          {VIDEOS.map((v) => (
            <TouchableOpacity 
              key={v.id} 
              style={styles.videoCard}
              activeOpacity={0.8}
              onPress={() => Linking.openURL(v.url)}
            >
              <Image source={{ uri: v.image }} style={styles.videoImg} />
              <View style={[styles.videoOverlay, { backgroundColor: 'rgba(0,0,0,0.45)' }]}>
                <View style={styles.playBtn}>
                  <Play size={18} color="#FFFFFF" fill="#FFFFFF" />
                </View>
                <Text style={styles.videoTitle} numberOfLines={2}>{v.title}</Text>
                <Text style={styles.videoDuration}>{v.duration}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

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
  quoteCard: { borderRadius: 20, padding: 24, marginBottom: 24 },
  quoteIcon: { color: 'rgba(255,255,255,0.6)', fontSize: 20, marginBottom: 8 },
  quoteText: { color: '#FFFFFF', fontSize: 16, fontFamily: 'Poppins-Regular', lineHeight: 26, marginBottom: 12 },
  quoteAuthor: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontFamily: 'Poppins-SemiBold' },
  sectionTitle: { fontSize: 18, fontFamily: 'Poppins-Bold', marginBottom: 14 },
  card: { borderRadius: 16, padding: 20, marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  breathingContainer: { alignItems: 'center', paddingVertical: 20, gap: 20 },
  breathCircleOuter: { width: 160, height: 160, borderRadius: 80, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
  breathCircleInner: { width: 120, height: 120, borderRadius: 60, borderWidth: 2, justifyContent: 'center', alignItems: 'center', gap: 4 },
  breathPhaseText: { fontSize: 18, fontFamily: 'Poppins-Bold' },
  breathSeconds: { fontSize: 13, fontFamily: 'Poppins-Regular' },
  breathHint: { fontSize: 13, fontFamily: 'Poppins-Regular' },
  hScroll: { marginBottom: 24 },
  articleCard: { width: 180, height: 120, borderRadius: 16, overflow: 'hidden', marginRight: 12 },
  articleImg: { width: '100%', height: '100%' },
  articleOverlay: { ...StyleSheet.absoluteFillObject, padding: 12, justifyContent: 'flex-end' },
  articleCat: { color: 'rgba(255,255,255,0.8)', fontSize: 10, fontFamily: 'Poppins-Bold', textTransform: 'uppercase', letterSpacing: 0.5 },
  articleTitle: { color: '#FFFFFF', fontSize: 13, fontFamily: 'Poppins-Bold' },
  videoCard: { width: 200, height: 130, borderRadius: 16, overflow: 'hidden', marginRight: 12 },
  videoImg: { width: '100%', height: '100%' },
  videoOverlay: { ...StyleSheet.absoluteFillObject, padding: 12, justifyContent: 'space-between' },
  playBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center' },
  videoTitle: { color: '#FFFFFF', fontSize: 13, fontFamily: 'Poppins-Bold' },
  videoDuration: { color: 'rgba(255,255,255,0.7)', fontSize: 11, fontFamily: 'Poppins-Regular' },
});

