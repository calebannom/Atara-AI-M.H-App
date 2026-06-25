import React, { createContext, useContext, useState } from 'react';

export type ChatMessage = {
  id: string;
  text: string;
  sender: 'user' | 'atara';
  timestamp: Date;
};

const OPENING_MESSAGE: ChatMessage = {
  id: 'opening',
  text: "Hi! I'm Atara, your mental health companion 🌿. I'm here to listen, support, and help you reflect. How are you feeling today?",
  sender: 'atara',
  timestamp: new Date(),
};

type ChatContextType = {
  messages: ChatMessage[];
  addMessage: (msg: ChatMessage) => void;
  clearMessages: () => void;
};

const ChatContext = createContext<ChatContextType>({
  messages: [OPENING_MESSAGE],
  addMessage: () => {},
  clearMessages: () => {},
});

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([OPENING_MESSAGE]);

  const addMessage = (msg: ChatMessage) => {
    setMessages((prev) => [msg, ...prev]);
  };

  const clearMessages = () => {
    setMessages([OPENING_MESSAGE]);
  };

  return (
    <ChatContext.Provider value={{ messages, addMessage, clearMessages }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext);
