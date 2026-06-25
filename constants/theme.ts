export const lightTheme = {
  background: '#EDE9F8',
  surface: '#F3EEFF',
  surfaceElevated: '#EAE2FF',
  primary: '#4C3BCF',
  accent: '#00C9A7',
  text: '#1A1A2E',
  textSecondary: '#6B6B8A',
  textMuted: '#9999BB',
  border: '#D8D2EE',
  error: '#F87171',
  success: '#4ADE80',
  card: '#F3EEFF',
  tabBar: '#F0EAFF',
  tabBarBorder: '#D8D2EE',
  inputBg: '#EAE4FF',
};

export const darkTheme = {
  background: '#0D0D14',
  surface: '#1A1A2E',
  surfaceElevated: '#252540',
  primary: '#7C6FE0',
  accent: '#00C9A7',
  text: '#F1F0FF',
  textSecondary: '#AAAACC',
  textMuted: '#7777AA',
  border: '#2E2E50',
  error: '#F87171',
  success: '#4ADE80',
  card: '#1A1A2E',
  tabBar: '#1A1A2E',
  tabBarBorder: '#2E2E50',
  inputBg: '#252540',
};

export const moodColors = {
  rad: '#00C9A7',
  good: '#4ADE80',
  meh: '#60A5FA',
  bad: '#FB923C',
  awful: '#F87171',
};

export const moodEmojis = {
  rad: '😄',
  good: '🙂',
  meh: '😐',
  bad: '😔',
  awful: '😢',
};

export const moodLabels = {
  rad: 'Rad',
  good: 'Good',
  meh: 'Meh',
  bad: 'Bad',
  awful: 'Awful',
};

export type MoodLevel = 'rad' | 'good' | 'meh' | 'bad' | 'awful';
export type Theme = typeof lightTheme;
