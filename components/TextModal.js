import React from 'react'
import {
  Box,
  KeyboardAvoidingView,
  ScrollView,
  Input,
  Text
} from 'native-base'
import { Modal } from 'react-native'

export const TextModal = ({ visible, onShow, onDismiss, onRequestClose, transparent, onBlur, onChangeText, onSubmitEditing, placeholder, text, type = 'text' }) => {
  
  const [input, setInput] = React.useState('')
  const inputRef = React.useRef(null)

  const handleOnShow = () => {
    inputRef.current.focus()
    if (onShow) onShow()
  }

  const handleOnDismiss = (newState) => {
    console.log(!!onDismiss)
    if (onDismiss)onDismiss(newState)
  }

  const handleOnSubmitEditing = () => {
    const txt = input
    setInput('')
    inputRef.current.clear()
    inputRef.current.focus()
    onSubmitEditing(txt)
  }

  
  
  return (
    <Modal
      visible={visible}
      onShow={() => handleOnShow()}
      // onDismiss={()  => handleOnDismiss('')}
      // onRequestClose={() => handleOnDismiss('')}
      transparent={transparent}
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
              <Text pb={2}>
                {text}
              </Text>
              <Input
                ref={inputRef}
                placeholder={placeholder}
                type={type}
                onBlur={() => handleOnDismiss('')}
                onChangeText={txt => setInput(txt)}
                onSubmitEditing={() => handleOnSubmitEditing()}
                blurOnSubmit={false}
              />
            </Box>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  )
}