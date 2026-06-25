import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile as firebaseUpdateProfile
} from 'firebase/auth';
import { auth, db } from '@/config/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import storage from '@/utils/storage';
import { MOCK_USER } from '@/constants/mockData';

type User = typeof MOCK_USER;

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  updateProfile: async () => {},
});

// Helper to convert Firebase User to our User type
const formatUser = async (firebaseUser: FirebaseUser): Promise<User> => {
  // Try to get user data from Firestore
  const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
  if (userDoc.exists()) {
    return userDoc.data() as User;
  }

  // Fallback to mock user format if no Firestore doc
  return {
    uid: firebaseUser.uid,
    displayName: firebaseUser.displayName || 'User',
    email: firebaseUser.email || '',
    streakCount: 0,
    bio: '',
    photoURL: '',
  };
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // First try to load from AsyncStorage
    storage.getItem('atara_user').then(async (stored) => {
      if (stored) {
        const parsedUser = JSON.parse(stored);
        setUser(parsedUser);
      }
      // Then listen for Firebase auth state changes
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const formattedUser = await formatUser(firebaseUser);
          setUser(formattedUser);
          await storage.setItem('atara_user', JSON.stringify(formattedUser));
        } else if (!stored) {
          setUser(null);
          await storage.removeItem('atara_user');
        }
        setLoading(false);
      });
      return unsubscribe;
    });
  }, []);

  const signIn = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const formattedUser = await formatUser(userCredential.user);
    setUser(formattedUser);
  };

  const signUp = async (name: string, email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Update profile with display name
    await firebaseUpdateProfile(userCredential.user, { displayName: name });

    // Create user document in Firestore
    const newUser: User = {
      uid: userCredential.user.uid,
      displayName: name,
      email: email,
      streakCount: 0,
      bio: '',
      photoURL: '',
    };

    await setDoc(doc(db, 'users', userCredential.user.uid), {
      ...newUser,
      createdAt: serverTimestamp(),
    });

    setUser(newUser);
    await storage.setItem('atara_user', JSON.stringify(newUser));
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    await storage.removeItem('atara_user');
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user || !auth.currentUser) return;
    
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    await storage.setItem('atara_user', JSON.stringify(updatedUser));

    try {
      // 1. Update Firebase Auth Profile (for displayName and photoURL)
      if (updates.displayName || updates.photoURL) {
        await firebaseUpdateProfile(auth.currentUser, {
          displayName: updates.displayName,
          photoURL: updates.photoURL,
        });
      }

      // 2. Update Firestore document
      await setDoc(doc(db, 'users', user.uid), updates, { merge: true });
    } catch (e) {
      console.log("Error updating profile:", e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
