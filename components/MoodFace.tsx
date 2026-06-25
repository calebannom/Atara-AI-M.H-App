import React from 'react';
import Svg, { Circle, Path, Line, Ellipse } from 'react-native-svg';
import { moodColors, MoodLevel } from '@/constants/theme';

type Props = {
  mood: MoodLevel;
  size?: number;
  selected?: boolean;
};

export default function MoodFace({ mood, size = 32, selected = false }: Props) {
  const color = moodColors[mood];
  const s = size;
  const c = s / 2;
  const r = s / 2 - s * 0.06;
  const sw = s * 0.06; // stroke width for circle
  const fsw = s * 0.055; // stroke width for face features

  const circleFill = selected ? color + '44' : color + '22';
  const circleStroke = color;
  const circleStrokeWidth = selected ? sw * 1.6 : sw;

  if (mood === 'rad') {
    return (
      <Svg width={s} height={s} viewBox="0 0 100 100">
        <Circle cx={50} cy={50} r={44} fill={circleFill} stroke={circleStroke} strokeWidth={circleStrokeWidth * (100 / s)} />
        {/* Eyes */}
        <Circle cx={35} cy={40} r={5.5} fill={color} />
        <Circle cx={65} cy={40} r={5.5} fill={color} />
        {/* Big smile */}
        <Path d="M 28 56 Q 50 76 72 56" stroke={color} strokeWidth={5.5} fill="none" strokeLinecap="round" />
        {/* Tongue */}
        <Ellipse cx={50} cy={72} rx={9} ry={6} fill={color} />
      </Svg>
    );
  }

  if (mood === 'good') {
    return (
      <Svg width={s} height={s} viewBox="0 0 100 100">
        <Circle cx={50} cy={50} r={44} fill={circleFill} stroke={circleStroke} strokeWidth={circleStrokeWidth * (100 / s)} />
        {/* Eyes */}
        <Circle cx={35} cy={40} r={5} fill={color} />
        <Circle cx={65} cy={40} r={5} fill={color} />
        {/* Smile */}
        <Path d="M 33 57 Q 50 72 67 57" stroke={color} strokeWidth={5.5} fill="none" strokeLinecap="round" />
      </Svg>
    );
  }

  if (mood === 'meh') {
    return (
      <Svg width={s} height={s} viewBox="0 0 100 100">
        <Circle cx={50} cy={50} r={44} fill={circleFill} stroke={circleStroke} strokeWidth={circleStrokeWidth * (100 / s)} />
        {/* Eyes */}
        <Circle cx={35} cy={40} r={5} fill={color} />
        <Circle cx={65} cy={40} r={5} fill={color} />
        {/* Worry brows */}
        <Path d="M 28 30 L 38 35" stroke={color} strokeWidth={4} strokeLinecap="round" />
        <Path d="M 62 35 L 72 30" stroke={color} strokeWidth={4} strokeLinecap="round" />
        {/* Flat mouth */}
        <Line x1={34} y1={63} x2={66} y2={63} stroke={color} strokeWidth={5.5} strokeLinecap="round" />
      </Svg>
    );
  }

  if (mood === 'bad') {
    return (
      <Svg width={s} height={s} viewBox="0 0 100 100">
        <Circle cx={50} cy={50} r={44} fill={circleFill} stroke={circleStroke} strokeWidth={circleStrokeWidth * (100 / s)} />
        {/* Oval eyes */}
        <Ellipse cx={35} cy={40} rx={7} ry={5.5} fill={color} />
        <Ellipse cx={65} cy={40} rx={7} ry={5.5} fill={color} />
        {/* Frown */}
        <Path d="M 32 66 Q 50 53 68 66" stroke={color} strokeWidth={5.5} fill="none" strokeLinecap="round" />
      </Svg>
    );
  }

  // awful
  return (
    <Svg width={s} height={s} viewBox="0 0 100 100">
      <Circle cx={50} cy={50} r={44} fill={circleFill} stroke={circleStroke} strokeWidth={circleStrokeWidth * (100 / s)} />
      {/* X left eye */}
      <Line x1={24} y1={30} x2={38} y2={44} stroke={color} strokeWidth={5.5} strokeLinecap="round" />
      <Line x1={38} y1={30} x2={24} y2={44} stroke={color} strokeWidth={5.5} strokeLinecap="round" />
      {/* X right eye */}
      <Line x1={62} y1={30} x2={76} y2={44} stroke={color} strokeWidth={5.5} strokeLinecap="round" />
      <Line x1={76} y1={30} x2={62} y2={44} stroke={color} strokeWidth={5.5} strokeLinecap="round" />
      {/* Nose dot */}
      <Circle cx={50} cy={54} r={3} fill={color} />
      {/* Deep frown */}
      <Path d="M 30 70 Q 50 57 70 70" stroke={color} strokeWidth={5.5} fill="none" strokeLinecap="round" />
    </Svg>
  );
}
