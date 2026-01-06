import { Sparkles } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { motion } from 'framer-motion';

const FloatingChatBadge = () => {
  const { isOpen, toggleChat, messages } = useChat();
  const unreadCount = messages.filter(m => m.sender === 'ai').length;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40"
    >
      <motion.button
        whileHover={{ scale: 1.15, rotate: 10 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleChat}
        className="relative w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-700 shadow-xl hover:shadow-2xl flex items-center justify-center text-white transition-all duration-300 border-2 border-purple-300"
        aria-label="Open AI assistant"
        title="AI Assistant"
      >
        <motion.div
          animate={{ y: isOpen ? 0 : -2 }}
          transition={{ duration: 0.2 }}
        >
          <Sparkles size={20} className="md:w-6 md:h-6" />
        </motion.div>

        {/* Unread badge */}
        {unreadCount > 0 && !isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center shadow-lg"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.div>
        )}

        {/* Pulse effect when not open - AI Theme */}
        {!isOpen && (
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0.3, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full border-2 border-purple-300"
          />
        )}
      </motion.button>
    </motion.div>
  );
};

export default FloatingChatBadge;
