import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { auth, db } from './FirebaseConfig';


// Função para buscar listas do Firestore
export async function fetchLists(setUserLists: React.Dispatch<React.SetStateAction<any[]>>) {
    const user = auth.currentUser; // Obtém o usuário autenticado
    if (!user) return; // Verifica se há um usuário autenticado

    // Referência à coleção de listas do usuário
    const userListsRef = collection(db, 'users', user.uid, 'lists');

    // Query para obter listas onde o usuário é o criador ou está incluído no campo "sharedWith"
    const q = query(userListsRef, where('sharedWith', 'array-contains', user.uid));

    // Listener em tempo real para sincronizar as listas com o Firestore
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const lists = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUserLists(lists); // Atualiza o estado com as listas recuperadas
    });

    // Limpeza do listener ao desmontar o componente
    return unsubscribe;
}
