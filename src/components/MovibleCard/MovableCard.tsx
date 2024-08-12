import { View } from 'native-base'
import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import Animated, {
  SharedValue,
  runOnJS
} from 'react-native-reanimated'
import Card, { CardProps } from '../Card/Card'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'


type Props = {
  data: CardProps,
  cardsPosition: SharedValue<number[]>,
  scrollY: SharedValue<number>,
  cardsCount: number
}

export default function MovableCard({ data }: Props) {

  const [moving, setMoving] = useState(false)

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
    .onTouchesDown((_,state)=>{
      moving ? state.activate() : state.fail()
    }) //setando o estagio da alteração, quando começa, enquanto, acaba ou após a iteração


  return (
    <Animated.View>
      <GestureDetector gesture={longPressGesture }>


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