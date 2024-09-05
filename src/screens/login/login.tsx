// src/screens/login/login.js
import React, { useState, useContext } from 'react';
import { Box, Button, Link, VStack, Text } from 'native-base';
import { TouchableOpacity } from 'react-native';
import Title from '../../components/header/Title';
import TextField from '../../components/TextField/TextField';
import AuthContext from '../../Contexts/AuthContext';


export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      await login(email, password);
      navigation.navigate('Main');
    } catch (error) {
      console.error('Erro ao fazer login:', error.message);
    }
  };

  return (
    <VStack alignItems="center" flex={1} p={5} justifyContent='center' bg="gray.900">
      <Title color="white">Faça Login em sua conta.</Title>
      <Box>
        <TextField
          labelText="Email"
          placeHolderText="Insira seu endereço de E-mail"
          value={email}
          onChangeText={(val) => setEmail(val)}
          inputProps={{ color: 'white', bg: 'gray.800' }}
        />
        <TextField
          labelText="Senha"
          placeHolderText="Insira sua Senha"
          secureTextEntry
          value={password}
          onChangeText={(val) => setPassword(val)}
          inputProps={{ color: 'white', bg: 'gray.800' }}
        />
      </Box>
      <Button onPress={handleLogin} w="100%" bg="green.500" mt={10} borderRadius="lg">
        Entrar
      </Button>
      <Link href="#" mt={2} _text={{ color: "white" }}>Esqueceu sua senha?</Link>
      <Box w="100%" flexDirection="row" justifyContent="center" mt={8}>
        <Text color="white">Ainda não tem cadastro? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("FormRegister")}>
          <Text color="green.500">Faça seu Cadastro.</Text>
        </TouchableOpacity>
      </Box>
    </VStack>
  );
}
