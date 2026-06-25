import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, Animated, ActivityIndicator, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, CheckCircle } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import ActivityChip from '@/components/ActivityChip';

const CONTACT_METHODS = ['Phone', 'Email', 'Text', 'Video Call'];
const URGENCY_LEVELS = ['Low', 'Medium', 'High', 'Crisis'];

export default function ReferralModal() {
  const { theme } = useTheme();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [phone, setPhone] = useState('');
  const [reason, setReason] = useState('');
  const [contactMethod, setContactMethod] = useState('Email');
  const [urgency, setUrgency] = useState('Low');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const successScale = useRef(new Animated.Value(0)).current;

  const handleSubmit = async () => {
    if (!phone.trim() || !reason.trim()) {
      Alert.alert('Error', 'Please provide your phone number and reason for referral.');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSuccess(true);
    Animated.spring(successScale, { toValue: 1, useNativeDriver: true, tension: 80, friction: 8 }).start();
  };

  if (authLoading && !user) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background, paddingTop: insets.top }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Professional Referral</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <X size={24} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>

      {success ? (
        <View style={styles.successContainer}>
          <Animated.View style={[styles.successIcon, { transform: [{ scale: successScale }] }]}>
            <CheckCircle size={80} color={theme.accent} />
          </Animated.View>
          <Text style={[styles.successTitle, { color: theme.text }]}>Request Submitted</Text>
          <Text style={[styles.successSubtitle, { color: theme.textSecondary }]}>
            Thank you for reaching out. A mental health professional will be in touch within 24 hours.
            Remember, seeking help is a sign of strength.
          </Text>
          <TouchableOpacity
            style={[styles.doneBtn, { backgroundColor: theme.accent }]}
            onPress={() => router.back()}
          >
            <Text style={styles.doneBtnText}>Done</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={[styles.description, { color: theme.textSecondary }]}>
            Connect with a licensed mental health professional. All information is confidential.
          </Text>

          {/* Name (pre-filled, disabled) */}
          <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Full Name</Text>
          <View style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, opacity: 0.7 }]}>
            <Text style={[styles.inputText, { color: theme.textMuted }]}>{user?.displayName}</Text>
          </View>

          {/* Email (disabled) */}
          <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Email</Text>
          <View style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, opacity: 0.7 }]}>
            <Text style={[styles.inputText, { color: theme.textMuted }]}>{user?.email}</Text>
          </View>

          {/* Phone */}
          <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Phone</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="Your phone number"
            placeholderTextColor={theme.textMuted}
          />

          {/* Contact Method */}
          <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Preferred Contact</Text>
          <View style={styles.chips}>
            {CONTACT_METHODS.map((m) => (
              <ActivityChip key={m} label={m} selected={contactMethod === m} onPress={() => setContactMethod(m)} />
            ))}
          </View>

          {/* Reason */}
          <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Reason for Referral</Text>
          <TextInput
            style={[styles.textArea, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
            value={reason}
            onChangeText={setReason}
            multiline
            numberOfLines={4}
            placeholder="Briefly describe what you would like support with..."
            placeholderTextColor={theme.textMuted}
            textAlignVertical="top"
          />

          {/* Urgency */}
          <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Urgency Level</Text>
          <View style={styles.chips}>
            {URGENCY_LEVELS.map((u) => (
              <ActivityChip
                key={u}
                label={u}
                selected={urgency === u}
                onPress={() => setUrgency(u)}
              />
            ))}
          </View>

          {urgency === 'Crisis' && (
            <View style={[styles.crisisAlert, { backgroundColor: theme.error + '22', borderColor: theme.error }]}>
              <Text style={[styles.crisisText, { color: theme.error }]}>
                If you are in immediate danger, please call 988 (Suicide & Crisis Lifeline) or 911.
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.submitBtn, { backgroundColor: theme.primary, opacity: loading ? 0.7 : 1 }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitBtnText}>{loading ? 'Submitting...' : 'Submit Referral'}</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 18, fontFamily: 'Poppins-Bold' },
  content: { padding: 24 },
  description: { fontSize: 14, fontFamily: 'Poppins-Regular', lineHeight: 22, marginBottom: 24 },
  fieldLabel: { fontSize: 12, fontFamily: 'Poppins-Bold', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8 },
  input: { borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 14, marginBottom: 20 },
  inputText: { fontSize: 15, fontFamily: 'Poppins-Regular' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
  textArea: { borderWidth: 1.5, borderRadius: 12, padding: 14, minHeight: 100, marginBottom: 20, fontSize: 15, fontFamily: 'Poppins-Regular' },
  crisisAlert: { borderWidth: 1.5, borderRadius: 12, padding: 14, marginBottom: 20 },
  crisisText: { fontSize: 14, fontFamily: 'Poppins-SemiBold', lineHeight: 22 },
  submitBtn: { borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  submitBtnText: { color: '#FFFFFF', fontSize: 16, fontFamily: 'Poppins-Bold' },
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40, gap: 20 },
  successIcon: {},
  successTitle: { fontSize: 24, fontFamily: 'Poppins-Bold', textAlign: 'center' },
  successSubtitle: { fontSize: 15, fontFamily: 'Poppins-Regular', lineHeight: 24, textAlign: 'center' },
  doneBtn: { paddingHorizontal: 40, paddingVertical: 14, borderRadius: 32, marginTop: 8 },
  doneBtnText: { color: '#FFFFFF', fontSize: 16, fontFamily: 'Poppins-Bold' },
});

