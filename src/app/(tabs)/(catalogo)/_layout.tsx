import { Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';

import { LinkPersonal } from '../../../components/LinkPersonal';
import { useTema } from '../../../hooks/useTema';

// con un deep link directo a /libro/[isbn] el catálogo queda debajo y "atrás" vuelve a él
export const unstable_settings = {
  initialRouteName: 'index',
};

export default function CatalogoLayout() {
  const { paleta } = useTema();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Catálogo',
          headerRight: () => <LinkPersonal />,
          headerBackground: () => (
            <LinearGradient colors={[paleta.fondo, paleta.superficie]} style={StyleSheet.absoluteFill} />
          ),
        }}
      />
      <Stack.Screen name="libro/[isbn]" options={{ title: 'Libro' }} />
    </Stack>
  );
}
