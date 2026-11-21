import { createContext, useCallback, useContext, useReducer, useState, type ReactNode } from 'react';

import { Pila } from '../estructuras/Pila';
import type { BibliotecaContextValue } from '../types/biblioteca';

const BibliotecaContext = createContext<BibliotecaContextValue | null>(null);

const noop = () => {};

// TODO fase 4: leer el tamanio real de la cola de espera
const tamanioEspera = () => 0;

type Props = {
  children: ReactNode;
};

export function BibliotecaProvider({ children }: Props) {
  const [vistos] = useState(() => new Pila<string>());
  // la Pila se muta en el lugar y React no se entera; el contador fuerza el re-render (B3)
  const [, forzar] = useReducer((n: number) => n + 1, 0);

  const verLibro = useCallback(
    (isbn: string) => {
      if (vistos.tope() === isbn) return;
      vistos.apilar(isbn);
      forzar();
    },
    [vistos],
  );

  const valor: BibliotecaContextValue = {
    prestamos: [],
    recientes: vistos.aArray().reverse(),
    sesion: null,
    reservar: noop,
    devolver: noop,
    verLibro,
    tamanioEspera,
    iniciarSesion: noop,
    cerrarSesion: noop,
  };

  return (
    <BibliotecaContext.Provider value={valor}>
      {children}
    </BibliotecaContext.Provider>
  );
}

export function useBiblioteca() {
  const contexto = useContext(BibliotecaContext);
  if (!contexto) {
    throw new Error('useBiblioteca tiene que usarse dentro de BibliotecaProvider');
  }
  return contexto;
}
