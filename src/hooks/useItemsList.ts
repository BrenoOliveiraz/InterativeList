import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../services/FirebaseConfig';

export default function useItemsFromList(listId: string) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['list-items', listId],
    queryFn: async () => {
      if (!listId) return null;
      const docRef = doc(db, 'lists', listId);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) return null;
      return (docSnap.data().items as any[]) || [];
    },
    enabled: !!listId,
    staleTime: 0, // MODIFICADO: 0 garante que ele sempre busque dados novos ao entrar na tela
    gcTime: 1000 * 60 * 5, // Mantém no cache por 5 min (se estiver na v5, se v4 use cacheTime)
  });

  const updateItemsMutation = useMutation({
    mutationFn: async (newItems: any[]) => {
      const docRef = doc(db, 'lists', listId);
      // MODIFICADO: Garantimos que o updateDoc termine antes de prosseguir
      await updateDoc(docRef, { items: newItems });
      return newItems; // MODIFICADO: Importante retornar os dados para o onSuccess
    },
    onSuccess: (data) => {
      // MODIFICADO: Atualiza o cache local imediatamente com os novos dados
      queryClient.setQueryData(['list-items', listId], data);
      // NOVO: Invalida a query para forçar um refresh do Firebase na próxima vez
      queryClient.invalidateQueries({ queryKey: ['list-items', listId] });
    }
  });

  return {
    serverItems: data,
    loading: isLoading,
    updateItems: updateItemsMutation.mutate,
  };
}