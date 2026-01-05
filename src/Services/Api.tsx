import { auth, db } from "./FirebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, collection, onSnapshot, updateDoc, deleteDoc, query, where, getDocs, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";


///////////////////LÓGIA DE REGISTRO FIRESTORE/////////////////////////////
export async function handleRegistration(formData: { nome: string; email: string; senha: string }, navigation: any) {
    try {

        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.senha);
        const user = userCredential.user;
        console.log("Usuário criado:", user.uid);


        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            nome: formData.nome,
            email: formData.email,
        });

        console.log("Dados do usuário salvos no Firestore!");


        navigation.navigate("Main");
    } catch (error) {
        console.error("Erro ao criar usuário: ", error);
    }
}
////////////////////////////////////////////////////////////////////////////



////////////////////LÓGICA DAS LISTAS NO FIRESTORE/////////////////////////////////////////
export async function handleSaveList(listName: string, items: any[], navigation: any) {
    if (!listName.trim()) return;

    const user = auth.currentUser;
    if (!user || !user.email) return;

    try {
        const userListsRef = collection(db, "lists");
        const newListRef = doc(userListsRef);

        await setDoc(newListRef, {
            id: newListRef.id,
            name: listName,
            items: items,
            saldo: 0,
            // O dono deve estar na lista para ela aparecer na busca por e-mail
            sharedWith: [user.email.toLowerCase()], 
            ownerId: user.uid,
            createdAt: new Date()
        });

        console.log("Lista criada com sucesso!");
        navigation.goBack();
    } catch (error) {
        console.error("Erro ao salvar lista: ", error);
    }
}

// BUSCAR LISTAS (Garante que busca listas onde o usuário é dono ou convidado)
export function fetchUserLists(setUserLists: (lists: any[]) => void) {
    const user = auth.currentUser;
    if (!user) return;

    const userListsRef = collection(db, "lists");
    
    // MUDANÇA AQUI: Filtra apenas onde você é o dono (ownerId)
    const q = query(userListsRef, where("ownerId", "==", user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const lists = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Opcional: ordenar localmente se desejar
        setUserLists(lists);
    });

    return unsubscribe;
}

// REMOVER LISTA
export async function handleRemoveList(itemId: string) {
    try {
        const listRef = doc(db, 'lists', itemId);
        await deleteDoc(listRef);
    } catch (error) {
        console.error('Erro ao remover:', error);
    }
}

// ORDEM DAS LISTAS (Mantive sua lógica de atualização)
export async function handleUpdateListOrder(data: any[]) {
    try {
        for (const list of data) {
            const listRef = doc(db, 'lists', list.id);
            await updateDoc(listRef, {
                items: list.items,
                name: list.name
            });
        }
    } catch (error) {
        console.error('Erro ao atualizar ordem:', error);
    }
}
////////////////////////////////////////////////////////////////////////////////////////////





/////////////////LÓGICA DOS ITENS DAS LISTAS NO FIRESTORE///////////////////////

export const fetchItems = async (listName, setItems, setLoading, setError) => {
    setLoading(true);
    setError(null);

    try {
        const userListsRef = collection(db, 'lists');
        const q = query(userListsRef, where('name', '==', listName));
        const querySnapshot = await getDocs(q);
        const fetchedLists = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const itemsWithIndex = fetchedLists[0]?.items.map((item, index) => ({
            ...item,
            originalIndex: index
        })) || [];

        setItems([{ ...fetchedLists[0], items: itemsWithIndex }]);
    } catch (error) {
        console.error('Erro ao buscar listas: ', error);
        setError('Erro ao buscar itens. Tente novamente mais tarde.');
    } finally {
        setLoading(false);
    }
};

export const updateItemOrder = async (items, setItems) => {
    setItems(prevItems => {
        const updatedItems = [...prevItems];
        updatedItems[0].items = items;

        if (updatedItems[0]?.id) {
            const listRef = doc(db, 'lists', updatedItems[0].id);
            updateDoc(listRef, { items })
                .catch(error => console.error('Erro ao atualizar ordem no Firestore:', error));
        }

        return updatedItems;
    });
};



export const handleCheckboxChange = async (itemId, isSelected, setItems) => {
    try {

        const listsRef = collection(db, 'lists');
        const snapshot = await getDocs(listsRef);

        for (const docSnap of snapshot.docs) {
            const listData = docSnap.data();
            const itemIndex = listData.items.findIndex((item) => item.id === itemId);

            if (itemIndex !== -1) {

                const updatedItems = [...listData.items];
                updatedItems[itemIndex].selected = isSelected;

                await updateDoc(doc(db, 'lists', docSnap.id), {
                    items: updatedItems
                });


                setItems((prevItems) => {
                    const updated = [...prevItems];
                    updated[0].items = updatedItems;
                    return updated;
                });


                break;
            }
        }
    } catch (error) {
        console.error('Erro ao atualizar item no Firestore:', error);
    }
};






///////////////////////////////////////////////////////////////////////////////////////////

//////////////LÓGICA DO PERFIL//////////////
export const HandleUser = () => {
    const [userData, setUserData] = useState<{ nome: string; email: string; uid: string } | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth.currentUser;
            if (!user) return;

            try {
                const userRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    setUserData(userSnap.data() as { nome: string; email: string; uid: string });
                } else {
                    console.log("Usuário não encontrado no Firestore");
                }
            } catch (error) {
                console.error("Erro ao buscar dados do usuário:", error);
            }
        };

        fetchUserData();
    }, []);

    return userData;
};
