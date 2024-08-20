
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/login/login';
import Main from './screens/main/main';
import FormRegister from './screens/register/register';






const Stack = createNativeStackNavigator();


export default function Routes() {
  return (
    <NavigationContainer>
        <Stack.Navigator>
            
            <Stack.Screen options={{headerShown: false}} name="Login" component={Login} />
            <Stack.Screen options={{headerShown: false}} name="Main" component={Main} />
            <Stack.Screen options={{headerShown: false}} name="FormRegister" component={FormRegister} />


        </Stack.Navigator>

    </NavigationContainer>
  )
}
