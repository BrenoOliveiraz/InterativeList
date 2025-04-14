import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/FirebaseConfig';

const STORAGE_KEY_PREFIX = 'priceState_';

const Price = ({ id, onChange }) => {
    const [price, setPrice] = useState('');
    const [placeholderPrice, setPlaceholderPrice] = useState('');

    useEffect(() => {
        const loadPrice = async () => {
            try {
                const storedPrice = await AsyncStorage.getItem(`${STORAGE_KEY_PREFIX}${id}`);
                if (storedPrice !== null) {
                    setPrice(storedPrice);
                } else {
                    await fetchPriceFromFirestore();
                }
            } catch (error) {
                console.error('Erro ao carregar o preço:', error);
            }
        };

        const fetchPriceFromFirestore = async () => {
            try {
                const listsRef = collection(db, 'lists');
                const snapshot = await getDocs(listsRef);

                for (const docSnap of snapshot.docs) {
                    const data = docSnap.data();
                    const item = data.items?.find((item) => item.id === id);
                    if (item?.price) {
                        setPlaceholderPrice(item.price);
                        break;
                    }
                }
            } catch (error) {
                console.error('Erro ao buscar preço no Firestore:', error);
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
