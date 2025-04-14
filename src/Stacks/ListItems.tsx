import React, { useState, useCallback } from 'react';
import { VStack, Box, Button, Text, Spinner, Pressable, HStack } from 'native-base';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DraggableFlatList from 'react-native-draggable-flatlist';

import Title from '../components/Title';
import { fetchItems, updateItemOrder, handlePriceChange } from '../services/Api';
import Prices from '../components/Price';
import Balance from '../components/Balance';
import CheckboxYT from '../components/CheckboxYT';
import { getDoc, doc } from 'firebase/firestore';
import { auth, db } from '../services/FirebaseConfig';


export default function ListScreen() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saldo, setSaldo] = useState<number | null>(null);  // Estado para o saldo
    const route = useRoute();
    const navigation = useNavigation();
    const { listName } = route.params;

    // Função para buscar o saldo
    const fetchSaldo = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    setSaldo(userDoc.data().saldo || 0);
                }
            }
        } catch (err) {
            console.error("Erro ao buscar saldo:", err);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchItems(listName, setItems, setLoading, setError);
            fetchSaldo();  
        }, [listName])
    );

    const handleDragEnd = ({ data }) => updateItemOrder(data, setItems);

    const renderItem = ({ item, index, drag }) => (
        <Pressable onLongPress={drag} key={index}>
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
                        selected={item.selected }
                        setItems={setItems}
                        
                    />
                    <Text fontSize="xl" color="white" numberOfLines={1} ellipsizeMode="tail">
                        {item.name}
                    </Text>
                    <Prices
                        id={item.id}
                        initialPrice={item.price || 0}
                        onChange={(id, newPrice) => handlePriceChange(id, newPrice, setItems)}
                    />
                </HStack>
            </Box>
        </Pressable>
    );

   return (
        <VStack flex={1} px={5} pt={10} bg="gray.900">
            <HStack alignItems="center" mb={5}>
                <Button
                    onPress={() => navigation.navigate('EditList', { listName, onUpdate: () => fetchItems(listName, setItems, setLoading, setError) })}
                    bg="emerald.500"
                    borderRadius="full"
                    px={4}
                    py={2}
                    _icon={{ color: "white" }}
                    leftIcon={
                        <MaterialCommunityIcons
                            name="file-document-edit-outline"
                            size={20}
                            color="white"
                        />
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
            ) : (
                items.length > 0 ? (
                    <DraggableFlatList
                        data={items[0]?.items || []}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => `draggable-item-${index}`}
                        onDragEnd={handleDragEnd}
                        contentContainerStyle={{ paddingBottom: 180 }}
                    />
                ) : (
                    <VStack flex={1} justifyContent="center" alignItems="center">
                        <Text color="gray.300" fontSize="md">Nenhuma lista encontrada com esse nome.</Text>
                    </VStack>
                )
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
                <Balance saldo={saldo} />

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
