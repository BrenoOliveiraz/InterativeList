import React, { useState } from 'react';
import { 
  VStack, Box, Button, Text, Input, IconButton, 
  HStack, ArrowBackIcon, useToast, Icon 
} from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../services/FirebaseConfig';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ShareListScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const toast = useToast();
    
    // Pegamos o ID da lista que veio da MyListsScreen
    const { listId } = route.params as { listId: string }; 
    
    const [emailToShare, setEmailToShare] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleShare = async () => {
        const emailFormatado = emailToShare.trim().toLowerCase();

        // Validações
        if (!emailFormatado) {
            setError('O e-mail não pode estar vazio.');
            return;
        }
        if (!emailFormatado.includes('@')) {
            setError('Digite um e-mail válido.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const listRef = doc(db, 'lists', listId);

            // arrayUnion adiciona ao array no Firebase sem duplicar
            await updateDoc(listRef, {
                sharedWith: arrayUnion(emailFormatado)
            });

            toast.show({
                description: "Lista compartilhada com sucesso!",
                placement: "top",
                bg: "green.600"
            });

            navigation.goBack();
        } catch (err: any) {
            console.error('Erro ao compartilhar:', err);
            setError('Não foi possível compartilhar a lista.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <VStack flex={1} p={5} bg="gray.900" pt={12}>
            {/* Cabeçalho */}
            <HStack alignItems="center" mb={8}>
                <IconButton 
                    variant="ghost"
                    icon={<ArrowBackIcon size="md" color="white" />} 
                    onPress={() => navigation.goBack()}
                />
                <Text color="white" fontSize="2xl" fontWeight="bold" ml={2}>
                    Compartilhar
                </Text>
            </HStack>

            {/* Card de Input */}
            <Box bg="gray.800" p={6} borderRadius="2xl" shadow={5}>
                <VStack space={4}>
                    <Icon 
                        as={MaterialCommunityIcons} 
                        name="account-plus" 
                        size="xl" 
                        color="cyan.400" 
                        alignSelf="center"
                        mb={2}
                    />
                    
                    <Text color="gray.300" textAlign="center" fontSize="md">
                        Digite o e-mail da pessoa que terá acesso a esta lista.
                    </Text>

                    <Input
                        placeholder="exemplo@email.com"
                        value={emailToShare}
                        onChangeText={(text) => {
                            setEmailToShare(text);
                            setError('');
                        }}
                        bg="gray.700"
                        color="white"
                        py={3}
                        px={4}
                        fontSize="md"
                        borderRadius="xl"
                        borderWidth={1}
                        borderColor={error ? "red.500" : "transparent"}
                        _focus={{ borderColor: "cyan.400", bg: "gray.700" }}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    {error ? (
                        <Text color="red.400" fontSize="xs" textAlign="center">
                            {error}
                        </Text>
                    ) : null}

                    <Button
                        mt={4}
                        onPress={handleShare}
                        bg="cyan.500"
                        isLoading={loading}
                        _pressed={{ bg: 'cyan.600' }}
                        borderRadius="xl"
                        h={12}
                        _text={{ fontWeight: 'bold', fontSize: 'md' }}
                    >
                        COMPARTILHAR AGORA
                    </Button>
                </VStack>
            </Box>
            
            <Text color="gray.500" fontSize="xs" textAlign="center" mt={6} px={10}>
                A pessoa convidada poderá ver, adicionar e marcar itens como comprados.
            </Text>
        </VStack>
    );
}