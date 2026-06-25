import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  FlatList, KeyboardAvoidingView, Platform, Animated, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Send } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useChat, ChatMessage } from '@/context/ChatContext';
import { callAI } from '@/services/aiService';

// Import the Message type from aiService
type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

const SUGGESTED_PROMPTS = [
  "I've been feeling anxious lately",
  "Help me challenge negative thoughts",
  "I need some motivation today",
  "Talk me through a breathing exercise",
];

function TypingDots() {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: -6, duration: 300, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
        ])
      );
    const a1 = anim(dot1, 0);
    const a2 = anim(dot2, 150);
    const a3 = anim(dot3, 300);
    a1.start(); a2.start(); a3.start();
    return () => { a1.stop(); a2.stop(); a3.stop(); };
  }, [dot1, dot2, dot3]);

  return (
    <View style={styles.typingContainer}>
      {[dot1, dot2, dot3].map((dot, i) => (
        <Animated.View key={i} style={[styles.typingDot, { transform: [{ translateY: dot }] }]} />
      ))}
    </View>
  );
}

export default function ChatModal() {
  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { messages, addMessage } = useChat();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
    };
    addMessage(userMsg);
    setInput('');
    setIsTyping(true);

    try {
      // Create the updated history including the message just sent
      const historyMessages = [userMsg, ...messages];
      const conversationHistory: Message[] = historyMessages.slice().reverse().map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text,
      }));

      // Call AI service
      console.log(`Calling AI with ${conversationHistory.length} messages...`);
      const response = await callAI(conversationHistory);
      console.log('AI Response received');

      const ataraMsg: ChatMessage = {
        id: `msg_${Date.now()}_atara`,
        text: response,
        sender: 'atara',
        timestamp: new Date(),
      };
      setIsTyping(false);
      addMessage(ataraMsg);
    } catch (error) {
      console.error('Error calling AI:', error);
      setIsTyping(false);
      Alert.alert(
        'Oops!',
        'Something went wrong. For testing, make sure you added your API key to constants/aiConfig.ts. For production, use Firebase Cloud Functions!',
        [{ text: 'OK' }]
      );
    }
  };

  const formatTime = (d: Date) =>
    d.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', hour12: true });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background, paddingTop: insets.top }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <View style={[styles.avatarWrapper, { backgroundColor: theme.accent + '33' }]}>
          <Text style={styles.avatarEmoji}>🧠</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={[styles.headerName, { color: theme.text }]}>Atara</Text>
          <Text style={[styles.headerStatus, { color: theme.accent }]}>● Online</Text>
        </View>
        <TouchableOpacity onPress={() => router.back()}>
          <X size={24} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        inverted
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          isTyping ? (
            <View style={[styles.bubble, styles.ataraContainer]}>
              <View style={[styles.ataraAvatar, { backgroundColor: theme.accent + '33' }]}>
                <Text>🧠</Text>
              </View>
              <View style={[styles.ataraBubble, { backgroundColor: theme.surfaceElevated }]}>
                <TypingDots />
              </View>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <View style={[styles.bubble, item.sender === 'user' ? styles.userContainer : styles.ataraContainer]}>
            {item.sender === 'atara' && (
              <View style={[styles.ataraAvatar, { backgroundColor: theme.accent + '33' }]}>
                <Text style={{ fontSize: 16 }}>🧠</Text>
              </View>
            )}
            <View style={[
              styles.bubbleInner,
              item.sender === 'user'
                ? { backgroundColor: theme.primary }
                : { backgroundColor: theme.surfaceElevated },
            ]}>
              <Text style={[
                styles.bubbleText,
                { color: item.sender === 'user' ? '#FFFFFF' : theme.text },
              ]}>
                {item.text}
              </Text>
              <Text style={[
                styles.bubbleTime,
                { color: item.sender === 'user' ? 'rgba(255,255,255,0.6)' : theme.textMuted },
              ]}>
                {formatTime(item.timestamp)}
              </Text>
            </View>
          </View>
        )}
        ListFooterComponent={
          messages.length === 1 ? (
            <View style={styles.suggestions}>
              <Text style={[styles.suggestionsLabel, { color: theme.textMuted }]}>Quick starts</Text>
              <View style={styles.suggestionsRow}>
                {SUGGESTED_PROMPTS.map((p) => (
                  <TouchableOpacity
                    key={p}
                    style={[styles.suggestionChip, { backgroundColor: theme.surface, borderColor: theme.border }]}
                    onPress={() => sendMessage(p)}
                  >
                    <Text style={[styles.suggestionText, { color: theme.text }]}>{p}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : null
        }
      />

      {/* Input */}
      <View style={[styles.inputBar, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
        <TextInput
          style={[styles.textInput, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
          value={input}
          onChangeText={setInput}
          placeholder="Message Atara..."
          placeholderTextColor={theme.textMuted}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendBtn, { backgroundColor: input.trim() ? theme.primary : theme.border }]}
          onPress={() => sendMessage(input)}
          disabled={!input.trim() || isTyping}
        >
          <Send size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16,
    paddingVertical: 14, borderBottomWidth: 1, gap: 12,
  },
  avatarWrapper: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  avatarEmoji: { fontSize: 22 },
  headerInfo: { flex: 1 },
  headerName: { fontSize: 16, fontFamily: 'Poppins-Bold' },
  headerStatus: { fontSize: 12, fontFamily: 'Poppins-SemiBold' },
  messagesList: { padding: 16, gap: 12, paddingBottom: 8 },
  bubble: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginBottom: 4 },
  userContainer: { justifyContent: 'flex-end' },
  ataraContainer: { justifyContent: 'flex-start' },
  ataraAvatar: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  ataraBubble: { borderRadius: 16, borderBottomLeftRadius: 4, paddingHorizontal: 14, paddingVertical: 12 },
  bubbleInner: {
    maxWidth: '78%', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 10,
  },
  bubbleText: { fontSize: 15, fontFamily: 'Poppins-Regular', lineHeight: 22 },
  bubbleTime: { fontSize: 10, fontFamily: 'Poppins-Regular', marginTop: 4, textAlign: 'right' },
  typingContainer: { flexDirection: 'row', gap: 4, paddingVertical: 4 },
  typingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#888' },
  suggestions: { marginTop: 8, gap: 8 },
  suggestionsLabel: { fontSize: 12, fontFamily: 'Poppins-SemiBold', textAlign: 'center' },
  suggestionsRow: { gap: 8 },
  suggestionChip: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10 },
  suggestionText: { fontSize: 14, fontFamily: 'Poppins-Regular' },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', padding: 12, gap: 8, borderTopWidth: 1 },
  textInput: {
    flex: 1, borderWidth: 1.5, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 10,
    fontSize: 15, fontFamily: 'Poppins-Regular', maxHeight: 100,
  },
  sendBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
});
