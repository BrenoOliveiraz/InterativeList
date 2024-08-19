import { View } from 'native-base';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  SharedValue,
  runOnJS, //rodar codigo js
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useAnimatedReaction,
} from 'react-native-reanimated';
import Card, { CARD_HEIGHT, CardProps } from '../Card/Card';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';




//SharedValue vem do reanimated para utilizar nas animações
type Props = {
  data: CardProps;
  cardsPosition: SharedValue<number[]>;
  scrollY: SharedValue<number>;
  cardsCount: number;
};

export default function MovableCard({ data, cardsPosition, cardsCount, scrollY }: Props) {


  //estado para interagir com o onStart depois de atingir a duração minima
  const [moving, setMoving] = useState(false);


  //
  const top = useSharedValue(cardsPosition.value[data.id] * CARD_HEIGHT);


  //entender
  function ObjectMove(positions: number[], from: number, to: number){
    'worklet'
    const newPoisitions = Object.assign({}, positions)

    for (const id in positions){
      if(positions[id]=== from){
        newPoisitions[id] = to
      }
      if(positions[id]=== to){
        newPoisitions[id] = from
      }
    }
    return newPoisitions
  }

  //LOGICA DOS GESTOS


  useAnimatedReaction(()=> cardsPosition.value[data.id], (currentPosition, previousPosition)=>{
    if(currentPosition!== previousPosition){
      if(!moving){
        top.value = withSpring(currentPosition * CARD_HEIGHT)
      }
    }
  }, [moving])


  //gesto de segurar 
  const longPressGesture = Gesture.LongPress()
    .onStart(() => { //começou o evento, o que irá acontecer
      runOnJS(setMoving)(true); //ativando movimento
    })
    .minDuration(200); //duração minima


  //gesto de segurar e arrastar
  const panGesture = Gesture.Pan() 

    .manualActivation(true) //ativar através do próprio código, manualmente

    .onTouchesMove((_, state) => { //estagio de interação, quando o usuário pressiona o elemento
      moving ? state.activate() : state.fail(); //se o longpressGesture estiver setado pelo setmoving, ele ativa o movimento, se não, ele cancela
    })
    .onUpdate((event) => { //enquanto o evento de arrastar está acontecendo
      const positionY = event.absoluteY + scrollY.value;
      top.value = positionY - CARD_HEIGHT

      const startPoisitionList = 0
      const endPositionList = cardsCount - 1
      const currentPositionList = Math.floor(positionY / CARD_HEIGHT)

      'worklet'; //indica que o codigo de devera ser executado em js e não na interface do usuário 
      const newPosition = Math.max(startPoisitionList, Math.min(currentPositionList, endPositionList ))

      if(newPosition !== cardsPosition.value[data.id]){
        cardsPosition.value = ObjectMove(cardsPosition.value, cardsPosition.value[data.id], newPosition)

      }
    })
    .onFinalize(()=>{
      const newPosition = cardsPosition.value[data.id] * CARD_HEIGHT
      top.value = withSpring(newPosition)
      runOnJS(setMoving)(false); //voltando estado pro falso quando acabar o movimento de arrastar

    })
    .simultaneousWithExternalGesture(longPressGesture)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      top: top.value - CARD_HEIGHT,
      opacity: withSpring(moving ? 1 : 0.4), 
      zIndex: moving? 1: 0
    };
  },[moving]);

  return ( 
    <Animated.View style={[styles.container, animatedStyle]}>
      
      <GestureDetector gesture={Gesture.Race(longPressGesture, panGesture)}> 
        <Card data={data} />
      </GestureDetector>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
   
  },
});

