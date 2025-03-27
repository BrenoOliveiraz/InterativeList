import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { db, auth } from '../Services/FirebaseConfig'; 
import { doc, getDoc } from 'firebase/firestore';
import { Center, Text, Spinner } from 'native-base';

const InitialScreen = ({ navigation }:any) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
      
            navigation.navigate('MainScreen');
          } else {
      
            navigation.navigate('Login');
          }
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
          Alert.alert('Erro ao buscar dados do usuário.');
          navigation.navigate('Login'); 
        }
      } else {
  
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
    ); 
  }

  return null; 
};

export default InitialScreen;
