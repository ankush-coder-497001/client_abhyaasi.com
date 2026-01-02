import Editor from "@monaco-editor/react";
import { memo } from "react";

/**
 * CodeEditor Component
 * A Monaco Editor wrapper with syntax highlighting, multiple language support, and themes
 * 
 * Features:
 * - Syntax highlighting for multiple languages
 * - Light/Dark theme support
 * - Automatic layout adjustment
 * - Customizable editor options
 * 
 * Performance Notes:
 * - Memoized to prevent re-mounting on parent re-renders
 * - Avoid multiple editors on one page
 * - Uses automaticLayout for responsive sizing
 */

const CodeEditor = memo(
  function CodeEditor({
    code,
    setCode,
    language = "javascript",
    theme = "vs-dark",
    height = "500px",
    readOnly = false,
    onMount,
    className = ""
  }) {
    const handleEditorChange = (value) => {
      if (setCode && !readOnly) {
        setCode(value || "");
      }
    };

    return (
      <div className={`w-full h-full ${className}`}>
        <Editor
          height="50vh"
          defaultLanguage={language}
          language={language}
          theme={theme}
          value={code}
          onChange={handleEditorChange}
          onMount={onMount}
          options={{
            // Layout
            fontSize: 14,
            lineHeight: 1.6,
            fontFamily: "'Fira Code', 'Courier New', monospace",

            // Editor features
            minimap: { enabled: false },
            automaticLayout: true,
            scrollBeyondLastLine: false,
            wordWrap: "on",
            wrappingIndent: "indent",

            // Behavior
            readOnly: readOnly,
            quickSuggestions: {
              other: true,
              comments: false,
              strings: false
            },
            suggestOnTriggerCharacters: true,
            tabSize: 2,
            insertSpaces: true,

            // Rendering
            renderWhitespace: "none",
            smoothScrolling: true,

            // Additional
            bracketPairColorization: true,
            "bracketPairColorization.independentColorPoolPerBracketType": true,
            semanticHighlighting: true
          }}
        />
      </div>
    );
  }
);

CodeEditor.displayName = "CodeEditor";

export default CodeEditor;
