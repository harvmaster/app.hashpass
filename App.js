import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { NativeBaseProvider } from 'native-base'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator()

import * as EncryptedStorage from 'expo-secure-store'

import { LoginScreen } from './views/Login'
import { SignupScreen } from './views/Signup'

import axios from 'axios'
import { HomeScreen } from './views/Home';
// import { PinInputScreen } from './views/PinInput'

export default function App() {
  axios.defaults.baseURL = 'http://mc.hzuccon.com:3000'

  const loadUserData = async () => {
    let userInfo = await EncryptedStorage.getItemAsync('user')
    userInfo = JSON.parse(userInfo)

    if (userInfo.accessToken.expires < Date.now()) {
      const tokenRes = await axios.post('/users/refreshtoken', { refreshToken: userInfo.refreshToken })
      userInfo.accessToken = tokenRes.data.accessToken

        axios.defaults.headers.authorization = tokenRes.data.accessToken.token
        await EncryptedStorage.setItemAsync('user', JSON.stringify({
          username: tokenRes.username,
          refreshToken: userInfo.refreshToken,
          accessToken: tokenRes.accessToken
        }))
        return
    }

    axios.defaults.headers.authorization = userInfo.accessToken.token
  }

  loadUserData()


  return (
    <NativeBaseProvider>
      <NavigationContainer>
          <StatusBar style="auto" />
          <Stack.Navigator>
          <Stack.Screen
              name='Home'
              component={HomeScreen}
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
          {/* <LoginScreen /> */}
          {/* <SignupScreen /> */}
          {/* <PinInputScreen /> */}
      </NavigationContainer>
    </NativeBaseProvider>
  );
}