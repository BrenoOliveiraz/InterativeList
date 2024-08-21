import React, { useState, useEffect } from 'react';
import { VStack, Box, Button, Text } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { collection, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../Services/FirebaseConfig';
import Title from '../../components/header/Title';
import DraggableFlatList from 'react-native-draggable-flatlist';

export default function MainScreen() {
    const [userLists, setUserLists] = useState([]);
    const navigation = useNavigation();

    // Função para buscar listas do Firestore
    const fetchLists = (setUserLists) => {
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
        const unsubscribe = fetchLists(setUserLists);

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
            const listId = userLists[0]?.id; // Considera a primeira lista como exemplo
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

    // Função para renderizar cada item
    const renderItem = ({ item, index, drag }) => (
        <Box
            key={item.id}
            p={4}
            bg="gray.700"
            borderRadius="lg"
            mb={2}
            shadow={2}
        >
            <Text
                color="white"
                onLongPress={drag}
                onPress={() => handleListPress(item.name)} // Navegar ao clicar
            >
                {item.name}
            </Text>
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
            <Box mt={8} w="100%">
                <Button onPress={handleAddList} bg="green.500" w="100%" borderRadius="lg">
                    <Text color="white">Adicionar Nova Lista</Text>
                </Button>
            </Box>
        </VStack>
    );
}
