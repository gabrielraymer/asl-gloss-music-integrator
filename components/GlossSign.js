import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

export function GlossSign({ sign, isHighlighted, isActive }) {
  const isTwoHanded = sign.includes('(2h)');
  const isRightHand = sign.includes('(Rh)');
  const isLeftHand = sign.includes('(Lh)');
  const isDirectionalLeft = sign.includes('<');
  const isDirectionalRight = sign.includes('>');
  const isRaisedSign = sign.includes('^');
  const isConnected = sign.includes('~');
  
  let cleanSign = sign
    .replace(/\(2h\)|\(Rh\)|\(Lh\)|\(rs\)|\^|\<|\>/g, '')
    .trim();
    
  const connectedParts = isConnected ? cleanSign.split('~') : [cleanSign];
  
  return (
    <View style={[
      styles.container,
      isHighlighted && styles.highlighted,
      isTwoHanded && styles.twoHanded,
      isRaisedSign && styles.raised,
      isDirectionalLeft && styles.directionalLeft,
      isDirectionalRight && styles.directionalRight,
    ]}>
      {connectedParts.map((part, index) => (
        <Text 
          key={index}
          style={[
            styles.text,
            isHighlighted && styles.highlightedText,
            isActive && !isHighlighted && styles.activeText,
            isRightHand && styles.rightHandText,
            isLeftHand && styles.leftHandText,
            isRaisedSign && styles.raisedText,
            index > 0 && styles.connectedText,
          ]}
        >
          {part}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 4,
    marginVertical: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: '#f0f0f0',
  },
  highlighted: {
    backgroundColor: '#6200ee',
  },
  twoHanded: {
    borderBottomWidth: 2,
    borderBottomColor: '#ff9800',
  },
  raised: {
    marginTop: -5,
  },
  directionalLeft: {
    borderLeftWidth: 2,
    borderLeftColor: '#4caf50',
  },
  directionalRight: {
    borderRightWidth: 2,
    borderRightColor: '#4caf50',
  },
  text: {
    fontWeight: '500',
  },
  highlightedText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  activeText: {
    color: '#333',
  },
  rightHandText: {
    textDecorationLine: 'underline',
  },
  leftHandText: {
    fontStyle: 'italic',
  },
  raisedText: {
    textDecorationLine: 'underline',
    textDecorationStyle: 'dotted',
  },
  connectedText: {
    marginLeft: 4,
  },
});