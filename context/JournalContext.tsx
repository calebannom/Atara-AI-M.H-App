import React, { createContext, useContext, useState, useEffect } from 'react';
import { DUMMY_JOURNALS, JournalEntry } from '@/constants/mockData';
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
  updateDoc,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';

type JournalContextType = {
  journals: JournalEntry[];
  addJournal: (entry: Omit<JournalEntry, 'id'>) => Promise<void>;
  updateJournal: (id: string, entry: Partial<JournalEntry>) => Promise<void>;
  deleteJournal: (id: string) => Promise<void>;
  loading: boolean;
};

const JournalContext = createContext<JournalContextType>({
  journals: DUMMY_JOURNALS,
  addJournal: async () => {},
  updateJournal: async () => {},
  deleteJournal: async () => {},
  loading: true,
});

export function JournalProvider({ children }: { children: React.ReactNode }) {
  const [journals, setJournals] = useState<JournalEntry[]>(DUMMY_JOURNALS);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Subscribe to journal entries from Firestore when user is logged in
  useEffect(() => {
    console.log("JournalProvider - user:", user);
    if (!user) {
      console.log("No user, using DUMMY_JOURNALS");
      setJournals(DUMMY_JOURNALS);
      setLoading(false);
      return;
    }

    console.log("Fetching journals for userId:", user.uid);
    const q = query(
      collection(db, 'journals'),
      where('userId', '==', user.uid),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log("Journals snapshot received! Docs count:", snapshot.docs.length);
      const journalData = snapshot.docs.map((doc) => {
        const data = doc.data();
        console.log("Journal doc:", doc.id, data);
        return { id: doc.id, ...data } as JournalEntry;
      });
      setJournals(journalData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching journals:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const addJournal = async (entry: Omit<JournalEntry, 'id'>) => {
    console.log("addJournal called with entry:", entry);
    if (!user) {
      console.log("No user, can't add journal!");
      return;
    }

    const docToAdd = {
      ...entry,
      userId: user.uid,
      createdAt: serverTimestamp(),
    };
    console.log("Adding journal to Firestore:", docToAdd);
    
    try {
      const docRef = await addDoc(collection(db, 'journals'), docToAdd);
      console.log("Journal added successfully! Doc ID:", docRef.id);
    } catch (error) {
      console.error("Error adding journal:", error);
    }
  };

  const updateJournal = async (id: string, entry: Partial<JournalEntry>) => {
    if (!user) return;
    await updateDoc(doc(db, 'journals', id), entry);
  };

  const deleteJournal = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, 'journals', id));
  };

  return (
    <JournalContext.Provider value={{ journals, addJournal, updateJournal, deleteJournal, loading }}>
      {children}
    </JournalContext.Provider>
  );
}

export const useJournal = () => useContext(JournalContext);
