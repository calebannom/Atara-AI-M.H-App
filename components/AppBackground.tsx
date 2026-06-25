import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@/context/ThemeContext';

const { width: W, height: H } = Dimensions.get('window');

export default function AppBackground() {
  const { isDark, theme } = useTheme();
  if (isDark) return null;

  return (
    <Svg
      width={W}
      height={H + 100}
      viewBox="0 0 390 844"
      preserveAspectRatio="xMidYMid slice"
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
    >
      {/* Purple blob — upper-left */}
      <Path
        d="M 40 -60 C 180 -80 320 20 310 140 C 300 260 200 330 80 310 C -40 290 -80 180 -60 80 C -40 -20 -100 -40 40 -60 Z"
        fill={theme.primary}
        opacity={0.11}
      />
      {/* Blue-periwinkle blob — upper-right */}
      <Path
        d="M 280 -80 C 420 -60 480 60 460 170 C 440 280 340 330 250 290 C 160 250 150 160 180 70 C 205 -10 140 -100 280 -80 Z"
        fill="#8B9CF4"
        opacity={0.13}
      />
      {/* Light-blue blob — mid right */}
      <Path
        d="M 350 320 C 470 340 520 450 490 560 C 460 670 360 710 260 680 C 160 650 140 550 170 460 C 200 375 230 300 350 320 Z"
        fill="#60A5FA"
        opacity={0.12}
      />
      {/* Teal blob — bottom right */}
      <Path
        d="M 420 700 C 480 730 500 830 460 920 C 420 1010 320 1040 230 1010 C 140 980 110 890 150 810 C 185 735 280 680 350 700 Z"
        fill={theme.accent}
        opacity={0.13}
      />
      {/* Cyan blob — bottom left */}
      <Path
        d="M -60 760 C -10 680 100 660 190 710 C 280 760 310 870 270 960 C 230 1050 110 1070 20 1030 C -70 990 -110 840 -60 760 Z"
        fill="#34D399"
        opacity={0.12}
      />
    </Svg>
  );
}
