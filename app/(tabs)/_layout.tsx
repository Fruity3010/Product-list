import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {  Tabs } from 'expo-router';


import { useThemeColor } from '@/components/Themed';
import ShoppingCartButton from '@/components/navigation/ShoppingCartButton';
import MenuButton from '@/components/navigation/MenuButton';


function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginTop: 0 }} {...props} />; 
}

export default function TabLayout() {
  const tabBarActiveTintColor = useThemeColor({}, 'tint');
  const tabBackgroundColor = useThemeColor({}, 'background');
  const tabBorderColor = useThemeColor({}, 'tabBorder');

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tabBarActiveTintColor,
        headerShown: true,
        tabBarStyle: {
          backgroundColor: tabBackgroundColor,
          borderTopWidth: 1,
          borderTopColor: tabBorderColor,
          height: 80,
          paddingBottom: 10,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: 'bold',
          marginBottom: 0,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Products',
          tabBarIcon: ({ color }) => <TabBarIcon name="shopping-bag" color={color} />,
          headerRight: () => <ShoppingCartButton destination="/modal" />,
          headerLeft: () => <MenuButton onPress={() => console.log('Menu button pressed!')} />,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}