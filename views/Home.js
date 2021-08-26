import React from 'react'
import { AntDesign } from "@expo/vector-icons"
import {
  Box,
  KeyboardAvoidingView,
  ScrollView,
  Input,
  Icon,
  Text,
  Button,
  Fab,
  Image,
  Heading,
  Center,
  Flex,
  Pressable
} from 'native-base'
import { Modal } from 'react-native'

import AsyncStorage from '@react-native-async-storage/async-storage'
import * as EncryptedStorage from 'expo-secure-store'
import axios from 'axios'

import { TextModal } from '../components/TextModal'

import { DefaultServices } from '../resources/DefaultServices'
import { generate } from '../resources/Generators'

export const HomeScreen = ({ navigation }) => {

  const [services, setServices] = React.useState([])
  const [secret, setSecret] = React.useState('')
  
  const [serviceModal, setServiceModal] = React.useState(false)
  const [serviceInput, setServiceInput] = React.useState('')
  const [secretModal, setSecretModal] = React.useState(false)
  const [secretInput, setSecretInput] = React.useState('')
  const [secretInputCallback, setSecretInputCallback] = React.useState(function () {})

  const serviceInputRef = React.useRef(null)
  const secretInputRef = React.useRef(null)

  const hashService = async (input, sct) => {
    console.log('input', input)
    console.log('secret', secret)
    console.log(hashService)

    // If secret is not set, we bring up the modal to enter the secret and use a callback to pass the secret to the function that
    /*
      we dont just read the secret variable because it was not being set prior to the function call so I instead just pass it as an optional parameter. Yes, this is a hack
    */
    if (!secret && !sct) {
      console.log('No Secret')
      setSecretInputCallback(() => s => {
        hashService(input, s)
      })
      setSecretModal(true)
      return
    }
    // 
    if (!sct) sct = secret
    console.log('has secret')

    const encoding = findEncoder(input) || 'HEX'
    const pwd = generate[encoding](serviceInput, secretInput)
    console.log(pwd)

    setServiceInput('')
  }

  // Returning the method of encoding the final password
  const findEncoder = (name) => {
    const serviceIndex = services.findIndex(service => service.name === name)
    return services[serviceIndex]?.encoding?.toUpperCase() || null
  }

  React.useEffect(() => {
    async function getServices () {
      let servicesFromStorage = await AsyncStorage.getItem('services')
      servicesFromStorage = JSON.parse(servicesFromStorage)

      if (!servicesFromStorage.length) {
        setServices(DefaultServices)
      } else {
        setServices(servicesFromStorage)
      }

      let userInfo = await EncryptedStorage.getItemAsync('user')
      userInfo = JSON.parse(userInfo)

      // No point continuing if the user wont be able to log in
      if (!userInfo || !userInfo.refreshToken) {
        return
      }

      // Make sure their access token is up to date, if not, get a new one
      if (userInfo.accessToken.expires < Date.now()) {
        console.log('bad token')
        try {
          const tokenRes = await axios.post('/users/refreshtoken', { refreshToken: userInfo.refreshToken })
          userInfo.accessToken = tokenRes.data.accessToken

          axios.defaults.headers.authorization = tokenRes.data.accessToken.token
          await EncryptedStorage.setItemAsync('user', JSON.stringify({
            username: tokenRes.username,
            refreshToken: userInfo.refreshToken,
            accessToken: tokenRes.accessToken
          }))
        } catch (error) {
          console.log(error)
        }
      }

      try {
        const res = await axios.get('/services')
        if (res.data.length > 0) setServices(res.data)
        await AsyncStorage.setItem('services', JSON.stringify(res.data))
       } catch (err) {
         console.log(err.response.status, err.response.data)
       }
     }
     getServices()
    }, [])

  return (
    <KeyboardAvoidingView behavior="padding" flex={1}>
      <ScrollView keyboardShouldPersistTaps="handled" flex={1}>

        {/* Handle service input */}
        <TextModal 
          visible={serviceModal}
          transparent={true}
          onSubmitEditing={service => hashService(service)}
          onDismiss={() => setServiceModal(false)}
          placeholder='Service'
          text='Enter the service you want to create a password for'
        />

        {/* Handle secret input */}
        <TextModal
          visible={secretModal}
          transparent={true}
          onSubmitEditing={scrt => secretInputCallback(scrt)}
          onDismiss={() => setSecretModal(false)}
          placeholder='Secret'
          text='This is your master password. Keep this secret'
          type='password'
        />

        

        <Fab
          placement="bottom-right"
          icon={<Icon color="white" as={<AntDesign name="plus" />} size={4} />}
          onPress={() => setServiceModal(true)}
        />

        {/* Services display area */}
        <Box
          safeArea
          flex={1}
          p={2}
          w="90%"
          mx='auto'
          justifyContent="flex-start"
        >
          <Center>
            <Heading size="lg" color='primary.500' pb={5} pt={0}>
              Hashpass
            </Heading>
          </Center>
          <Flex direction='row' wrap='wrap' w='100%'>
            {services.length == 0 && (<Text>No Services Found</Text>)}
            {services.length > 0 && services.map((service, index, arr) => (
              <Pressable w='20%' onPress={() => hashService(service.name)} key={service.name}>
                <Box style={{ padding: 5 }}>
                  <Image
                    source={{ uri: service.logo }}
                    w='100%'
                    aspectRatio={1}
                    borderRadius={10}
                    alt='https://learnhrm.shrm.org/wp-content/uploads/2020/04/logo-placeholder-generic.200x200.png'
                  />
                </Box>
              </Pressable>
            ))}
          </Flex>

        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const Styles = {
  bottom: {
    marginBottom: 10,
    marginTop: "auto",
  },
}