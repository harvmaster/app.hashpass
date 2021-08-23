import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { NativeBaseProvider } from 'native-base'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator()

import { LoginScreen } from './views/Login'
import { SignupScreen } from './views/Signup'

import axios from 'axios'
import { HomeScreen } from './views/Home';
// import { PinInputScreen } from './views/PinInput'

export default function App() {
  axios.defaults.baseURL = 'http://mc.hzuccon.com:3000'


  return (
    <NativeBaseProvider>
      <NavigationContainer>
          <StatusBar style="auto" />
          <Stack.Navigator>
            <Stack.Screen
              name='Login'
              component={LoginScreen}
            />
            <Stack.Screen
              name='Signup'
              component={SignupScreen}
            />
            <Stack.Screen
              name='Home'
              component={HomeScreen}
            />      
          </Stack.Navigator>
          {/* <LoginScreen /> */}
          {/* <SignupScreen /> */}
          {/* <PinInputScreen /> */}
      </NavigationContainer>
    </NativeBaseProvider>
  );
}