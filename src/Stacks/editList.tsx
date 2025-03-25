import React, { useState, useEffect, useRef } from 'react';
import { VStack, Box, Button, Text, Spinner, Pressable, Icon, HStack, IconButton } from 'native-base';
import { useRoute, useNavigation } from '@react-navigation/native';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { auth, db } from '../Services/FirebaseConfig';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Alert as RNAlert, StyleSheet, View, Animated } from 'react-native';

export default function EditList() {
    const [items, setItems] = useState([]); // Estado para os itens da lista
    const [loading, setLoading] = useState(true); // Estado de carregamento
    const [error, setError] = useState(null); // Estado para gerenciar erros
    const [listId, setListId] = useState(null); // Estado para o ID da lista
    const route = useRoute();
    const navigation = useNavigation();

    const { listName, onUpdate } = route.params; // Obtendo parâmetros da rota

    const shakeAnimation = useRef(new Animated.Value(0)).current; // Animação de shake

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

                if (fetchedLists.length > 0) {
                    // Supondo que 'items' seja um array de objetos que possuem uma propriedade 'name'
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
        // Animação de shake
        Animated.sequence([
            Animated.timing(shakeAnimation, {
                toValue: -10,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(shakeAnimation, {
                toValue: 10,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(shakeAnimation, {
                toValue: -5,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(shakeAnimation, {
                toValue: 5,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(shakeAnimation, {
                toValue: 0,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();
    }, [items]);

    const handleDragEnd = async ({ data }) => {
        setItems(data); // Atualiza a lista após arrastar
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
                        setItems(prevItems => prevItems.filter(item => item.id !== itemToRemove.id)); // Filtra pelo ID do item
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
            const listRef = doc(db, 'users', auth.currentUser.uid, 'lists', listId);
            await updateDoc(listRef, { items });
            console.log('Alterações salvas no Firestore');
            if (onUpdate) onUpdate(); // Chama a função de callback, se definida
            navigation.goBack();
        } catch (error) {
            console.error('Erro ao salvar alterações no Firestore:', error);
            setError('Erro ao salvar alterações. Tente novamente mais tarde.');
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item, index, drag }) => (
        <Pressable onLongPress={drag} key={item.id}> {/* Use 'item.id' como chave */}
            <Animated.View style={[styles.card, { transform: [{ translateX: shakeAnimation }] }]}>
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
                        {item.name} {/* Acesse a propriedade 'name' do objeto */}
                    </Text>
                    <IconButton
                        icon={<MaterialCommunityIcons name="minus-circle" size={24} color="#943631" />}
                        onPress={() => handleRemoveItem(item)} // Chama a função para remover o item
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
                    keyExtractor={(item) => item.id} // Use 'item.id' como chave
                    onDragEnd={handleDragEnd}
                    contentContainerStyle={{ padding: 4, paddingBottom: 80 }}
                />
            )}

            <View style={styles.saveButtonContainer}>
                <Button
                    onPress={handleSaveChanges}
                    bg="blue.500"
                    borderRadius="md"
                    w="100%"
                    h={12}
                    _text={{ color: 'white', fontSize: 'lg' }}
                >
                    Salvar Alterações
                </Button>
            </View>
        </VStack>
    );
}

const styles = StyleSheet.create({
    saveButtonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: 'transparent',
    },
    card: {
        marginVertical: 5,
    },
});
