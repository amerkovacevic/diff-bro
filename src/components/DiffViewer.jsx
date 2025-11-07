import { useMemo } from 'react';
import { calculateDiff, getDiffStats, getCharacterDiff } from '../utils/diffUtils.js';

function DiffLine({ line, showCharDiff = false, otherLine }) {
  const getLineClass = (type) => {
    switch (type) {
      case 'added':
        return 'bg-success-900/20 border-l-4 border-success-500';
      case 'removed':
        return 'bg-error-900/20 border-l-4 border-error-500';
      case 'modified':
        return 'bg-warning-900/20 border-l-4 border-warning-500';
      case 'empty':
        return 'bg-primary-800/50';
      default:
        return 'bg-primary-700/50';
    }
  };

  const getLineNumberClass = (type) => {
    switch (type) {
      case 'added':
        return 'text-success-400';
      case 'removed':
        return 'text-error-400';
      case 'modified':
        return 'text-warning-400';
      case 'empty':
        return 'text-quaternary-700';
      default:
        return 'text-quaternary-600';
    }
  };

  // Render character-level diff for modified lines
  const renderContent = () => {
    if (line.type === 'modified' && showCharDiff && otherLine) {
      const { result1, result2 } = getCharacterDiff(line.content, otherLine.content);
      const result = line.isLeft ? result1 : result2;
      
      return (
        <span>
          {result.map((item, idx) => (
            <span
              key={idx}
              className={
                item.type === 'added'
                  ? 'bg-success-600/40'
                  : item.type === 'removed'
                  ? 'bg-error-600/40'
                  : ''
              }
            >
              {item.char}
            </span>
          ))}
        </span>
      );
    }
    
    return line.content || '\u00A0'; // non-breaking space for empty lines
  };

  return (
    <div className={`flex px-4 py-1 font-mono text-sm ${getLineClass(line.type)}`}>
      <span className={`inline-block w-12 text-right mr-4 select-none ${getLineNumberClass(line.type)}`}>
        {line.type !== 'empty' ? line.line : ''}
      </span>
      <span className="flex-1 whitespace-pre-wrap break-all text-accent-50">
        {renderContent()}
      </span>
    </div>
  );
}

export default function DiffViewer({ text1, text2, showCharDiff = true }) {
  const { diff1, diff2, stats } = useMemo(() => {
    const { diff1, diff2 } = calculateDiff(text1, text2);
    const stats = getDiffStats(diff1, diff2);
    
    // Mark which side each line belongs to for character diff
    diff1.forEach(line => line.isLeft = true);
    diff2.forEach(line => line.isLeft = false);
    
    return { diff1, diff2, stats };
  }, [text1, text2]);

  // If both texts are empty, show a placeholder
  if (!text1 && !text2) {
    return (
      <div className="flex h-full items-center justify-center rounded-xl border border-tertiary-600/50 bg-primary-700/50 p-12">
        <div className="text-center">
          <div className="mb-4 text-6xl">📝</div>
          <p className="text-lg font-medium text-quaternary-400">
            Enter text in both panels to see the differences
          </p>
          <p className="mt-2 text-sm text-quaternary-500">
            The diff comparison will appear here automatically
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Stats Bar */}
      <div className="mb-4 flex flex-wrap gap-4 rounded-lg border border-tertiary-600/50 bg-secondary-700 p-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-quaternary-400">Total Lines:</span>
          <span className="font-mono text-sm font-semibold text-accent-50">{stats.total}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-success-500" />
          <span className="text-sm text-quaternary-400">Added:</span>
          <span className="font-mono text-sm font-semibold text-success-300">{stats.added}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-error-500" />
          <span className="text-sm text-quaternary-400">Removed:</span>
          <span className="font-mono text-sm font-semibold text-error-300">{stats.removed}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-warning-500" />
          <span className="text-sm text-quaternary-400">Modified:</span>
          <span className="font-mono text-sm font-semibold text-warning-300">{stats.modified}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-quaternary-400">Unchanged:</span>
          <span className="font-mono text-sm font-semibold text-accent-50">{stats.equal}</span>
        </div>
      </div>

      {/* Diff View */}
      <div className="flex flex-1 flex-col gap-4 lg:flex-row">
        {/* Left Side - Original */}
        <div className="flex-1 rounded-xl border border-tertiary-600/50 bg-primary-700">
          <div className="border-b border-tertiary-600/50 bg-secondary-700 px-4 py-2">
            <h3 className="text-sm font-display font-semibold text-accent-50">Original</h3>
          </div>
          <div>
            {diff1.map((line, idx) => (
              <DiffLine 
                key={idx} 
                line={line} 
                showCharDiff={showCharDiff}
                otherLine={diff2[idx]}
              />
            ))}
          </div>
        </div>

        {/* Right Side - Modified */}
        <div className="flex-1 rounded-xl border border-tertiary-600/50 bg-primary-700">
          <div className="border-b border-tertiary-600/50 bg-secondary-700 px-4 py-2">
            <h3 className="text-sm font-display font-semibold text-accent-50">Modified</h3>
          </div>
          <div>
            {diff2.map((line, idx) => (
              <DiffLine 
                key={idx} 
                line={line} 
                showCharDiff={showCharDiff}
                otherLine={diff1[idx]}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

