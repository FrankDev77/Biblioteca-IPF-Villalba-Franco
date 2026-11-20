import { useCallback, useEffect, useState } from 'react';

import { obtenerLibros } from '../lib/api';
import type { Libro } from '../types';

export function useLibros() {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    // si el usuario reintenta antes de que vuelva la respuesta anterior, la vieja se descarta
    let cancelado = false;

    obtenerLibros()
      .then((datos) => {
        if (!cancelado) setLibros(datos);
      })
      .catch((e: unknown) => {
        if (!cancelado) {
          setError(e instanceof Error ? e.message : 'Ocurrió un error inesperado.');
        }
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });

    return () => {
      cancelado = true;
    };
  }, [intento]);

  const reintentar = useCallback(() => {
    setCargando(true);
    setError(null);
    setIntento((n) => n + 1);
  }, []);

  return { libros, cargando, error, reintentar };
}
