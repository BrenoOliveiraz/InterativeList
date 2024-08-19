import { Box, Button, Image, Link, View, VStack, Text } from 'native-base'
import React, { useState } from 'react'
import { TouchableOpacity } from 'react-native'
import Title from '../../components/header/Title';
import TextField from '../../components/TextField/TextField';


type LoginProps = {
    navigation: {
      navigate: (screen: string) => void;
    };
  };



export default function Login({navigation}: LoginProps) {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    function NavigateToForm() {
        navigation.navigate("Register");
      }


    function handleLogin() {
        
    }


    return (
        <VStack alignItems="center" flex={1} p={5} justifyContent='center' bg='white'>
          <Image  />
          <Title>
            Faça Login em sua conta.
          </Title>
    
          <Box>
            <TextField
              labelText="Email"
              placeHolderText="Insira seu endereço de E-mail"
              value={email}
              onChangeText={(val) => { setEmail(val) }}
            />
            <TextField
              labelText="Senha"
              placeHolderText="Insira sua Senha"
              secureTextEntry
              value={password}
              onChangeText={(val) => { setPassword(val) }}
            />
          </Box>
    
          <Button onPress={handleLogin} w="100%" bg="blue.800" mt={10} borderRadius="lg">
            Entrar
          </Button>
          <Link href="#" mt={2}>
            Esqueceu sua senha?
          </Link>
          <Box w="100%" flexDirection="row" justifyContent="center" mt={8}>
            <Text>Ainda não tem cadastro? </Text>
            <TouchableOpacity onPress={NavigateToForm}><Text color="blue.500">Faça seu Cadastro.</Text></TouchableOpacity>
          </Box>
        </VStack>
      );
}
