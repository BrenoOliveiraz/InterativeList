import React from 'react';
import { TextInput } from 'react-native';
import { HStack, Box, Text, Icon, Spinner } from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useSaldo from '../hooks/useSaldo';
import useItemsFromList from '../hooks/useItemsList';

export default function Balance({ total }) {
  const {
    saldo,
    rawSaldo,
    loading,
    error,
    handleSaldoChange,
    formatToBRL,
  } = useSaldo();

 
  

  
  const validTotal = !isNaN(total) ? total : 0;  


  return (
    <HStack
      justifyContent="space-between"
      alignItems="center"
      w="full"
      px={4}
      py={3}
      bg="gray.700"
      borderRadius="lg"
      shadow={2}
    >
      <HStack space={3} alignItems="center">
        <Icon as={MaterialCommunityIcons} name="wallet" size="md" color="green.300" />
        <Text color="white" fontSize="md" fontWeight="bold">
          Meu Saldo
        </Text>
        <Box>
          <TextInput
            keyboardType="numeric"
            value={formatToBRL(parseInt(rawSaldo - validTotal || '0'))}
            onChangeText={handleSaldoChange}
            style={{
              color: "white",
              borderBottomWidth: 1,
              borderBottomColor: "#22c55e",
              minWidth: 80,
              paddingBottom: 2,
              fontSize: 16,
              fontWeight: '500',
            }}
            placeholder="R$ 0,00"
            placeholderTextColor="gray"
          />
        </Box>
      </HStack>

      {loading ? (
        <Spinner color="green.300" />
      ) : error ? (
        <Text color="red.500">Erro</Text>
      ) : (
        <HStack space={2} alignItems="center">
          <Text color="white" fontSize="md" fontWeight="bold">
            Total
          </Text>
          <Text color="green.300" fontSize="md" fontWeight="bold">
           
            {validTotal !== null ? (formatToBRL(validTotal * 100)) : ('R$ 0,00')}
          </Text>
        </HStack>
      )}
    </HStack>
  );
}
