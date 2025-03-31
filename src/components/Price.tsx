import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY_PREFIX = 'priceState_';

const Price = ({ id, onChange, initialPrice = "" }) => {
    const [price, setPrice] = useState(initialPrice);

    useEffect(() => {
       
        const loadPrice = async () => {
            try {
                const storedPrice = await AsyncStorage.getItem(`${STORAGE_KEY_PREFIX}${id}`);
                if (storedPrice !== null) {
                    setPrice(storedPrice);
                }
            } catch (error) {
                console.error('Erro ao carregar o preço', error);
            }
        };
        loadPrice();
    }, [id]);

    const handlePriceChange = async (newPrice) => {
        setPrice(newPrice);
        try {
            await AsyncStorage.setItem(`${STORAGE_KEY_PREFIX}${id}`, newPrice);
            if (onChange) {
                onChange(id, newPrice);
            }
        } catch (error) {
            console.error('Erro ao salvar o preço', error);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={price}
                onChangeText={handlePriceChange}
                placeholder="Preço"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        height: 40,
        width: 80,
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 4,
        textAlign: 'center',
    },
});

export default Price;
