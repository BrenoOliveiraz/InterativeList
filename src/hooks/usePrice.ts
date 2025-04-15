import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../services/FirebaseConfig';

const STORAGE_KEY_PREFIX = 'priceState_';

export const usePrice = (id: string, onChange?: (id: string, price: number) => void) => {
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
        const snapshot = await getDocs(collection(db, 'lists'));
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

  const updatePrice = async (newPrice: string) => {
    setPrice(newPrice);
    try {
      await AsyncStorage.setItem(`${STORAGE_KEY_PREFIX}${id}`, newPrice);
      if (onChange) onChange(id, parseFloat(newPrice));
      await updateFirestorePrice(newPrice);
    } catch (error) {
      console.error('Erro ao salvar o preço', error);
    }
  };

  const updateFirestorePrice = async (newPrice: string) => {
    try {
      const snapshot = await getDocs(collection(db, 'lists'));
      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        const itemIndex = data.items?.findIndex((item) => item.id === id);
        if (itemIndex !== -1) {
          const updatedItems = [...data.items];
          updatedItems[itemIndex].price = newPrice;
          const listRef = doc(db, 'lists', docSnap.id);
          await updateDoc(listRef, { items: updatedItems });
          break;
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar preço no Firestore:', error);
    }
  };

  return { price, placeholderPrice, updatePrice };
};
