import { useCallback, useEffect, useState } from 'react';

import { obtenerLibros } from '../lib/api';
import type { Libro } from '../types';

export function useLibroPorIsbn(isbn: string) {
  const [libro, setLibro] = useState<Libro | null>(null);
  const [validando, setValidando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    obtenerLibros()
      .then((lista) => setLibro(lista.find((l) => l.isbn === isbn) ?? null))
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : 'Ocurrió un error inesperado.');
      })
      .finally(() => setValidando(false));
  }, [isbn, intento]);

  const reintentar = useCallback(() => {
    setValidando(true);
    setError(null);
    setLibro(null);
    setIntento((n) => n + 1);
  }, []);

  return { libro, validando, error, reintentar };
}
