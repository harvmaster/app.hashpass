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
  
  const [isVisible, setIsVisible] = React.useState(visible)
  const [input, setInput] = React.useState('')

  const inputRef = React.useRef(null)

  React.useEffect(() => {
    setIsVisible(visible)
  }, [visible])

  React.useEffect(() => {
    visible = isVisible
  }, [isVisible])

  React.useEffect(() => {
    if (onChangeText) onChangeText(input)
  }, [input])

  const handleOnShow = () => {
    setIsVisible(true)
    inputRef.current.focus()
    if (onShow) onShow()
  }

  const handleOnDismiss = () => {
    setIsVisible(false)
    if (onDismiss)onDismiss()
  }

  
  
  return (
    <Modal
      visible={visible}
      onShow={() => handleOnShow()}
      onDismiss={()  => handleOnDismiss()}
      onRequestClose={() => handleOnDismiss()}
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
                onBlur={() => handleOnDismiss()}
                onChangeText={txt => setInput(txt)}
                onSubmitEditing={() => onSubmitEditing(input)}
              />
            </Box>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  )
}