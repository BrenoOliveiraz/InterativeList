import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CheckIcon } from 'native-base';

const STORAGE_KEY_PREFIX = 'checkboxState_';

const Checkbox = ({ id, onChange, isChecked }) => {
    const [selected, setSelected] = useState(isChecked || false);

    useEffect(() => {
        // Carregar o estado salvo quando o componente é montado
        const loadState = async () => {
            try {
                const storedValue = await AsyncStorage.getItem(`${STORAGE_KEY_PREFIX}${id}`);
                if (storedValue !== null) {
                    setSelected(JSON.parse(storedValue));
                }
            } catch (error) {
                console.error('Erro ao carregar o estado', error);
            }
        };

        loadState();
    }, [id]);

    const handlePress = async () => {
        const newState = !selected;
        setSelected(newState);
        
        // Salvar o novo estado no AsyncStorage
        try {
            await AsyncStorage.setItem(`${STORAGE_KEY_PREFIX}${id}`, JSON.stringify(newState));
            if (onChange) {
                onChange(id, newState);
            }
        } catch (error) {
            console.error('Erro ao salvar o estado', error);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.touchable} onPress={handlePress}>
                {selected && <CheckIcon size="5" mt="0.5" color="emerald.500" />}
            </TouchableOpacity>
        </View>
    );
};

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
        borderColor: 'grey',
        borderWidth: 1,
    },
});

export default Checkbox;
