import React, { useRef, useState } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/themes/prism-tomorrow.css'; // Dark theme

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  language: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange, language }) => {
  const [scrollTop, setScrollTop] = useState(0);
  
  // Map softvibe languages to Prism languages
  const getLanguage = (lang: string) => {
    switch (lang.toLowerCase()) {
      case 'python': return languages.python;
      case 'java': return languages.java;
      case 'c': return languages.c;
      default: return languages.clike;
    }
  };

  const currentLanguage = getLanguage(language);

  // Synchronize scrolling between editor and line numbers
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  // Generate line numbers
  const lineNumbers = code.split('\n').map((_, i) => i + 1);

  return (
    <div className="relative w-full h-full bg-[#1e1e1e] flex text-sm font-mono overflow-hidden">
      {/* Line Numbers Column */}
      <div 
        className="bg-[#2d2d2d] text-gray-500 text-right select-none border-r border-gray-700 hidden sm:block overflow-hidden min-w-[3.5rem]"
        style={{
          paddingTop: '16px', // Match Editor padding
          paddingBottom: '16px'
        }}
      >
        <div 
          className="pr-4"
          style={{ 
            transform: `translateY(-${scrollTop}px)`,
            transition: 'transform 0s', // Instant sync
            lineHeight: '1.5', // Match Prism line-height
            fontFamily: '"JetBrains Mono", monospace' 
          }}
        >
          {lineNumbers.map(n => (
            <div key={n}>{n}</div>
          ))}
        </div>
      </div>
      
      {/* Editor Area */}
      <div 
        className="flex-1 h-full overflow-auto custom-scrollbar relative"
        onScroll={handleScroll}
      >
        <Editor
          value={code}
          onValueChange={onChange}
          highlight={code => highlight(code, currentLanguage, language.toLowerCase())}
          padding={16}
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 14,
            backgroundColor: 'transparent',
            minHeight: '100%',
            lineHeight: '1.5'
          }}
          textareaClassName="focus:outline-none"
        />
      </div>
      
      {/* Language Badge */}
      <div className="absolute top-2 right-4 text-xs text-gray-400 bg-[#2d2d2d] px-2 py-1 rounded opacity-80 pointer-events-none z-10 border border-gray-700 shadow-sm">
        {language}
      </div>
    </div>
  );
};