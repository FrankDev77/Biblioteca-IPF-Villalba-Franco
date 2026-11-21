import { useColorScheme } from 'react-native';

import { colores, type Paleta } from '../constants/tema';

export type ModoTema = 'claro' | 'oscuro';

export function useTema(): { paleta: Paleta; modo: ModoTema } {
  const esquema = useColorScheme();
  const modo: ModoTema = esquema === 'dark' ? 'oscuro' : 'claro';
  return { paleta: colores[modo], modo };
}
