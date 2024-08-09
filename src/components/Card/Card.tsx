import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';

export type CardProps = {
  id: number;
  title: string;
};

type Props = {
  data: CardProps;
};

export default function Card({ data }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{data.title}</Text>
      <MaterialIcons name='drag-indicator' size={32} color='black' />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    height: 75,
    padding: 20 ,
    
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: '100%', // Garante que o card ocupe 100% da largura disponível
    flexDirection: 'row', // Alinha os itens em uma linha
    justifyContent: 'space-between', // Distribui espaço entre o texto e o ícone
    alignItems: 'center', // Alinha os itens verticalmente no centro
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1, // Faz o texto ocupar o máximo de espaço disponível
    

  },
});
