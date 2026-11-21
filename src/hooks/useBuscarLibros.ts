import { useEffect, useState } from 'react';

import { buscarLibros } from '../lib/api';
import type { Libro } from '../types';

export function useBuscarLibros(q: string) {
  const [resultados, setResultados] = useState<Libro[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (q.trim() === '') {
      setResultados([]);
      setBuscando(false);
      return;
    }

    setBuscando(true);
    setError(null);

    // buscarLibros tarda al azar: sin esta bandera una respuesta vieja ("bor") puede pisar a la nueva ("borges") (B2)
    let cancelado = false;

    buscarLibros(q)
      .then((datos) => {
        if (!cancelado) {
          setResultados(datos);
          setBuscando(false);
        }
      })
      .catch((e: unknown) => {
        if (!cancelado) {
          setError(e instanceof Error ? e.message : 'Ocurrió un error inesperado.');
          setBuscando(false);
        }
      });

    return () => {
      cancelado = true;
    };
  }, [q]);

  return { resultados, buscando, error };
}
