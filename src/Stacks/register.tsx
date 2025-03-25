import React, { useState } from 'react';
import { ScrollView, Box, Button, Text } from 'native-base';
import {sessions} from '../utils/textInputs'
import Title from '../components/header/Title';
import TextField from '../components/TextField/TextField';
import { handleRegistration } from '../Services/Api';


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
            handleRegistration(formData, navigation);
        }
    }

    function handleSectionBack() {
        if (numSession > 0) {
            setNumSession(numSession - 1);
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

