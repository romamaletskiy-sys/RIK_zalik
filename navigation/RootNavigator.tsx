import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import AddTransactionScreen from '../screens/AddTransactionScreen';

export type RootStackParamList = {
  Main: undefined;
  AddTransaction: undefined;
};

type TabParamList = {
  Home: undefined;
  Transactions: undefined;
  Statistics: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const TAB_ICONS: Record<string, { active: string; inactive: string }> = {
  Home: { active: '🏠', inactive: '🏠' },
  Transactions: { active: '📋', inactive: '📋' },
  Statistics: { active: '📊', inactive: '📊' },
};

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  return (
    <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>
      {TAB_ICONS[name]?.active ?? '●'}
    </Text>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
        tabBarActiveTintColor: '#6C63FF',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#f0f0f0',
          paddingBottom: 6,
          height: 60,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
        headerStyle: { backgroundColor: '#6C63FF' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700', fontSize: 18 },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Головна', tabBarLabel: 'Головна' }} />
      <Tab.Screen name="Transactions" component={TransactionsScreen} options={{ title: 'Транзакції', tabBarLabel: 'Транзакції' }} />
      <Tab.Screen name="Statistics" component={StatisticsScreen} options={{ title: 'Статистика', tabBarLabel: 'Статистика' }} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen
          name="AddTransaction"
          component={AddTransactionScreen}
          options={{
            title: 'Нова транзакція',
            presentation: 'modal',
            headerStyle: { backgroundColor: '#6C63FF' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: '700' },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
