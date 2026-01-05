import React, { useState, useEffect } from 'react';
import { Modal, FormControl, Input, Button, Text } from 'native-base';

interface Item {
  id: string;
  name: string;
}

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void; // MODIFICADO: Nome genérico para servir para Add e Update
  initialData?: Item | null;      // NOVO: Dados para quando for edição
}

export default function AddItemModal({ isOpen, onClose, onSave, initialData }: AddItemModalProps) {
  const [itemName, setItemName] = useState('');

  // NOVO: Monitora se o modal abriu com dados iniciais (Edição) ou vazio (Novo)
  useEffect(() => {
    if (isOpen) {
      setItemName(initialData ? initialData.name : '');
    }
  }, [isOpen, initialData]);

  const handleSave = () => {
    if (itemName.trim()) {
      onSave(itemName);
      setItemName(''); 
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" animationPreset="slide">
      {/* MODIFICADO: bg alterado para gray.800 para manter consistência visual */}
      <Modal.Content bg="gray.800" borderRadius="2xl">
        <Modal.CloseButton />
        <Modal.Header borderBottomWidth={0} _text={{ color: "cyan.400", fontWeight: "bold" }}>
          {initialData ? 'Editar Item' : 'Novo Item'}
        </Modal.Header>
        
        <Modal.Body>
          <FormControl>
            <FormControl.Label _text={{ color: "gray.300" }}>
              {initialData ? 'Altere o nome do item:' : 'O que você quer adicionar?'}
            </FormControl.Label>
            <Input 
              color="white" 
              fontSize="md"
              placeholder="Ex: Arroz, Feijão..." 
              focusOutlineColor="cyan.400"
              value={itemName}
              onChangeText={setItemName}
              autoFocus
              onSubmitEditing={handleSave} 
            />
          </FormControl>
        </Modal.Body>

        <Modal.Footer bg="gray.800" borderTopWidth={0}>
          <Button.Group space={2}>
            <Button variant="ghost" _text={{ color: "gray.400" }} onPress={onClose}>
              Cancelar
            </Button>
            {/* MODIFICADO: Garantindo cores contrastantes no botão */}
            <Button 
                bg="cyan.400" 
                _pressed={{ bg: "cyan.500" }} 
                onPress={handleSave}
            >
              <Text color="black" fontWeight="bold">
                {initialData ? 'Salvar' : 'Adicionar'}
              </Text>
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}