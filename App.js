import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from 'react-native-screens/native-stack'; // Note: Use 'react-native-screens' for Expo

import Login from './screens/Login';
import Home from './screens/Home';
import OTP from './screens/OTP';
import ChatList from './screens/ChatList';
import ChatBox from './screens/ChatBox';
import GroupChat from './screens/GroupChat';
import SignUp from './screens/SignUp';
import NewChat from './screens/NewChat';
import AddNewCollaborators from './screens/AddNewCollaborators';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          stackAnimation: 'slide_from_right', // Slide in from the right
          stackPresentation: 'push', // Slide-out behavior
          headerShown: false, // Hide the header by default
        }}
      >
      
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="OTP" component={OTP} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="ChatList" component={ChatList} />
        <Stack.Screen name="GroupChat" component={GroupChat} />
        <Stack.Screen name="ChatBox" component={ChatBox} />
        <Stack.Screen name="NewChat" component={NewChat} />
        <Stack.Screen name="AddNewCollaborators" component={AddNewCollaborators} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
