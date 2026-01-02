import { MessageCircle, X } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { motion } from 'framer-motion';

const FloatingChatButton = () => {
  const { isOpen, toggleChat } = useChat();

  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleChat}
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 md:left-auto md:right-6 md:bottom-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-2xl flex items-center justify-center text-white hover:shadow-3xl transition-all duration-300"
      aria-label="Open chat"
    >
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <MessageCircle size={24} />
        )}
      </motion.div>
    </motion.button>
  );
};

export default FloatingChatButton;
