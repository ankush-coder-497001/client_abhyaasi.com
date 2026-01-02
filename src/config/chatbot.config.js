/**
 * Chatbot Configuration
 * Customize the chatbot appearance and behavior
 */

export const CHATBOT_CONFIG = {
  // Storage
  storage: {
    key: 'abhyaasi_chat_history',
    maxMessages: 100, // Maximum messages to store
  },

  // Appearance
  appearance: {
    // Colors
    primaryColor: 'from-blue-500 to-blue-600',
    hoverColor: 'from-blue-600 to-blue-700',
    accentColor: 'indigo-600',

    // Sizing
    buttonSize: 'w-14 h-14',
    dialogWidth: 'w-96',
    dialogMaxHeight: 'max-h-[600px]',

    // Borders & Shadows
    borderRadius: 'rounded-2xl',
    buttonBorderRadius: 'rounded-full',
    shadowLevel: '2xl', // sm, md, lg, xl, 2xl
  },

  // Animation Settings
  animations: {
    // Duration in milliseconds
    dialogAnimationDuration: 0.3,
    messageAnimationDuration: 0.2,
    buttonAnimationDuration: 0.3,

    // Spring Physics (for framer-motion)
    spring: {
      stiffness: 300,
      damping: 30,
      mass: 1,
    },

    // Enable/Disable animations
    enableButtonPulse: true,
    enableMessageAnimation: true,
    enableLoadingSpinner: true,
  },

  // Content
  content: {
    // Button tooltip
    buttonLabel: 'Open chat',

    // Dialog Header
    headerTitle: 'Chat Assistant',
    headerSubtitle: 'Online • Always here to help',

    // Placeholder Text
    inputPlaceholder: 'Type your message...',

    // Empty State
    emptyStateEmoji: '💬',
    emptyStateTitle: 'No messages yet',
    emptyStateSubtitle: 'Ask me anything about the platform',

    // Loading State
    loadingMessage: 'AI is thinking...',

    // Error Messages
    errorMessage: 'Sorry, something went wrong. Please try again.',
    errorProcessing: 'Failed to process your message.',

    // Buttons
    sendButtonLabel: 'Send',
    clearButtonLabel: 'Clear chat history',
  },

  // API Configuration
  api: {
    endpoint: '/api/v1/AI/chat',
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
    retryDelay: 1000, // 1 second
  },

  // Feature Flags
  features: {
    enableBadgeCounter: true, // Show unread count
    enableClearButton: true, // Show clear history button
    enableTimestamps: true, // Show message timestamps
    enableAutoScroll: true, // Auto-scroll to latest message
    persistHistory: true, // Save chat to localStorage
    enableTypingIndicator: false, // Show typing effect (future)
    enableVoiceInput: false, // Voice messages (future)
  },

  // Positioning
  positioning: {
    position: 'fixed',
    bottom: '1.5rem', // bottom-6
    right: '1.5rem', // right-6
    zIndex: 40,

    dialogBottom: '6rem', // bottom-24
    dialogRight: '1.5rem', // right-6
  },

  // Responsive Settings
  responsive: {
    breakpoint: 640, // pixels (sm in Tailwind)
    mobileDialogMargin: '16px',
    mobileButtonMargin: '16px',
  },

  // Logging
  debug: {
    enableLogging: false,
    logApiCalls: false,
    logStorageOperations: false,
  },
};

/**
 * Customize appearance easily:
 * 
 * Example: Change to purple theme
 * primaryColor: 'from-purple-500 to-purple-600',
 * 
 * Example: Dark theme
 * primaryColor: 'from-gray-800 to-gray-900',
 * 
 * Example: Green theme
 * primaryColor: 'from-green-500 to-green-600',
 */

// Pre-made themes
export const CHATBOT_THEMES = {
  light: {
    primaryColor: 'from-blue-500 to-blue-600',
    hoverColor: 'from-blue-600 to-blue-700',
    backgroundColor: 'bg-white',
    textColor: 'text-gray-800',
  },

  dark: {
    primaryColor: 'from-gray-800 to-gray-900',
    hoverColor: 'from-gray-700 to-gray-800',
    backgroundColor: 'bg-gray-900',
    textColor: 'text-white',
  },

  purple: {
    primaryColor: 'from-purple-500 to-purple-600',
    hoverColor: 'from-purple-600 to-purple-700',
    backgroundColor: 'bg-white',
    textColor: 'text-gray-800',
  },

  green: {
    primaryColor: 'from-green-500 to-green-600',
    hoverColor: 'from-green-600 to-green-700',
    backgroundColor: 'bg-white',
    textColor: 'text-gray-800',
  },

  orange: {
    primaryColor: 'from-orange-500 to-orange-600',
    hoverColor: 'from-orange-600 to-orange-700',
    backgroundColor: 'bg-white',
    textColor: 'text-gray-800',
  },
};

export default CHATBOT_CONFIG;
