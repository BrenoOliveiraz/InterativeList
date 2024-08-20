import React from 'react';
import { VStack, Box, Button, Text, ScrollView } from 'native-base';
import Title from '../../components/header/Title';

export default function MainScreen({ navigation }) {
    const handleAddList = () => {
        // Navegar para a tela de adição de nova lista
        navigation.navigate('AddList');
    };

    return (
        <VStack flex={1} p={5} bg="gray.900">
            <Title color="white">Minhas Listas</Title>

            <ScrollView flex={1} mt={4} bg="gray.800" borderRadius="lg" p={4}>
                {/* Espaço reservado para as Listas salvas */}
                <Text color="white">Nenhuma lista salva ainda.</Text>
            </ScrollView>

            <Box mt={8} w="100%">
                <Button onPress={handleAddList} bg="green.500" w="100%" borderRadius="lg">
                    <Text style={{ color: 'white' }}>Adicionar Nova Lista</Text>
                </Button>
            </Box>
        </VStack>
    );
}
