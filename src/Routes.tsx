// src/Routes.js
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './screens/login/login';
import MainScreen from './screens/main/main';
import FormRegister from './screens/register/register';
import AddList from './screens/addList/addList';
import ListScreen from './screens/List/ListItems';
import EditList from './screens/EditList/editList';
import InitialScreen from './screens/InitialScreen/InitialScreen';
import AuthContext from './Contexts/AuthContext';

const Stack = createNativeStackNavigator();

export default function Routes() {
  const { user } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen options={{ headerShown: false }} name="Main" component={MainScreen} />
            <Stack.Screen options={{ headerShown: false }} name="AddList" component={AddList} />
            <Stack.Screen options={{ headerShown: false }} name="ListScreen" component={ListScreen} />
            <Stack.Screen options={{ headerShown: false }} name="EditList" component={EditList} />
          </>
        ) : (
          <>
            <Stack.Screen options={{ headerShown: false }} name="InitialScreen" component={InitialScreen} />
            <Stack.Screen options={{ headerShown: false }} name="Login" component={Login} />
            <Stack.Screen options={{ headerShown: false }} name="FormRegister" component={FormRegister} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
