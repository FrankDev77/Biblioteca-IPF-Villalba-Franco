import { useMemo } from 'react';

import type { Paleta } from '../constants/tema';
import { useTema } from './useTema';

// crear tiene que estar definida a nivel de módulo para que el memo solo dependa de la paleta
export function useEstilos<T>(crear: (paleta: Paleta) => T): T {
  const { paleta } = useTema();
  return useMemo(() => crear(paleta), [crear, paleta]);
}
