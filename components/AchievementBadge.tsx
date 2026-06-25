import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Path, Polygon, Line, G } from 'react-native-svg';
import { AchievementIconType } from '@/constants/achievements';

interface Props {
  icon: AchievementIconType;
  color: string;
  size?: number;
  unlocked?: boolean;
}

// All icons sit on a 64×64 viewBox, centered at (32,32)

function FlameIcon({ c }: { c: string }) {
  return (
    <Path
      d="M32 52C22 46 17 35 23 26C25 31 28 31 29 28C31 22 30 15 27 10C36 18 43 30 39 40C37 34 34 33 33 36C40 30 40 45 32 52Z"
      fill={c}
    />
  );
}

function StarIcon({ c }: { c: string }) {
  // 5-pointed star: outer r=18, inner r=7.5, centered at (32,32)
  return (
    <Polygon
      points="32,14 35.9,26.2 48.5,26.2 38.3,33.8 42.1,46 32,38.4 21.9,46 25.7,33.8 15.5,26.2 28.1,26.2"
      fill={c}
    />
  );
}

function BookIcon({ c }: { c: string }) {
  return (
    <G>
      {/* Left page */}
      <Path
        d="M12 20 L30 24 L30 50 L12 46Z"
        fill={c + '40'}
        stroke={c}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* Right page */}
      <Path
        d="M34 24 L52 20 L52 46 L34 50Z"
        fill={c + '40'}
        stroke={c}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* Spine */}
      <Line x1="32" y1="24" x2="32" y2="50" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
      {/* Left page lines */}
      <Line x1="16" y1="29" x2="28" y2="31" stroke={c} strokeWidth="1.2" strokeLinecap="round" />
      <Line x1="16" y1="35" x2="28" y2="37" stroke={c} strokeWidth="1.2" strokeLinecap="round" />
      <Line x1="16" y1="41" x2="28" y2="43" stroke={c} strokeWidth="1.2" strokeLinecap="round" />
      {/* Right page lines */}
      <Line x1="36" y1="31" x2="48" y2="29" stroke={c} strokeWidth="1.2" strokeLinecap="round" />
      <Line x1="36" y1="37" x2="48" y2="35" stroke={c} strokeWidth="1.2" strokeLinecap="round" />
      <Line x1="36" y1="43" x2="48" y2="41" stroke={c} strokeWidth="1.2" strokeLinecap="round" />
    </G>
  );
}

function MedalIcon({ c }: { c: string }) {
  return (
    <G>
      {/* Left ribbon */}
      <Path d="M27 13 L24 33 L32 28 L32 13Z" fill={c + 'AA'} />
      {/* Right ribbon */}
      <Path d="M37 13 L40 33 L32 28 L32 13Z" fill={c} />
      {/* Circle */}
      <Circle cx="32" cy="44" r="13" fill={c + '25'} stroke={c} strokeWidth="2" />
      {/* Inner star (5pt, small) */}
      <Polygon
        points="32,36 33.6,41 38.8,41 34.6,44 36.2,49 32,46 27.8,49 29.4,44 25.2,41 30.4,41"
        fill={c}
      />
    </G>
  );
}

function CompassIcon({ c }: { c: string }) {
  return (
    <G>
      {/* Outer ring */}
      <Circle cx="32" cy="32" r="19" fill="none" stroke={c} strokeWidth="2" />
      {/* Center dot */}
      <Circle cx="32" cy="32" r="2.5" fill={c} />
      {/* North needle (red/colored) */}
      <Path d="M32 14 L28.5 32 L32 29 L35.5 32Z" fill={c} />
      {/* South needle (muted) */}
      <Path d="M32 50 L35.5 32 L32 35 L28.5 32Z" fill={c + '55'} />
      {/* East needle */}
      <Path d="M50 32 L32 28.5 L35 32 L32 35.5Z" fill={c + '55'} />
      {/* West needle */}
      <Path d="M14 32 L32 35.5 L29 32 L32 28.5Z" fill={c + '55'} />
    </G>
  );
}

function LotusIcon({ c }: { c: string }) {
  return (
    <G>
      {/* Outer left petal */}
      <Path d="M32 50C18 44 12 30 18 18C22 28 26 40 32 50Z" fill={c + '55'} />
      {/* Outer right petal */}
      <Path d="M32 50C46 44 52 30 46 18C42 28 38 40 32 50Z" fill={c + '55'} />
      {/* Left petal */}
      <Path d="M32 50C21 44 18 32 22 20C26 28 30 40 32 50Z" fill={c + 'AA'} />
      {/* Right petal */}
      <Path d="M32 50C43 44 46 32 42 20C38 28 34 40 32 50Z" fill={c + 'AA'} />
      {/* Center petal */}
      <Path d="M32 50C28 40 28 28 32 16C36 28 36 40 32 50Z" fill={c} />
      {/* Base */}
      <Path
        d="M23 52 Q32 57 41 52"
        stroke={c}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </G>
  );
}

export default function AchievementBadge({ icon, color, size = 80, unlocked = true }: Props) {
  return (
    <View style={{ width: size, height: size, opacity: unlocked ? 1 : 0.38 }}>
      <Svg width={size} height={size} viewBox="0 0 64 64">
        {/* Background fill */}
        <Circle cx="32" cy="32" r="29" fill={color + '1A'} />
        {/* Outer ring — dashed when locked */}
        <Circle
          cx="32"
          cy="32"
          r="29"
          fill="none"
          stroke={color}
          strokeWidth={unlocked ? 2.2 : 1.5}
          strokeDasharray={unlocked ? undefined : '5 3'}
        />
        {/* Inner subtle ring */}
        <Circle cx="32" cy="32" r="25" fill="none" stroke={color + '30'} strokeWidth="1" />
        {/* Icon */}
        {icon === 'flame'   && <FlameIcon   c={color} />}
        {icon === 'star'    && <StarIcon    c={color} />}
        {icon === 'book'    && <BookIcon    c={color} />}
        {icon === 'medal'   && <MedalIcon   c={color} />}
        {icon === 'compass' && <CompassIcon c={color} />}
        {icon === 'lotus'   && <LotusIcon   c={color} />}
      </Svg>
    </View>
  );
}
