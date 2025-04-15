
import { useState, useEffect } from "react";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../services/FirebaseConfig";

export default function useItemsFromList(listName: string) {
  const [items, setItems] = useState([]);
  const [listId, setListId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchList() {
      const q = query(collection(db, 'lists'), where('name', '==', listName));
      const snapshot = await getDocs(q);
      const docData = snapshot.docs[0];
      if (docData) {
        setListId(docData.id);
        setItems(docData.data().items || []);
      }
      setLoading(false);
    }

    fetchList();
  }, [listName]);

  const updateItems = async (newItems) => {
    if (!listId) return;
    await updateDoc(doc(db, 'lists', listId), { items: newItems });
    setItems(newItems);
  };

  return { items, updateItems, loading };
}
