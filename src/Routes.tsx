
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Tabs from './tabs'
import AuthContext from './contexts/AuthContext';
import ShareListScreen from './stacks/shareScreen';
import AddList from './stacks/addList';
import ListScreen from './stacks/listItems';
import EditList from './stacks/editList';
import InitialScreen from './stacks/InitialScreen';
import Login from './stacks/login';
import FormRegister from './stacks/register';

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
