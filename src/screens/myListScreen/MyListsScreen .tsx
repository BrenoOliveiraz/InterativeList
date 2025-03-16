import React, { useState, useEffect } from 'react';
import { VStack, Box, Button, Text, Icon, IconButton, Menu, Pressable } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { Alert as RNAlert } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { fetchUserLists, handleUpdateListOrder, handleRemoveList } from '../../Services/Api'; // Importando as funções

import { auth } from '../../Services/FirebaseConfig';
import Title from '../../components/header/Title';

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

    const handleListPress = (listName) => {
        navigation.navigate('ListScreen', { listName });
    };

    const handleSharedLists = () => {
        navigation.navigate('SharedListsScreen');
    };

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigation.navigate('Login');
        } catch (error) {
            console.error('Logout falhou', error);
        }
    };

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
                onPress={() => handleListPress(item.name)} 
            >
                {item.name}
            </Text>

            <Menu
                w="150"
                trigger={(triggerProps) => (
                    <Pressable {...triggerProps}>
                        <Icon
                            as={<MaterialCommunityIcons name="dots-vertical" />}
                            size="lg"
                            color="white"
                        />
                    </Pressable>
                )}
            >
                <Menu.Item onPress={() => handleRemoveItem(item.id)}>Remover Lista</Menu.Item>
                <Menu.Item onPress={() => handleOpenMenu(item.id)}>Compartilhar</Menu.Item>
            </Menu>
        </Box>
    );

    return (
        <VStack flex={1} p={5} bg="gray.900">
            <Box flexDirection="row" justifyContent="space-between" alignItems="center">
                <Title color="white">Minhas Listas</Title>
                <IconButton
                    icon={<MaterialCommunityIcons name="logout" size={24} color="white" />}
                    onPress={handleLogout}
                    _icon={{ color: 'white' }}
                />
            </Box>
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
                    w="90%" 
                    h={12}
                    _text={{ color: 'white', fontSize: 'lg' }}
                    leftIcon={
                        <Icon
                            as={<MaterialCommunityIcons name="plus" />}
                            size="lg"
                            color="white"
                        />
                    }
                />
            </Box>
            <Box mt={2} w="100%" alignItems="center">
                <Button
                    onPress={handleSharedLists}
                    bg="blue.500"
                    borderRadius="md"
                    w="90%" 
                    h={12}
                    _text={{ color: 'white', fontSize: 'lg' }}
                    leftIcon={
                        <Icon
                            as={<MaterialCommunityIcons name="share" />}
                            size="lg"
                            color="white"
                        />
                    }
                >
                    Listas Compartilhadas
                </Button>
            </Box>
        </VStack>
    );
}
