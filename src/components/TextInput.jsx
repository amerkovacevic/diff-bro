import { useState, useEffect } from 'react';

export default function TextInput({ value, onChange, label, placeholder, storageKey }) {
  const [charCount, setCharCount] = useState(0);
  const [lineCount, setLineCount] = useState(0);

  useEffect(() => {
    setCharCount(value.length);
    setLineCount(value.split('\n').length);
  }, [value]);

  const handleClear = () => {
    onChange('');
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      onChange(text);
    } catch (err) {
      console.error('Failed to read clipboard:', err);
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-display font-semibold text-accent-50">{label}</h3>
          <span className="text-xs text-quaternary-500">
            {lineCount} {lineCount === 1 ? 'line' : 'lines'} · {charCount} {charCount === 1 ? 'char' : 'chars'}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlePaste}
            className="rounded-lg bg-tertiary-700 px-3 py-1.5 text-xs font-medium text-accent-50 transition-colors hover:bg-tertiary-600"
            title="Paste from clipboard"
          >
            Paste
          </button>
          <button
            onClick={handleClear}
            className="rounded-lg bg-secondary-600 px-3 py-1.5 text-xs font-medium text-accent-50 transition-colors hover:bg-secondary-500"
            title="Clear text"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Text Area */}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 w-full resize-none rounded-lg border border-tertiary-600/50 bg-primary-700 p-4 font-mono text-sm text-accent-50 placeholder-quaternary-600 focus:border-tertiary-500 focus:outline-none focus:ring-2 focus:ring-tertiary-500/50"
        spellCheck="false"
      />
    </div>
  );
}

