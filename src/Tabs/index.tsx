import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MyListsScreen from './MyListsScreen';
import SharedListsScreen from './sharedListScreen';

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="MyListsScreen" component={MyListsScreen} />
      <Tab.Screen name="SharedListsScreen" component={SharedListsScreen} />
    </Tab.Navigator>
  );
}