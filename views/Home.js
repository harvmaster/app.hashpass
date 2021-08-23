import React from 'react'
import { AntDesign } from "@expo/vector-icons"
import {
  Box,
  KeyboardAvoidingView,
  ScrollView,
  VStack,
  FormControl,
  Input,
  Icon,
  Text,
  Fab,
  // Modal
} from 'native-base'
import { Modal } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import EncryptedStorage from 'react-native-encrypted-storage'
import axios from 'axios'

import DefaultServices from '../resources/DefaultServices'

export const HomeScreen = ({ navigation }) => {

  const [services, setServices] = React.useState([])
  const [secret, setSecret] = React.useState('')
  
  const [serviceModal, setServiceModal] = React.useState(false)
  const [serviceInput, setServiceInput] = React.useState('')

  const serviceInputRef = React.useRef(null)

  const hashService = async input => {
    // const pwd = runHash(input)
  }

  React.useEffect(() => {
    async function getServices () {
      let servicesFromStorage = await AsyncStorage.getItem('services')
      servicesFromStorage = JSON.parse(servicesFromStorage)

      setServices(servicesFromStorage)
      if (!servicesFromStorage) {
        setServices(DefaultServices)
      }

      const userInfo = await EncryptedStorage.getItem('user')

      // No point continuing if the user wont be able to log in
      if (!userInfo || !userInfo.refreshToken) {
        return
      }

      // Make sure their access token is up to date, if not, get a new one
      if (userInfo.accessToken.expires > Date.now().getTime()) {
        try {
          const tokenRes = await axios.post('/users/refreshtoken', { refreshToken: userInfo.refreshToken })
          userInfo.accessToken = tokenRes.data.accessToken

          axios.defaults.headers.authorization = tokenRes.data.accessToken
          await EncryptedStorage.setItem('user', {
            username: tokenRes.username,
            refreshToken: userInfo.refreshToken,
            accessToken: tokenRes.accessToken
          })
        } catch (error) {
          console.log(error)
        }
      }

      try {
        const res = await axios.get('/services')
        setServices(res.data)
       } catch (err) {
         console.log(err.response.status, err.response.data)
       }
     }
     getServices()
    }, [])

  return (
    <KeyboardAvoidingView behavior="padding" flex={1}>
      <ScrollView keyboardShouldPersistTaps="handled" flex={1} centerContent>

        {/* Handle service input */}
        <Modal
          visible={serviceModal}
          onShow={() => serviceInputRef.current.focus()}
          onDismiss={()  => setServiceModal(false)}
          onRequestClose={() => setServiceModal(false)}
          transparent={true}
        >
          <KeyboardAvoidingView 
            behavior="padding"
            style={{
              height: '100%',
              width: '100%'
            }}
          >
            <ScrollView _contentContainerStyle={{ height: '100%', width: '100%', justifyContent: 'flex-end' }}>
                <Box style={{ backgroundColor: 'white' }} p={2}>
                  <Input
                    ref={serviceInputRef}
                    onBlur={() => setServiceModal(false)}
                    onChangeText={text => setServiceInput(text)}
                    onSubmitEditing={() => hashService(serviceInput)}
                  />
                </Box>
            </ScrollView>
          </KeyboardAvoidingView>
        </Modal>

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
          justifyContent="center"
        >
          {services.length == 0 && (<Text>No Services Found</Text>)}
          {services.length > 0 && services.forEach(service => (
            <Box>
              {service.name}
            </Box>
          ))}


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