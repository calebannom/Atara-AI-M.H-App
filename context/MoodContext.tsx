import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { DUMMY_MOODS, MoodEntry } from '@/constants/mockData';
import { MoodLevel } from '@/constants/theme';
import { useAuth } from './AuthContext';
import { db } from '@/config/firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  deleteDoc,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';

type MoodContextType = {
  moods: MoodEntry[];
  addMood: (mood: MoodLevel, activities: string[], notes: string) => Promise<void>;
  deleteMood: (id: string) => Promise<void>;
  currentStreak: number;
  longestStreak: number;
  loading: boolean;
};

const MoodContext = createContext<MoodContextType>({
  moods: DUMMY_MOODS,
  addMood: async () => {},
  deleteMood: async () => {},
  currentStreak: 0,
  longestStreak: 0,
  loading: true,
});

function computeCurrentStreak(moods: MoodEntry[]): number {
  const today = new Date().toISOString().split('T')[0];
  const dateSet = new Set(moods.map((m) => m.date));
  let streak = 0;
  const d = new Date();
  // if today not logged, start counting from yesterday
  if (!dateSet.has(today)) d.setDate(d.getDate() - 1);
  while (true) {
    const dateStr = d.toISOString().split('T')[0];
    if (dateSet.has(dateStr)) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

function computeLongestStreak(moods: MoodEntry[]): number {
  const dates = [...new Set(moods.map((m) => m.date))].sort();
  if (dates.length === 0) return 0;
  let longest = 1;
  let current = 1;
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1] + 'T12:00:00');
    const curr = new Date(dates[i] + 'T12:00:00');
    const diff = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 1) {
      current++;
      if (current > longest) longest = current;
    } else {
      current = 1;
    }
  }
  return longest;
}

export function MoodProvider({ children }: { children: React.ReactNode }) {
  const [moods, setMoods] = useState<MoodEntry[]>(DUMMY_MOODS);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Subscribe to mood entries from Firestore when user is logged in
  useEffect(() => {
    if (!user) {
      setMoods(DUMMY_MOODS);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'moods'),
      where('userId', '==', user.uid),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const moodData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      } as MoodEntry));
      setMoods(moodData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching moods:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const addMood = async (mood: MoodLevel, activities: string[], notes: string) => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    
    // First check if there's already an entry for today
    const q = query(
      collection(db, 'moods'),
      where('userId', '==', user.uid),
      where('date', '==', today)
    );
    const snapshot = await getDocs(q);
    
    // Delete existing entry for today if it exists
    for (const docSnap of snapshot.docs) {
      await deleteDoc(doc(db, 'moods', docSnap.id));
    }

    // Add new entry
    await addDoc(collection(db, 'moods'), {
      userId: user.uid,
      date: today,
      mood,
      activities,
      notes,
      createdAt: serverTimestamp(),
    });
  };

  const deleteMood = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, 'moods', id));
  };

  const currentStreak = useMemo(() => computeCurrentStreak(moods), [moods]);
  const longestStreak = useMemo(() => computeLongestStreak(moods), [moods]);

  return (
    <MoodContext.Provider value={{ moods, addMood, deleteMood, currentStreak, longestStreak, loading }}>
      {children}
    </MoodContext.Provider>
  );
}

export const useMood = () => useContext(MoodContext);
