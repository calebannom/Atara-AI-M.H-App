import { useEffect } from 'react';
import { Stack, usePathname, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { MessageSquare } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { MoodProvider } from '@/context/MoodContext';
import { JournalProvider } from '@/context/JournalContext';
import { ChatProvider } from '@/context/ChatContext';
import { GoalProvider } from '@/context/GoalContext';

SplashScreen.preventAutoHideAsync();

function RootLayoutInner() {
  useFrameworkReady();
  const { isDark, theme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Hide splash screen immediately since we're not loading custom fonts
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal/mood-checkin" options={{ presentation: 'modal' }} />
        <Stack.Screen name="modal/mood-tracker" options={{ presentation: 'modal' }} />
        <Stack.Screen name="modal/chat" options={{ presentation: 'modal' }} />
        <Stack.Screen name="modal/journal-entry" options={{ presentation: 'modal' }} />
        <Stack.Screen name="modal/discover" options={{ presentation: 'modal' }} />
        <Stack.Screen name="modal/referral" options={{ presentation: 'modal' }} />
        <Stack.Screen name="modal/achievement" options={{ presentation: 'modal' }} />
        <Stack.Screen name="modal/video-player" options={{ presentation: 'modal' }} />
        {/* New screens we added */}
        <Stack.Screen name="modal/reminders" options={{ presentation: 'modal' }} />
        <Stack.Screen name="modal/reports" options={{ presentation: 'modal' }} />
        <Stack.Screen name="modal/edit-profile" options={{ presentation: 'modal' }} />
        <Stack.Screen name="goals" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <TouchableOpacity
        style={[
          styles.floatingButton,
          {
            backgroundColor: theme.primary,
            bottom: (pathname && !pathname.includes('modal') ? 112 : 30) + (Platform.OS === 'ios' ? insets.bottom / 2 : 0),
            right: 20 + insets.right,
            shadowColor: theme.primary,
            display: pathname &&
              !pathname.includes('login') &&
              !pathname.includes('register') &&
              !pathname.includes('onboarding') &&
              !pathname.includes('chat') &&
              !pathname.includes('modal') &&
              pathname !== '/' ? 'flex' : 'none',
          },
        ]}
        onPress={() => router.push('/modal/chat')}
        activeOpacity={0.8}
      >
        <MessageSquare size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 999,
  },
});

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MoodProvider>
          <JournalProvider>
            <ChatProvider>
              <GoalProvider>
                <RootLayoutInner />
              </GoalProvider>
            </ChatProvider>
          </JournalProvider>
        </MoodProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
