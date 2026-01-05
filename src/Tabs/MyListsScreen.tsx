import React, { useState, useEffect } from 'react';
import { VStack, Box, Button, Text, Icon, IconButton, Menu, Pressable, Progress, HStack } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { Alert as RNAlert } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { fetchUserLists, handleUpdateListOrder, handleRemoveList } from '../services/Api';
import { auth } from '../services/FirebaseConfig';
import Title from '../components/Title';

export default function MyListsScreen() {
    const [userLists, setUserLists] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = fetchUserLists(setUserLists);
        return () => {
            if (typeof unsubscribe === 'function') {
                unsubscribe();
            }
        };
    }, []);

    // NOVO: Função para calcular a porcentagem de conclusão
    const calculateProgress = (items) => {
        if (!items || items.length === 0) return 0;
        const selectedCount = items.filter(item => item.selected).length;
        return (selectedCount / items.length) * 100;
    };

    const handleDragEnd = async ({ data }) => {
        setUserLists(data);
        await handleUpdateListOrder(data);
    };

    const handleRemoveItem = (itemId) => {
        RNAlert.alert(
            "Confirmar Remoção",
            "Você realmente deseja remover esta lista?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Remover", onPress: () => handleRemoveList(itemId) }
            ]
        );
    };

    const handleOpenMenu = (itemId) => {
        navigation.navigate('ShareListScreen', { listId: itemId });
    };

    const handleAddList = () => {
        navigation.navigate('AddList');
    };

    const handleListPress = (listId, listName) => {
        navigation.navigate('ListScreen', { listId, listName });
    };

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigation.navigate('Login');
        } catch (error) {
            console.error('Logout falhou', error);
        }
    };

    const renderItem = ({ item, drag }) => {
        // MODIFICADO: Cálculo do progresso e contagem de itens
        const progressValue = calculateProgress(item.items);
        const totalItems = item.items?.length || 0;
        const checkedItems = item.items?.filter(i => i.selected).length || 0;

        return (
            <Box
                p={4}
                bg="gray.800"
                borderRadius="2xl"
                mb={3}
                shadow={3}
            >
                {/* MODIFICADO: VStack para empilhar Título e Barra de Progresso */}
                <VStack space={3}>
                    <HStack alignItems="center" justifyContent="space-between">
                        <Pressable 
                            flex={1} 
                            onLongPress={drag} 
                            onPress={() => handleListPress(item.id, item.name)}
                        >
                            <Text
                                fontSize="lg"
                                color="white"
                                fontWeight="medium"
                            >
                                {item.name}
                            </Text>
                        </Pressable>

                        <Menu
                            w="40"
                            borderRadius="md"
                            bg="white"
                            _item={{ _text: { color: 'white' } }}
                            trigger={(triggerProps) => (
                                <Pressable {...triggerProps}>
                                    <Icon
                                        as={<MaterialCommunityIcons name="dots-vertical" />}
                                        size="lg"
                                        color="gray.300"
                                    />
                                </Pressable>
                            )}
                        >
                            <Menu.Item onPress={() => handleRemoveItem(item.id)}>
                                Remover Lista
                            </Menu.Item>
                            <Menu.Item onPress={() => handleOpenMenu(item.id)}>
                                Compartilhar
                            </Menu.Item>
                        </Menu>
                    </HStack>

                    {/* NOVO: Seção da Barra de Progresso */}
                    {totalItems > 0 && (
                        <VStack space={1}>
                            <Progress 
                                value={progressValue} 
                                colorScheme={progressValue === 100 ? "green" : "cyan"} 
                                bg="gray.700"
                                size="xs" 
                                borderRadius="full"
                            />
                            <HStack justifyContent="space-between" alignItems="center">
                                <Text fontSize="xs" color="gray.400">
                                    {Math.round(progressValue)}% concluído
                                </Text>
                                <Text fontSize="xs" color="gray.400">
                                    {checkedItems}/{totalItems} itens
                                </Text>
                            </HStack>
                        </VStack>
                    )}
                </VStack>
            </Box>
        );
    };

    return (
        <VStack flex={1} px={5} pt={10} bg="gray.900" space={4}>
            <Box flexDirection="row" justifyContent="space-between" alignItems="center">
                <Title color="white">Minhas Listas</Title>
                <IconButton
                    icon={<MaterialCommunityIcons name="logout" size={24} color="white" />}
                    onPress={handleLogout}
                    variant="ghost"
                    _pressed={{ bg: 'gray.800' }}
                />
            </Box>

            {userLists.length > 0 ? (
                <DraggableFlatList
                    data={userLists}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    onDragEnd={handleDragEnd}
                    contentContainerStyle={{ paddingBottom: 16 }}
                />
            ) : (
                <VStack flex={1} justifyContent="center" alignItems="center">
                    <Text color="gray.300">Nenhuma lista salva ainda.</Text>
                </VStack>
            )}

            <Box pb={5}>
                <Button
                    onPress={handleAddList}
                    bg="green.500"
                    borderRadius="2xl"
                    w="100%"
                    h={12}
                    _pressed={{ bg: 'green.600' }}
                    leftIcon={
                        <Icon
                            as={<MaterialCommunityIcons name="plus" />}
                            size="lg"
                            color="white"
                        />
                    }
                    _text={{ color: 'white', fontSize: 'md', fontWeight: 'medium' }}
                >
                    Nova Lista
                </Button>
            </Box>
        </VStack>
    );
}