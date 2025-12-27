import React from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  language: string;
  isDarkMode?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange, language, isDarkMode }) => {
  const monacoLanguage = language.toLowerCase();

  return (
    <div className="w-full h-full bg-[#1e1e1e] overflow-hidden">
      <Editor
        height="100%"
        language={monacoLanguage}
        value={code}
        theme={isDarkMode ? "vs-dark" : "light"}
        onChange={(value) => onChange(value || '')}
        options={{
          fontSize: 14,
          fontFamily: '"JetBrains Mono", monospace',
          minimap: { enabled: true },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 4,
          padding: { top: 16 },
          wordWrap: 'on',
          lineNumbers: 'on',
          renderLineHighlight: 'all',
          cursorBlinking: 'smooth',
          smoothScrolling: true,
          fontLigatures: true
        }}
      />
      {/* Visual Overlay for Language */}
      <div className="absolute top-2 right-12 text-[10px] font-bold uppercase tracking-widest text-gray-500/50 pointer-events-none z-10">
        {language} ENGINE
      </div>
    </div>
  );
};