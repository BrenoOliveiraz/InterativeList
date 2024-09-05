// components/AvatarWithDropdown.js
import React from 'react';
import { Avatar, Menu, MenuTrigger, MenuOptions, MenuOption, Icon } from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { auth } from '../../Services/FirebaseConfig'; // Ajuste o caminho conforme sua estrutura de projeto
import { useNavigation } from '@react-navigation/native';

const AvatarWithDropdown = ({ userName, userPhotoUrl }) => {
    const navigation = useNavigation();

    // Função para lidar com o logout
    const handleLogout = async () => {
        try {
            await auth.signOut();
            console.log('Usuário deslogado');
            navigation.navigate('Login'); // Navegue para a tela de login ou onde for apropriado
        } catch (error) {
            console.error('Erro ao deslogar:', error);
        }
    };

    return (
        <Menu>
            <MenuTrigger>
                <Avatar
                    source={{ uri: userPhotoUrl }}
                    size="md"
                    bg="gray.500"
                    alignSelf="center"
                    borderWidth={2}
                    borderColor="green.500"
                >
                    {userPhotoUrl ? null : userName[0]}
                </Avatar>
            </MenuTrigger>
            <MenuOptions>
                <MenuOption onSelect={handleLogout}>
                    <Icon as={<MaterialCommunityIcons name="logout" />} size="sm" mr={2} />
                    Sair
                </MenuOption>
            </MenuOptions>
        </Menu>
    );
};

export default AvatarWithDropdown;
