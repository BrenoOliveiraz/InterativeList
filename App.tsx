import { NativeBaseProvider, StatusBar } from 'native-base';
import Main from './src/screens/main/main';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  return (
    <NativeBaseProvider >
      <GestureHandlerRootView style={{flex: 1}}>
        <StatusBar barStyle='light-content' translucent backgroundColor='transparent' />
        <Main />

      </GestureHandlerRootView>
    </NativeBaseProvider>
  );
}


