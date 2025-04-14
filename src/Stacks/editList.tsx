import React, { useState, useEffect, useRef } from 'react';
import { VStack, Box, Button, Text, Spinner, Pressable, Icon, HStack, IconButton } from 'native-base';
import { useRoute, useNavigation } from '@react-navigation/native';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { auth, db } from '../services/FirebaseConfig';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Alert as RNAlert, StyleSheet, Animated } from 'react-native';

export default function EditList() {
    const [items, setItems] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 
    const [listId, setListId] = useState(null); 
    const route = useRoute();
    const navigation = useNavigation();

    const { listName } = route.params;

    const shakeAnimation = useRef(new Animated.Value(0)).current; 

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
                const userListsRef = collection(db, 'lists');
                const q = query(userListsRef, where('name', '==', listName));
                const querySnapshot = await getDocs(q);
                const fetchedLists = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                if (fetchedLists.length > 0) {
                    setItems(fetchedLists[0]?.items || []);
                    setListId(fetchedLists[0]?.id);
                }
            } catch (error) {
                console.error('Erro ao buscar listas: ', error);
                setError('Erro ao buscar itens. Tente novamente mais tarde.');
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, [listName]);

    useEffect(() => {
        // Definindo a função de atualização no options da navegação
        navigation.setOptions({
            onUpdate: () => {
                console.log('Atualizar lista');
            },
        });
    }, [navigation]);

    const handleDragEnd = async ({ data }) => {
        setItems(data); 
    };

    const handleRemoveItem = (itemToRemove) => {
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
                    onPress: () => {
                        setItems(prevItems => prevItems.filter(item => item.id !== itemToRemove.id)); 
                    }
                }
            ]
        );
    };

    const handleSaveChanges = async () => {
        if (!listId) {
            console.error('ID da lista não encontrado');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const listRef = doc(db,'lists', listId);
            await updateDoc(listRef, { items });
            console.log('Alterações salvas no Firestore');
            // Acessando a função onUpdate diretamente via navigation
            const parent = navigation.getParent();
            parent?.getState().routes.find(r => r.name === "ListScreen")?.params?.onUpdate?.();
            navigation.goBack();
        } catch (error) {
            console.error('Erro ao salvar alterações no Firestore:', error);
            setError('Erro ao salvar alterações. Tente novamente mais tarde.');
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item, index, drag }) => (
        <Pressable onLongPress={drag} key={item.id}> 
            <Animated.View style={[styles.card, { transform: [{ translateX: shakeAnimation }] }]} >
                <Box
                    p={4}
                    bg="gray.700"
                    borderRadius="lg"
                    mb={2}
                    shadow={2}
                    minHeight={50}
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Text fontSize="xl" color="white" numberOfLines={1} ellipsizeMode="tail">
                        {item.name} 
                    </Text>
                    <IconButton
                        icon={<MaterialCommunityIcons name="minus-circle" size={24} color="#943631" />}
                        onPress={() => handleRemoveItem(item)} 
                    />
                </Box>
            </Animated.View>
        </Pressable>
    );

    return (
        <VStack flex={1} p={5} bg="gray.900">
            <HStack alignItems='center' mb={5}>
                <Text marginRight={2} fontSize="2xl" color="red.500">
                    {listName}
                </Text>
            </HStack>

            {loading ? (
                <VStack flex={1} justifyContent="center" alignItems="center">
                    <Spinner color="blue.500" />
                </VStack>
            ) : (
                <DraggableFlatList
                    data={items}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    onDragEnd={handleDragEnd}
                    contentContainerStyle={{ padding: 4 }}
                />
            )}

            {error && <Text color="red.500" textAlign="center">{error}</Text>}

            <Box mt={8} w="100%">
                <Button onPress={handleSaveChanges} bg="green.500" w="100%" borderRadius="lg">
                    {loading ? (
                        <Spinner color="white" />
                    ) : (
                        <Text color="white">Salvar Alterações</Text>
                    )}
                </Button>
            </Box>
        </VStack>
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 8,
        backgroundColor: 'gray',
        padding: 12,
        borderRadius: 8,
        minHeight: 50,
    },
});
