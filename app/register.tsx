import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Eye, EyeOff } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

function PasswordStrengthBar({ password }: { password: string }) {
  const { theme } = useTheme();
  const score = !password ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : /[A-Z]/.test(password) && /[0-9]/.test(password) ? 4 : 3;
  const colors = ['transparent', theme.error, '#FB923C', '#60A5FA', theme.accent];
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  return (
    <View style={styles.strengthWrapper}>
      <View style={styles.strengthBars}>
        {[1, 2, 3, 4].map((i) => (
          <View key={i} style={[styles.strengthSegment, { backgroundColor: i <= score ? colors[score] : theme.border }]} />
        ))}
      </View>
      {password ? <Text style={[styles.strengthLabel, { color: colors[score] }]}>{labels[score]}</Text> : null}
    </View>
  );
}

export default function Register() {
  const { theme } = useTheme();
  const { signUp } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focused, setFocused] = useState<number>(-1);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirm) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await signUp(name, email, password);
      router.replace('/(tabs)');
    } catch {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: 'Full Name', value: name, set: setName, type: 'default' as const, secure: false },
    { label: 'Email', value: email, set: setEmail, type: 'email-address' as const, secure: false },
    { label: 'Password', value: password, set: setPassword, type: 'default' as const, secure: true },
    { label: 'Confirm Password', value: confirm, set: setConfirm, type: 'default' as const, secure: true },
  ];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background, paddingTop: insets.top }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={[styles.appName, { color: theme.primary }]}>Atara</Text>
          <Text style={[styles.tagline, { color: theme.textSecondary }]}>Create your account</Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.surface, shadowColor: theme.text }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Get started</Text>

          {fields.map((f, i) => {
            const isPasswordField = f.secure;
            const isVisible = i === 2 ? showPassword : showConfirm;
            return (
              <View key={f.label}>
                <View
                  style={[
                    styles.inputWrapper,
                    { borderColor: focused === i ? theme.primary : theme.border, backgroundColor: theme.inputBg },
                  ]}
                >
                  <Text
                    style={[
                      styles.floatLabel,
                      {
                        color: focused === i || f.value ? theme.primary : theme.textMuted,
                        fontSize: focused === i || f.value ? 11 : 14,
                        top: focused === i || f.value ? 6 : 18,
                      },
                    ]}
                  >
                    {f.label}
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        color: theme.text,
                        paddingTop: f.value || focused === i ? 20 : 14,
                        paddingRight: isPasswordField ? 44 : 14,
                      },
                    ]}
                    value={f.value}
                    onChangeText={f.set}
                    keyboardType={f.type}
                    secureTextEntry={isPasswordField && !isVisible}
                    autoCapitalize={i === 0 ? 'words' : 'none'}
                    onFocus={() => setFocused(i)}
                    onBlur={() => setFocused(-1)}
                  />
                  {isPasswordField && (
                    <TouchableOpacity
                      style={styles.eyeBtn}
                      onPress={() => i === 2 ? setShowPassword((v) => !v) : setShowConfirm((v) => !v)}
                    >
                      {isVisible
                        ? <EyeOff size={18} color={theme.textMuted} />
                        : <Eye size={18} color={theme.textMuted} />}
                    </TouchableOpacity>
                  )}
                </View>
                {i === 2 && <PasswordStrengthBar password={password} />}
              </View>
            );
          })}

          {error ? <Text style={[styles.error, { color: theme.error }]}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.btn, { backgroundColor: theme.primary, opacity: loading ? 0.7 : 1 }]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Create Account</Text>}
          </TouchableOpacity>

          <View style={styles.loginRow}>
            <Text style={[styles.loginText, { color: theme.textSecondary }]}>Already have an account? </Text>
            <Link href="/login">
              <Text style={[styles.loginLink, { color: theme.primary }]}>Sign In</Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  header: { alignItems: 'center', marginBottom: 32 },
  appName: { fontSize: 40, fontFamily: 'Poppins-Bold' },
  tagline: { fontSize: 15, fontFamily: 'Poppins-Regular', marginTop: 4 },
  card: {
    borderRadius: 24, padding: 24,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 4,
  },
  cardTitle: { fontSize: 22, fontFamily: 'Poppins-Bold', marginBottom: 24 },
  inputWrapper: {
    borderWidth: 1.5, borderRadius: 12, marginBottom: 16, height: 56,
    justifyContent: 'center', position: 'relative', paddingHorizontal: 14,
  },
  floatLabel: { position: 'absolute', left: 14, fontFamily: 'Poppins-Regular' },
  input: { fontSize: 15, fontFamily: 'Poppins-Regular', paddingBottom: 4 },
  eyeBtn: { position: 'absolute', right: 14, top: 0, bottom: 0, justifyContent: 'center' },
  strengthWrapper: { flexDirection: 'row', alignItems: 'center', marginTop: -8, marginBottom: 16, gap: 8 },
  strengthBars: { flexDirection: 'row', gap: 4, flex: 1 },
  strengthSegment: { flex: 1, height: 4, borderRadius: 2 },
  strengthLabel: { fontSize: 12, fontFamily: 'Poppins-SemiBold', minWidth: 48 },
  error: { fontSize: 13, fontFamily: 'Poppins-Regular', marginBottom: 12 },
  btn: { borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginTop: 4 },
  btnText: { color: '#FFFFFF', fontSize: 16, fontFamily: 'Poppins-Bold' },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  loginText: { fontSize: 14, fontFamily: 'Poppins-Regular' },
  loginLink: { fontSize: 14, fontFamily: 'Poppins-Bold' },
});
