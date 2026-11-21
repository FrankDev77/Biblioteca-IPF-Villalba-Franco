import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, Tabs } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colores, espaciado, tipografia } from '../../constants/tema';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colores.claro.primario,
        tabBarInactiveTintColor: colores.claro.textoSuave,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Catálogo',
          tabBarAccessibilityLabel: 'Catálogo',
          tabBarIcon: ({ focused, size }) => (
            <Ionicons name="library" color={focused ? colores.claro.primario : colores.claro.textoSuave} size={size} />
          ),
          // TODO fase 6: si hay sesion mostrar Mostrador en lugar de Personal
          headerRight: () => (
            <Link href="/login" asChild>
              <Pressable
                accessibilityRole="link"
                accessibilityLabel="Ingreso del personal"
                style={styles.linkPersonal}
              >
                <Text style={styles.linkPersonalTexto}>Personal</Text>
              </Pressable>
            </Link>
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
      <Tabs.Screen
        name="libro/[isbn]"
        options={{ href: null, title: 'Libro' }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  linkPersonal: {
    minHeight: 44,
    minWidth: 44,
    justifyContent: 'center',
    paddingHorizontal: espaciado.l,
  },
  linkPersonalTexto: {
    ...tipografia.cuerpo,
    fontWeight: '600',
    color: colores.claro.primario,
  },
});
