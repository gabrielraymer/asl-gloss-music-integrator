import { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, List, Switch, Divider, Button, Dialog, Portal, RadioButton } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const [beatIndicatorEnabled, setBeatIndicatorEnabled] = useState(true);
  const [fontSizeDialogVisible, setFontSizeDialogVisible] = useState(false);
  const [fontSizeValue, setFontSizeValue] = useState('medium');
  const [themeDialogVisible, setThemeDialogVisible] = useState(false);
  const [themeValue, setThemeValue] = useState('auto');

  const toggleHapticFeedback = () => {
    setHapticFeedback(!hapticFeedback);
    AsyncStorage.setItem('hapticFeedback', (!hapticFeedback).toString());
  };

  const toggleAutoScroll = () => {
    setAutoScrollEnabled(!autoScrollEnabled);
    AsyncStorage.setItem('autoScrollEnabled', (!autoScrollEnabled).toString());
  };

  const toggleBeatIndicator = () => {
    setBeatIndicatorEnabled(!beatIndicatorEnabled);
    AsyncStorage.setItem('beatIndicatorEnabled', (!beatIndicatorEnabled).toString());
  };

  const saveFontSize = () => {
    AsyncStorage.setItem('fontSize', fontSizeValue);
    setFontSizeDialogVisible(false);
  };

  const saveTheme = () => {
    AsyncStorage.setItem('theme', themeValue);
    setThemeDialogVisible(false);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.settingsContainer}>
        <List.Section>
          <List.Subheader>Display Settings</List.Subheader>
          <List.Item
            title="Font Size"
            description="Adjust text size throughout the app"
            left={props => <List.Icon {...props} icon="format-size" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => setFontSizeDialogVisible(true)}
          />
          <Divider />
          <List.Item
            title="Theme"
            description="Change app appearance"
            left={props => <List.Icon {...props} icon="theme-light-dark" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => setThemeDialogVisible(true)}
          />
        </List.Section>

        <List.Section>
          <List.Subheader>Player Settings</List.Subheader>
          <List.Item
            title="Haptic Feedback"
            description="Vibration on beats"
            left={props => <List.Icon {...props} icon="vibrate" />}
            right={props => <Switch value={hapticFeedback} onValueChange={toggleHapticFeedback} />}
          />
          <Divider />
          <List.Item
            title="Auto-Scroll"
            description="Automatically scroll through notation"
            left={props => <List.Icon {...props} icon="gesture-swipe-vertical" />}
            right={props => <Switch value={autoScrollEnabled} onValueChange={toggleAutoScroll} />}
          />
          <Divider />
          <List.Item
            title="Beat Indicator"
            description="Show moving beat indicator"
            left={props => <List.Icon {...props} icon="metronome" />}
            right={props => <Switch value={beatIndicatorEnabled} onValueChange={toggleBeatIndicator} />}
          />
        </List.Section>

        <List.Section>
          <List.Subheader>About</List.Subheader>
          <List.Item
            title="Version"
            description="1.0.0"
            left={props => <List.Icon {...props} icon="information" />}
          />
          <Divider />
          <List.Item
            title="Help & Support"
            description="Get assistance with the app"
            left={props => <List.Icon {...props} icon="help-circle" />}
            onPress={() => {}}
          />
          <Divider />
          <List.Item
            title="Terms & Privacy Policy"
            description="Review our policies"
            left={props => <List.Icon {...props} icon="file-document" />}
            onPress={() => {}}
          />
        </List.Section>

        <View style={{ height: 50 }} />
      </ScrollView>

      <Portal>
        <Dialog visible={fontSizeDialogVisible} onDismiss={() => setFontSizeDialogVisible(false)}>
          <Dialog.Title>Font Size</Dialog.Title>
          <Dialog.Content>
            <RadioButton.Group onValueChange={value => setFontSizeValue(value)} value={fontSizeValue}>
              <RadioButton.Item label="Small" value="small" />
              <RadioButton.Item label="Medium" value="medium" />
              <RadioButton.Item label="Large" value="large" />
              <RadioButton.Item label="Extra Large" value="xlarge" />
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setFontSizeDialogVisible(false)}>Cancel</Button>
            <Button onPress={saveFontSize}>Save</Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={themeDialogVisible} onDismiss={() => setThemeDialogVisible(false)}>
          <Dialog.Title>Theme</Dialog.Title>
          <Dialog.Content>
            <RadioButton.Group onValueChange={value => setThemeValue(value)} value={themeValue}>
              <RadioButton.Item label="Light" value="light" />
              <RadioButton.Item label="Dark" value="dark" />
              <RadioButton.Item label="System Default" value="auto" />
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setThemeDialogVisible(false)}>Cancel</Button>
            <Button onPress={saveTheme}>Save</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
  },
  title: {
    fontWeight: 'bold',
  },
  settingsContainer: {
    flex: 1,
  },
});