import React, { useState } from 'react';
import { VStack, Box, Button, Text, Input } from 'native-base';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../Services/FirebaseConfig';
import Title from '../../components/header/Title';

export default function ShareListScreen({ route, navigation }) {
    const { listId } = route.params;
    const [emailToShare, setEmailToShare] = useState('');
    const [error, setError] = useState('');

    const handleShare = async () => {
        if (!emailToShare.trim()) {
            setError('O email não pode estar vazio.');
            return;
        }

        const user = auth.currentUser;
        if (!user) return;

        try {
            // Obter a lista que será compartilhada
            const listRef = doc(db, 'users', user.uid, 'lists', listId);
            const listDoc = await listRef.get();
            const listData = listDoc.data();

            if (listData) {
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
            <Title color="white">Compartilhar Lista</Title>

            {error ? (
                <Box bg="red.500" p={3} borderRadius="md" mb={4}>
                    <Text color="white">{error}</Text>
                </Box>
            ) : null}

            <Box mt={4}>
                <Input
                    placeholder="Insira o email para compartilhar"
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

            <Box mt={8} w="100%">
                <Button
                    onPress={handleShare}
                    bg="blue.800"
                    w="100%"
                    borderRadius="md"
                    shadow={3}
                    _pressed={{
                        bg: "blue.900"
                    }}
                >
                    <Text color="white">Compartilhar</Text>
                </Button>
            </Box>
        </VStack>
    );
}
