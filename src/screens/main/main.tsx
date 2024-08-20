import React, { useState, useEffect } from 'react';
import { VStack, Box, Button, Text, ScrollView } from 'native-base';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../../Services/FirebaseConfig'; 
import Title from '../../components/header/Title';
import { fetchLists } from '../../Services/ListService';

export default function MainScreen({ navigation }) {
    const [userLists, setUserLists] = useState([]);

    useEffect(() => {
        const unsubscribe = fetchLists(setUserLists); // Chama a função para buscar as listas ao montar o componente

        // Limpeza do listener ao desmontar o componente
        return () => unsubscribe();
    }, []);

    const handleAddList = () => {
        // Navegar para a tela de adição de nova lista
        navigation.navigate('AddList');
    };

    return (
        <VStack flex={1} p={5} bg="gray.900">
            {/* Título da tela */}
            <Title color="white">Minhas Listas</Title>

            {/* Área de ScrollView para listar as listas do usuário */}
            <ScrollView flex={1} mt={4} bg="gray.800" borderRadius="lg" p={4}>
                {/* Condicional para exibir as listas do usuário ou uma mensagem se não houver listas */}
                {userLists.length > 0 ? (
                    userLists.map((list) => (
                        <Box key={list.id} mb={4} p={4} bg="gray.700" borderRadius="lg">
                            <Text color="white">{list.name}</Text>
                        </Box>
                    ))
                ) : (
                    <Text color="white">Nenhuma lista salva ainda.</Text>
                )}
            </ScrollView>

            {/* Botão para adicionar uma nova lista */}
            <Box mt={8} w="100%">
                <Button onPress={handleAddList} bg="green.500" w="100%" borderRadius="lg">
                    <Text style={{ color: 'white' }}>Adicionar Nova Lista</Text>
                </Button>
            </Box>
        </VStack>
    );
}
