import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { NativeBaseProvider, Avatar, Pressable } from 'native-base'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator()

import { LoginScreen } from './views/Login'
import { SignupScreen } from './views/Signup'
import { HomeScreen } from './views/Home'

import axios from 'axios'

import * as UserData from './resources/UserData'

export default function App() {
  axios.defaults.baseURL = 'http://mc.hzuccon.com:3000'

  UserData.setupUser()

  const avatarHeader = (navigation) => {
    return (
      <Pressable onPress={() => navigation.navigate('Login') }>
        <Avatar 
          size='sm'
          ml={2}
          source={{
            uri: "data:image/jpeg;base64,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",
          }}
        >

        </Avatar>
      </Pressable>
    )
  }


  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator>
          <Stack.Screen
              name='Home'
              component={HomeScreen}
              options={({ navigation }) => ({
                headerLeft: () => avatarHeader(navigation)
              })}
            />    
            <Stack.Screen
              name='Login'
              component={LoginScreen}
            />
            <Stack.Screen
              name='Signup'
              component={SignupScreen}
            />
              
          </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}