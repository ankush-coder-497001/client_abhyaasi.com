import { useState, useRef, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader, ChevronDown, ChevronUp, Copy, X } from 'lucide-react';
import { Trash2 } from 'lucide-react';

const FLOATING_SUGGESTIONS = [
  'Help with courses',
  'Track my progress',
  'Show leaderboard',
  'About professions',
  'Get recommendations',
];

const ChatDialog = () => {
  const { isOpen, messages, sendChatMessage, isLoading, clearChat, toggleChat } = useChat();
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [expandedMessageId, setExpandedMessageId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputValue.trim() === '' || isLoading) return;

    const messageToSend = inputValue;
    setInputValue('');
    setIsSending(true);

    await sendChatMessage(messageToSend);

    setIsSending(false);
  };

  // Calculate text size based on message length
  const getTextSize = (text) => {
    const length = text.length;
    if (length < 50) return 'text-sm';
    if (length < 150) return 'text-sm';
    if (length < 300) return 'text-xs';
    return 'text-xs';
  };

  const handleSuggestionClick = async (suggestion) => {
    setInputValue(suggestion);
    await sendChatMessage(suggestion);
  };

  const handleCopyMessage = (text, messageId) => {
    navigator.clipboard.writeText(text);
    setCopiedId(messageId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleExpandMessage = (messageId) => {
    setExpandedMessageId(expandedMessageId === messageId ? null : messageId);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Mobile overlay backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-30 md:hidden"
            onClick={toggleChat}
          />

          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 md:bottom-24 md:right-6 md:left-auto z-40 w-full md:w-96 h-[90vh] md:h-auto md:max-h-[700px] bg-white rounded-t-3xl md:rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100"
          >
            {/* Drag handle for mobile */}
            <div className="md:hidden flex justify-center pt-2 pb-1">
              <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
            </div>

            {/* Header */}
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 px-4 md:px-6 py-3 md:py-4 flex-shrink-0"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold text-base md:text-lg">Chat Assistant</h3>
                  <p className="text-blue-100 text-xs md:text-sm">Online • Always here to help</p>
                </div>
                <div className="flex items-center gap-2">
                  {/* Mobile close button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleChat}
                    className="md:hidden text-blue-100 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-blue-400/30"
                    title="Close chat"
                  >
                    <X size={18} />
                  </motion.button>

                  {/* Clear chat button */}
                  <motion.button
                    whileHover={{ rotate: 90, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={clearChat}
                    className="text-blue-100 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-blue-400/30"
                    title="Clear chat history"
                  >
                    <Trash2 size={18} />
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-4 md:space-y-5 bg-gradient-to-b from-gray-50 to-white min-h-0">
              {messages.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="h-full flex items-center justify-center"
                >
                  <div className="text-center text-gray-500">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-5xl mb-3"
                    >
                      💬
                    </motion.div>
                    <p className="font-semibold text-gray-700">No messages yet</p>
                    <p className="text-sm text-gray-500">Ask me anything about the platform</p>
                  </div>
                </motion.div>
              ) : (
                messages.map((message, index) => {
                  const isExpanded = expandedMessageId === message.id;
                  const isCopied = copiedId === message.id;
                  const textSizeClass = getTextSize(message.text);

                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10, x: message.sender === 'user' ? 10 : -10 }}
                      animate={{ opacity: 1, y: 0, x: 0 }}
                      transition={{ duration: 0.2, type: 'spring' }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'
                        } group`}
                    >
                      <div
                        className={`relative max-w-[80%] sm:max-w-xs md:max-w-xs ${isExpanded ? 'sm:max-w-sm md:max-w-md' : 'max-w-[80%] sm:max-w-xs md:max-w-xs'
                          } transition-all ${message.sender === 'user'
                            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-none shadow-md'
                            : `${message.error
                              ? 'bg-red-50 text-red-800'
                              : 'bg-white text-gray-800'
                            } rounded-bl-none border ${message.error ? 'border-red-200' : 'border-gray-200'
                            } shadow-sm`
                          } px-3 md:px-4 py-2 md:py-3 rounded-lg`}
                      >
                        {/* Message text with responsive sizing */}
                        <p
                          className={`break-words leading-relaxed text-xs sm:text-sm ${textSizeClass} ${isExpanded ? 'whitespace-normal' : 'line-clamp-4'
                            }`}
                        >
                          {message.text}
                        </p>

                        {/* Timestamp */}
                        <p
                          className={`text-xs mt-1 md:mt-2 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                            }`}
                        >
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>

                        {/* Action buttons for AI messages */}
                        {message.sender === 'ai' && !message.error && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                            className="flex gap-1 mt-2 pt-2 border-t border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            {message.text.length > 100 && (
                              <button
                                onClick={() => toggleExpandMessage(message.id)}
                                className="text-gray-500 hover:text-gray-700 p-1 rounded transition-colors"
                                title={isExpanded ? 'Collapse' : 'Expand'}
                              >
                                {isExpanded ? (
                                  <ChevronUp size={14} />
                                ) : (
                                  <ChevronDown size={14} />
                                )}
                              </button>
                            )}
                            <button
                              onClick={() => handleCopyMessage(message.text, message.id)}
                              className="text-gray-500 hover:text-gray-700 p-1 rounded transition-colors"
                              title="Copy message"
                            >
                              <Copy size={14} />
                            </button>
                          </motion.div>
                        )}

                        {/* Copy feedback */}
                        {isCopied && (
                          <motion.span
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-xs text-green-600 mt-1 block"
                          >
                            ✓ Copied
                          </motion.span>
                        )}
                      </div>
                    </motion.div>
                  );
                })
              )}

              {/* Loading indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring' }}
                  className="flex justify-start"
                >
                  <div className="bg-white text-gray-800 px-4 py-3 rounded-lg rounded-bl-none border border-gray-200 shadow-sm flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Loader size={16} className="text-blue-500" />
                    </motion.div>
                    <span className="text-sm text-gray-600 font-medium">AI is thinking...</span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>



            {/* Input Form */}
            <motion.form
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
              onSubmit={handleSendMessage}
              className="border-t border-gray-200 p-3 md:p-4 bg-white flex-shrink-0"
            >
              <div className="flex gap-1.5 md:gap-2">
                <motion.input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type message..."
                  disabled={isLoading || isSending}
                  className="flex-1 px-3 md:px-4 py-2 md:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all text-xs md:text-sm"
                  whileFocus={{ scale: 1.01 }}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={isLoading || isSending || inputValue.trim() === ''}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-300 text-white px-3 md:px-4 py-2 md:py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-lg"
                >
                  <motion.div
                    animate={isSending ? { y: [0, -3, 0] } : {}}
                    transition={{ duration: 0.5, repeat: isSending ? Infinity : 0 }}
                  >
                    <Send size={16} className="md:w-[18px] md:h-[18px]" />
                  </motion.div>
                </motion.button>
              </div>
            </motion.form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ChatDialog;
