import React, { useState, useEffect } from 'react';
import { VStack, Box, Button, Text, Spinner, Pressable } from 'native-base';
import { useRoute, useNavigation } from '@react-navigation/native';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../Services/FirebaseConfig';
import Title from '../../components/header/Title';
import DraggableFlatList from 'react-native-draggable-flatlist';

export default function ListScreen() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const route = useRoute();
    const navigation = useNavigation();

    const { listName } = route.params;

    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);
            setError(null);

            if (!listName) {
                setError('Nome da lista inválido');
                setLoading(false);
                return;
            }

            try {
                const userListsRef = collection(db, 'users', auth.currentUser.uid, 'lists');
                const q = query(userListsRef, where('name', '==', listName));
                const querySnapshot = await getDocs(q);
                const fetchedLists = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setItems(fetchedLists);
            } catch (error) {
                console.error('Erro ao buscar listas: ', error);
                setError('Erro ao buscar itens. Tente novamente mais tarde.');
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, [listName]);

    const handleDragEnd = async ({ data }) => {
        setItems(prevItems => {
            const updatedItems = [...prevItems];
            updatedItems[0].items = data;

            if (updatedItems[0]?.id) {
                const listRef = doc(db, 'users', auth.currentUser.uid, 'lists', updatedItems[0].id);
                updateDoc(listRef, { items: data })
                    .catch(error => console.error('Erro ao atualizar ordem no Firestore:', error));
            }

            return updatedItems;
        });
    };

    const renderItem = ({ item, index, drag }) => (
        <Pressable onLongPress={drag} key={index}>
            <Box p={4} bg="gray.700" borderRadius="lg" mb={2} shadow={2} minHeight={50} justifyContent="center">
                <Text fontSize="xl" color="white" numberOfLines={1} ellipsizeMode="tail">
                    {item}
                </Text>
            </Box>
        </Pressable>
    );

    return (
        <VStack flex={1} p={5} bg="gray.900">
            <Title color="white"> {listName}</Title>

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
                        contentContainerStyle={{ padding: 4, paddingBottom: 50 }} 
                    />
                ) : (
                    <VStack flex={1} justifyContent="center" alignItems="center">
                        <Text color="white">Nenhuma lista encontrada com o nome fornecido.</Text>
                    </VStack>
                )
            )}

            <Box mt={8} w="100%">
                <Button onPress={() => navigation.goBack()} bg="blue.800" w="100%" borderRadius="lg">
                    <Text color="white">Voltar</Text>
                </Button>
            </Box>
        </VStack>
    );
}
