import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';

import { useBiblioteca } from '../context/BibliotecaProvider';
import { useTema } from '../hooks/useTema';

export function NavegacionRaiz() {
  const { sesion } = useBiblioteca();
  const { paleta, modo } = useTema();

  // ThemeProvider sale de expo-router y no de @react-navigation/native: el router trae su
  // propia copia de react-navigation y con otra instancia los headers no verían el tema
  const temaNavegacion = useMemo(() => {
    const base = modo === 'oscuro' ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: paleta.primario,
        background: paleta.fondo,
        card: paleta.superficie,
        text: paleta.texto,
        border: paleta.borde,
        notification: paleta.error,
      },
    };
  }, [modo, paleta]);

  return (
    <ThemeProvider value={temaNavegacion}>
      <StatusBar style={modo === 'oscuro' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: paleta.superficie },
          headerTintColor: paleta.texto,
          contentStyle: { backgroundColor: paleta.fondo },
        }}
      >
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
    </ThemeProvider>
  );
}
