import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Switch, Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Moon, Bell, Target, FileText, LogOut, ChevronRight, HeartHandshake, MessageSquare, User,
} from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import AppBackground from '@/components/AppBackground';

export default function MoreScreen() {
  const { theme, isDark, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out', style: 'destructive', onPress: async () => {
          await signOut();
          router.replace('/login');
        }
      },
    ]);
  };

  const comingSoon = (feature: string) => {
    Alert.alert('Coming Soon', `${feature} will be available in a future update.`);
  };

  const sections = [
    {
      title: 'Profile',
      items: [
        { icon: User, label: 'Edit Profile', onPress: () => router.push('/modal/edit-profile'), color: theme.primary },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: HeartHandshake, label: 'Professional Referral', onPress: () => router.push('/modal/referral'), color: theme.accent },
        { icon: MessageSquare, label: 'Chat with Atara', onPress: () => router.push('/modal/chat'), color: theme.primary },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { icon: Target, label: 'Goals', onPress: () => router.push('/goals' as any), color: '#FB923C' },
        { icon: Bell, label: 'Reminders', onPress: () => router.push('/modal/reminders'), color: '#60A5FA' },
        { icon: FileText, label: 'Reports', onPress: () => router.push('/modal/reports'), color: '#4ADE80' },
      ],
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.background, paddingTop: insets.top }}>
      <AppBackground />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
      <Text style={[styles.pageTitle, { color: theme.text }]}>More</Text>

      {/* Profile Card */}
      <View style={[styles.profileCard, { backgroundColor: theme.surface }]}>
        {user?.photoURL ? (
          <Image source={{ uri: user.photoURL }} style={styles.avatarImage} />
        ) : (
          <View style={[styles.avatar, { backgroundColor: theme.primary + '33' }]}>
            <Text style={[styles.avatarInitials, { color: theme.primary }]}>
              {user?.displayName?.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </Text>
          </View>
        )}
        <View style={styles.profileInfo}>
          <Text style={[styles.profileName, { color: theme.text }]} numberOfLines={1}>{user?.displayName}</Text>
          <Text style={[styles.profileEmail, { color: theme.textSecondary }]} numberOfLines={1}>{user?.email}</Text>
          <Text style={[styles.profileBio, { color: user?.bio ? theme.textSecondary : theme.textMuted }]} numberOfLines={2}>
            {user?.bio || 'Add a bio to your profile...'}
          </Text>
          <View style={styles.streakRow}>
            <Text style={styles.streakFire}>🔥</Text>
            <Text style={[styles.streakText, { color: theme.textSecondary }]}>{user?.streakCount} day streak</Text>
          </View>
        </View>
      </View>

      {/* Dark Mode Toggle */}
      <View style={[styles.settingsSection, { backgroundColor: theme.surface }]}>
        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <View style={[styles.settingIcon, { backgroundColor: '#252540' }]}>
              <Moon size={18} color="#7C6FE0" />
            </View>
            <Text style={[styles.settingLabel, { color: theme.text }]}>Dark Mode</Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: '#767577', true: theme.primary }}
            thumbColor={isDark ? '#FFFFFF' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Other Sections */}
      {sections.map((section) => (
        <View key={section.title} style={styles.sectionWrapper}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>{section.title.toUpperCase()}</Text>
          <View style={[styles.settingsSection, { backgroundColor: theme.surface }]}>
            {section.items.map((item, idx) => (
              <TouchableOpacity
                key={item.label}
                style={[
                  styles.settingRow,
                  idx < section.items.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.border },
                ]}
                onPress={item.onPress}
              >
                <View style={styles.settingLeft}>
                  <View style={[styles.settingIcon, { backgroundColor: item.color + '22' }]}>
                    <item.icon size={18} color={item.color} />
                  </View>
                  <Text style={[styles.settingLabel, { color: theme.text }]}>{item.label}</Text>
                </View>
                <ChevronRight size={18} color={theme.textMuted} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      {/* Sign Out */}
      <TouchableOpacity
        style={[styles.signOutBtn, { backgroundColor: theme.error + '22', borderColor: theme.error }]}
        onPress={handleSignOut}
      >
        <LogOut size={18} color={theme.error} />
        <Text style={[styles.signOutText, { color: theme.error }]}>Sign Out</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 110 },
  pageTitle: { fontSize: 26, fontFamily: 'Poppins-Bold', marginBottom: 20 },
  profileCard: {
    borderRadius: 16, padding: 20, flexDirection: 'row', alignItems: 'center', gap: 16,
    marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  avatar: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center' },
  avatarImage: { width: 64, height: 64, borderRadius: 32 },
  avatarInitials: { fontSize: 24, fontFamily: 'Poppins-Bold' },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 18, fontFamily: 'Poppins-Bold', marginBottom: 2 },
  profileEmail: { fontSize: 13, fontFamily: 'Poppins-Regular', marginBottom: 4 },
  profileBio: { fontSize: 13, fontFamily: 'Poppins-Regular', marginBottom: 6, lineHeight: 16 },
  streakRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  streakFire: { fontSize: 14 },
  streakText: { fontSize: 13, fontFamily: 'Poppins-SemiBold' },
  settingsSection: {
    borderRadius: 16, overflow: 'hidden', marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  settingLabel: { fontSize: 15, fontFamily: 'Poppins-SemiBold' },
  sectionWrapper: { marginBottom: 4 },
  sectionTitle: { fontSize: 11, fontFamily: 'Poppins-Bold', letterSpacing: 1, marginBottom: 8, marginLeft: 4 },
  signOutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderRadius: 16, paddingVertical: 14, gap: 8, marginTop: 8,
  },
  signOutText: { fontSize: 16, fontFamily: 'Poppins-Bold' },
});

