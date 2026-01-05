import React, { useEffect, useMemo, useState } from 'react';
import { VStack, Box, Button, Text, Spinner, Pressable, HStack } from 'native-base';
import { useRoute, useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DraggableFlatList from 'react-native-draggable-flatlist';

import Title from '../components/Title';
import Prices from '../components/Price';
import Balance from '../components/Balance';
import CheckboxYT from '../components/Checkbox';

import useItemsFromList from '../hooks/useItemsList';
import AddItemModal from '../components/ModalItemNovo';

export default function ListScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { listId, listName } = route.params as { listId: string, listName: string };

  const { serverItems, updateItems, loading } = useItemsFromList(listId);
  const [modalVisible, setModalVisible] = useState(false);
  const [localItems, setLocalItems] = useState<any[]>([]);
  
  // NOVO: Estado para controlar qual item está sendo editado
  const [editingItem, setEditingItem] = useState<{id: string, name: string} | null>(null);

  useEffect(() => {
    if (serverItems && serverItems.length > 0 && localItems.length === 0) {
      setLocalItems(serverItems);
    }
  }, [serverItems, localItems.length]);

  const total = useMemo(() => {
    return localItems
      .filter(item => item && item.selected)
      .reduce((acc, item) => acc + (Number(item.price) || 0), 0);
  }, [localItems]);

  // MODIFICADO: Função unificada para Adicionar e Editar
  const handleSaveItem = (name: string) => {
    let updated;
    
    if (editingItem) {
      // Lógica de Edição (Update)
      updated = localItems.map(item => 
        item.id === editingItem.id ? { ...item, name } : item
      );
    } else {
      // Lógica de Adição (Create)
      const newItem = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        price: 0,
        selected: false,
      };
      updated = [...localItems, newItem];
    }

    setLocalItems(updated);
    updateItems(updated);
    setModalVisible(false);
    setEditingItem(null); // Limpa o estado após salvar
  };

  const handleDragEnd = ({ data }: { data: any[] }) => {
    if (!data) return;
    setLocalItems(data);
    updateItems(data);
  };

  const handlePriceChange = (id: string, newPrice: number) => {
    const updated = localItems.map(item => item.id === id ? { ...item, price: newPrice } : item);
    setLocalItems(updated);
    updateItems(updated);
  };

  const handleCheckboxToggle = (id: string, selected: boolean) => {
    const updated = localItems.map(item => item.id === id ? { ...item, selected } : item);
    setLocalItems(updated);
    updateItems(updated);
  };

  // NOVO: Função para abrir o modal em modo edição
  const openEditModal = (item: any) => {
    setEditingItem({ id: item.id, name: item.name });
    setModalVisible(true);
  };

  const renderItem = ({ item, drag, isActive }: any) => (
    <Pressable onLongPress={drag} delayLongPress={150} disabled={isActive}>
      <Box
        p={4}
        bg={isActive ? 'gray.600' : (item.selected ? 'green.500' : 'gray.700')}
        borderRadius="lg"
        mb={2}
        opacity={item.selected && !isActive ? 0.6 : 1}
        borderWidth={isActive ? 2 : 0}
        borderColor="cyan.400"
      >
        <HStack alignItems="center" justifyContent="space-between">
          <CheckboxYT
            id={item.id}
            selected={item.selected}
            setSelected={(val: boolean) => handleCheckboxToggle(item.id, val)}
          />
          
          {/* MODIFICADO: Clique no texto abre a edição */}
          <Pressable onPress={() => openEditModal(item)} flex={1} mx={3}>
            <Text fontSize="md" color="white" strikeThrough={item.selected}>
              {item.name}
            </Text>
          </Pressable>

          <HStack alignItems="center" space={1}>
            <Text color="white" fontSize="xs">R$</Text>
            <Prices id={item.id} initialPrice={item.price || 0} onChange={handlePriceChange} />
          </HStack>
        </HStack>
      </Box>
    </Pressable>
  );

  return (
    <VStack flex={1} bg="gray.900" pt={10}>
      <HStack px={5} alignItems="center" justifyContent="space-between" mb={5}>
        <HStack alignItems="center" space={3} flex={1}>
          <Button
            onPress={() => navigation.goBack()}
            variant="ghost"
            leftIcon={<MaterialCommunityIcons name="arrow-left" size={24} color="white" />}
          />
          <Title color="cyan.400">{listName}</Title>
        </HStack>
        
        {/* MODIFICADO: Botão de adicionar limpa o editingItem antes de abrir */}
        <Button
          variant="unstyled"
          onPress={() => {
            setEditingItem(null);
            setModalVisible(true);
          }}
        >
          <MaterialCommunityIcons name="plus-circle" size={32} color="#22d3ee" />
        </Button>
      </HStack>

      <Box flex={1}>
        {loading && localItems.length === 0 ? (
          <Spinner color="cyan.400" size="lg" flex={1} />
        ) : (
          <DraggableFlatList
            data={localItems}
            keyExtractor={(item) => `item-${item.id}`}
            renderItem={renderItem}
            onDragEnd={handleDragEnd}
            activationDistance={20}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
          />
        )}
      </Box>

      <Box w="full" bg="gray.800" p={5} borderTopRadius="2xl" shadow={9}>
        <Balance total={total} listId={listId} />
      </Box>

      {/* MODIFICADO: Props atualizadas para suportar edição */}
      <AddItemModal 
        isOpen={modalVisible} 
        onClose={() => {
            setModalVisible(false);
            setEditingItem(null);
        }} 
        onSave={handleSaveItem} 
        initialData={editingItem}
      />
    </VStack>
  );
}