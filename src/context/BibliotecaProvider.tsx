import { createContext, useCallback, useContext, useReducer, useState, type ReactNode } from 'react';

import { LIBROS } from '../data/libros';
import { Cola } from '../estructuras/Cola';
import { Pila } from '../estructuras/Pila';
import { sumarDias } from '../lib/fechas';
import type { Prestamo, ReservaEnEspera } from '../types';
import type { BibliotecaContextValue, ResultadoReserva } from '../types/biblioteca';

export const USUARIO = 'yo';

const BibliotecaContext = createContext<BibliotecaContextValue | null>(null);

const noop = () => {};

// listas de espera iniciales que pide A2 del TP
function crearListasIniciales() {
  const listas = new Map<string, Cola<string>>();

  const cienAnios = new Cola<string>();
  cienAnios.encolar('Ana');
  listas.set('9788420471839', cienAnios);

  const sobreHeroes = new Cola<string>();
  sobreHeroes.encolar('Juan');
  sobreHeroes.encolar('Lucía');
  listas.set('9789500426992', sobreHeroes);

  return listas;
}

type Props = {
  children: ReactNode;
};

export function BibliotecaProvider({ children }: Props) {
  const [vistos] = useState(() => new Pila<string>());
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  // Cola propia y no un array con shift(): desencolar en el mostrador queda O(1)
  const [listasEspera] = useState(crearListasIniciales);
  // la Pila y las Colas se mutan en el lugar y React no se entera; el contador fuerza el re-render (B3)
  const [, forzar] = useReducer((n: number) => n + 1, 0);

  const verLibro = useCallback(
    (isbn: string) => {
      if (vistos.tope() === isbn) return;
      vistos.apilar(isbn);
      forzar();
    },
    [vistos],
  );

  const estaPrestado = useCallback(
    (isbn: string) => prestamos.some((p) => p.isbn === isbn),
    [prestamos],
  );

  const ejemplaresDisponibles = useCallback(
    (isbn: string) => {
      const libro = LIBROS.find((l) => l.isbn === isbn);
      if (!libro) return 0;
      const prestados = prestamos.filter((p) => p.isbn === isbn).length;
      return Math.max(0, libro.ejemplares - prestados);
    },
    [prestamos],
  );

  const tamanioEspera = useCallback(
    (isbn: string) => listasEspera.get(isbn)?.tamanio ?? 0,
    [listasEspera],
  );

  const miPosicion = useCallback(
    (isbn: string) => {
      const cola = listasEspera.get(isbn);
      if (!cola) return null;
      const indice = cola.aArray().indexOf(USUARIO);
      return indice === -1 ? null : indice + 1;
    },
    [listasEspera],
  );

  const misReservasEnEspera = useCallback(() => {
    const reservas: ReservaEnEspera[] = [];
    listasEspera.forEach((_, isbn) => {
      const posicion = miPosicion(isbn);
      if (posicion !== null) reservas.push({ isbn, posicion });
    });
    return reservas;
  }, [listasEspera, miPosicion]);

  const reservar = useCallback(
    (isbn: string): ResultadoReserva => {
      if (estaPrestado(isbn)) return { ok: false, razon: 'ya-prestado' };
      if (miPosicion(isbn) !== null) return { ok: false, razon: 'ya-en-cola' };

      if (ejemplaresDisponibles(isbn) > 0) {
        const hasta = sumarDias(7);
        setPrestamos((actuales) => [
          ...actuales,
          { isbn, desde: new Date().toISOString(), hasta, notificacionId: null },
        ]);
        return { ok: true, tipo: 'prestamo', hasta };
      }

      let cola = listasEspera.get(isbn);
      if (!cola) {
        cola = new Cola<string>();
        listasEspera.set(isbn, cola);
      }
      cola.encolar(USUARIO);
      forzar();
      return { ok: true, tipo: 'cola', posicion: cola.tamanio };
    },
    [estaPrestado, miPosicion, ejemplaresDisponibles, listasEspera],
  );

  const devolver = useCallback((isbn: string) => {
    // si hay cola para este libro no se desencola aca, eso lo hace el mostrador (fase 6)
    setPrestamos((actuales) => actuales.filter((p) => p.isbn !== isbn));
  }, []);

  const valor: BibliotecaContextValue = {
    prestamos,
    recientes: vistos.aArray().reverse(),
    sesion: null,
    reservar,
    devolver,
    verLibro,
    ejemplaresDisponibles,
    tamanioEspera,
    miPosicion,
    estaPrestado,
    misReservasEnEspera,
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
