import { View } from 'native-base'
import React from 'react'
import { StyleSheet } from 'react-native'
import Animated, { SharedValue } from 'react-native-reanimated'
import Card, { CardProps } from '../Card/Card'


type Props = {
  data: CardProps,
  cardsPosition: SharedValue<number[]>,
  scrollY: SharedValue<number>,
  cardsCount: number
}

export default function MovableCard({ data }: Props) {
  return (
    <Animated.View>
      <Card data={data} />
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