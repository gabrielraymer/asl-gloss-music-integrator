import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { GlossSign } from './GlossSign';

export function GlossLine({ line, isActive, progress }) {
  const highlightIndex = isActive 
    ? Math.min(Math.floor(progress * line.length), line.length - 1) 
    : -1;

  return (
    <View style={[
      styles.container,
      isActive && styles.activeContainer
    ]}>
      <View style={styles.lineContent}>
        {line.map((sign, index) => (
          <GlossSign 
            key={index} 
            sign={sign} 
            isHighlighted={index === highlightIndex}
            isActive={isActive}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginBottom: 8,
    backgroundColor: '#f8f9fa',
  },
  activeContainer: {
    backgroundColor: '#e3f2fd',
    borderWidth: 1,
    borderColor: '#bbdefb',
  },
  lineContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
});