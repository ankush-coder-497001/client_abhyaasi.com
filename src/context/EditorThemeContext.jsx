import { createContext, useContext, useState, useEffect } from 'react';

/**
 * EditorTheme Context
 * Manages Monaco editor theme state (vs-dark / vs-light)
 */

const EditorThemeContext = createContext();

export const EditorThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Check localStorage or system preference
    const saved = localStorage.getItem('editorTheme');
    if (saved) {
      return saved;
    }

    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'vs-dark';
    }

    return 'vs-light';
  });

  // Persist theme to localStorage
  useEffect(() => {
    localStorage.setItem('editorTheme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'vs-dark' ? 'vs-light' : 'vs-dark');
  };

  const value = {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === 'vs-dark'
  };

  return (
    <EditorThemeContext.Provider value={value}>
      {children}
    </EditorThemeContext.Provider>
  );
};

/**
 * Hook to use editor theme
 * @returns {Object} - { theme, setTheme, toggleTheme, isDark }
 */
export const useEditorTheme = () => {
  const context = useContext(EditorThemeContext);
  if (!context) {
    throw new Error('useEditorTheme must be used within EditorThemeProvider');
  }
  return context;
};
