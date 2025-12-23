import { MessageCircle } from 'lucide-react';
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
      className="fixed bottom-6 right-6 z-40"
    >
      <motion.button
        whileHover={{ scale: 1.15, rotate: 10 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleChat}
        className="relative w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 shadow-2xl flex items-center justify-center text-white hover:shadow-3xl transition-all duration-300 border-2 border-blue-300"
        aria-label="Open chat"
      >
        <motion.div
          animate={{ y: isOpen ? 0 : -2 }}
          transition={{ duration: 0.2 }}
        >
          <MessageCircle size={24} />
        </motion.div>

        {/* Unread badge */}
        {unreadCount > 0 && !isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.div>
        )}

        {/* Pulse effect when not open */}
        {!isOpen && (
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full border-2 border-blue-300"
          />
        )}
      </motion.button>
    </motion.div>
  );
};

export default FloatingChatBadge;
