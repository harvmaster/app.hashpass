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
  Divider
} from 'native-base';
import { Keyboard, TouchableWithoutFeedback, StyleSheet } from 'react-native'

export const PinInputScreen = () => {
  const [pin, setPin] = React.useState([])

  // const display = () => {
  //   let pins = []
  //   for (let i in 4) {
  //     pins.push(pinDisplay(pin[i] != null))
  //   }
  // }

 return (
    <Box
      safeArea
      flex={1}
      p={2}
      w="90%"
      mx='auto'
      justifyContent="center"
    >
      <Heading size="lg" color='primary.500'>
        Enter your 4-digit Pin
      </Heading>

      <VStack space={3} mt={5}>
        <HStack space={1}>
          {pin.map(v => <pinDisplay key={v} />)}
        </HStack>
        <HStack space={3}>
          {numInput(1)}
          {numInput(2)}
          {numInput(3)}
        </HStack>
      </VStack>
    </Box>
  );
}

export const PinDisplay = (filled) => {
  return filled ? (
    <Box style={ [ styles.round, styles.filled ] } />
  ) : ( <Box style={styles.round} /> )
}

export const numInput = (number) => {
  return (
    <Box style={styles.round}>
      {number}
    </Box>
  )
}
    

const styles = StyleSheet.create({
  round: {
    width: 75,
    height: 75,
    borderRadius: 75
  },
  filled: {
    backgroundColor: 'grey'
  }
})