import AsyncStorage from '@react-native-async-storage/async-storage'
import * as EncryptedStorage from 'expo-secure-store'
import axios from 'axios'


export const getUserData = async () => {
  let userInfo = await EncryptedStorage.getItemAsync('user')
  userInfo = JSON.parse(userInfo)
  let services = await AsyncStorage.getItem('services')
  services = JSON.parse(services)
  return { ...userInfo, services }
}

export const isLoggedIn = async () => {
  const userData = await getUserData()
  return !!userData.refreshToken
}

export const getServices = async () => {
  const userData = await getUserData()
  return userData.services
}

export const getTokens = async () => {
  const userData = await getUserData()
  userData.accessToken && (axios.defaults.headers.authorization = userData.accessToken.token)
  return { accessToken: userData.accessToken, refreshToken: userData.refreshToken }
}

export const hasValidToken = async () => {
  const { accessToken } = await getTokens()
  return accessToken.expires > Date.now()
}

export const getNewToken = async () => {
  const { refreshToken } = await getTokens()
  try {
    const res = await axios.post('/users/refreshtoken', { refreshToken })

    axios.defaults.headers.authorization = tokenRes.data.accessToken.token
    await EncryptedStorage.setItemAsync('user', JSON.stringify({
      username: res.username,
      refreshToken,
      accessToken: res.accessToken
    }))
  } catch (error) {
    console.log('Could not get new access token', error.response.status, error.response.data)
  }
}

export const validateToken = async () => {
  const isValid = await hasValidToken()
  if (isValid) return

  await getNewToken()
  console.log('got new token')
  return
}

export const getUpdatedServices = async () => {
  await validateToken()

  try {
    const res = await axios.get('/services/')
    await AsyncStorage.setItem('services', JSON.stringify(res.data))
  } catch (error) {
    console.log('Could not get new services from the server', error.response.status, error.response.data)
  }
}

export const setupUser = async () => {
  await validateToken()
  const userData = await getUserData()
  axios.defaults.headers.authorization = userData.accessToken.token
}