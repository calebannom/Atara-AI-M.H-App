import React, { createContext, useContext, useState } from 'react';

export type GoalCategory = 'mental' | 'physical' | 'social' | 'habits' | 'other';

export type Goal = {
  id: string;
  title: string;
  description: string;
  category: GoalCategory;
  target: number;
  progress: number;
  unit: string;
  completed: boolean;
  createdAt: string;
  dueDate?: string;
};

const now = new Date();
const daysAgo = (n: number) => { const d = new Date(now); d.setDate(d.getDate() - n); return d.toISOString().split('T')[0]; };
const daysAhead = (n: number) => { const d = new Date(now); d.setDate(d.getDate() + n); return d.toISOString().split('T')[0]; };

const INITIAL_GOALS: Goal[] = [
  {
    id: 'goal_1',
    title: 'Meditate Daily',
    description: 'Start each morning with 10 minutes of meditation',
    category: 'mental',
    target: 30,
    progress: 12,
    unit: 'days',
    completed: false,
    createdAt: daysAgo(12),
    dueDate: daysAhead(18),
  },
  {
    id: 'goal_2',
    title: 'Exercise 3×/week',
    description: 'Stay active with regular workouts',
    category: 'physical',
    target: 12,
    progress: 12,
    unit: 'sessions',
    completed: true,
    createdAt: daysAgo(30),
  },
  {
    id: 'goal_3',
    title: 'Connect with a friend',
    description: 'Reach out to someone important every week',
    category: 'social',
    target: 4,
    progress: 1,
    unit: 'times',
    completed: false,
    createdAt: daysAgo(7),
    dueDate: daysAhead(21),
  },
  {
    id: 'goal_4',
    title: 'Read before bed',
    description: 'Replace screen time with 20 min of reading',
    category: 'habits',
    target: 21,
    progress: 8,
    unit: 'nights',
    completed: false,
    createdAt: daysAgo(8),
    dueDate: daysAhead(13),
  },
];

type GoalContextType = {
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'progress' | 'completed' | 'createdAt'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  logProgress: (id: string) => void;
  toggleComplete: (id: string) => void;
};

const GoalContext = createContext<GoalContextType>({
  goals: INITIAL_GOALS,
  addGoal: () => {},
  updateGoal: () => {},
  deleteGoal: () => {},
  logProgress: () => {},
  toggleComplete: () => {},
});

export function GoalProvider({ children }: { children: React.ReactNode }) {
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);

  const addGoal = (goal: Omit<Goal, 'id' | 'progress' | 'completed' | 'createdAt'>) => {
    setGoals((prev) => [{
      ...goal,
      id: `goal_${Date.now()}`,
      progress: 0,
      completed: false,
      createdAt: new Date().toISOString().split('T')[0],
    }, ...prev]);
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates } : g)));
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const logProgress = (id: string) => {
    setGoals((prev) => prev.map((g) => {
      if (g.id !== id || g.completed) return g;
      const next = Math.min(g.progress + 1, g.target);
      return { ...g, progress: next, completed: next >= g.target };
    }));
  };

  const toggleComplete = (id: string) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g)));
  };

  return (
    <GoalContext.Provider value={{ goals, addGoal, updateGoal, deleteGoal, logProgress, toggleComplete }}>
      {children}
    </GoalContext.Provider>
  );
}

export const useGoals = () => useContext(GoalContext);
