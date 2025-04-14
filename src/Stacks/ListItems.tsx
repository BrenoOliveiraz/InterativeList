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
                minHeight={50}
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
        <VStack flex={1} p={5} bg="gray.900">
            <HStack alignItems='center'>
                <Button
                    onPress={() => navigation.navigate('EditList', { listName, onUpdate: () => fetchItems(listName, setItems, setLoading, setError) })}
                    bg="green.500"
                    borderRadius="md"
                    w="20%"
                    h={10}
                    _text={{ color: 'white', fontSize: 'lg' }}
                    leftIcon={<MaterialCommunityIcons name="file-document-edit-outline" size={24} color="white" />}
                />
                <Title marginLeft={2} color="red.500"> {listName}</Title>
            </HStack>

            {loading ? (
                <VStack flex={1} justifyContent="center" alignItems="center">
                    <Spinner color="blue.500" />
                </VStack>
            ) : (
                items.length > 0 ? (
                    <DraggableFlatList
                        data={items[0]?.items || []}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => `draggable-item-${index}`}
                        onDragEnd={handleDragEnd}
                        contentContainerStyle={{ padding: 4, paddingBottom: 180 }}
                    />
                ) : (
                    <VStack flex={1} justifyContent="center" alignItems="center">
                        <Text color="white">Nenhuma lista encontrada com o nome fornecido.</Text>
                    </VStack>
                )
            )}

            <VStack
                position="absolute"
                bottom={0}
                left={0}
                right={0}
                p={4}
                h={32}
                justifyContent="center"
                alignItems="center"
                bg="gray.800"
                borderTopWidth={1}
                borderColor="gray.600"
            >
                <Text>

                <Balance saldo={saldo} />  
                </Text>

                <Button
                    onPress={() => navigation.goBack()}
                    bg="blue.800"
                    w="50%"
                    borderRadius="lg"
                    mt={4}
                >
                    <Text color="white">Voltar</Text>
                </Button>
            </VStack>
        </VStack>
    );
}
