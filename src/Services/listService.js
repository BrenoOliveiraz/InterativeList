import { collection, doc, onSnapshot, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from './FirebaseConfig';

// Função para buscar listas do Firestore
export const fetchLists = (setUserLists) => {
    const user = auth.currentUser;
    if (!user) return;

    const userListsRef = collection(db, 'users', user.uid, 'lists');

    const unsubscribe = onSnapshot(userListsRef, (snapshot) => {
        const lists = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUserLists(lists);
    });

    return unsubscribe;
};

// Função para atualizar a ordem das listas no Firestore
export const updateListOrder = async (data) => {
    const user = auth.currentUser;
    if (!user || data.length === 0) return;

    const listId = data[0]?.id;
    if (!listId) return;

    const listRef = doc(db, 'users', user.uid, 'lists', listId);
    try {
        await updateDoc(listRef, { items: data.map(item => item.name) });
        console.log('Ordem atualizada no Firestore');
    } catch (error) {
        console.error('Erro ao atualizar a ordem no Firestore:', error);
    }
};

// Função para remover uma lista do Firestore
export const removeList = async (itemId) => {
    const user = auth.currentUser;
    if (!user) return;

    const listRef = doc(db, 'users', user.uid, 'lists', itemId);
    try {
        await deleteDoc(listRef);
        console.log('Lista removida do Firestore');
    } catch (error) {
        console.error('Erro ao remover a lista do Firestore:', error);
    }
};
