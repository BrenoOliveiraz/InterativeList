import { useState, useEffect } from 'react';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/FirebaseConfig';

export default function useSaldo(listId: string) {
  const [rawSaldo, setRawSaldo] = useState<string>('0'); 
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Segurança: Se não houver ID, não tenta buscar nada
    if (!listId) {
      setLoading(false);
      return;
    }

    const docRef = doc(db, 'lists', listId);
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const saldoDaLista = docSnap.data().saldo ?? 0;
        setRawSaldo(Math.round(saldoDaLista * 100).toString());
      }
      setLoading(false);
    }, (err) => {
      console.error("Erro ao carregar saldo:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [listId]);

  const handleSaldoChange = async (text: string) => {
    if (!listId) return; // Segurança contra o erro de 'undefined'

    const cleaned = text.replace(/\D/g, '');
    const finalValue = cleaned === '' ? '0' : cleaned;
    setRawSaldo(finalValue);
    
    const valueInReais = parseInt(finalValue) / 100;

    try {
      const listRef = doc(db, 'lists', listId);
      await updateDoc(listRef, { saldo: valueInReais });
    } catch (err) {
      console.error("Erro ao salvar saldo:", err);
    }
  };

  const formatToBRL = (valueInCents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valueInCents / 100);
  };

  return { rawSaldo, loading, handleSaldoChange, formatToBRL };
}