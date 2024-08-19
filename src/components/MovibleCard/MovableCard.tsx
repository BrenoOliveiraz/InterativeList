import { View } from 'native-base';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  SharedValue,
  runOnJS,
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import Card, { CARD_HEIGHT, CardProps, MARGIN_BOTTON } from '../Card/Card';

import { Gesture, GestureDetector } from 'react-native-gesture-handler';


//SharedValue vem do reanimated para utilizar nas animações
type Props = {
  data: CardProps;
  cardsPosition: SharedValue<number[]>;
  scrollY: SharedValue<number>;
  cardsCount: number;
};

export default function MovableCard({ data, cardsPosition, cardsCount, scrollY }: Props) {
  const [moving, setMoving] = useState(false);
  const top = useSharedValue(cardsPosition.value[data.id] * (CARD_HEIGHT + MARGIN_BOTTON));

  const longPressGesture = Gesture.LongPress()
    .onStart(() => {
      runOnJS(setMoving)(true);
    })
    .minDuration(200);

  const panGesture = Gesture.Pan()
    .manualActivation(true)
    .onTouchesDown((_, state) => {
      moving ? state.activate() : state.fail();
    })
    .onUpdate((event) => {
      top.value = event.absoluteY + scrollY.value;
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      top: top.value - CARD_HEIGHT < 0 ? 0 : top.value - CARD_HEIGHT, // Garante que o card não seja renderizado fora da tela
    };
  });

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



// import { View } from 'native-base';
// import React, { useState } from 'react';
// import { StyleSheet } from 'react-native';
// import Animated, {
//   SharedValue,
//   runOnJS,
//   useSharedValue,
//   useAnimatedStyle
// } from 'react-native-reanimated';
// import Card, { CardProps } from '../Card/Card';
// import { Gesture, GestureDetector } from 'react-native-gesture-handler';
// import { cards } from '../../utils/cards';

// type Props = {
//   data: CardProps,
//   cardsPosition: SharedValue<number[]>,
//   scrollY: SharedValue<number>,
//   cardsCount: number
// };

// export default function MovableCard({ data, cardsPosition, cardsCount, scrollY }: Props) {
//   const [moving, setMoving] = useState(false);

//   // Ajuste na inicialização de 'top' para não multiplicar por cards.length
//   // Isso garante que a posição inicial é calculada corretamente
//   const top = useSharedValue(cardsPosition.value[data.id] * 60); // MODIFICADO

//   // Configuração do gesto de long press para ativar o movimento
//   const longPressGesture = Gesture
//     .LongPress()
//     .onStart(() => {
//       runOnJS(setMoving)(true);
//     })
//     .minDuration(200);

//   // Configuração do gesto de pan para mover o cartão
//   const panGesture = Gesture
//     .Pan()
//     .manualActivation(true)
//     .onTouchesDown((_, state) => {
//       moving ? state.activate() : state.fail();
//     })
//     // Ajuste na atualização da posição do 'top'
//     // Usando event.translationY para mover o cartão relativo à sua posição inicial
//     .onUpdate((event) => {
//       top.value = cardsPosition.value[data.id] * 60 + event.translationY; // MODIFICADO
//     });

//   // Ajuste no estilo animado para usar diretamente o valor de 'top'
//   // Removido o deslocamento adicional que estava causando problemas
//   const animatedStyle = useAnimatedStyle(() => {
//     return {
//       top: top.value, // MODIFICADO
//     };
//   });

//   return (
//     <Animated.View style={[styles.container, animatedStyle]}>
//       <GestureDetector gesture={longPressGesture}>
//         <Card data={data} />
//       </GestureDetector>
//     </Animated.View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     position: 'absolute',
//     left: 0,
//     right: 0,
//     marginBottom: 12
//   }
// });
