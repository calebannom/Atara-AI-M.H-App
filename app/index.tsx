import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import storage from '@/utils/storage';
import { useAuth } from '@/context/AuthContext';
import Loader from '@/components/Loader';

export default function Index() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    const check = async () => {
      const onboarded = await storage.getItem('atara_onboarded');
      if (!onboarded) {
        router.replace('/onboarding');
      } else if (!user) {
        router.replace('/login');
      } else {
        router.replace('/(tabs)');
      }
    };
    check();
  }, [loading, user, router]);

  return <Loader />;
}
