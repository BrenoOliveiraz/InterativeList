// src/Routes.js
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './Stacks/login';
import MainScreen from './Tabs/myListsScreen';
import FormRegister from './Stacks/register';
import AddList from './Stacks/addList';
import ListScreen from './Stacks/ListItems';
import EditList from './Stacks/editList';
import InitialScreen from './Stacks/InitialScreen';
import AuthContext from './Contexts/AuthContext';
import SharedListsScreen from './Tabs/sharedListScreen';
import ShareListScreen from './Stacks/shareScreen';
import Tabs from './Tabs'

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
