import React, { createContext, useState, useContext, ReactNode } from 'react';

// Definição da interface para o estado da lista
interface List {
  id: string;
  name: string;
  items: string[];
}

// Definição da interface para o contexto
interface ListContextType {
  list: List | null;
  setList: React.Dispatch<React.SetStateAction<List | null>>;
}

// Criação do contexto com valor default
const ListContext = createContext<ListContextType | undefined>(undefined);

// Provedor de contexto
export function ListProvider({ children }: { children: ReactNode }) {
  const [list, setList] = useState<List | null>(null);

  return (
    <ListContext.Provider value={{ list, setList }}>
      {children}
    </ListContext.Provider>
  );
}

// Hook personalizado para acessar o contexto
export function useList() {
  const context = useContext(ListContext);
  if (context === undefined) {
    throw new Error('useList must be used within a ListProvider');
  }
  return context;
}
