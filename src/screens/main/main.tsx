import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import Title from '../../components/header/Title';
import { cards } from '../../utils/cards';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';

import MovableCard from '../../components/MovibleCard/MovableCard';
import { CARD_HEIGHT } from '../../components/Card/Card';

export default function Main() {


  //hook do animated pra atualizar o estado da rolagem
  const scrollY = useSharedValue(0)
  const cardsPosition = useSharedValue(listToObject(cards))


  //função do animated pra capturar as informações de rolagem
  const handleScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y //contentOffset é para mostrar a posição da rolagem em Y (vertical)
  })



  //função para criar um objeto a partir do array fornecido pelos utils
  function listToObject(list: typeof cards) {
    const listOfCards = Object.values(list)

    const object: any = {}

    listOfCards.forEach((card, index) => {
      object[card.id] = index

    })
    return object

  }



  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Passando o título principal e o subtítulo */}
        <Title subTitle="Defina a sequência de assuntos que você mais gosta no topo da lista.">
          Categorias
        </Title>

        <Animated.ScrollView
          contentContainerStyle={{height: cards.length * CARD_HEIGHT}}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll} //obter os numeros de posições de interação com o scroll, função do animated
          scrollEventThrottle={16} //obtém a resposta dos dados da rolagem mais rapido

        >
          {cards.map((item) => (
            <MovableCard
              key={item.id}
              data={item}
              scrollY={scrollY}
              cardsPosition={cardsPosition}
              cardsCount={cards.length}


            />
          ))}
        </Animated.ScrollView>
      </View>
    </SafeAreaView>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 16, // Adicione padding se necessário
    paddingTop: 20, // Ajuste o padding superior se necessário
  },
  list: {
    flex: 1,
    padding: 32,
    position: 'relative',
    height: cards.length * 60
  },
});
