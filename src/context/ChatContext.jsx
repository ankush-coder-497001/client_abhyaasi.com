import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { sendMessage } from '../api_services/aichat.api';

const ChatContext = createContext();
const CHAT_STORAGE_KEY = 'abhyaasi_chat_history';

export const ChatProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load chat history from localStorage on mount
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem(CHAT_STORAGE_KEY);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  }, []);

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error('Failed to save chat history:', error);
    }
  }, [messages]);

  const toggleChat = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const addMessage = useCallback((message) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const sendChatMessage = useCallback(async (userMessage) => {
    // Add user message
    addMessage({
      id: Date.now(),
      text: userMessage,
      sender: 'user',
      timestamp: new Date(),
    });

    setIsLoading(true);

    try {
      const response = await sendMessage(userMessage);

      // Clean asterisks from AI response
      let aiResponse = response.data.response || 'Sorry, I could not process your message.';
      aiResponse = aiResponse.replace(/\*/g, '');

      // Add AI response
      addMessage({
        id: Date.now() + 1,
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
      });
    } catch (error) {
      console.error('Chat error:', error);
      addMessage({
        id: Date.now() + 1,
        text: 'Sorry, something went wrong. Please try again.',
        sender: 'ai',
        timestamp: new Date(),
        error: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [addMessage]);

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  const value = {
    isOpen,
    toggleChat,
    messages,
    addMessage,
    sendChatMessage,
    isLoading,
    clearChat,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};
