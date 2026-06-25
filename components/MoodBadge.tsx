import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { moodColors, moodLabels, MoodLevel } from '@/constants/theme';
import MoodFace from '@/components/MoodFace';

type Props = { mood: MoodLevel; showLabel?: boolean; size?: 'sm' | 'md' | 'lg' };

export default function MoodBadge({ mood, showLabel = true, size = 'md' }: Props) {
  const faceSize = size === 'sm' ? 24 : size === 'md' ? 36 : 52;
  const lfs = size === 'sm' ? 10 : size === 'md' ? 12 : 14;

  return (
    <View style={styles.container}>
      <MoodFace mood={mood} size={faceSize} />
      {showLabel && (
        <Text style={[styles.label, { color: moodColors[mood], fontSize: lfs }]}>
          {moodLabels[mood]}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: 2 },
  label: { fontFamily: 'Poppins-SemiBold', fontWeight: '600' },
});
