import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Home, BarChart2, BookOpen, MoreHorizontal, Plus } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

type Props = BottomTabBarProps & {
  onFabPress?: () => void;
};

export default function FloatingTabBar({ state, descriptors, navigation, onFabPress }: Props) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  const activeIndex = state.index;

  const renderIcon = (routeName: string, color: string, size = 20) => {
    switch (routeName) {
      case 'index': return <Home size={size} color={color} />;
      case 'stats': return <BarChart2 size={size} color={color} />;
      case 'journal': return <BookOpen size={size} color={color} />;
      case 'more': return <MoreHorizontal size={size} color={color} />;
      case 'fab': return <Plus size={size} color={color} />;
      default: return <Home size={size} color={color} />;
    }
  };

  return (
    <View pointerEvents="box-none" style={[styles.wrapper, { bottom: insets.bottom + 14 }]}> 
      <View style={[styles.pill, { backgroundColor: theme.tabBar, shadowColor: '#000' }]}>
        {state.routes.map((route, idx) => {
          const focused = state.routes.indexOf(route) === activeIndex;
          const color = focused ? theme.primary : theme.textMuted;
          const label = descriptors[route.key]?.options.title ?? route.name;

          const onPress = () => {
            if (route.name === 'fab') {
              if (onFabPress) onFabPress();
              return;
            }
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!event.defaultPrevented) {
              navigation.navigate(route.name as never);
            }
          };

          if (route.name === 'fab') {
            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityLabel="Open actions"
                onPress={onPress}
                activeOpacity={0.9}
                style={[styles.fabInPill, { backgroundColor: theme.primary, shadowColor: theme.primary }]}
                hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
              >
                <Plus size={24} color="#fff" strokeWidth={2.5} />
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
              accessibilityLabel={descriptors[route.key]?.options.tabBarAccessibilityLabel}
              testID={(descriptors[route.key]?.options as any)?.tabBarTestID}
              onPress={onPress}
              activeOpacity={0.8}
              style={styles.tabButton}
              hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
            >
              {renderIcon(route.name, color, 20)}
              <Text style={[styles.tabLabel, { color, fontFamily: 'Poppins-SemiBold' }]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 20,
  },
  pill: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 8 : 6,
    borderRadius: 999,
    width: '90%',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'visible',
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    paddingVertical: 6,
    flex: 1,
  },
  tabLabel: { fontSize: 10, marginTop: 4 },
  fabInPill: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -22,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 10,
  },
});
