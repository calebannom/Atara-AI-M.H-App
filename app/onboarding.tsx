import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path, Rect, Line } from 'react-native-svg';
import { useVideoPlayer, VideoView } from 'expo-video';
import { ArrowRight } from 'lucide-react-native';
import storage from '@/utils/storage';

const { width, height } = Dimensions.get('window');

// ─── SVG Illustrations ────────────────────────────────────────────────────────

function MoodIllustration() {
  return (
    <Svg width={240} height={240} viewBox="0 0 240 240">
      {/* Outer dashed orbit */}
      <Circle cx={120} cy={120} r={108}
        stroke="rgba(255,255,255,0.1)" strokeWidth={1} strokeDasharray="6 5" fill="none" />
      {/* Middle ring */}
      <Circle cx={120} cy={120} r={80}
        stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} fill="none" />
      {/* Glow core */}
      <Circle cx={120} cy={120} r={58} fill="rgba(255,255,255,0.14)" />
      <Circle cx={120} cy={120} r={58}
        stroke="rgba(255,255,255,0.38)" strokeWidth={2} fill="none" />
      {/* Mood orbs at 120° apart on middle ring (r=80) */}
      {/* Top (270°): (120, 40) */}
      <Circle cx={120} cy={40} r={20} fill="#00C9A7" />
      <Circle cx={120} cy={40} r={20} stroke="rgba(255,255,255,0.55)" strokeWidth={2} fill="none" />
      {/* Bottom-left (150°): (51, 160) */}
      <Circle cx={51} cy={160} r={16} fill="#4ADE80" />
      <Circle cx={51} cy={160} r={16} stroke="rgba(255,255,255,0.55)" strokeWidth={2} fill="none" />
      {/* Bottom-right (30°): (189, 160) */}
      <Circle cx={189} cy={160} r={16} fill="#60A5FA" />
      <Circle cx={189} cy={160} r={16} stroke="rgba(255,255,255,0.55)" strokeWidth={2} fill="none" />
      {/* Face */}
      <Circle cx={107} cy={113} r={5} fill="rgba(255,255,255,0.9)" />
      <Circle cx={133} cy={113} r={5} fill="rgba(255,255,255,0.9)" />
      <Path d="M 104 130 Q 120 144 136 130"
        stroke="rgba(255,255,255,0.9)" strokeWidth={3.5} strokeLinecap="round" fill="none" />
    </Svg>
  );
}

function InsightsIllustration() {
  const bars = [42, 67, 46, 84, 60, 92, 72];
  const barW = 18;
  const gap = 12;
  const totalW = bars.length * (barW + gap) - gap;
  const startX = (240 - totalW) / 2;
  const maxH = 90;
  const baseY = 172;

  const pts = bars.map((h, i) => ({
    x: startX + i * (barW + gap) + barW / 2,
    y: baseY - (h / 100) * maxH,
  }));
  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <Svg width={240} height={220} viewBox="0 0 240 220">
      {/* Decorative rings */}
      <Circle cx={120} cy={95} r={85} fill="rgba(255,255,255,0.06)" />
      <Circle cx={120} cy={95} r={56} fill="rgba(255,255,255,0.06)" />
      {/* Bars */}
      {bars.map((h, i) => {
        const x = startX + i * (barW + gap);
        const bh = (h / 100) * maxH;
        return (
          <Rect key={i} x={x} y={baseY - bh} width={barW} height={bh} rx={7}
            fill={i === 5 ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.22)'} />
        );
      })}
      {/* Baseline */}
      <Line x1={startX - 6} y1={baseY} x2={startX + totalW + 6} y2={baseY}
        stroke="rgba(255,255,255,0.22)" strokeWidth={1} />
      {/* Trend line */}
      <Path d={linePath} stroke="rgba(255,255,255,0.82)" strokeWidth={2.5}
        fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* Dots */}
      {pts.map((p, i) => (
        <Circle key={i} cx={p.x} cy={p.y} r={i === 5 ? 7 : 4}
          fill="white" opacity={i === 5 ? 1 : 0.65} />
      ))}
    </Svg>
  );
}

function SupportIllustration() {
  return (
    <Svg width={240} height={210} viewBox="0 0 240 210">
      {/* Main chat bubble */}
      <Rect x={16} y={14} width={158} height={110} rx={28} fill="rgba(255,255,255,0.88)" />
      {/* Bubble tail */}
      <Path d="M 34 122 L 16 152 L 76 122 Z" fill="rgba(255,255,255,0.88)" />
      {/* Heart */}
      <Path
        d="M 95 76 C 95 69 86 62 79 67 C 72 72 72 82 82 90 L 95 102 L 108 90 C 118 82 118 72 111 67 C 104 62 95 69 95 76 Z"
        fill="#F87171"
      />
      {/* Reply bubble */}
      <Rect x={110} y={150} width={114} height={50} rx={22} fill="rgba(255,255,255,0.28)" />
      {/* Typing dots */}
      <Circle cx={136} cy={175} r={6} fill="rgba(255,255,255,0.9)" />
      <Circle cx={160} cy={175} r={6} fill="rgba(255,255,255,0.65)" />
      <Circle cx={184} cy={175} r={6} fill="rgba(255,255,255,0.4)" />
      {/* Sparkle top-right */}
      <Path
        d="M 200 40 L 203 49 L 212 49 L 205 54 L 207 63 L 200 58 L 193 63 L 195 54 L 188 49 L 197 49 Z"
        fill="rgba(255,255,255,0.55)"
      />
      {/* Small sparkle bottom-left */}
      <Path
        d="M 20 166 L 22 173 L 29 173 L 24 177 L 26 184 L 20 180 L 14 184 L 16 177 L 11 173 L 18 173 Z"
        fill="rgba(255,255,255,0.35)"
      />
    </Svg>
  );
}

// ─── Slide data ───────────────────────────────────────────────────────────────

type FeatureSlide = {
  key: string;
  type: 'feature';
  tag: string;
  gradient: string[];
  title: string;
  subtitle: string;
  Illustration: React.FC;
};

type SlideItem = { key: string; type: 'video' } | FeatureSlide;

const SLIDES: SlideItem[] = [
  { key: 'video', type: 'video' },
  {
    key: 'mood',
    type: 'feature',
    tag: '01 · Feel',
    gradient: ['#1A1070', '#4C3BCF', '#7C6FE0'],
    title: 'Know how\nyou feel',
    subtitle: 'Log your mood in seconds — capture activities, notes, and stay honest with yourself every single day.',
    Illustration: MoodIllustration,
  },
  {
    key: 'insights',
    type: 'feature',
    tag: '02 · Grow',
    gradient: ['#004D3D', '#00A080', '#00C9A7'],
    title: 'Patterns\nthat matter',
    subtitle: 'Discover what lifts you up and what holds you back. Your emotional history, beautifully visualised.',
    Illustration: InsightsIllustration,
  },
  {
    key: 'support',
    type: 'feature',
    tag: '03 · Connect',
    gradient: ['#3A0E80', '#7C3AED', '#A78BFA'],
    title: 'Support,\nalways here',
    subtitle: 'Chat with Atara any time — day or night. Guided reflections and a companion that truly listens.',
    Illustration: SupportIllustration,
  },
];

// ─── Main component ───────────────────────────────────────────────────────────

export default function Onboarding() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const player = useVideoPlayer(require('../assets/Animation/Loading screen.mp4'), (p) => {
    p.loop = true;
    p.play();
  });

  const finish = async () => {
    await storage.setItem('atara_onboarded', 'true');
    router.replace('/login');
  };

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      const next = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: next, animated: true });
      setCurrentIndex(next);
    } else {
      finish();
    }
  };

  const isVideo = currentIndex === 0;
  const isLast  = currentIndex === SLIDES.length - 1;

  return (
    <View style={styles.root}>
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.key}
        onMomentumScrollEnd={(e) => {
          setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width));
        }}
        renderItem={({ item }) => {
          if (item.type === 'video') {
            return (
              <View style={[styles.slide, { backgroundColor: '#FFFFFF' }]}>
                <VideoView
                  style={styles.videoPlayer}
                  player={player}
                  nativeControls={false}
                  contentFit="contain"
                />
              </View>
            );
          }

          const { tag, gradient, title, subtitle, Illustration } = item as FeatureSlide;

          return (
            <LinearGradient
              colors={gradient as [string, string, string]}
              style={styles.slide}
              start={{ x: 0.15, y: 0 }}
              end={{ x: 0.85, y: 1 }}
            >
              {/* Decorative background blobs */}
              <View style={styles.blobTR} />
              <View style={styles.blobBL} />

              {/* Status-bar spacer */}
              <View style={{ height: insets.top + 16 }} />

              {/* Illustration */}
              <View style={styles.illustrationWrap}>
                <Illustration />
              </View>

              {/* Text content */}
              <View style={styles.textWrap}>
                <View style={styles.tagPill}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
              </View>
            </LinearGradient>
          );
        }}
      />

      {/* ── Footer ── */}
      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom + 8, 28) },
          isVideo && styles.footerOnWhite,
        ]}
      >
        {/* Dots */}
        <View style={styles.dotsRow}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  width: i === currentIndex ? 28 : 8,
                  backgroundColor: isVideo
                    ? (i === currentIndex ? '#4C3BCF' : '#C5C0E8')
                    : (i === currentIndex ? '#FFFFFF' : 'rgba(255,255,255,0.4)'),
                },
              ]}
            />
          ))}
        </View>

        {/* Buttons */}
        <View style={styles.btnRow}>
          {/* Left: Skip or spacer */}
          {!isLast ? (
            <TouchableOpacity onPress={finish} hitSlop={10} style={styles.skipBtn}>
              <Text style={[styles.skipText, { color: isVideo ? '#6B6B8A' : 'rgba(255,255,255,0.75)' }]}>
                Skip
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.skipBtn} />
          )}

          {/* Right: Next / Continue / Get Started */}
          <TouchableOpacity
            onPress={handleNext}
            activeOpacity={0.85}
            style={[
              styles.nextBtn,
              isVideo && styles.nextBtnSolid,
              isLast && styles.nextBtnWhite,
            ]}
          >
            <Text
              style={[
                styles.nextText,
                isLast && styles.nextTextDark,
              ]}
            >
              {isLast ? 'Get Started' : isVideo ? 'Begin' : 'Next'}
            </Text>
            {!isLast && <ArrowRight size={17} color="#FFF" strokeWidth={2.5} />}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1 },

  slide: { width, height },

  videoPlayer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
  },

  // Decorative blobs
  blobTR: {
    position: 'absolute',
    top: -90,
    right: -90,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  blobBL: {
    position: 'absolute',
    bottom: height * 0.22,
    left: -70,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },

  // Illustration
  illustrationWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Text
  textWrap: {
    paddingHorizontal: 32,
    paddingBottom: 140,
    paddingTop: 4,
  },
  tagPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  tagText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
    letterSpacing: 0.5,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 38,
    fontFamily: 'Poppins-Bold',
    lineHeight: 46,
    marginBottom: 14,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    lineHeight: 24,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 28,
    paddingTop: 16,
  },
  footerOnWhite: {},

  // Dots
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },

  // Buttons
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipBtn: {
    paddingVertical: 14,
    paddingRight: 12,
    minWidth: 60,
  },
  skipText: {
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.38)',
    borderRadius: 32,
    paddingHorizontal: 28,
    paddingVertical: 14,
    minWidth: 130,
    justifyContent: 'center',
  },
  nextBtnSolid: {
    backgroundColor: '#4C3BCF',
    borderColor: 'transparent',
  },
  nextBtnWhite: {
    backgroundColor: '#FFFFFF',
    borderColor: 'transparent',
    minWidth: 160,
  },
  nextText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Poppins-Bold',
  },
  nextTextDark: {
    color: '#4C3BCF',
  },
});
