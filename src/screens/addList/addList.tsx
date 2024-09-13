import React, { useState } from 'react';
import { VStack, Box, Button, Text, ScrollView, HStack, Input, Icon } from 'native-base';
import { AddIcon, CloseIcon } from 'native-base';
import { auth, db } from '../../Services/FirebaseConfig'; // Importação do Firebase e Firestore
import Title from '../../components/header/Title';
import { doc, setDoc, collection } from 'firebase/firestore';
import { MaterialIcons } from '@expo/vector-icons'; // Importa MaterialIcons

export default function AddList({ navigation }) {
    const [listName, setListName] = useState('');
    const [itemName, setItemName] = useState('');
    const [items, setItems] = useState([]);
    const [error, setError] = useState('');
    const [emailToShare, setEmailToShare] = useState(''); // Novo estado para o email opcional

    const handleAddItem = () => {
        if (itemName.trim()) {
            const newItem = {
                id: Date.now().toString(),
                name: itemName
            };
            setItems([...items, newItem]);
            setItemName('');
        }
    };

    const handleRemoveItem = (id) => {
        setItems(items.filter(item => item.id !== id));
    };

    const handleSaveList = async () => {
        if (!listName.trim()) {
            setError('O nome da lista não pode estar vazio.');
            return;
        }
        if (items.length === 0) {
            setError('A lista deve conter pelo menos um item.');
            return;
        }

        const user = auth.currentUser;
        if (!user) return;

        try {
            const userListsRef = collection(db, 'users', user.uid, 'lists');
            const newListRef = doc(userListsRef);

            await setDoc(newListRef, {
                id: newListRef.id,
                name: listName,
                items: items,
                sharedWith: emailToShare ? [user.email, emailToShare.trim()] : [user.email] // Compartilha com o email do usuário e o opcional
            });

            console.log('Lista salva com sucesso!');
            navigation.goBack();
        } catch (error) {
            console.error('Erro ao salvar lista: ', error);
            setError('Erro ao salvar a lista. Tente novamente mais tarde.');
        }
    };

    return (
        <VStack flex={1} p={5} bg="gray.900">
            <Title color="white">Adicionar Nova Lista</Title>

            {error ? (
                <Box bg="red.500" p={3} borderRadius="md" mb={4}>
                    <Text color="white">{error}</Text>
                </Box>
            ) : null}

            <Box mt={4}>
                <Input
                    placeholder="Insira o nome da lista"
                    value={listName}
                    onChangeText={setListName}
                    bg="gray.700"
                    borderRadius="md"
                    color="white"
                    p={4}
                    borderColor="gray.600"
                    _focus={{
                        borderColor: "blue.500",
                        bg: "gray.800",
                        shadow: 2
                    }}
                />
            </Box>

            <Box mt={4}>
                <Input
                    placeholder="Insira o email opcional para compartilhar"
                    value={emailToShare}
                    onChangeText={setEmailToShare}
                    bg="gray.700"
                    borderRadius="md"
                    color="white"
                    p={4}
                    borderColor="gray.600"
                    _focus={{
                        borderColor: "blue.500",
                        bg: "gray.800",
                        shadow: 2
                    }}
                />
            </Box>

            <Box mt={4}>
                <HStack alignItems="center">
                    <Input
                        flex={1}
                        placeholder="Insira o nome do item"
                        value={itemName}
                        onChangeText={setItemName}
                        bg="gray.700"
                        borderRadius="md"
                        color="white"
                        p={4}
                        borderColor="gray.600"
                        mr={2}
                        _focus={{
                            borderColor: "blue.500",
                            bg: "gray.800",
                            shadow: 2
                        }}
                    />
                    <Button
                        onPress={handleAddItem}
                        bg="green.500"
                        borderRadius="md"
                        p={2}
                        height={12}
                        flexDirection="row"
                        alignItems="center"
                        justifyContent="center"
                        _pressed={{
                            bg: "green.600"
                        }}
                        shadow={2}
                    >
                        <Icon as={MaterialIcons} name="add" color="white" size="md" />
                    </Button>
                </HStack>
            </Box>

            <ScrollView mt={4} bg="gray.800" borderRadius="md" p={4} shadow={3}>
                {items.length > 0 ? (
                    items.map((item) => (
                        <HStack key={item.id} mb={2} p={4} bg="gray.700" borderRadius="md" shadow={2} alignItems="center" justifyContent="space-between">
                            <Text color="white">{item.name}</Text>
                            <Button
                                onPress={() => handleRemoveItem(item.id)}
                                bg="red.500"
                                borderRadius="full"
                                p={2}
                                _pressed={{
                                    bg: "red.700"
                                }}
                                shadow={2}
                            >
                                <CloseIcon color="white" size='sm' />
                            </Button>
                        </HStack>
                    ))
                ) : (
                    <Text color="white">Nenhum item adicionado ainda.</Text>
                )}
            </ScrollView>

            <Box mt={8} w="100%">
                <Button
                    onPress={handleSaveList}
                    bg="blue.800"
                    w="100%"
                    borderRadius="md"
                    shadow={3}
                    _pressed={{
                        bg: "blue.900"
                    }}
                >
                    <Text color="white">Salvar Lista</Text>
                </Button>
            </Box>
        </VStack>
    );
}

