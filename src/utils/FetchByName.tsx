// Services/ListService.js
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../Services/FirebaseConfig'; // Certifique-se de ajustar o caminho conforme necessário

export const fetchListsByName = async (name, setLists) => {
    const user = auth.currentUser; // Obtém o usuário autenticado
    if (!user) return;

    try {
        // Cria uma referência para a coleção de listas do usuário
        const userListsRef = collection(db, 'users', user.uid, 'lists');
        
        // Cria uma consulta para buscar listas com o nome específico
        const q = query(userListsRef, where('name', '==', name));
        const querySnapshot = await getDocs(q);

        // Processa os documentos e armazena no estado
        const fetchedLists = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLists(fetchedLists);
    } catch (error) {
        console.error('Erro ao buscar listas: ', error);
    }
};
