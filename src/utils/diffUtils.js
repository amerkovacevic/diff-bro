/**
 * Calculate the differences between two texts line by line
 * Returns an array of diff objects with type and content
 */
export function calculateDiff(text1, text2) {
  const lines1 = text1.split('\n');
  const lines2 = text2.split('\n');
  
  const maxLength = Math.max(lines1.length, lines2.length);
  const diff1 = [];
  const diff2 = [];
  
  for (let i = 0; i < maxLength; i++) {
    const line1 = lines1[i] ?? '';
    const line2 = lines2[i] ?? '';
    
    if (line1 === line2) {
      // Lines are identical
      diff1.push({ type: 'equal', content: line1, line: i + 1 });
      diff2.push({ type: 'equal', content: line2, line: i + 1 });
    } else if (line1 && !line2) {
      // Line exists only in text1
      diff1.push({ type: 'removed', content: line1, line: i + 1 });
      diff2.push({ type: 'empty', content: '', line: i + 1 });
    } else if (!line1 && line2) {
      // Line exists only in text2
      diff1.push({ type: 'empty', content: '', line: i + 1 });
      diff2.push({ type: 'added', content: line2, line: i + 1 });
    } else {
      // Both lines exist but are different
      diff1.push({ type: 'modified', content: line1, line: i + 1 });
      diff2.push({ type: 'modified', content: line2, line: i + 1 });
    }
  }
  
  return { diff1, diff2 };
}

/**
 * Get statistics about the diff
 */
export function getDiffStats(diff1, diff2) {
  const stats = {
    total: diff1.length,
    equal: 0,
    added: 0,
    removed: 0,
    modified: 0,
  };
  
  diff1.forEach((line) => {
    if (line.type === 'equal') stats.equal++;
    else if (line.type === 'removed') stats.removed++;
    else if (line.type === 'modified') stats.modified++;
  });
  
  diff2.forEach((line) => {
    if (line.type === 'added') stats.added++;
  });
  
  return stats;
}

/**
 * Get character-level differences within a line
 */
export function getCharacterDiff(str1, str2) {
  const result1 = [];
  const result2 = [];
  const maxLen = Math.max(str1.length, str2.length);
  
  let i = 0;
  let j = 0;
  
  while (i < str1.length || j < str2.length) {
    if (i >= str1.length) {
      // Rest of str2 is added
      result2.push({ char: str2[j], type: 'added' });
      j++;
    } else if (j >= str2.length) {
      // Rest of str1 is removed
      result1.push({ char: str1[i], type: 'removed' });
      i++;
    } else if (str1[i] === str2[j]) {
      // Characters match
      result1.push({ char: str1[i], type: 'equal' });
      result2.push({ char: str2[j], type: 'equal' });
      i++;
      j++;
    } else {
      // Characters differ
      result1.push({ char: str1[i], type: 'removed' });
      result2.push({ char: str2[j], type: 'added' });
      i++;
      j++;
    }
  }
  
  return { result1, result2 };
}

