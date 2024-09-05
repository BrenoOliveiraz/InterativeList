import React, { useState } from 'react';
import { ScrollView, Box, Button } from 'native-base';
import {sessions} from '../../utils/textInputs'
import {  setDoc, doc } from "firebase/firestore";
import { Text } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../Services/FirebaseConfig'
import Title from '../../components/header/Title';
import TextField from '../../components/TextField/TextField';

type LoginProps = {
    navigation: {
        navigate: (screen: string) => void;
    };
};

export default function FormRegister({ navigation }: LoginProps) {
    const [numSession, setNumSession] = useState(0);
    const [formData, setFormData] = useState({
        nome: '',
        senha: '',
        email: '',

    });

    function handleSection() {
        if (numSession < sessions.length - 1) {
            setNumSession(numSession + 1);
        } else {
            handleRegistration();
        }
    }

    function handleSectionBack() {
        if (numSession > 0) {
            setNumSession(numSession - 1);
        }
    }

    async function handleRegistration() {
        try {
            // Criar o usuário no sistema de autenticação do Firebase
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.senha);
            const user = userCredential.user;
            console.log('Usuário criado:', user.uid);

            // Salvar os dados do usuário no Firestore usando o uid como ID do documento
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                nome: formData.nome,
                email: formData.email,
  
            });

            console.log('Dados do usuário salvos no Firestore!');
            
            // Navegar para a próxima tela após o registro
            navigation.navigate("Main");
        } catch (error) {
            console.error('Erro ao criar usuário: ', error);
        }
    }

    function handleChange(text, label) {
        setFormData({ ...formData, [label.toLowerCase()]: text });
    }

    return (
        <ScrollView flex={1} p={5} bg="gray.900">
            <Title color="white">
                {sessions[numSession].title}
            </Title>

            <Box>
                {sessions[numSession].textInput.map(input => (
                    <TextField
                        key={input.id}
                        placeHolderText={input.placeHolder}
                        labelText={input.label}
                        secureTextEntry={input.secureTextEntry}
                        onChangeText={(text) => handleChange(text, input.label)}
                        inputProps={{ color: 'white', bg: 'gray.800' }}
                    />
                ))}
            </Box>

            {numSession > 0 && (
                <Button onPress={handleSectionBack} bg="gray.500" w="100%" mt={10} borderRadius="lg">
                    <Text style={{ color: 'white' }}>Voltar</Text>
                </Button>
            )}
            <Button onPress={handleSection} w="100%" bg="green.500" mt={4} borderRadius="lg">
                <Text style={{ color: 'white' }}>{numSession < sessions.length - 1 ? 'Avançar' : 'Salvar'}</Text>
            </Button>
        </ScrollView>
    );
}

