import React, { ReactNode } from 'react';
import { View } from 'react-native';
import { ITextProps, Text } from 'native-base';

interface TitleProps extends ITextProps {
  children: ReactNode;
  subTitle?: ReactNode; // Propriedade opcional para o subtítulo
}

export default function Title({ children, subTitle, ...rest }: TitleProps) {
  return (
    <View style={{ alignItems: 'center', marginVertical: 10 }}>
      <Text
        fontSize={"3xl"}
        fontWeight={"medium"}
        color={"white"}
        textAlign="center"
        mb={1} // Margem inferior para separar o título do subtítulo
        {...rest}
      >
        {children}
      </Text>
      {subTitle && (
        <Text
          fontSize={"lg"}
          color={"gray.400"}
          textAlign="center"
        >
          {subTitle}
        </Text>
      )}
    </View>
  );
}
