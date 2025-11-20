import { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import TextInput from './components/TextInput.jsx';
import DiffViewer from './components/DiffViewer.jsx';

function Background() {
  return null;
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
    <div className="relative flex min-h-screen flex-col bg-accent-50 text-primary-900">
      <Background />
      
      <main className="relative z-10 mx-auto w-full max-w-7xl flex-1 px-6 py-8">
        <Header />

        {/* Controls */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('split')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors border ${
                viewMode === 'split'
                  ? 'bg-tertiary-100 text-tertiary-700 border-tertiary-300'
                  : 'bg-white text-primary-600 hover:bg-accent-100 border-primary-200'
              }`}
            >
              Split View
            </button>
            <button
              onClick={() => setViewMode('diff')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors border ${
                viewMode === 'diff'
                  ? 'bg-tertiary-100 text-tertiary-700 border-tertiary-300'
                  : 'bg-white text-primary-600 hover:bg-accent-100 border-primary-200'
              }`}
            >
              Diff View
            </button>
          </div>

          <div className="flex gap-2">
            {viewMode === 'diff' && (
              <button
                onClick={() => setShowCharDiff(!showCharDiff)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors border ${
                  showCharDiff
                    ? 'bg-tertiary-100 text-tertiary-700 border-tertiary-300'
                    : 'bg-white text-primary-600 hover:bg-accent-100 border-primary-200'
                }`}
                title="Toggle character-level highlighting"
              >
                Char Diff
              </button>
            )}
            <button
              onClick={handleSwap}
              className="rounded-lg bg-white border border-primary-300 px-4 py-2 text-sm font-medium text-primary-700 transition-colors hover:bg-accent-100"
              title="Swap left and right text"
            >
              ⇄ Swap
            </button>
            <button
              onClick={handleClearBoth}
              className="rounded-lg bg-white border border-primary-300 px-4 py-2 text-sm font-medium text-primary-700 transition-colors hover:bg-accent-100"
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
            <div className="flex flex-col rounded-xl border border-primary-200 bg-white p-6">
              <TextInput
                value={text1}
                onChange={setText1}
                label="Original Text"
                placeholder="Paste or type your original text here..."
                storageKey="diffBro_text1"
              />
            </div>
            <div className="flex flex-col rounded-xl border border-primary-200 bg-white p-6">
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
          <div className="rounded-xl border border-primary-200 bg-white p-6">
            <DiffViewer text1={text1} text2={text2} showCharDiff={showCharDiff} />
          </div>
        )}

        {/* Tips */}
        <div className="mt-8 rounded-xl border border-primary-200 bg-white p-6">
          <h3 className="mb-3 text-lg font-display font-semibold text-primary-900">
            💡 Tips
          </h3>
          <ul className="space-y-2 text-sm text-primary-700">
            <li className="flex items-start gap-2">
              <span className="text-primary-600">•</span>
              <span>Use <strong className="text-primary-900">Split View</strong> to edit both texts side-by-side</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600">•</span>
              <span>Switch to <strong className="text-primary-900">Diff View</strong> to see highlighted differences</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600">•</span>
              <span>Toggle <strong className="text-primary-900">Char Diff</strong> to see character-level changes within modified lines</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600">•</span>
              <span>Your text is automatically saved in your browser</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600">•</span>
              <span>Green = Added, Red = Removed, Orange = Modified</span>
            </li>
          </ul>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-primary-200 bg-accent-100 py-4 text-center text-xs text-primary-600">
        <p>&copy; {new Date().getFullYear()} Amer Kovacevic All rights reserved.</p>
      </footer>
    </div>
  );
}

