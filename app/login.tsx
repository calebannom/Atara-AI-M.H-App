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

export default function Login() {
  const { theme } = useTheme();
  const { signIn } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      router.replace('/(tabs)');
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // Google OAuth — wire up with Supabase signInWithOAuth when backend is ready
    setError('Google sign-in coming soon.');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background, paddingTop: insets.top }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={[styles.appName, { color: theme.primary }]}>Atara</Text>
          <Text style={[styles.tagline, { color: theme.textSecondary }]}>Your mental health companion</Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.surface, shadowColor: theme.text }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Welcome back</Text>

          <View style={[styles.inputWrapper, { borderColor: emailFocused ? theme.primary : theme.border, backgroundColor: theme.inputBg }]}>
            <Text style={[styles.floatLabel, { color: emailFocused || email ? theme.primary : theme.textMuted, fontSize: emailFocused || email ? 11 : 14, top: emailFocused || email ? 6 : 18 }]}>Email</Text>
            <TextInput
              style={[styles.input, { color: theme.text, paddingTop: email || emailFocused ? 20 : 14 }]}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
            />
          </View>

          <View style={[styles.inputWrapper, { borderColor: passFocused ? theme.primary : theme.border, backgroundColor: theme.inputBg }]}>
            <Text style={[styles.floatLabel, { color: passFocused || password ? theme.primary : theme.textMuted, fontSize: passFocused || password ? 11 : 14, top: passFocused || password ? 6 : 18 }]}>Password</Text>
            <TextInput
              style={[styles.input, { color: theme.text, paddingTop: password || passFocused ? 20 : 14, paddingRight: 44 }]}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              onFocus={() => setPassFocused(true)}
              onBlur={() => setPassFocused(false)}
            />
            <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPassword((v) => !v)}>
              {showPassword
                ? <EyeOff size={18} color={theme.textMuted} />
                : <Eye size={18} color={theme.textMuted} />}
            </TouchableOpacity>
          </View>

          {error ? <Text style={[styles.error, { color: theme.error }]}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.btn, { backgroundColor: theme.primary, opacity: loading ? 0.7 : 1 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Sign In</Text>}
          </TouchableOpacity>

          <View style={[styles.divider, { borderColor: theme.border }]}>
            <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
            <Text style={[styles.dividerText, { color: theme.textMuted }]}>or</Text>
            <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
          </View>

          <TouchableOpacity
            style={[styles.googleBtn, { borderColor: theme.border, backgroundColor: theme.surface }]}
            onPress={handleGoogleSignIn}
          >
            <Text style={styles.googleIcon}>G</Text>
            <Text style={[styles.googleText, { color: theme.text }]}>Continue with Google</Text>
          </TouchableOpacity>

          <View style={styles.registerRow}>
            <Text style={[styles.registerText, { color: theme.textSecondary }]}>Don&apos;t have an account? </Text>
            <Link href="/register">
              <Text style={[styles.registerLink, { color: theme.primary }]}>Register</Text>
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
  error: { fontSize: 13, fontFamily: 'Poppins-Regular', marginBottom: 12 },
  btn: { borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginTop: 4 },
  btnText: { color: '#FFFFFF', fontSize: 16, fontFamily: 'Poppins-Bold' },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { marginHorizontal: 12, fontFamily: 'Poppins-Regular', fontSize: 13 },
  googleBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderRadius: 16, paddingVertical: 14, gap: 10,
  },
  googleIcon: { fontSize: 18, fontFamily: 'Poppins-Bold', color: '#4285F4' },
  googleText: { fontSize: 15, fontFamily: 'Poppins-SemiBold' },
  registerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  registerText: { fontSize: 14, fontFamily: 'Poppins-Regular' },
  registerLink: { fontSize: 14, fontFamily: 'Poppins-Bold' },
});
