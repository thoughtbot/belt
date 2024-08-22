import { StatusBar } from 'expo-status-bar';
import Screen from 'src/components/Screen';
import HomeScreenContent from './HomeScreenContent';

export default function HomeScreen() {
  return (
    <Screen>
      <HomeScreenContent />
      <StatusBar style="auto" />
    </Screen>
  );
}
