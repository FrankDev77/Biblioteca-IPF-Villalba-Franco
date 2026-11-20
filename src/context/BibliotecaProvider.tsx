import { createContext, useContext, type ReactNode } from 'react';

import type { BibliotecaContextValue } from '../types/biblioteca';

const BibliotecaContext = createContext<BibliotecaContextValue | null>(null);

const noop = () => {};

const valorInicial: BibliotecaContextValue = {
  prestamos: [],
  recientes: [],
  sesion: null,
  reservar: noop,
  devolver: noop,
  agregarReciente: noop,
  iniciarSesion: noop,
  cerrarSesion: noop,
};

type Props = {
  children: ReactNode;
};

export function BibliotecaProvider({ children }: Props) {
  return (
    <BibliotecaContext.Provider value={valorInicial}>
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
