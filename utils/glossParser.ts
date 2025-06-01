/**
 * Parses an ASL gloss file content and returns structured data
 */
export function parseGlossFile(content: string): string[][] {
  // Split the content into lines
  const lines = content
    .split('\n')
    .filter(line => line.trim() !== '');
  
  // Process each line to extract signs
  return lines.map(line => {
    // Remove any extra whitespace
    const trimmedLine = line.trim();
    
    // Split the line by pipe character and trim each sign
    return trimmedLine
      .split('|')
      .map(sign => sign.trim())
      .filter(sign => sign !== '');
  });
}

/**
 * Analyzes a sign string to determine if it has specific notation
 */
export function analyzeSign(sign: string) {
  return {
    isTwoHanded: sign.includes('(2h)'),
    isRightHand: sign.includes('(Rh)'),
    isLeftHand: sign.includes('(Lh)'),
    isRaisedSign: sign.includes('^'),
    isDirectionalLeft: sign.includes('<'),
    isDirectionalRight: sign.includes('>'),
    isConnected: sign.includes('~'),
  };
}