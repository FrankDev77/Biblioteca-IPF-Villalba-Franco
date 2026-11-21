import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';

import { useTema } from '../../hooks/useTema';

export default function TabsLayout() {
  const { paleta } = useTema();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: paleta.primario,
        tabBarInactiveTintColor: paleta.textoSuave,
        tabBarStyle: { backgroundColor: paleta.superficie, borderTopColor: paleta.borde },
        headerStyle: { backgroundColor: paleta.superficie },
        headerTintColor: paleta.texto,
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
            <Ionicons name="library" color={focused ? paleta.primario : paleta.textoSuave} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="reservas"
        options={{
          title: 'Mis reservas',
          tabBarAccessibilityLabel: 'Mis reservas',
          tabBarIcon: ({ focused, size }) => (
            <Ionicons name="bookmark" color={focused ? paleta.primario : paleta.textoSuave} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
