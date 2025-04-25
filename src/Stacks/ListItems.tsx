import React, { useCallback } from 'react';
import { VStack, Box, Button, Text, Spinner, Pressable, HStack } from 'native-base';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DraggableFlatList from 'react-native-draggable-flatlist';

import Title from '../components/Title';
import Prices from '../components/Price';
import Balance from '../components/Balance';
import CheckboxYT from '../components/Checkbox';
import useSaldo from '../hooks/useSaldo';
import useItemsFromList from '../hooks/useItemsList';

interface Item {
  id: string;
  name: string;
  price: number;
  selected: boolean;
}

export default function ListScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { listName } = route.params as { listName: string };

  const { saldo, loading: saldoLoading, error: saldoError } = useSaldo();
  const { items, updateItems, loading } = useItemsFromList(listName);

  useFocusEffect(
    useCallback(() => {}, [listName, items])
  );

  const calculateTotal = () => {
    const total = items
      .filter(item => item.selected)
      .reduce((total, item) => total + item.price, 0);
    return total;
  };

  const handleDragEnd = ({ data }: { data: Item[] }) => {
    updateItems(data);
  };

  const handlePriceChange = (id: string, newPrice: number) => {
    const updated = items.map(item =>
      item.id === id ? { ...item, price: newPrice } : item
    );
    updateItems(updated);
  };

  const handleCheckboxToggle = (id: string, selected: boolean) => {
    const updated = items.map(item =>
      item.id === id ? { ...item, selected } : item
    );
    updateItems(updated);
  };

  const total = calculateTotal();

  const renderItem = ({ item, index, drag }: { item: Item; index: number; drag: () => void }) => (
    <Pressable onLongPress={drag} key={item.id}>
      <Box
        p={4}
        bg={item.selected ? "green.400" : "gray.700"}
        borderRadius="lg"
        mb={2}
        shadow={2}
        height={20}
        justifyContent="center"
        opacity={item.selected ? 0.5 : 1}
      >
        <HStack alignItems="center" justifyContent="space-between" space={3}>
          <CheckboxYT
            id={item.id}
            selected={item.selected}
            setSelected={(selected: boolean) => handleCheckboxToggle(item.id, selected)}
          />
          <Text fontSize="xl" color="white" numberOfLines={1} ellipsizeMode="tail">
            {item.name}
          </Text>
          <HStack alignItems="center">
  <Text color="white">R$</Text>
  <Prices
    id={item.id}
    initialPrice={item.price || 0}
    onChange={handlePriceChange}
  />
</HStack>

        </HStack>
      </Box>
    </Pressable>
  );

  return (
    <VStack flex={1} px={5} pt={10} bg="gray.900">
      <HStack alignItems="center" mb={5}>
        <Button
          onPress={() =>
            navigation.navigate('EditList', {
              listName,
              onUpdate: () => {},
            })
          }
          bg="emerald.500"
          borderRadius="full"
          px={4}
          py={2}
          leftIcon={
            <MaterialCommunityIcons name="file-document-edit-outline" size={20} color="white" />
          }
        >
          <Text color="white" fontSize="md">Editar</Text>
        </Button>
        <Title marginLeft={3} color="cyan.400">{listName}</Title>
      </HStack>

      {loading ? (
        <VStack flex={1} justifyContent="center" alignItems="center">
          <Spinner color="cyan.400" size="lg" />
        </VStack>
      ) : items.length > 0 ? (
        <DraggableFlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          onDragEnd={handleDragEnd}
          contentContainerStyle={{ paddingBottom: 180 }}
        />
      ) : (
        <VStack flex={1} justifyContent="center" alignItems="center">
          <Text color="gray.300" fontSize="md">Nenhuma lista encontrada com esse nome.</Text>
        </VStack>
      )}

      <VStack
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        p={5}
        bg="gray.800"
        borderTopWidth={1}
        borderColor="gray.700"
        alignItems="center"
      >
        {saldoLoading ? (
          <Spinner color="cyan.400" size="lg" />
        ) : saldoError ? (
          <Text color="red.500">Erro ao carregar saldo</Text>
        ) : (
          <Balance saldo={saldo} total={total} />
        )}
        <Button
          onPress={() => navigation.goBack()}
          bg="blue.600"
          mt={4}
          px={8}
          py={3}
          borderRadius="xl"
        >
          <Text color="white" fontWeight="bold">Voltar</Text>
        </Button>
      </VStack>
    </VStack>
  );
}
