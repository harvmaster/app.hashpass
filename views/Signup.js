import * as React from 'react';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import {
  NativeBaseProvider,
  Box,
  Text,
  Heading,
  VStack,
  FormControl,
  Input,
  Link,
  Button,
  Icon,
  IconButton,
  HStack,
  useToast,
  Divider
} from 'native-base';
import { ScrollView, KeyboardAvoidingView } from 'react-native';
import axios from 'axios'

export const SignupScreen = ({ navigation }) => {
  const toast = useToast()


  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirmation, setConfirmation] = React.useState('')

  const attemptSignup = async () => {

    // Handle input errors
    if (!username) return toast.show({
      title: 'Missing Fields',
      status: 'error',
      description: 'Username cannot be blank'
    })
    if (!password) return toast.show({
      title: 'Missing Fields',
      status: 'error',
      description: 'Passwword cannot be blank'
    })
    if (confirmation != password) return toast.show({
      title: 'Missing Fields',
      status: 'error',
      description: 'Passwords do not match'
    })

    // Send request to api
    try{
      const res = await axios.post('/users/create', { user: {
        username, password
      }})
      if (res.status == 201) {
        // ReRoute back to login or go straight to account?
        toast.show({
          title: 'Account Created',
          status: 'success',
          description: ''
        })
        navigation.navigate('Login')
        return
      }
    } catch (error) {
      console.log(error)
      if (error.response.status == 409) {
        toast.show({
          title: 'Username Taken',
          status: 'error',
          description: 'That username is already in use. Please choose a different username'
        })
        return
      }
      toast.show({
        title: 'Error',
        status: 'error',
        description: 'There was a problem creating your account. Please try again later'
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
          justifyContent='center'
        >
          <Heading size="lg" color='primary.500'>
            Welcome to Hashpass
          </Heading>
          <Heading color="muted.400" size="xs">
            Sign up to continue!
          </Heading>

          <VStack space={2} mt={5}>
            <FormControl>
              <FormControl.Label _text={{color: 'muted.700', fontSize: 'sm', fontWeight: 600}}>
                  Username
              </FormControl.Label>
              <Input 
                onChangeText={text => setUsername(text)}
              />
            </FormControl>
            <FormControl>
              <FormControl.Label  _text={{color: 'muted.700', fontSize: 'sm', fontWeight: 600}}>
                  Password
              </FormControl.Label>
              <Input 
                type="password"
                onChangeText={text => setPassword(text)}
              />
            </FormControl>
            <FormControl>
              <FormControl.Label  _text={{color: 'muted.700', fontSize: 'sm', fontWeight: 600}}>
                Confirm Password
              </FormControl.Label>
              <Input 
                type="password"
                onChangeText={text => setConfirmation(text)}
              />
            </FormControl>
            <VStack  space={2}  mt={5}>
              <Button colorScheme="cyan" _text={{color: 'white' }} onPress={attemptSignup}>
                  SignUp
              </Button>

              <HStack justifyContent="center">
                <Button variant="link" _text={{ color: 'cyan.500', bold: true, fontSize: 'sm' }} onPress={() => navigation.navigate('Login')}>
                  I already have an account
                </Button>
              </HStack>
            </VStack>
          </VStack>
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}