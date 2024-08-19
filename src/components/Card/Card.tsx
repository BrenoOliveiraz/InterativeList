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


export const HEIGHT = 68
export const MARGIN_BOTTON = 12
export const CARD_HEIGHT = HEIGHT + MARGIN_BOTTON 

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    height: 60,
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
   
    
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
});
