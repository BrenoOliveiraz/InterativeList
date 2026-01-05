import React, { useState, useEffect } from 'react';
import { VStack, Box, Button, Text, Icon, IconButton, CloseIcon } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { collection, query, where, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../services/FirebaseConfig';
import Title from '../components/Title';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Alert as RNAlert } from 'react-native';

export default function SharedListsScreen() {
    const [sharedLists, setSharedLists] = useState([]);
    const navigation = useNavigation();

const fetchSharedLists = () => {
    const user = auth.currentUser;
    if (!user || !user.email) return;

    const userListsRef = collection(db, 'lists');
    
    // Busca listas onde seu e-mail está, mas filtramos o dono no código
    const q = query(userListsRef, where('sharedWith', 'array-contains', user.email.toLowerCase())); 

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const lists = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // FILTRO: Só mostra listas onde o ownerId é DIFERENTE do seu UID
        const onlySharedWithMe = lists.filter(list => list.ownerId !== user.uid);

        setSharedLists(onlySharedWithMe);
    });

    return unsubscribe;
};

    useEffect(() => {
        const unsubscribe = fetchSharedLists();

        return () => {
            if (typeof unsubscribe === 'function') {
                unsubscribe();
            }
        };
    }, []);

  
    const handleRemoveItem = (itemId) => {
        RNAlert.alert(
            "Confirmar Remoção",
            "Você realmente deseja remover esta lista?",
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
                                    console.log('Lista removida do Firestore');
                                })
                                .catch((error) => {
                                    console.error('Erro ao remover a lista do Firestore:', error);
                                });
                        }
                    }
                }
            ]
        );
    };

    
    const renderItem = ({ item }) => (
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
              onPress={() => handleListPress(item.id, item.name)}
            >
                {item.name}
            </Text>

            <CloseIcon
                bg="red.500"
                borderRadius="full"
                p={2}
                _pressed={{
                    bg: "red.700"
                }}
                shadow={2}
                color="white" size='sm'
                onPress={() => handleRemoveItem(item.id)}
            />
        </Box>
    );

    const handleListPress = (listId, listName ) => {
        navigation.navigate('ListScreen', { listId, listName });
    };

    const handleBack = () => {
        navigation.goBack();
    };

    return (
        <VStack flex={1} p={5} bg="gray.900">
            <Box flexDirection="row" justifyContent="space-between" alignItems="center">
                <Title color="white">Listas Compartilhadas</Title>
                <IconButton
                    icon={<MaterialCommunityIcons name="arrow-left" size={24} color="white" />}
                    onPress={handleBack}
                    _icon={{ color: 'white' }}
                />
            </Box>
            {sharedLists.length > 0 ? (
                <VStack mt={4}>
                    {sharedLists.map(item => renderItem({ item }))}
                </VStack>
            ) : (
                <VStack flex={1} justifyContent="center" alignItems="center">
                    <Text color="white">Nenhuma lista compartilhada encontrada.</Text>
                </VStack>
            )}
        </VStack>
    );
}
