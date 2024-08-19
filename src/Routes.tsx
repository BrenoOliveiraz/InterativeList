
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/login/login';





const Stack = createNativeStackNavigator();


export default function Routes() {
  return (
    <NavigationContainer>
        <Stack.Navigator>
            
            <Stack.Screen options={{headerShown: false}} name="Login" component={Login} />

        </Stack.Navigator>

    </NavigationContainer>
  )
}
