
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './screens/Login/login';
import Main from './screens/Main/main';
import FormRegister from './screens/Register/register';
import AddList from './screens/AddList/addList';
import ListScreen from './screens/List/List';




const Stack = createNativeStackNavigator();


export default function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator>

        <Stack.Screen options={{ headerShown: false }} name="Login" component={Login} />
        <Stack.Screen options={{ headerShown: false }} name="Main" component={Main} />
        <Stack.Screen options={{ headerShown: false }} name="FormRegister" component={FormRegister} />
        <Stack.Screen options={{ headerShown: false }} name="AddList" component={AddList} />
        <Stack.Screen options={{ headerShown: false }} name="ListScreen" component={ListScreen} />

      </Stack.Navigator>

    </NavigationContainer>
  )
}
