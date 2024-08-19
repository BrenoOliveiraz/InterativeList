import { NativeBaseProvider, StatusBar } from 'native-base';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Routes from './src/Routes';

export default function App() {
  return (
    <NativeBaseProvider >
      <GestureHandlerRootView style={{flex: 1}}>
        <StatusBar barStyle='light-content' translucent backgroundColor='transparent' />
        <Routes />

      </GestureHandlerRootView>
    </NativeBaseProvider>
  );
}


