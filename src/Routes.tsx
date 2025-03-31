// src/Routes.js
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './stacks/login';
import MainScreen from './tabs/myListsScreen';
import FormRegister from './stacks/register';
import AddList from './stacks/addList';
import ListScreen from './stacks/ListItems';
import EditList from './stacks/editList';
import InitialScreen from './stacks/InitialScreen';
import AuthContext from './contexts/AuthContext';
import SharedListsScreen from './tabs/sharedListScreen';
import ShareListScreen from './stacks/shareScreen';
import Tabs from './tabs'

const Stack = createNativeStackNavigator();

export default function Routes() {
  const { user } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen options={{ headerShown: false }} name="Tabs" component={Tabs} />

            <Stack.Screen options={{ headerShown: false }} name="ShareListScreen" component={ShareListScreen} />
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
