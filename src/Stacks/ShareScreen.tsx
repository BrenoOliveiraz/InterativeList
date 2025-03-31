import React, { useState } from 'react';
import { VStack, Box, Button, Text, Input, Alert } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../services/FirebaseConfig';

export default function ShareListScreen({ route }) {
    const { listId } = route.params; 
    const [emailToShare, setEmailToShare] = useState('');
    const [error, setError] = useState('');
    const navigation = useNavigation();

    const handleShare = async () => {
        if (!emailToShare.trim()) {
            setError('O email não pode estar vazio.');
            return;
        }

        const user = auth.currentUser;
        if (!user) {
            setError('Usuário não autenticado.');
            return;
        }

        try {
         
            const listRef = doc(db,  'lists', listId);

            const listDoc = await getDoc(listRef);
            const listData = listDoc.data();

            if (listData) {
           
                if (!Array.isArray(listData.sharedWith)) {
                    listData.sharedWith = [];
                }

          
                const updatedSharedWith = [...listData.sharedWith, emailToShare.trim()];

                await updateDoc(listRef, { sharedWith: updatedSharedWith });

                console.log('Lista compartilhada com sucesso!');
                navigation.goBack();
            } else {
                setError('Lista não encontrada.');
            }
        } catch (error) {
            console.error('Erro ao compartilhar lista:', error);
            setError('Erro ao compartilhar a lista. Tente novamente mais tarde.');
        }
    };

    return (
        <VStack flex={1} p={5} bg="gray.900">
            <Box mb={4}>
                <Text color="white" fontSize="xl">Compartilhar Lista</Text>
            </Box>
            <Input
                placeholder="Digite o email para compartilhar"
                value={emailToShare}
                onChangeText={(text) => setEmailToShare(text)}
                bg="white"
                mb={4}
                borderRadius="md"
                p={3}
                w="90%"
                mx="auto"
            />
            <Button
                onPress={handleShare}
                bg="blue.500"
                borderRadius="md"
                w="90%"
                h={12}
                _text={{ color: 'white', fontSize: 'lg' }}
            >
                Compartilhar
            </Button>
            {error ? (
                <Alert mt={4} status="error">
                    <Alert.Icon />
                    <Text>{error}</Text>
                </Alert>
            ) : null}
        </VStack>
    );
}
