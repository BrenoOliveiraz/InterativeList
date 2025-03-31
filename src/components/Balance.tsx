import { View, Text } from 'react-native'
import React from 'react'
import { Box, HStack } from 'native-base'

export default function Balance() {

  




  return (
    <HStack justifyContent="space-between" w="80%" alignItems="center">
      <HStack space={2} alignItems="center">
        <Box>
          <Text style={{ color: "white" }}>Meu Saldo</Text>
        </Box>
        <Box>
          <Text style={{ color: "white" }}>R$ 100,00</Text>
        </Box>
      </HStack>
      <HStack space={2} alignItems="center">
        <Text style={{ color: "white" }}>Total</Text>
        <Text style={{ color: "white" }}>R$ 200,00</Text>
      </HStack>
    </HStack>
  )
}
