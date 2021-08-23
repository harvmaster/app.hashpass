import * as React from 'react';
import {
  Box,
  Text,
  Heading,
  VStack,
  FormControl,
  Input,
  Link,
  Button,
  HStack,
  ScrollView,
  KeyboardAvoidingView,
  useToast
} from 'native-base'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios';

export const LoginScreen = ({ navigation }) => {
  const toast = useToast()


  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')

  const saveUserData = async data => {
    try {
      const jsonValue = JSON.stringify(data)
      await AsyncStorage.setItem('@hashpass', jsonValue)
    } catch (error) {
      console.log(error)
      toast.show({
        title: 'Could not save user data',
        status: 'error',
        description: 'There was a problem saving user data to this device. You may need to login again next time you use the app'
      })
    }
  }

  const attemptLogin = async () => {

    // Handle input errors
    if (!username) return toast.show({
      title: 'Missing Fields',
      status: 'error',
      description: 'Username cannot be blank',
      variant: 'outline'
    })
    if (!password) return toast.show({
      title: 'Missing Fields',
      status: 'error',
      description: 'Passwword cannot be blank',
      variant: 'outline'
    })

    try {
      // Send API request
      const res = await axios.post('/users/login', {
        user: {
          username, password  
        }
      })
      
      // Save user data to the device and axios headers
      const dataToSave = {
        accessToken: res.data.accessToken,
        services: res.data.services,
        refreshToken: res.data.refreshToken || '',
        username: res.data.username
      }

      axios.defaults.headers.authorization = res.data.accessToken
      saveUserData(dataToSave).then(() => navigation.navigate('Home'))

      // Let the user know they logged in
      toast.show({
        render: () =>
          <Box bg="emerald.500" rounded="md" mv={5} px={3} py={3} _text={{ fontSize :"xl" }} >
            Signed in
          </Box>
      })

    } catch (error) {
      if (error.response.status == 400) {
        toast.show({
          title: 'Missing Fields',
          status: 'error',
          description: `${error.response.data}`
        })
        return
      }
      if (error.response.status == 500) {
        toast.show({
          title: 'Server Error',
          status: 'error',
          description: 'We seem to be having trouble logging you in. Please try again later'
        })
        return
      }
      console.log(error)
      toast.show({
        title: 'Error',
        status: 'error',
        description: 'There was a problem signing you in. Please try again later'
      })
    }

  }

  return (
    <KeyboardAvoidingView behavior="padding" flex={1}>
      <ScrollView keyboardShouldPersistTaps="handled" flex={1} centerContent>
        <Box
          safeArea
          flex={1}
          p={2}
          w="90%"
          mx='auto'
          justifyContent="center"
        >
          <Heading size="lg" color='primary.500'>
            Welcome to Hashpass
          </Heading>
          <Heading color="muted.400" size="xs">
            Sign in to continue!
          </Heading>

          <VStack space={2} mt={5}>
            <FormControl>
              <FormControl.Label _text={{color: 'muted.700', fontSize: 'sm', fontWeight: 600}}>
                  Username
              </FormControl.Label>
              <Input onChangeText={text => setUsername(text)} />
            </FormControl>
            <FormControl mb={5}>
              <FormControl.Label  _text={{color: 'muted.700', fontSize: 'sm', fontWeight: 600}}>
                  Password
              </FormControl.Label>
              <Input type="password" onChangeText={text => setPassword(text)} />
              <Link
                _text={{ fontSize: 'xs', fontWeight: '700', color:'cyan.500' }}
                alignSelf="flex-end"
                mt={1}
              >
                Forget Password?
              </Link>
            </FormControl>
            <VStack  space={2}>
            <Button colorScheme="cyan" _text={{color: 'white' }} onPress={() => attemptLogin()}>
                Login
            </Button>

            </VStack>
            <HStack justifyContent="center" alignItems="center">
              <Text fontSize='sm' color='muted.700' fontWeight={400}>I'm a new user</Text>
              <Button variant="link" _text={{ color: 'cyan.500', bold: true, fontSize: 'sm' }} onPress={() => navigation.navigate('Signup')}>
                Sign Up
              </Button>
            </HStack>
          </VStack>
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });