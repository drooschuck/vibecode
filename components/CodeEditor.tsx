import React from 'react';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  language: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange, language }) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  // Simple line number generation
  const lineNumbers = code.split('\n').map((_, i) => i + 1).join('\n');

  return (
    <div className="relative w-full h-full min-h-[400px] bg-[#1e1e1e] rounded-lg overflow-hidden flex text-sm font-mono shadow-inner border border-gray-700">
      {/* Line Numbers */}
      <div className="bg-[#2d2d2d] text-gray-500 p-4 text-right select-none leading-6 border-r border-gray-700 hidden sm:block">
        <pre>{lineNumbers}</pre>
      </div>
      
      {/* Text Area */}
      <textarea
        value={code}
        onChange={handleChange}
        className="flex-1 bg-[#1e1e1e] text-gray-200 p-4 resize-none outline-none border-none leading-6 w-full custom-scrollbar whitespace-pre"
        spellCheck={false}
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
      />
      
      <div className="absolute top-2 right-2 text-xs text-gray-500 bg-[#2d2d2d] px-2 py-1 rounded uppercase opacity-70">
        {language}
      </div>
    </div>
  );
};