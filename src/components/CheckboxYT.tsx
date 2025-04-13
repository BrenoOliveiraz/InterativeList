import { View, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { handleCheckboxChange } from '../services/Api';


export default function CheckboxYT({ id, selected, setItems }) {
  const toggle = () => {
    handleCheckboxChange(id, !selected, setItems);
    
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.touchable, { backgroundColor: selected ? '#3ebd93' : '#ccc' }]}
        onPress={toggle}
      >
        {selected && (
          <Icon name="check" color="#FFF" size={16} />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  touchable: {
    height: 20,
    width: 20,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc',
  },
});
