import React from 'react';
import { TextInput } from 'react-native';
import { HStack, Box, Text, Icon, Spinner } from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useSaldo from '../hooks/useSaldo';

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

  const saldoEmCentavos = parseInt(rawSaldo || '0');
  const totalEmCentavos = parseInt((validTotal * 100).toFixed(0));

  // Calcula a diferença
  const diferenca = saldoEmCentavos - totalEmCentavos;

  
  const saldoFormatado = diferenca < 0
    ? formatToBRL(0)
    : formatToBRL(diferenca);

  const saldoNegativo = diferenca < 0
    ? formatToBRL(Math.abs(diferenca))
    : null;

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
            value={saldoFormatado}
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
          {saldoNegativo && (
            <Text color="red.400" fontSize="sm" mt={1}>
              -{saldoNegativo}
            </Text>
          )}
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
            {formatToBRL(totalEmCentavos)}
          </Text>
        </HStack>
      )}
    </HStack>
  );
}
