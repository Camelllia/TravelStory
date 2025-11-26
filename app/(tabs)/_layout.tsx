import React from 'react';
import GalleryScreen from './gallery';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

export default function TabLayout() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Gallery" component={GalleryScreen} options={{ title: '정리하기' }} />
    </Tab.Navigator>
  );
}
