export type AchievementIconType = 'flame' | 'star' | 'book' | 'medal' | 'compass' | 'lotus';

export type Achievement = {
  id: number;
  title: string;
  icon: AchievementIconType;
  color: string;
  desc: string;
  detail: string;
  requirement: string;
  unlocked: boolean;
  unlockedDate?: string;
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 1,
    title: '7-Day Streak',
    icon: 'flame',
    color: '#FF6B35',
    desc: 'Log mood 7 days in a row',
    detail: 'You built a 7-day habit of checking in with yourself. Consistency is the foundation of self-awareness — well done.',
    requirement: 'Log your mood for 7 consecutive days without missing a day.',
    unlocked: true,
    unlockedDate: 'June 15, 2025',
  },
  {
    id: 2,
    title: 'First Entry',
    icon: 'star',
    color: '#FFB800',
    desc: 'Log your first mood',
    detail: 'Every journey begins with a single step. You took yours by logging your very first mood entry in Atara.',
    requirement: 'Log your very first mood entry.',
    unlocked: true,
    unlockedDate: 'June 9, 2025',
  },
  {
    id: 3,
    title: 'Reflective',
    icon: 'book',
    color: '#00C9A7',
    desc: 'Write 5 journal entries',
    detail: 'Writing is thinking made visible. By journaling 5 times you\'ve begun a powerful reflection practice.',
    requirement: 'Write at least 5 journal entries.',
    unlocked: true,
    unlockedDate: 'June 18, 2025',
  },
  {
    id: 4,
    title: 'Consistent',
    icon: 'medal',
    color: '#7C6FE0',
    desc: '30-day streak',
    detail: 'A full month of daily check-ins. This level of dedication to your mental wellness is rare and worth celebrating.',
    requirement: 'Log your mood for 30 consecutive days without missing a day.',
    unlocked: false,
  },
  {
    id: 5,
    title: 'Explorer',
    icon: 'compass',
    color: '#38BDF8',
    desc: 'Try all 5 moods',
    detail: 'You\'ve experienced and acknowledged the full spectrum of emotions tracked in Atara. Emotional range is a sign of authenticity.',
    requirement: 'Log each of the 5 mood levels (Rad, Good, Meh, Bad, Awful) at least once.',
    unlocked: false,
  },
  {
    id: 6,
    title: 'Mindful',
    icon: 'lotus',
    color: '#4ADE80',
    desc: 'Complete 10 check-ins',
    detail: 'Ten full guided check-ins means ten deep moments of self-reflection. Mindfulness grows with every practice.',
    requirement: 'Complete 10 full guided check-in sessions from start to finish.',
    unlocked: false,
  },
];
