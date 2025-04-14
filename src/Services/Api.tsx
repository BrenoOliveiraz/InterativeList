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
export async function handleSaveList(listName: string, items: any[], emailToShare: string | null, navigation: any) {
    if (!listName.trim()) {
        console.error("O nome da lista não pode estar vazio.");
        return;
    }
    if (items.length === 0) {
        console.error("A lista deve conter pelo menos um item.");
        return;
    }

    const user = auth.currentUser;
    if (!user) return;

    try {
        const userListsRef = collection(db, "lists");
        const newListRef = doc(userListsRef);

        await setDoc(newListRef, {
            id: newListRef.id,
            name: listName,
            items: items,
            sharedWith: emailToShare ? [user.email, emailToShare.trim()] : [user.email],
            ownerId: user.uid 
        });
        

        console.log("Lista salva com sucesso!");
        navigation.goBack();
    } catch (error) {
        console.error("Erro ao salvar lista: ", error);
    }
}

export function fetchUserLists(setUserLists) {
    const user = auth.currentUser;
    if (!user) return;

    const userListsRef = collection(db, "lists");
    const q = query(userListsRef, where("sharedWith", "array-contains", user.email));

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const lists = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUserLists(lists);
    });

    return unsubscribe;
}



export async function handleUpdateListOrder(data) {
    const user = auth.currentUser;
    if (user && data.length > 0) {
        const listId = data[0]?.id;
        if (listId) {
            const listRef = doc(db, 'lists', listId);
            await updateDoc(listRef, { items: data.map(item => item.name) })
                .then(() => {
                    console.log('Ordem atualizada no Firestore');
                })
                .catch((error) => {
                    console.error('Erro ao atualizar a ordem no Firestore:', error);
                });
        }
    }
}

export async function handleRemoveList(itemId) {
    const user = auth.currentUser;
    if (user) {
        const listRef = doc(db, 'lists', itemId);
        await deleteDoc(listRef)
            .then(() => {
                console.log('Lista removida do Firestore');
            })
            .catch((error) => {
                console.error('Erro ao remover a lista do Firestore:', error);
            });
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



export const handlePriceChange = async (id, newPrice, setItems) => {
    setItems(prevItems => {
        const updatedItems = [...prevItems];
        const list = updatedItems[0];

        if (list?.items) {
            const itemIndex = list.items.findIndex(item => item.id === id);
            console.log("Índice do item:", itemIndex);

            if (itemIndex > -1) {

                list.items[itemIndex] = { ...list.items[itemIndex], price: newPrice };

                if (list?.id) {


                    const listRef = doc(db, 'lists', list.id);
                    updateDoc(listRef, {
                        items: list.items
                    })

                        .then(() => console.log("Preço atualizado no Firestore"))
                        .catch(error => console.error("Erro ao atualizar preço no Firestore:", error));
                }
            }
        }
        return [...updatedItems];
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
