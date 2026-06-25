import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Modal, KeyboardAvoidingView, Platform, Alert, Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft, Plus, Brain, Zap, Users, Repeat, Star,
  Check, Trash2, X, ChevronRight,
} from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useGoals, GoalCategory } from '@/context/GoalContext';
import type { Goal } from '@/context/GoalContext';

const CATEGORIES: { key: GoalCategory; label: string; color: string; Icon: React.ComponentType<any> }[] = [
  { key: 'mental',   label: 'Mental',   color: '#7C6FE0', Icon: Brain },
  { key: 'physical', label: 'Physical', color: '#4ADE80', Icon: Zap },
  { key: 'social',   label: 'Social',   color: '#60A5FA', Icon: Users },
  { key: 'habits',   label: 'Habits',   color: '#FB923C', Icon: Repeat },
  { key: 'other',    label: 'Other',    color: '#9CA3AF', Icon: Star },
];

const getCat = (key: GoalCategory) => CATEGORIES.find((c) => c.key === key)!;

function dueDateLabel(dueDate: string): { text: string; urgent: boolean } {
  const diff = Math.ceil(
    (new Date(dueDate + 'T12:00:00').getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  if (diff < 0)  return { text: 'Overdue',    urgent: true };
  if (diff === 0) return { text: 'Due today', urgent: true };
  if (diff <= 3)  return { text: `${diff}d left`, urgent: true };
  return { text: `${diff} days left`, urgent: false };
}

function GoalCard({ goal }: { goal: Goal }) {
  const { theme } = useTheme();
  const { logProgress, deleteGoal } = useGoals();
  const cat = getCat(goal.category);
  const pct = Math.min(Math.round((goal.progress / goal.target) * 100), 100);

  const handleDelete = () => {
    Alert.alert('Delete Goal', `Delete "${goal.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteGoal(goal.id) },
    ]);
  };

  const due = goal.dueDate && !goal.completed ? dueDateLabel(goal.dueDate) : null;

  return (
    <View style={[styles.card, { backgroundColor: theme.surface }]}>
      {/* Top row */}
      <View style={styles.cardTop}>
        <View style={[styles.catIcon, { backgroundColor: cat.color + '22' }]}>
          <cat.Icon size={20} color={cat.color} />
        </View>
        <View style={styles.cardMeta}>
          <View style={styles.cardTitleRow}>
            <Text
              style={[styles.cardTitle, { color: theme.text }, goal.completed && styles.strike]}
              numberOfLines={1}
            >
              {goal.title}
            </Text>
            <View style={[styles.catPill, { backgroundColor: cat.color + '18', borderColor: cat.color + '50' }]}>
              <Text style={[styles.catPillText, { color: cat.color }]}>{cat.label}</Text>
            </View>
          </View>
          {goal.description ? (
            <Text style={[styles.cardDesc, { color: theme.textSecondary }]} numberOfLines={1}>
              {goal.description}
            </Text>
          ) : null}
        </View>
      </View>

      {/* Progress bar */}
      <View style={[styles.trackBg, { backgroundColor: theme.border }]}>
        <View
          style={[
            styles.trackFill,
            { width: `${pct}%`, backgroundColor: goal.completed ? '#4ADE80' : cat.color },
          ]}
        />
      </View>

      {/* Footer */}
      <View style={styles.cardFooter}>
        <View>
          <Text style={[styles.progressText, { color: theme.text }]}>
            {goal.progress}
            <Text style={{ color: theme.textMuted }}>/{goal.target} {goal.unit}</Text>
            <Text style={[styles.pctText, { color: theme.textMuted }]}> · {pct}%</Text>
          </Text>
          {due ? (
            <Text style={[styles.dueText, { color: due.urgent ? theme.error : theme.textMuted }]}>
              {due.text}
            </Text>
          ) : null}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.iconBtn, { backgroundColor: theme.error + '18' }]}
            onPress={handleDelete}
            hitSlop={6}
          >
            <Trash2 size={14} color={theme.error} />
          </TouchableOpacity>

          {goal.completed ? (
            <View style={[styles.doneTag, { backgroundColor: '#4ADE8022', borderColor: '#4ADE8060' }]}>
              <Check size={13} color="#4ADE80" />
              <Text style={[styles.doneTagText, { color: '#4ADE80' }]}>Done!</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.logBtn, { backgroundColor: cat.color }]}
              onPress={() => logProgress(goal.id)}
            >
              <Plus size={13} color="#FFF" strokeWidth={2.5} />
              <Text style={styles.logBtnText}>Log</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

type Filter = 'all' | 'active' | 'done';

export default function GoalsScreen() {
  const { theme } = useTheme();
  const { goals, addGoal } = useGoals();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [filter, setFilter] = useState<Filter>('all');
  const [showAdd, setShowAdd] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<GoalCategory>('mental');
  const [targetStr, setTargetStr] = useState('');
  const [unit, setUnit] = useState('');
  const [dueDate, setDueDate] = useState('');

  const filtered = useMemo(() => {
    if (filter === 'active') return goals.filter((g) => !g.completed);
    if (filter === 'done')   return goals.filter((g) =>  g.completed);
    return goals;
  }, [goals, filter]);

  const activeCount = goals.filter((g) => !g.completed).length;
  const doneCount   = goals.filter((g) =>  g.completed).length;

  const resetForm = () => {
    setTitle(''); setDescription(''); setCategory('mental');
    setTargetStr(''); setUnit(''); setDueDate('');
  };

  const handleSave = () => {
    if (!title.trim()) return;
    addGoal({
      title: title.trim(),
      description: description.trim(),
      category,
      target: parseInt(targetStr, 10) || 1,
      unit: unit.trim() || 'times',
      dueDate: dueDate.trim() || undefined,
    });
    resetForm();
    setShowAdd(false);
  };

  const FILTERS: { key: Filter; label: string }[] = [
    { key: 'all',    label: `All (${goals.length})` },
    { key: 'active', label: `Active (${activeCount})` },
    { key: 'done',   label: `Done (${doneCount})` },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.background, paddingTop: insets.top }}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <ArrowLeft size={24} color={theme.textSecondary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>My Goals</Text>
        <TouchableOpacity onPress={() => setShowAdd(true)} hitSlop={8}>
          <View style={[styles.addBtn, { backgroundColor: theme.primary }]}>
            <Plus size={20} color="#FFF" strokeWidth={2.5} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Summary strip */}
      <View style={[styles.summary, { backgroundColor: theme.primary }]}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNum}>{activeCount}</Text>
          <Text style={styles.summaryLabel}>Active</Text>
        </View>
        <View style={[styles.summaryDivider, { backgroundColor: 'rgba(255,255,255,0.3)' }]} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNum}>{doneCount}</Text>
          <Text style={styles.summaryLabel}>Completed</Text>
        </View>
        <View style={[styles.summaryDivider, { backgroundColor: 'rgba(255,255,255,0.3)' }]} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNum}>{goals.length}</Text>
          <Text style={styles.summaryLabel}>Total</Text>
        </View>
      </View>

      {/* Filter tabs */}
      <View style={[styles.filterRow, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterTab, filter === f.key && { borderBottomWidth: 2, borderBottomColor: theme.primary }]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[styles.filterText, { color: filter === f.key ? theme.primary : theme.textSecondary }]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Goal list */}
      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🎯</Text>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              {filter === 'done' ? 'Nothing completed yet' : 'No goals here'}
            </Text>
            <Text style={[styles.emptyDesc, { color: theme.textSecondary }]}>
              {filter === 'done'
                ? 'Keep logging progress — you\'ll see completed goals here.'
                : 'Tap + to set your first goal.'}
            </Text>
          </View>
        ) : (
          filtered.map((goal) => <GoalCard key={goal.id} goal={goal} />)
        )}
        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Add Goal bottom sheet */}
      <Modal
        visible={showAdd}
        transparent
        animationType="slide"
        onRequestClose={() => { setShowAdd(false); resetForm(); }}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => { setShowAdd(false); resetForm(); }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ width: '100%' }}
          >
            <Pressable onPress={(e) => e.stopPropagation()}>
              <View style={[styles.sheet, { backgroundColor: theme.surface }]}>
                <View style={[styles.sheetHandle, { backgroundColor: theme.border }]} />

                <View style={styles.sheetHeader}>
                  <Text style={[styles.sheetTitle, { color: theme.text }]}>New Goal</Text>
                  <TouchableOpacity onPress={() => { setShowAdd(false); resetForm(); }}>
                    <X size={22} color={theme.textSecondary} />
                  </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                  <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>GOAL TITLE *</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="e.g. Meditate every morning"
                    placeholderTextColor={theme.textMuted}
                  />

                  <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>DESCRIPTION</Text>
                  <TextInput
                    style={[styles.input, styles.inputMulti, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="What does achieving this look like?"
                    placeholderTextColor={theme.textMuted}
                    multiline
                    numberOfLines={2}
                    textAlignVertical="top"
                  />

                  <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>CATEGORY</Text>
                  <View style={styles.catRow}>
                    {CATEGORIES.map((c) => (
                      <TouchableOpacity
                        key={c.key}
                        style={[
                          styles.catChip,
                          {
                            backgroundColor: category === c.key ? c.color : c.color + '18',
                            borderColor: c.color + '60',
                          },
                        ]}
                        onPress={() => setCategory(c.key)}
                      >
                        <c.Icon size={12} color={category === c.key ? '#FFF' : c.color} />
                        <Text style={[styles.catChipText, { color: category === c.key ? '#FFF' : c.color }]}>
                          {c.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>TARGET</Text>
                  <View style={styles.targetRow}>
                    <TextInput
                      style={[styles.input, styles.targetInput, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
                      value={targetStr}
                      onChangeText={setTargetStr}
                      placeholder="30"
                      placeholderTextColor={theme.textMuted}
                      keyboardType="number-pad"
                    />
                    <TextInput
                      style={[styles.input, styles.unitInput, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
                      value={unit}
                      onChangeText={setUnit}
                      placeholder="days / sessions / times"
                      placeholderTextColor={theme.textMuted}
                    />
                  </View>

                  <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>DUE DATE (YYYY-MM-DD, optional)</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
                    value={dueDate}
                    onChangeText={setDueDate}
                    placeholder="e.g. 2025-09-01"
                    placeholderTextColor={theme.textMuted}
                  />

                  <TouchableOpacity
                    style={[styles.saveBtn, { backgroundColor: title.trim() ? theme.primary : theme.border }]}
                    onPress={handleSave}
                    disabled={!title.trim()}
                  >
                    <Text style={styles.saveBtnText}>Save Goal</Text>
                  </TouchableOpacity>

                  <View style={{ height: 24 }} />
                </ScrollView>
              </View>
            </Pressable>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 18, fontFamily: 'Poppins-Bold' },
  addBtn: { width: 34, height: 34, borderRadius: 17, justifyContent: 'center', alignItems: 'center' },
  summary: {
    flexDirection: 'row', paddingVertical: 18, paddingHorizontal: 24,
  },
  summaryItem: { flex: 1, alignItems: 'center', gap: 2 },
  summaryNum: { fontSize: 26, fontFamily: 'Poppins-Bold', color: '#FFF' },
  summaryLabel: { fontSize: 12, fontFamily: 'Poppins-SemiBold', color: 'rgba(255,255,255,0.75)' },
  summaryDivider: { width: 1, marginVertical: 4 },
  filterRow: {
    flexDirection: 'row', borderBottomWidth: 1,
  },
  filterTab: {
    flex: 1, alignItems: 'center', paddingVertical: 12,
  },
  filterText: { fontSize: 13, fontFamily: 'Poppins-SemiBold' },
  list: { padding: 16, paddingBottom: 40 },
  card: {
    borderRadius: 16, padding: 16, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 14 },
  catIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  cardMeta: { flex: 1 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  cardTitle: { fontSize: 15, fontFamily: 'Poppins-Bold', flex: 1 },
  strike: { textDecorationLine: 'line-through', opacity: 0.6 },
  cardDesc: { fontSize: 12, fontFamily: 'Poppins-Regular' },
  catPill: {
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, borderWidth: 1, flexShrink: 0,
  },
  catPillText: { fontSize: 10, fontFamily: 'Poppins-Bold' },
  trackBg: { height: 7, borderRadius: 4, overflow: 'hidden', marginBottom: 10 },
  trackFill: { height: '100%', borderRadius: 4 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  progressText: { fontSize: 13, fontFamily: 'Poppins-SemiBold' },
  pctText: { fontFamily: 'Poppins-Regular' },
  dueText: { fontSize: 11, fontFamily: 'Poppins-SemiBold', marginTop: 2 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconBtn: { width: 30, height: 30, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  logBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10,
  },
  logBtnText: { color: '#FFF', fontSize: 13, fontFamily: 'Poppins-Bold' },
  doneTag: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, borderWidth: 1,
  },
  doneTagText: { fontSize: 12, fontFamily: 'Poppins-Bold' },
  empty: { alignItems: 'center', paddingVertical: 64, gap: 10 },
  emptyIcon: { fontSize: 48 },
  emptyTitle: { fontSize: 18, fontFamily: 'Poppins-Bold' },
  emptyDesc: { fontSize: 14, fontFamily: 'Poppins-Regular', textAlign: 'center', lineHeight: 22 },
  // Modal sheet
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end',
  },
  sheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '90%' },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  sheetHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20,
  },
  sheetTitle: { fontSize: 20, fontFamily: 'Poppins-Bold' },
  fieldLabel: { fontSize: 11, fontFamily: 'Poppins-Bold', letterSpacing: 0.6, marginBottom: 6, marginTop: 16 },
  input: {
    borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11,
    fontSize: 14, fontFamily: 'Poppins-Regular',
  },
  inputMulti: { minHeight: 72, textAlignVertical: 'top', paddingTop: 11 },
  catRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, borderWidth: 1,
  },
  catChipText: { fontSize: 12, fontFamily: 'Poppins-SemiBold' },
  targetRow: { flexDirection: 'row', gap: 10 },
  targetInput: { width: 80 },
  unitInput: { flex: 1 },
  saveBtn: { borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginTop: 24 },
  saveBtnText: { color: '#FFF', fontSize: 16, fontFamily: 'Poppins-Bold' },
});
