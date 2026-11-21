import { Stack } from 'expo-router';

import { useBiblioteca } from '../context/BibliotecaProvider';

export function NavegacionRaiz() {
  const { sesion } = useBiblioteca();

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="buscar" options={{ title: 'Buscar' }} />
      <Stack.Screen name="escanear" options={{ title: 'Escanear' }} />
      <Stack.Screen
        name="reservar/[isbn]"
        options={{ title: 'Reservar', presentation: 'modal' }}
      />
      <Stack.Screen
        name="permisos/[recurso]"
        options={{ title: 'Permisos', presentation: 'modal' }}
      />
      <Stack.Screen
        name="login"
        options={{ title: 'Ingresar', presentation: 'modal' }}
      />
      <Stack.Screen name="+not-found" options={{ title: 'No encontrado' }} />
      {/* sin sesion la ruta no existe: un deep link a /mostrador cae al catálogo
          y al cerrar sesion la pantalla sale sola del historial */}
      <Stack.Protected guard={sesion !== null}>
        <Stack.Screen name="mostrador" options={{ title: 'Mostrador' }} />
      </Stack.Protected>
    </Stack>
  );
}
