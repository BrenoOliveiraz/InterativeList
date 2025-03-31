import React, { useState } from 'react';
import { VStack, Box, Button, Text, ScrollView, HStack, Input, Icon } from 'native-base';
import { AddIcon, CloseIcon } from 'native-base';
import { auth, db } from '../Services/FirebaseConfig';
import Title from '../components/Title';
import { doc, setDoc, collection } from 'firebase/firestore';
import { MaterialIcons } from '@expo/vector-icons';
import { handleSaveList } from '../Services/Api';

interface AddListProps {
  navigation: {
    navigate: (screen: string) => void;
  };
}

interface Item {
  id: string;
  name: string;
  price: number | null;
}

const AddList: React.FC<AddListProps> = ({ navigation }) => {
  const [listName, setListName] = useState<string>('');
  const [itemName, setItemName] = useState<string>('');
  const [itemPrice, setItemPrice] = useState<string>('');  // Estado para o preço
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState<string>('');
  const [emailToShare, setEmailToShare] = useState<string>('');

  const handleAddItem = () => {
    if (itemName.trim()) {
      const newItem: Item = {
        id: Date.now().toString(),
        name: itemName,
        price: itemPrice ? parseFloat(itemPrice) : null,  // Adiciona o preço ao item
      };
      setItems([...items, newItem]);
      setItemName('');
      setItemPrice('');  // Limpa o preço após adicionar
    }
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <VStack flex={1} p={5} bg="gray.900">
      <Title color="white">Adicionar Nova Lista</Title>

      <Box mt={4}>
        <Input
          placeholder="Insira o nome da lista"
          value={listName}
          onChangeText={setListName}
          bg="gray.700"
          borderRadius="md"
          color="white"
          p={4}
          borderColor="gray.600"
          _focus={{
            borderColor: "blue.500",
            bg: "gray.800",
            shadow: 2
          }}
        />
      </Box>

      <Box mt={4}>
        <Input
          placeholder="Insira o email opcional para compartilhar"
          value={emailToShare}
          onChangeText={setEmailToShare}
          bg="gray.700"
          borderRadius="md"
          color="white"
          p={4}
          borderColor="gray.600"
          _focus={{
            borderColor: "blue.500",
            bg: "gray.800",
            shadow: 2
          }}
        />
      </Box>

      <Box mt={4}>
        <HStack alignItems="center">
          <Input
            flex={1}
            placeholder="Insira o nome do item"
            value={itemName}
            onChangeText={setItemName}
            bg="gray.700"
            borderRadius="md"
            color="white"
            p={4}
            borderColor="gray.600"
            mr={2}
            _focus={{
              borderColor: "blue.500",
              bg: "gray.800",
              shadow: 2
            }}
          />
          <Input
            flex={1}
            placeholder="Preço (opcional)"
            value={itemPrice}
            onChangeText={setItemPrice}
            keyboardType="numeric"
            bg="gray.700"
            borderRadius="md"
            color="white"
            p={4}
            borderColor="gray.600"
            _focus={{
              borderColor: "blue.500",
              bg: "gray.800",
              shadow: 2
            }}
          />
          <Button
            onPress={handleAddItem}
            bg="green.500"
            borderRadius="md"
            p={2}
            height={12}
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            _pressed={{
              bg: "green.600"
            }}
            shadow={2}
          >
            <Icon as={MaterialIcons} name="add" color="white" size="md" />
          </Button>
        </HStack>
      </Box>

      <ScrollView mt={4} bg="gray.800" borderRadius="md" p={4} shadow={3}>
        {items.length > 0 ? (
          items.map((item) => (
            <HStack key={item.id} mb={2} p={4} bg="gray.700" borderRadius="md" shadow={2} alignItems="center" justifyContent="space-between">
              <Text color="white">{item.name}</Text>
              {item.price && (
                <Text color="white">Preço: R${item.price.toFixed(2)}</Text>
              )}
              <Button
                onPress={() => handleRemoveItem(item.id)}
                bg="red.500"
                borderRadius="full"
                p={2}
                _pressed={{
                  bg: "red.700"
                }}
                shadow={2}
              >
                <CloseIcon color="white" size='sm' />
              </Button>
            </HStack>
          ))
        ) : (
          <Text color="white">Nenhum item adicionado ainda.</Text>
        )}
      </ScrollView>

      <Box mt={8} w="100%">
        <Button
          onPress={() => handleSaveList(listName, items, emailToShare, navigation)}
          bg="blue.800"
          w="100%"
          borderRadius="md"
          shadow={3}
          _pressed={{
            bg: "blue.900"
          }}
        >
          <Text color="white">Salvar Lista</Text>
        </Button>
      </Box>
    </VStack>
  );
};

export default AddList;
