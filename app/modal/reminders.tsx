import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Bell, CheckCircle2 } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

const REMINDER_TYPES = [
  { id: 'mood', label: 'Daily Mood Check-in', defaultTime: '09:00 AM' },
  { id: 'journal', label: 'Evening Journal', defaultTime: '08:00 PM' },
  { id: 'gratitude', label: 'Gratitude Prompt', defaultTime: '07:00 PM' },
];

export default function RemindersModal() {
  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [reminders, setReminders] = useState([
    { ...REMINDER_TYPES[0], enabled: true },
    { ...REMINDER_TYPES[1], enabled: false },
    { ...REMINDER_TYPES[2], enabled: false },
  ]);

  const toggleReminder = (id: string) => {
    setReminders(reminders.map(r => 
      r.id === id ? { ...r, enabled: !r.enabled } : r
    ));
  };

  const saveReminders = () => {
    // In a real app, this would save to AsyncStorage or Firestore
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background, paddingTop: insets.top }}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <X size={24} color={theme.textSecondary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Reminders</Text>
        <TouchableOpacity onPress={saveReminders}>
          <CheckCircle2 size={24} color={theme.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.description, { color: theme.textSecondary }]}>
          Set up friendly reminders to help you stay consistent with your mental health routine.
        </Text>

        {reminders.map((reminder) => (
          <View key={reminder.id} style={[styles.reminderCard, { backgroundColor: theme.surface }]}>
            <View style={styles.reminderLeft}>
              <View style={[styles.iconContainer, { backgroundColor: theme.primary + '22' }]}>
                <Bell size={20} color={theme.primary} />
              </View>
              <View style={styles.reminderInfo}>
                <Text style={[styles.reminderTitle, { color: theme.text }]}>
                  {reminder.label}
                </Text>
                <Text style={[styles.reminderTime, { color: theme.textSecondary }]}>
                  {reminder.defaultTime}
                </Text>
              </View>
            </View>
            <Switch
              value={reminder.enabled}
              onValueChange={() => toggleReminder(reminder.id)}
              trackColor={{ false: '#767577', true: theme.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 18, fontFamily: 'Poppins-Bold' },
  content: { padding: 20 },
  description: { fontSize: 14, fontFamily: 'Poppins-Regular', lineHeight: 20, marginBottom: 24 },
  reminderCard: {
    borderRadius: 16, padding: 16, marginBottom: 12,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  reminderLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconContainer: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  reminderInfo: { gap: 2 },
  reminderTitle: { fontSize: 15, fontFamily: 'Poppins-SemiBold' },
  reminderTime: { fontSize: 13, fontFamily: 'Poppins-Regular' },
});
