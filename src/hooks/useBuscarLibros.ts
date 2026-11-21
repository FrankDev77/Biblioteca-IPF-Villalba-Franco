import { useEffect, useState } from 'react';

import { buscarLibros } from '../lib/api';
import type { Libro } from '../types';

type Respuesta = {
  q: string;
  resultados: Libro[];
  error: string | null;
};

export function useBuscarLibros(q: string) {
  const [respuesta, setRespuesta] = useState<Respuesta | null>(null);

  useEffect(() => {
    if (q.trim() === '') return;

    // buscarLibros tarda al azar: sin esta bandera una respuesta vieja ("bor") puede pisar a la nueva ("borges") (B2)
    let cancelado = false;

    buscarLibros(q)
      .then((datos) => {
        if (!cancelado) setRespuesta({ q, resultados: datos, error: null });
      })
      .catch((e: unknown) => {
        if (!cancelado) {
          setRespuesta({
            q,
            resultados: [],
            error: e instanceof Error ? e.message : 'Ocurrió un error inesperado.',
          });
        }
      });

    return () => {
      cancelado = true;
    };
  }, [q]);

  // buscando se deriva de si ya hay respuesta para la q actual, así el efecto no hace setState sincrónico
  const vacia = q.trim() === '';
  const vigente = respuesta !== null && respuesta.q === q ? respuesta : null;

  return {
    resultados: vacia ? [] : (vigente?.resultados ?? []),
    buscando: !vacia && vigente === null,
    error: vacia ? null : (vigente?.error ?? null),
  };
}
