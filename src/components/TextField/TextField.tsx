import React from 'react';
import { FormControl, IInputProps, Input } from 'native-base';

interface TextFieldProps extends IInputProps {
    placeHolderText: string;
    labelText: string;
    secureTextEntry?: boolean;
    value?: string;
    onChangeText?: (text: string) => void;
}

export default function TextField({ placeHolderText, labelText, secureTextEntry = false, value, onChangeText, ...rest }: TextFieldProps) {
    return (
        <FormControl>
            <FormControl.Label>{labelText}</FormControl.Label>
            <Input
                placeholder={placeHolderText}
                w="100%"
                size="lg"
                borderRadius="lg"
                backgroundColor="gray.100"
                shadow={3}
                secureTextEntry={secureTextEntry}
                value={value}
                onChangeText={onChangeText}
                {...rest}
            />
        </FormControl>
    );
}

