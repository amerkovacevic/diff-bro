import { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import TextInput from './components/TextInput.jsx';
import DiffViewer from './components/DiffViewer.jsx';

function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(65,90,119,0.12),_rgba(13,27,42,0.95))]" />
    </div>
  );
}

export default function App() {
  // Load initial values from localStorage
  const [text1, setText1] = useState(() => {
    try {
      return localStorage.getItem('diffBro_text1') || '';
    } catch {
      return '';
    }
  });

  const [text2, setText2] = useState(() => {
    try {
      return localStorage.getItem('diffBro_text2') || '';
    } catch {
      return '';
    }
  });

  const [viewMode, setViewMode] = useState('split'); // 'split' or 'diff'
  const [showCharDiff, setShowCharDiff] = useState(true);

  // Save to localStorage whenever text changes
  useEffect(() => {
    try {
      localStorage.setItem('diffBro_text1', text1);
    } catch (err) {
      console.error('Failed to save text1:', err);
    }
  }, [text1]);

  useEffect(() => {
    try {
      localStorage.setItem('diffBro_text2', text2);
    } catch (err) {
      console.error('Failed to save text2:', err);
    }
  }, [text2]);

  const handleSwap = () => {
    const temp = text1;
    setText1(text2);
    setText2(temp);
  };

  const handleClearBoth = () => {
    setText1('');
    setText2('');
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-primary-800 text-accent-50">
      <Background />
      
      <main className="relative z-10 mx-auto w-full max-w-7xl flex-1 px-6 py-8">
        <Header />

        {/* Controls */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('split')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === 'split'
                  ? 'bg-tertiary-600 text-accent-50'
                  : 'bg-secondary-700 text-quaternary-400 hover:bg-secondary-600'
              }`}
            >
              Split View
            </button>
            <button
              onClick={() => setViewMode('diff')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === 'diff'
                  ? 'bg-tertiary-600 text-accent-50'
                  : 'bg-secondary-700 text-quaternary-400 hover:bg-secondary-600'
              }`}
            >
              Diff View
            </button>
          </div>

          <div className="flex gap-2">
            {viewMode === 'diff' && (
              <button
                onClick={() => setShowCharDiff(!showCharDiff)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  showCharDiff
                    ? 'bg-tertiary-600 text-accent-50'
                    : 'bg-secondary-700 text-quaternary-400 hover:bg-secondary-600'
                }`}
                title="Toggle character-level highlighting"
              >
                Char Diff
              </button>
            )}
            <button
              onClick={handleSwap}
              className="rounded-lg bg-secondary-700 px-4 py-2 text-sm font-medium text-accent-50 transition-colors hover:bg-secondary-600"
              title="Swap left and right text"
            >
              ⇄ Swap
            </button>
            <button
              onClick={handleClearBoth}
              className="rounded-lg bg-secondary-700 px-4 py-2 text-sm font-medium text-accent-50 transition-colors hover:bg-secondary-600"
              title="Clear all text"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        {viewMode === 'split' ? (
          // Split View - Side by side text inputs
          <div className="grid gap-6 lg:grid-cols-2" style={{ minHeight: '500px' }}>
            <div className="flex flex-col rounded-xl border border-tertiary-600/50 bg-primary-700/50 p-6">
              <TextInput
                value={text1}
                onChange={setText1}
                label="Original Text"
                placeholder="Paste or type your original text here..."
                storageKey="diffBro_text1"
              />
            </div>
            <div className="flex flex-col rounded-xl border border-tertiary-600/50 bg-primary-700/50 p-6">
              <TextInput
                value={text2}
                onChange={setText2}
                label="Modified Text"
                placeholder="Paste or type your modified text here..."
                storageKey="diffBro_text2"
              />
            </div>
          </div>
        ) : (
          // Diff View - Show differences
          <div className="rounded-xl border border-tertiary-600/50 bg-primary-700/50 p-6">
            <DiffViewer text1={text1} text2={text2} showCharDiff={showCharDiff} />
          </div>
        )}

        {/* Tips */}
        <div className="mt-8 rounded-xl border border-tertiary-600/30 bg-secondary-700/50 p-6">
          <h3 className="mb-3 text-lg font-display font-semibold text-accent-50">
            💡 Tips
          </h3>
          <ul className="space-y-2 text-sm text-quaternary-300">
            <li className="flex items-start gap-2">
              <span className="text-tertiary-400">•</span>
              <span>Use <strong className="text-accent-50">Split View</strong> to edit both texts side-by-side</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-tertiary-400">•</span>
              <span>Switch to <strong className="text-accent-50">Diff View</strong> to see highlighted differences</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-tertiary-400">•</span>
              <span>Toggle <strong className="text-accent-50">Char Diff</strong> to see character-level changes within modified lines</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-tertiary-400">•</span>
              <span>Your text is automatically saved in your browser</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-tertiary-400">•</span>
              <span>Green = Added, Red = Removed, Orange = Modified</span>
            </li>
          </ul>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-tertiary-500/30 bg-primary-800/80 py-4 text-center text-xs text-quaternary-500">
        <p>&copy; {new Date().getFullYear()} Amer Kovacevic All rights reserved.</p>
      </footer>
    </div>
  );
}

