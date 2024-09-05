import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { db, auth } from '../../Services/FirebaseConfig'; // Certifique-se de que o caminho está correto
import { doc, getDoc } from 'firebase/firestore';
import { Center, Text, Spinner } from 'native-base';

const InitialScreen = ({ navigation }:any) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          // Busca o documento do usuário no Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            // Se o documento existir, navega para a tela principal
            navigation.navigate('MainScreen');
          } else {
            // Se o documento não existir, navega para a tela de escolha de tabelas ou algo semelhante
            navigation.navigate('Login');
          }
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
          Alert.alert('Erro ao buscar dados do usuário.');
          navigation.navigate('Login'); // Navega para a tela de login em caso de erro
        }
      } else {
        // Se o usuário não estiver autenticado, navega para a tela de login
        navigation.navigate('Login');
      }
      setIsLoading(false);
    };

    fetchUser();
  }, [navigation]);

  if (isLoading) {
    return (
      <Center flex={1} bg="gray.900">
        <Spinner color="blue.500" />
      </Center>
    ); // Exibe um indicador de carregamento enquanto a verificação está em andamento
  }

  return null; // O componente inicial não precisa renderizar nada após o carregamento
};

export default InitialScreen;
