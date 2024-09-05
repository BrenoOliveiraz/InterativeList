import React, { useState } from 'react';
import { VStack, Box, Button, Text, ScrollView, HStack, Input, Icon } from 'native-base';
import { AddIcon, CloseIcon } from 'native-base';
import { auth, db } from '../../Services/FirebaseConfig'; // Importação do Firebase e Firestore
import Title from '../../components/header/Title';
import { collection, addDoc } from 'firebase/firestore';
import { MaterialIcons } from '@expo/vector-icons'; // Importa MaterialIcons

export default function AddList({ navigation }) {
    // Estados para armazenar o nome da lista e os itens
    const [listName, setListName] = useState('');
    const [itemName, setItemName] = useState('');
    const [items, setItems] = useState([]);

    // Função para adicionar um item à lista localmente
    const handleAddItem = () => {
        if (itemName.trim()) {
            const newItem = {
                id: Date.now().toString(), // Gera um ID único usando timestamp
                name: itemName
            };
            setItems([...items, newItem]);
            setItemName(''); // Limpa o campo após adicionar
        }
    };

    // Função para remover um item da lista localmente
    const handleRemoveItem = (id) => {
        setItems(items.filter(item => item.id !== id));
    };

    // Função para salvar a lista no Firestore
    const handleSaveList = async () => {
        const user = auth.currentUser; // Obtém o usuário autenticado
        if (!user) return; // Verifica se há um usuário autenticado

        try {
            // Cria uma referência para a coleção de listas do usuário
            const userListsRef = collection(db, 'users', user.uid, 'lists');

            // Adiciona um novo documento à coleção de listas com o nome e os itens
            await addDoc(userListsRef, {
                name: listName,
                items: items, // Salva os itens com a estrutura atualizada
                sharedWith: [user.uid] // Adiciona o UID do usuário à lista de compartilhamento
            });

            console.log('Lista salva com sucesso!');
            navigation.goBack(); // Retorna à tela principal após salvar
        } catch (error) {
            console.error('Erro ao salvar lista: ', error);
        }
    };

    return (
        <VStack flex={1} p={5} bg="gray.900">
            {/* Título da tela */}
            <Title color="white">Adicionar Nova Lista</Title>

            {/* Campo para o nome da lista */}
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
                <HStack alignItems="center">
                    <Input
                        flex={1} // Faz o campo de texto ocupar o máximo espaço disponível
                        placeholder="Insira o nome do item"
                        value={itemName}
                        onChangeText={setItemName}
                        bg="gray.700"
                        borderRadius="md"
                        color="white"
                        p={4}
                        borderColor="gray.600"
                        mr={2} // Margem direita para separar do botão
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
                        height={12} // Ajusta a altura do botão para alinhar com o Input
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
