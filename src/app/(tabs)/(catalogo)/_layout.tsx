import { Stack } from 'expo-router';

import { LinkPersonal } from '../../../components/LinkPersonal';

// con un deep link directo a /libro/[isbn] el catálogo queda debajo y "atrás" vuelve a él
export const unstable_settings = {
  initialRouteName: 'index',
};

export default function CatalogoLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Catálogo',
          // TODO fase 6: si hay sesion mostrar Mostrador en lugar de Personal
          headerRight: () => <LinkPersonal />,
        }}
      />
      <Stack.Screen name="libro/[isbn]" options={{ title: 'Libro' }} />
    </Stack>
  );
}
