import { Sparkles, X } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { motion } from 'framer-motion';

const FloatingChatButton = () => {
  const { isOpen, toggleChat } = useChat();

  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleChat}
      className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-700 shadow-xl hover:shadow-2xl flex items-center justify-center text-white transition-all duration-300 border-2 border-purple-300"
      aria-label="Open AI assistant"
      title="AI Assistant"
    >
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0, scale: isOpen ? 0.8 : 1 }}
        transition={{ duration: 0.3 }}
      >
        {isOpen ? (
          <X size={20} className="md:w-6 md:h-6" />
        ) : (
          <Sparkles size={20} className="md:w-6 md:h-6" />
        )}
      </motion.div>

      {/* Pulse effect for AI */}
      {!isOpen && (
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0.3, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full border-2 border-purple-300"
        />
      )}
    </motion.button>
  );
};

export default FloatingChatButton;
