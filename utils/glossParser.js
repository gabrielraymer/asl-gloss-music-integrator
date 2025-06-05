export function parseGlossFile(content) {
  const lines = content
    .split('\n')
    .filter(line => line.trim() !== '');
  
  return lines.map(line => {
    const trimmedLine = line.trim();
    
    return trimmedLine
      .split('|')
      .map(sign => sign.trim())
      .filter(sign => sign !== '');
  });
}

export function analyzeSign(sign) {
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