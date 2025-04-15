import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { usePrice } from '../hooks/usePrice';

const Price = ({ id, onChange }) => {
    
  const { price, placeholderPrice, updatePrice } = usePrice(id, onChange);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={price}
        onChangeText={updatePrice}
        placeholder={placeholderPrice ? `R$ ${placeholderPrice}` : 'Preço'}
        placeholderTextColor="#999"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  input: {
    height: 44,
    width: 65,
    backgroundColor: '#F5F5F5',
    borderColor: '#D1D1D1',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default Price;
