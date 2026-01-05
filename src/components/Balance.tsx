import React from 'react';
import { TextInput } from 'react-native';
import { HStack, Box, Text, Icon, Spinner } from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useSaldo from '../hooks/useSaldo';

interface BalanceProps {
  total: number;
  listId: string;
}

export default function Balance({ total, listId }: BalanceProps) {
  const {
    rawSaldo,
    loading,         // Certifique-se que o hook useSaldo retorna isso
    error,           // Certifique-se que o hook useSaldo retorna isso
    handleSaldoChange,
    formatToBRL,
  } = useSaldo(listId);

  // Cálculo preciso em centavos para evitar erros de ponto flutuante
  const totalEmCentavos = Math.round((total || 0) * 100);
  const saldoUsuarioCentavos = parseInt(rawSaldo || '0', 10);

  const diferenca = saldoUsuarioCentavos - totalEmCentavos;
  const saldoNegativo = diferenca < 0;

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
        <Icon
          as={MaterialCommunityIcons}
          name="wallet"
          size="md"
          color="green.300"
        />

        <Box>
          <Text color="gray.400" fontSize="xs" fontWeight="bold">
            MEU SALDO
          </Text>

          <TextInput
            keyboardType="numeric"
            value={formatToBRL(saldoUsuarioCentavos)}
            onChangeText={handleSaldoChange}
            style={{
              color: 'white',
              borderBottomWidth: 1,
              borderBottomColor: '#22c55e',
              minWidth: 100,
              fontSize: 18,
              fontWeight: 'bold',
            }}
          />

          {saldoNegativo && (
            <Text color="red.400" fontSize="xs" mt={1}>
              Falta: {formatToBRL(Math.abs(diferenca))}
            </Text>
          )}
          
          {!saldoNegativo && saldoUsuarioCentavos > 0 && (
             <Text color="green.400" fontSize="xs" mt={1}>
               Sobra: {formatToBRL(diferenca)}
             </Text>
          )}
        </Box>
      </HStack>

      {loading ? (
        <Spinner color="green.300" />
      ) : error ? (
        <Text color="red.500">Erro</Text>
      ) : (
        <Box alignItems="flex-end">
          <Text color="gray.400" fontSize="xs" fontWeight="bold">
            TOTAL
          </Text>
          <Text color="green.300" fontSize="lg" fontWeight="bold">
            {formatToBRL(totalEmCentavos)}
          </Text>
        </Box>
      )}
    </HStack>
  );
}