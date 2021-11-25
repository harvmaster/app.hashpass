import React from 'react'
import { AntDesign } from "@expo/vector-icons"
import {
  Box,
  KeyboardAvoidingView,
  ScrollView,
  Icon,
  Text,
  Fab,
  Image,
  Heading,
  Center,
  Flex,
  Pressable
} from 'native-base'

import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'

import { TextModal } from '../components/TextModal'

import { DefaultServices } from '../resources/DefaultServices'
import { generate } from '../resources/Generators'
import * as UserData from '../resources/UserData'

export const HomeScreen = ({ navigation }) => {

  const [services, setServices] = React.useState([])
  const [secret, setSecret] = React.useState('')

  const [modal, setModal] = React.useState('')
  const [secretInputCallback, setSecretInputCallback] = React.useState(function () {})

  const hashService = async (input, sct) => {

    // If secret is not set, we bring up the modal to enter the secret and use a callback to pass the secret to the function that
    /*
      we dont just read the secret variable because it was not being set prior to the function call so I instead just pass it as an optional parameter. Yes, this is a hack
    */
    if (!secret && !sct) {
      setSecretInputCallback(() => s => {
        hashService(input, s)
      })
      setModal('secret')
      return
    }

    setModal('')

    if (!sct) sct = secret

    const encoding = findEncoder(input) || 'HEX'
    const pwd = generate[encoding](input, sct)
    console.log(pwd)

    attemptAddService(input)
  }

  const attemptAddService = async service => {
    const alreadyExists = services.find(s => service === s.name)
    if (alreadyExists) return

    let logoRes
    try {
      logoRes = await axios.get('https://autocomplete.clearbit.com/v1/companies/suggest?query=' + service)
    } catch (error) {
      console.log('error getting logo', error.response.status, error.response.data)
    }
    const logo = logoRes?.data[0]?.logo || ''

    service = {
      name: service,
      logo: logo,
      note: '',
      encoding: 'HEX',
      legacy: false
    }

    await AsyncStorage.setItem('services', JSON.stringify([...services, service]))
    setServices([...services, service])

    const isLoggedIn = await UserData.isLoggedIn()
    if (!isLoggedIn) return

    await UserData.validateToken()

    try {
      const res = await axios.post('/services/', { service: service })
    } catch (error) {
      console.log(error)
    }

  }

  // Returning the method of encoding the final password
  const findEncoder = (name) => {
    const serviceIndex = services.findIndex(service => service.name === name)
    return services[serviceIndex]?.encoding?.toUpperCase() || null
  }

  React.useEffect(() => {
    async function getServices () {
      const servicesFromStorage = await UserData.getServices()

      if (!servicesFromStorage) {
        setServices(DefaultServices)
      } else {
        setServices(servicesFromStorage)
      }

      const userInfo = await UserData.getUserData()

      // No point continuing if the user wont be able to log in
      if (!userInfo || !userInfo.refreshToken) {
        return
      }

      // Make sure their access token is up to date, if not, get a new one
      await UserData.validateToken()

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

    const modals = {
      secret: {
        onSubmit: scrt => {
          setSecret(scrt)
          secretInputCallback(scrt)
        },
        type: 'password',
        placeholder: 'Secret',
        text: 'This is your master password. Keep this secret'
      },
      service: {
        onSubmit: service => {
          hashService(service)
        },
        placeholder: 'Service',
        text: 'Enter the service you want to create a password for'
      }
    }

  return (
    <KeyboardAvoidingView behavior="padding" flex={1}>
      <ScrollView keyboardShouldPersistTaps="handled" flex={1}>

        {/* Handle Modal input (both service and secret) */}
        <TextModal 
          visible={modal.length > 0}
          transparent={true}
          onDismiss={newState => setModal(newState)}
          onSubmitEditing={service => modals[modal]?.onSubmit(service)}
          placeholder={modals[modal]?.placeholder}
          text={modals[modal]?.text}
          type={modals[modal]?.type}
        />

        <Fab
          placement="bottom-right"
          icon={<Icon color="white" as={<AntDesign name="plus" />} size={4} />}
          onPress={() => setModal('service')}
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
                    alt={'https://learnhrm.shrm.org/wp-content/uploads/2020/04/logo-placeholder-generic.200x200.png'}
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