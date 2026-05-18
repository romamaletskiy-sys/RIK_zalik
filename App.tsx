import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { FinanceProvider } from './context/FinanceContext';
import RootNavigator from './navigation/RootNavigator';

export default function App() {
  return (
    <FinanceProvider>
      <StatusBar style="light" />
      <RootNavigator />
    </FinanceProvider>
  );
}
