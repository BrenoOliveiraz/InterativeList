import { View } from 'native-base'
import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import Animated, {
  SharedValue,
  runOnJS,
  useSharedValue,
  useAnimatedStyle
} from 'react-native-reanimated'
import Card, { CardProps } from '../Card/Card'

import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { cards } from '../../utils/cards'



type Props = {
  data: CardProps,
  cardsPosition: SharedValue<number[]>,
  scrollY: SharedValue<number>,
  cardsCount: number
}

export default function MovableCard({ data, cardsPosition, cardsCount, scrollY }: Props) {

  const [moving, setMoving] = useState(false)
  const top =  useSharedValue(cardsPosition.value[data.id] * cards.length * 60)

  //setando os gestos de ativação pra ordenar a lista
  const longPressGesture = Gesture
    .LongPress()
    .onStart(() => {
      runOnJS(setMoving)(true)
    })
    .minDuration(200)

  //setando a iteração de arrastar o card
  const panGesture = Gesture.
    Pan()
    .manualActivation(true)
    .onTouchesDown((_, state) => { //o metodo passa o evento e o estado
      moving ? state.activate() : state.fail()
    
    }) //setando o estagio da alteração, quando começa, enquanto, acaba ou após a iteração
    .onUpdate((event)=>{
      top.value = (event.absoluteY)
    })

    const animatedStyle = useAnimatedStyle(()=>{
      return {
        top: top.value - cards.length * 60
      }
    })

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <GestureDetector gesture={longPressGesture}>


        <Card data={data} />
      </GestureDetector>
    </Animated.View>
  )
}



const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    marginBottom: 12
  }
})