import { Box, Button, Link, View, VStack, Text } from 'native-base'
import React, { useState } from 'react'
import { TouchableOpacity } from 'react-native'
import Title from '../../components/header/Title';
import TextField from '../../components/TextField/TextField';
import { auth, db } from '../../Services/FirebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';

type LoginProps = {
    navigation: {
      navigate: (screen: string) => void;
    };
};

export default function Login({ navigation }: LoginProps) {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    function NavigateToForm() {
        navigation.navigate("FormRegister");
    }

    const handleLogin = async () => {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          console.log('Usuário logado:', user.uid);
    
          // Verificar se o usuário tem numTables definido no Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            navigation.navigate("Main")
          } else {
            navigation.navigate('ChooseTablesScreen');
          }
        } catch (error) {
          const errorMessage = error.message;
          console.error('Erro ao fazer login:', errorMessage);
        }
      };

    return (
        <VStack alignItems="center" flex={1} p={5} justifyContent='center' bg="gray.900">
         
          <Title color="white">
            Faça Login em sua conta.
          </Title>
    
          <Box>
            <TextField
              labelText="Email"
              placeHolderText="Insira seu endereço de E-mail"
              value={email}
              onChangeText={(val) => { setEmail(val) }}
              inputProps={{ color: 'white', bg: 'gray.800' }}
            />
            <TextField
              labelText="Senha"
              placeHolderText="Insira sua Senha"
              secureTextEntry
              value={password}
              onChangeText={(val) => { setPassword(val) }}
              inputProps={{ color: 'white', bg: 'gray.800' }}
            />
          </Box>
    
          <Button onPress={handleLogin} w="100%" bg="green.500" mt={10} borderRadius="lg">
            Entrar
          </Button>
          <Link href="#" mt={2} _text={{ color: "white" }}>
            Esqueceu sua senha?
          </Link>
          <Box w="100%" flexDirection="row" justifyContent="center" mt={8}>
            <Text color="white">Ainda não tem cadastro? </Text>
            <TouchableOpacity onPress={NavigateToForm}>
              <Text color="green.500">Faça seu Cadastro.</Text>
            </TouchableOpacity>
          </Box>
        </VStack>
    );
}
