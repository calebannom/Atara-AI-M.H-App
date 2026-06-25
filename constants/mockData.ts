import { MoodLevel } from './theme';

export const MOCK_USER = {
  uid: 'user_001',
  displayName: 'Alex Johnson',
  email: 'alex@example.com',
  streakCount: 12,
  bio: '',
  photoURL: '',
};

export type MoodEntry = {
  id: string;
  date: string;
  mood: MoodLevel;
  activities: string[];
  notes: string;
};

export type JournalEntry = {
  id: string;
  date: string;
  title: string;
  body: string;
  mood: MoodLevel;
  activities: string[];
};

const now = new Date();
function daysAgo(n: number): string {
  const d = new Date(now);
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

export const DUMMY_MOODS: MoodEntry[] = [
  { id: 'm1', date: daysAgo(0), mood: 'good', activities: ['Exercise', 'Reading'], notes: 'Had a productive morning.' },
  { id: 'm2', date: daysAgo(1), mood: 'rad', activities: ['Socializing', 'Music'], notes: 'Fantastic day with friends!' },
  { id: 'm3', date: daysAgo(2), mood: 'meh', activities: ['Work', 'TV'], notes: 'Just an average day, nothing special.' },
  { id: 'm4', date: daysAgo(3), mood: 'bad', activities: ['Work'], notes: 'Stressful meeting at work.' },
  { id: 'm5', date: daysAgo(4), mood: 'good', activities: ['Exercise', 'Cooking'], notes: 'Morning run felt amazing.' },
  { id: 'm6', date: daysAgo(5), mood: 'awful', activities: ['Sleep issues'], notes: 'Couldn\'t sleep, feeling exhausted.' },
  { id: 'm7', date: daysAgo(6), mood: 'meh', activities: ['Reading', 'Walking'], notes: 'Quiet day at home.' },
  { id: 'm8', date: daysAgo(8), mood: 'good', activities: ['Socializing', 'Exercise'], notes: 'Weekend hike was refreshing.' },
  { id: 'm9', date: daysAgo(9), mood: 'rad', activities: ['Music', 'Art'], notes: 'Creative flow all day!' },
  { id: 'm10', date: daysAgo(10), mood: 'bad', activities: ['Work', 'Stress'], notes: 'Deadline pressure overwhelming.' },
  { id: 'm11', date: daysAgo(11), mood: 'meh', activities: ['TV', 'Cooking'], notes: 'Low energy day.' },
  { id: 'm12', date: daysAgo(12), mood: 'good', activities: ['Reading', 'Meditation'], notes: 'Meditation really helped today.' },
  { id: 'm13', date: daysAgo(14), mood: 'rad', activities: ['Exercise', 'Socializing'], notes: 'Best day in a while!' },
  { id: 'm14', date: daysAgo(15), mood: 'awful', activities: ['Isolation'], notes: 'Felt very alone today.' },
  { id: 'm15', date: daysAgo(16), mood: 'bad', activities: ['Work', 'Conflict'], notes: 'Argument with colleague.' },
  { id: 'm16', date: daysAgo(18), mood: 'good', activities: ['Cooking', 'Music'], notes: 'Made a great new recipe.' },
  { id: 'm17', date: daysAgo(20), mood: 'meh', activities: ['Work'], notes: 'Nothing to report.' },
  { id: 'm18', date: daysAgo(22), mood: 'good', activities: ['Exercise', 'Reading'], notes: 'Getting back on track.' },
  { id: 'm19', date: daysAgo(25), mood: 'rad', activities: ['Socializing', 'Travel'], notes: 'Day trip was wonderful.' },
  { id: 'm20', date: daysAgo(28), mood: 'bad', activities: ['Health', 'Sleep issues'], notes: 'Not feeling well physically.' },
];

export const DUMMY_JOURNALS: JournalEntry[] = [
  {
    id: 'j1',
    date: daysAgo(0),
    title: 'Morning Reflections',
    body: 'Today I woke up feeling genuinely hopeful. The sunlight through my window had that particular quality that makes everything feel possible. I\'ve been trying to practice gratitude each morning, and it really does shift my perspective. Small steps forward still count as progress.',
    mood: 'good',
    activities: ['Meditation', 'Reading'],
  },
  {
    id: 'j2',
    date: daysAgo(2),
    title: 'Dealing with Work Stress',
    body: 'The presentation today felt like a mountain I couldn\'t climb. But I did climb it, even if my legs were shaking the whole time. I need to remember that anxiety before something difficult doesn\'t mean failure — it means I care. Talking to Maya after helped me decompress significantly.',
    mood: 'meh',
    activities: ['Work', 'Socializing'],
  },
  {
    id: 'j3',
    date: daysAgo(4),
    title: 'A Day I Want to Remember',
    body: 'Spontaneous road trip with friends turned into one of those rare perfect days. We laughed until we cried at least three times. No phones for four straight hours. Feeling deeply grateful for the people in my life who make ordinary moments extraordinary.',
    mood: 'rad',
    activities: ['Travel', 'Socializing'],
  },
  {
    id: 'j4',
    date: daysAgo(7),
    title: 'When Everything Feels Heavy',
    body: 'Some days the weight of everything just presses down. Today was one of those days. I didn\'t accomplish what I planned. I barely got out of bed before noon. But I made myself eat a real meal, drink water, and take a short walk. That has to count for something.',
    mood: 'bad',
    activities: ['Walking'],
  },
  {
    id: 'j5',
    date: daysAgo(10),
    title: 'New Habit Check-In',
    body: 'Week two of consistent morning exercise. My body is starting to remember what it feels like to be moved and challenged. The mental clarity afterward is genuinely addictive. I feel more patient and less reactive throughout the day when I start with movement.',
    mood: 'good',
    activities: ['Exercise', 'Meditation'],
  },
  {
    id: 'j6',
    date: daysAgo(15),
    title: 'Thoughts on Connection',
    body: 'Had a really deep conversation with my sister tonight. We talked about things we\'ve never quite said aloud before. It reminded me how much loneliness is really just distance — physical or emotional — between people who care about each other. I want to close that distance more.',
    mood: 'rad',
    activities: ['Socializing', 'Reflection'],
  },
  {
    id: 'j7',
    date: daysAgo(20),
    title: 'Processing a Hard Week',
    body: 'Three rough days in a row. Tension at work, poor sleep, eating poorly. I can see the domino effect happening in real time. When one pillar falls the others follow. The insight doesn\'t make it easier but it makes it less mysterious. I know what to rebuild first.',
    mood: 'awful',
    activities: ['Reflection'],
  },
  {
    id: 'j8',
    date: daysAgo(25),
    title: 'Small Victories',
    body: 'Finally finished that book I\'ve been trying to read for two months. Sent the email I\'d been dreading. Called the doctor to schedule that appointment. None of these feel big but together they feel like momentum. Momentum is what I\'ve been missing.',
    mood: 'good',
    activities: ['Reading', 'Self-care'],
  },
];

export const ACTIVITIES = [
  'Exercise', 'Reading', 'Meditation', 'Socializing', 'Work', 'Music',
  'Cooking', 'Walking', 'TV', 'Art', 'Travel', 'Gaming', 'Sleep issues',
  'Self-care', 'Reflection', 'Outdoors', 'Health',
];

export const THINKING_TRAPS = [
  'All-or-nothing', 'Overgeneralization', 'Mind reading', 'Fortune telling',
  'Catastrophizing', 'Minimizing', 'Emotional reasoning', 'Should statements',
  'Labeling', 'Personalization',
];

export const MOCK_AI_RESPONSES = [
  "It sounds like you're carrying a lot right now. That awareness alone — the ability to name what you're feeling — is genuinely powerful. Your feelings are valid, and you're doing something important by paying attention to them.",
  "I hear how difficult this has been for you. Remember that tough moments are temporary, even when they don't feel that way. The fact that you're reflecting on this shows real emotional courage.",
  "What you're describing makes complete sense given everything you've been through. You're not alone in feeling this way, and taking time to check in with yourself like this is a meaningful form of self-care.",
  "Thank you for sharing that with me. It takes courage to sit with difficult feelings. I want you to know that what you're experiencing is something many people navigate, and there's no \"right\" way to feel.",
  "The patterns you've identified are really insightful. Awareness is the first step to change. You seem to have a thoughtful, reflective nature — that's a real strength in working through challenges like this.",
];

export const DAILY_QUOTES = [
  { text: "You don't have to be positive all the time. It's perfectly okay to feel sad, angry, annoyed, frustrated, scared, or anxious.", author: "Lori Deschene" },
  { text: "Mental health is not a destination, but a process. It's about how you drive, not where you're going.", author: "Noam Shpancer" },
  { text: "You are allowed to be both a masterpiece and a work in progress simultaneously.", author: "Sophia Bush" },
  { text: "It's okay to not be okay. It's okay to ask for help.", author: "Demi Lovato" },
  { text: "Owning our story and loving ourselves through that process is the bravest thing that we'll ever do.", author: "Brené Brown" },
];

export const ARTICLES = [
  { id: 'a1', title: '5 Ways to Manage Anxiety', category: 'Anxiety', color: '#4C3BCF', image: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=400', url: 'https://www.mentalhealth.org.uk/explore-mental-health/a-z-topics/anxiety' },
  { id: 'a2', title: 'Building Emotional Resilience', category: 'Resilience', color: '#00C9A7', image: 'https://images.pexels.com/photos/3755755/pexels-photo-3755755.jpeg?auto=compress&cs=tinysrgb&w=400', url: 'https://www.apa.org/topics/resilience' },
  { id: 'a3', title: 'The Power of Journaling', category: 'Self-care', color: '#FB923C', image: 'https://images.pexels.com/photos/317355/pexels-photo-317355.jpeg?auto=compress&cs=tinysrgb&w=400', url: 'https://www.verywellmind.com/gratitude-journaling-therapy-4165953' },
  { id: 'a4', title: 'Sleep & Mental Health', category: 'Sleep', color: '#60A5FA', image: 'https://images.pexels.com/photos/3771069/pexels-photo-3771069.jpeg?auto=compress&cs=tinysrgb&w=400', url: 'https://www.mentalhealth.org.uk/explore-mental-health/a-z-topics/sleep' },
  { id: 'a5', title: 'Mindful Movement', category: 'Exercise', color: '#4ADE80', image: 'https://images.pexels.com/photos/3822621/pexels-photo-3822621.jpeg?auto=compress&cs=tinysrgb&w=400', url: 'https://www.mindful.org/mindful-movement-what-is-it/' },
];

export const VIDEOS = [
  { 
    id: 'v1', 
    title: 'Breathing for Calm', 
    duration: '4:32', 
    color: '#4C3BCF', 
    image: 'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=400',
    url: 'https://www.youtube.com/watch?v=oX6I6vs1EFs',
  },
  { 
    id: 'v2', 
    title: 'Morning Meditation', 
    duration: '10:00', 
    color: '#00C9A7', 
    image: 'https://images.pexels.com/photos/3822864/pexels-photo-3822864.jpeg?auto=compress&cs=tinysrgb&w=400',
    url: 'https://www.youtube.com/watch?v=ZToicYcHIOU',
  },
  { 
    id: 'v3', 
    title: 'CBT Basics', 
    duration: '8:15', 
    color: '#FB923C', 
    image: 'https://images.pexels.com/photos/4101143/pexels-photo-4101143.jpeg?auto=compress&cs=tinysrgb&w=400',
    url: 'https://www.youtube.com/watch?v=7H3vXjZ43vY',
  },
  { 
    id: 'v4', 
    title: 'Grounding Techniques', 
    duration: '6:48', 
    color: '#F87171', 
    image: 'https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=400',
    url: 'https://www.youtube.com/watch?v=SdI8W29V8Kk',
  },
];
