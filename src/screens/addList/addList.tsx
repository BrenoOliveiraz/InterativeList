import React, { useState } from 'react';
import { VStack, Box, Button, Text, ScrollView } from 'native-base';
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../../Services/FirebaseConfig'; // Importação do Firebase e Firestore
import Title from '../../components/header/Title';
import TextField from '../../components/TextField/TextField';

export default function AddList({ navigation }) {
    // Estados para armazenar o nome da lista e os itens
    const [listName, setListName] = useState('');
    const [itemName, setItemName] = useState('');
    const [items, setItems] = useState([]);

    // Função para adicionar um item à lista localmente
    const handleAddItem = () => {
        if (itemName.trim()) {
            setItems([...items, itemName]);
            setItemName(''); // Limpa o campo após adicionar
        }
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
                items: items,
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
                <TextField
                    labelText="Nome da Lista"
                    placeHolderText="Insira o nome da lista"
                    value={listName}
                    onChangeText={setListName}
                />
            </Box>

            <Box mt={4}>
                <TextField
                    labelText="Adicionar Item"
                    placeHolderText="Insira o nome do item"
                    value={itemName}
                    onChangeText={setItemName}
                />
                <Button onPress={handleAddItem} bg="green.500" mt={2} borderRadius="lg">
                    <Text style={{ color: 'white' }}>Adicionar Item</Text>
                </Button>
            </Box>

     
            <ScrollView mt={4} bg="gray.800" borderRadius="lg" p={4}>
                {items.length > 0 ? (
                    items.map((item, index) => (
                        <Box key={index} mb={2} p={2} bg="gray.700" borderRadius="lg">
                            <Text color="white">{item}</Text>
                        </Box>
                    ))
                ) : (
                    <Text color="white">Nenhum item adicionado ainda.</Text>
                )}
            </ScrollView>

   
            <Box mt={8} w="100%">
                <Button onPress={handleSaveList} bg="blue.800" w="100%" borderRadius="lg">
                    <Text style={{ color: 'white' }}>Salvar Lista</Text>
                </Button>
            </Box>
        </VStack>
    );
}
