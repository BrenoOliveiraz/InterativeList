import React, { useState, useEffect } from 'react';
import { VStack, Box, Button, Text, Icon, IconButton, Alert } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { collection, query, where, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../../Services/FirebaseConfig';
import Title from '../../components/header/Title';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Alert as RNAlert } from 'react-native';

export default function MainScreen() {
    const [userLists, setUserLists] = useState([]);
    const navigation = useNavigation();

    // Função para buscar listas do Firestore
    const fetchLists = () => {
        const user = auth.currentUser;
        if (!user) return;

        const userListsRef = collection(db, 'users', user.uid, 'lists');
        const q = query(userListsRef, where('sharedWith', 'array-contains', user.uid));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const lists = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUserLists(lists);
        });

        return unsubscribe;
    };

    useEffect(() => {
        const unsubscribe = fetchLists();

        return () => {
            if (typeof unsubscribe === 'function') {
                unsubscribe();
            }
        };
    }, []);

    // Função para lidar com a mudança na ordem dos itens
    const handleDragEnd = async ({ data }) => {
        setUserLists(data);

        const user = auth.currentUser;
        if (user && userLists.length > 0) {
            const listId = data[0]?.id; // Considera a primeira lista como exemplo
            if (listId) {
                const listRef = doc(db, 'users', user.uid, 'lists', listId);
                await updateDoc(listRef, { items: data.map(item => item.name) }) // Ajuste conforme o formato dos dados
                    .then(() => {
                        console.log('Ordem atualizada no Firestore');
                    })
                    .catch((error) => {
                        console.error('Erro ao atualizar a ordem no Firestore:', error);
                    });
            }
        }
    };

    // Função para remover um item da lista com confirmação
    const handleRemoveItem = (itemId) => {
        RNAlert.alert(
            "Confirmar Remoção",
            "Você realmente deseja remover este item?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Remover",
                    onPress: async () => {
                        const user = auth.currentUser;
                        if (user) {
                            const listRef = doc(db, 'users', user.uid, 'lists', itemId);
                            await deleteDoc(listRef)
                                .then(() => {
                                    console.log('Item removido do Firestore');
                                })
                                .catch((error) => {
                                    console.error('Erro ao remover o item do Firestore:', error);
                                });
                        }
                    }
                }
            ]
        );
    };

    // Função para renderizar cada item
    const renderItem = ({ item, index, drag }) => (
        <Box
            key={item.id}
            p={4}
            bg="gray.700"
            borderRadius="lg"
            mb={2}
            shadow={2}
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
        >
            <Text
                fontSize="xl"
                color="white"
                onLongPress={drag}
                onPress={() => handleListPress(item.name)} // Navegar ao clicar
            >
                {item.name}
            </Text>
            <IconButton
                icon={<MaterialCommunityIcons name="minus-circle" size={24} color="#943631" />}
                onPress={() => handleRemoveItem(item.id)}
            />
        </Box>
    );

    const handleAddList = () => {
        navigation.navigate('AddList');
    };

    const handleListPress = (listName) => {
        navigation.navigate('ListScreen', { listName });
    };

    return (
        <VStack flex={1} p={5} bg="gray.900">
            <Title color="white">Minhas Listas</Title>
            {userLists.length > 0 ? (
                <DraggableFlatList
                    data={userLists}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    onDragEnd={handleDragEnd}
                    contentContainerStyle={{ padding: 4 }}
                />
            ) : (
                <VStack flex={1} justifyContent="center" alignItems="center">
                    <Text color="white">Nenhuma lista salva ainda.</Text>
                </VStack>
            )}
            <Box mt={5} w="100%" alignItems="center">
                <Button
                    onPress={handleAddList}
                    bg="green.500"
                    borderRadius="md"
                    w="90%" // Ajusta o tamanho do botão
                    h={12}
                    _text={{ color: 'white', fontSize: 'lg' }}
                    leftIcon={
                        <Icon
                            as={<MaterialCommunityIcons name="plus" />}
                            size="lg"
                            color="white"
                        />
                    }
                >

                </Button>
            </Box>
        </VStack>
    );
}
