// src/contexts/ListContext.tsx

import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define o tipo para o contexto
interface ListContextType {
  lists: { [key: string]: any };
  setLists: (lists: { [key: string]: any }) => void;
}

// Cria o contexto com um valor padrão
const ListContext = createContext<ListContextType | undefined>(undefined);

// Provedor do contexto
export const ListProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lists, setLists] = useState<{ [key: string]: any }>({});

  return (
    <ListContext.Provider value={{ lists, setLists }}>
      {children}
    </ListContext.Provider>
  );
};

// Hook personalizado para usar o contexto
export const useListContext = () => {
  const context = useContext(ListContext);
  if (context === undefined) {
    throw new Error('useListContext must be used within a ListProvider');
  }
  return context;
};
