import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { Home, BarChart2, BookOpen, MoreHorizontal, Plus, Brain, Pencil } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import FloatingTabBar from '@/components/FloatingTabBar';

function FABSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { theme } = useTheme();
  const router = useRouter();

  const options = [
    { icon: Brain, label: 'Log Mood', color: '#00C9A7', route: '/modal/mood-tracker' },
    { icon: Pencil, label: 'New Journal', color: '#60A5FA', route: '/modal/journal-entry' },
  ];

  const handleOption = (route: string) => {
    onClose();
    setTimeout(() => router.push(route as any), 200);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={[styles.sheet, { backgroundColor: theme.surface }]}>
          <Text style={[styles.sheetTitle, { color: theme.text }]}>What would you like to do?</Text>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt.label}
              style={[styles.sheetOption, { borderColor: theme.border }]}
              onPress={() => handleOption(opt.route)}
            >
              <View style={[styles.sheetIconBox, { backgroundColor: opt.color + '22' }]}>
                <opt.icon size={22} color={opt.color} />
              </View>
              <Text style={[styles.sheetOptionText, { color: theme.text }]}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
}

export default function TabLayout() {
  const { theme } = useTheme();
  const [fabOpen, setFabOpen] = useState(false);

  return (
    <>
      <Tabs
        tabBar={(props) => <FloatingTabBar {...props} onFabPress={() => setFabOpen(true)} />}
        screenOptions={{ headerShown: false }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="stats"
          options={{
            title: 'Stats',
            tabBarIcon: ({ color, size }) => <BarChart2 size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="fab"
          options={{
            title: '',
            tabBarIcon: () => (
              <View style={[styles.fab, { backgroundColor: theme.primary }]}>
                <Plus size={26} color="#FFFFFF" strokeWidth={2.5} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="journal"
          options={{
            title: 'Journal',
            tabBarIcon: ({ color, size }) => <BookOpen size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="more"
          options={{
            title: 'More',
            tabBarIcon: ({ color, size }) => <MoreHorizontal size={size} color={color} />,
          }}
        />
      </Tabs>
      <FABSheet visible={fabOpen} onClose={() => setFabOpen(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  fabWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  sheetTitle: { fontSize: 18, fontFamily: 'Poppins-Bold', marginBottom: 20 },
  sheetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    gap: 16,
  },
  sheetIconBox: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  sheetOptionText: { fontSize: 16, fontFamily: 'Poppins-SemiBold' },
});

