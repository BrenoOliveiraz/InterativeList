import { useState, useEffect } from 'react';
import { getDoc, updateDoc, doc } from 'firebase/firestore';
import { auth, db } from '../services/FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'user_balance';

export default function useSaldo() {
  const [saldo, setSaldo] = useState<number | null>(null);
  const [rawSaldo, setRawSaldo] = useState<string>(''); // valor em centavos como string
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSaldo = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const saldoFromDb = userDoc.data().saldo || 0;
            setSaldo(saldoFromDb);
            setRawSaldo((saldoFromDb * 100).toString());
          }
        }

        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored !== null) {
          setRawSaldo(stored);
        }
      } catch (err) {
        setError("Erro ao buscar saldo");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSaldo();
  }, []);

  const handleSaldoChange = async (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    setRawSaldo(cleaned);
    const valueInCents = parseInt(cleaned) || 0;
    const valueInReais = valueInCents / 100;

    try {
      await AsyncStorage.setItem(STORAGE_KEY, cleaned);
      const user = auth.currentUser;
      if (user) {
        await updateDoc(doc(db, 'users', user.uid), { saldo: valueInReais });
        setSaldo(valueInReais);
      }
    } catch (err) {
      setError("Erro ao salvar saldo");
      console.error(err);
    }
  };

  const formatToBRL = (valueInCents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valueInCents / 100);
  };

  return {
    saldo,
    rawSaldo,
    loading,
    error,
    handleSaldoChange,
    formatToBRL
  };
}
