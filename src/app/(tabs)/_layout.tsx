import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';

import { colores } from '../../constants/tema';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colores.claro.primario,
        tabBarInactiveTintColor: colores.claro.textoSuave,
      }}
    >
      <Tabs.Screen
        name="(catalogo)"
        options={{
          title: 'Catálogo',
          // el header lo pone el Stack del catálogo; si no, quedan dos headers
          headerShown: false,
          tabBarAccessibilityLabel: 'Catálogo',
          tabBarIcon: ({ focused, size }) => (
            <Ionicons name="library" color={focused ? colores.claro.primario : colores.claro.textoSuave} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="reservas"
        options={{
          title: 'Mis reservas',
          tabBarAccessibilityLabel: 'Mis reservas',
          tabBarIcon: ({ focused, size }) => (
            <Ionicons name="bookmark" color={focused ? colores.claro.primario : colores.claro.textoSuave} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
