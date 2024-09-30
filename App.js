import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './src/screens/homescreen';
import JournalEntryScreen from './src/screens/journalentryscreen';
import DiaryPage from './src/screens/diarypage';
import DiaryDetailPage from './src/screens/diarydetailpage';
import ReminderScreen from './src/screens/reminderscreen';
import ChatBotScreen from './src/components/ChatBot';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = 'home';
        } else if (route.name === 'Diary') {
          iconName = 'book';
        } else if (route.name === 'Add Journal') {
          iconName = 'add-circle';
        } else if (route.name === 'Reminder') {
          iconName = 'alarm';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: 'tomato',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Diary" component={DiaryPage} />
    <Tab.Screen name="Add Journal" component={JournalEntryScreen} />
    <Tab.Screen name="Reminder" component={ReminderScreen} />
  </Tab.Navigator>
);

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeTabs">
        <Stack.Screen
          name="HomeTabs"
          component={HomeTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="DiaryDetailPage" component={DiaryDetailPage} />
        <Stack.Screen name="ChatBotScreen" component={ChatBotScreen} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
