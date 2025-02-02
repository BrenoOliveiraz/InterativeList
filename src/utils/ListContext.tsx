
import React, { createContext, useState, useContext, ReactNode } from 'react';


interface ListContextType {
  lists: { [key: string]: any };
  setLists: (lists: { [key: string]: any }) => void;
}


const ListContext = createContext<ListContextType | undefined>(undefined);


export const ListProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lists, setLists] = useState<{ [key: string]: any }>({});

  return (
    <ListContext.Provider value={{ lists, setLists }}>
      {children}
    </ListContext.Provider>
  );
};


export const useListContext = () => {
  const context = useContext(ListContext);
  if (context === undefined) {
    throw new Error('useListContext must be used within a ListProvider');
  }
  return context;
};
