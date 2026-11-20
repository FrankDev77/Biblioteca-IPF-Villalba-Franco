import { Stack } from 'expo-router';

import { BibliotecaProvider } from '../context/BibliotecaProvider';

export default function RootLayout() {
  // TODO fase 6: leer sesion del context
  const haySesion = false;

  return (
    <BibliotecaProvider>
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
        <Stack.Protected guard={haySesion}>
          <Stack.Screen name="mostrador" options={{ title: 'Mostrador' }} />
        </Stack.Protected>
      </Stack>
    </BibliotecaProvider>
  );
}
