import React from "react";
import { Box, Text, VStack, Button } from "native-base";
import { HandleUser } from "../services/Api";
import AvatarWithDropdown from "../components/Avatar";


const ProfileScreen = () => {
    const userData = HandleUser();

    return (
        <Box flex={1} bg="gray.900" alignItems="center" justifyContent="center" p={5}>
            <AvatarWithDropdown />
            <Text fontSize="xl" color="white" bold>
                {userData?.nome || "Nome do Usuário"}
            </Text>
            <Text fontSize="md" color="gray.400" mb={6}>
                {userData?.email || "usuario@email.com"}
            </Text>

            <VStack space={4} width="100%" maxW="300px">
                <Button colorScheme="emerald" onPress={() => console.log("Editar Perfil")}>
                    Editar Perfil
                </Button>
                <Button colorScheme="emerald" onPress={() => console.log("Alterar Senha")}>
                    Alterar Senha
                </Button>
                <Button colorScheme="red" onPress={() => console.log("Sair")}>
                    Sair da Conta
                </Button>
            </VStack>
        </Box>
    );
};

export default ProfileScreen;
