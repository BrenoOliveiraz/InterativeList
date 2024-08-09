import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import Title from '../../components/header/Title';
import { cards } from '../../utils/cards';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';

import MovableCard from '../../components/MovibleCard/MovableCard';

export default function Main() {

  const scrollY = useSharedValue(0)
  const cardPositions = useSharedValue(0)

  const handleScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y
  })

  function ListToObject(list: typeof cards ) {
    const listOfCards = Object.values(list)

    const object: any = {}

    listOfCards.forEach((card, index)=>{
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
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16} //obtém os dados da rolagem mais rapido
          
        >
          {cards.map((item) => (
            <MovableCard
              key={item.id}
              data={item}
              scrollY={scrollY} 
              
              
              />
          ))}
        </Animated.ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    flexGrow: 1,
    paddingHorizontal: 0,
    paddingVertical: 8,
    marginTop: 10,
    position: 'relative',
    height: cards.length * 75
  },
});
