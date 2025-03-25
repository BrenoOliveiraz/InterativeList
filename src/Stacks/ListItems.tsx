import React, { useState, useCallback } from 'react';
import { VStack, Box, Button, Text, Spinner, Pressable, HStack } from 'native-base';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DraggableFlatList from 'react-native-draggable-flatlist';
import Checkbox from '../components/CheckBox/Checkbox';
import Title from '../components/header/Title';
import { fetchItems, updateItemOrder, handleCheckboxChange } from '../Services/Api';

export default function ListScreen() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const route = useRoute();
    const navigation = useNavigation();
    const { listName } = route.params;

    useFocusEffect(
        useCallback(() => {
            fetchItems(listName, setItems, setLoading, setError);
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
                <HStack alignItems="center" space={3}>
                    <Checkbox id={item.id} onChange={(id, state) => handleCheckboxChange(id, state, setItems)} isChecked={item.selected} />
                    <Text fontSize="xl" color="white" numberOfLines={1} ellipsizeMode="tail">
                        {item.name}
                    </Text>
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
