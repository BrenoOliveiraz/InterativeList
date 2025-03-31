import React from "react";
import { Avatar, Icon, Popover, VStack, Text, Pressable } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../services/FirebaseConfig";
import { HandleUser } from "../services/Api";


const AvatarWithDropdown = () => {
    const navigation = useNavigation();
    const userData = HandleUser();

    const handleLogout = async () => {
        try {
            await auth.signOut();
            console.log("Usuário deslogado");
            navigation.navigate("Login");
        } catch (error) {
            console.error("Erro ao deslogar:", error);
        }
    };

    return (
        <Popover trigger={(triggerProps) => (
            <Pressable {...triggerProps}>
                <Avatar
                    source={undefined} 
                    size="2xl"
                    bg="gray.500"
                    alignSelf="center"
                    borderWidth={2}
                    borderColor="green.500"
                >
                    {userData?.nome ? userData.nome.charAt(0).toUpperCase() : "U"}
                </Avatar>
            </Pressable>
        )}>
            <Popover.Content w="40">
                <Popover.Arrow />
                <Popover.Body>
                    <VStack space={2}>
                        <Pressable onPress={handleLogout} flexDirection="row" alignItems="center">
                            <Icon as={MaterialCommunityIcons} name="logout" size="sm" mr={2} />
                            <Text>Sair</Text>
                        </Pressable>
                    </VStack>
                </Popover.Body>
            </Popover.Content>
        </Popover>
    );
};

export default AvatarWithDropdown;
