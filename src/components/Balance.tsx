import React, { useState, useEffect } from 'react';
import { TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HStack, Box, Text, Icon } from 'native-base';
import { auth, db } from '../services/FirebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const STORAGE_KEY = 'user_balance';

export default function Balance({ saldo }: { saldo?: number }) {
  const [rawSaldo, setRawSaldo] = useState<string>('');

  useEffect(() => {
    const loadSaldo = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored !== null) {
          setRawSaldo(stored);
        }
      } catch (error) {
        console.error("Erro ao carregar saldo:", error);
      }
    };
    loadSaldo();
  }, []);

  const formatToBRL = (valueInCents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valueInCents / 100);
  };

  const handleSaldoChange = async (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    setRawSaldo(cleaned);
    const valueInCents = parseInt(cleaned) || 0;

    try {
      await AsyncStorage.setItem(STORAGE_KEY, cleaned);

      const user = auth.currentUser;
      if (user) {
        await updateDoc(doc(db, 'users', user.uid), { saldo: valueInCents / 100 });
      }
    } catch (error) {
      console.error("Erro ao salvar saldo:", error);
    }
  };

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
            value={formatToBRL(parseInt(rawSaldo || '0'))}
            onChangeText={handleSaldoChange}
            style={{
              color: "white",
              borderBottomWidth: 1,
              borderBottomColor: "#22c55e", 
              minWidth: 80,
              paddingBottom: 2,
              fontSize: 16,
              fontWeight: '500'
            }}
            placeholder="R$ 0,00"
            placeholderTextColor="gray"
          />
        </Box>
      </HStack>

      <HStack space={2} alignItems="center">
        <Text color="white" fontSize="md" fontWeight="bold">
          Total
        </Text>
        <Text color="green.300" fontSize="md" fontWeight="bold">
          {saldo !== null ? formatToBRL(saldo * 100) : 'R$ 0,00'}
        </Text>
      </HStack>
    </HStack>
  );
}
