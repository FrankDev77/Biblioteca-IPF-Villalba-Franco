import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
  type ReactNode,
} from 'react';

import { EstadoCargando } from '../components/EstadoCargando';
import { LIBROS } from '../data/libros';
import { Cola } from '../estructuras/Cola';
import { Pila } from '../estructuras/Pila';
import { useRecordatorio } from '../hooks/useRecordatorio';
import { sumarDias } from '../lib/fechas';
import { CLAVES, guardar, leer } from '../lib/persistencia';
import type { Prestamo, ReservaEnEspera, Sesion } from '../types';
import type {
  BibliotecaContextValue,
  LibroConCola,
  ResultadoEntrega,
  ResultadoLogin,
  ResultadoReserva,
} from '../types/biblioteca';

export const USUARIO = 'yo';

// TP: credenciales fijas para el mostrador académico
const USUARIO_MOSTRADOR = 'biblioteca';
const CLAVE_MOSTRADOR = 'ipf2026';

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
  const [version, forzar] = useReducer((n: number) => n + 1, 0);
  const { programar, cancelar } = useRecordatorio();
  // la app solo modela al alumno ('yo'); para el resto alcanza con contar cuántos ejemplares
  // se llevaron por isbn, así ejemplaresDisponibles baja sin inventar un modelo de usuarios
  const [prestamosExternos, setPrestamosExternos] = useState<Record<string, number>>({});
  const [sesion, setSesion] = useState<Sesion | null>(null);
  // hasta leer AsyncStorage no se pinta nada: si no, se ve un instante la app vacía
  // y los efectos de guardado pisarían lo persistido con los valores iniciales
  const [cargandoHidratacion, setCargandoHidratacion] = useState(true);

  // las colas de espera no se persisten a propósito: son el seed de A2 y al reabrir
  // la app la biblioteca arranca con las listas iniciales
  useEffect(() => {
    let cancelado = false;
    Promise.all([
      leer<Prestamo[]>(CLAVES.prestamos, []),
      leer<string[]>(CLAVES.vistos, []),
      leer<Record<string, number>>(CLAVES.prestamosExternos, {}),
      leer<Sesion | null>(CLAVES.sesion, null),
    ]).then(([prestamosGuardados, vistosGuardados, externosGuardados, sesionGuardada]) => {
      if (cancelado) return;
      vistosGuardados.forEach((isbn) => vistos.apilar(isbn));
      setPrestamos(prestamosGuardados);
      setPrestamosExternos(externosGuardados);
      setSesion(sesionGuardada);
      setCargandoHidratacion(false);
    });
    return () => {
      cancelado = true;
    };
  }, [vistos]);

  useEffect(() => {
    if (!cargandoHidratacion) guardar(CLAVES.prestamos, prestamos).catch(noop);
  }, [cargandoHidratacion, prestamos]);

  useEffect(() => {
    // la Pila no cambia de identidad al apilar; version es lo que avisa que hubo cambios
    if (!cargandoHidratacion) guardar(CLAVES.vistos, vistos.aArray()).catch(noop);
  }, [cargandoHidratacion, version, vistos]);

  useEffect(() => {
    if (!cargandoHidratacion) guardar(CLAVES.prestamosExternos, prestamosExternos).catch(noop);
  }, [cargandoHidratacion, prestamosExternos]);

  useEffect(() => {
    if (!cargandoHidratacion) guardar(CLAVES.sesion, sesion).catch(noop);
  }, [cargandoHidratacion, sesion]);

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
      const externos = prestamosExternos[isbn] ?? 0;
      return Math.max(0, libro.ejemplares - prestados - externos);
    },
    [prestamos, prestamosExternos],
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

  const devolver = useCallback(
    (isbn: string) => {
      const prestamo = prestamos.find((p) => p.isbn === isbn);
      if (prestamo) cancelar(prestamo.notificacionId).catch(noop);
      // si hay cola para este libro no se desencola aca, eso lo hace el mostrador (fase 6)
      setPrestamos((actuales) => actuales.filter((p) => p.isbn !== isbn));
    },
    [prestamos, cancelar],
  );

  const activarRecordatorio = useCallback(
    async (isbn: string, activo: boolean) => {
      const prestamo = prestamos.find((p) => p.isbn === isbn);
      if (!prestamo) return;

      let notificacionId: string | null = null;
      if (activo) {
        if (prestamo.notificacionId !== null) return;
        const libro = LIBROS.find((l) => l.isbn === isbn);
        notificacionId = await programar(isbn, libro?.titulo ?? isbn);
      } else {
        await cancelar(prestamo.notificacionId);
      }

      setPrestamos((actuales) =>
        actuales.map((p) => (p.isbn === isbn ? { ...p, notificacionId } : p)),
      );
    },
    [prestamos, programar, cancelar],
  );

  const librosConCola = useCallback(() => {
    const libros: LibroConCola[] = [];
    listasEspera.forEach((cola, isbn) => {
      const siguiente = cola.frente();
      const libro = LIBROS.find((l) => l.isbn === isbn);
      if (siguiente === undefined || !libro) return;
      libros.push({
        isbn,
        titulo: libro.titulo,
        autor: libro.autor,
        siguiente,
        cuantosEsperan: cola.tamanio,
      });
    });
    return libros;
  }, [listasEspera]);

  const entregarAlSiguiente = useCallback(
    (isbn: string): ResultadoEntrega | null => {
      const siguiente = listasEspera.get(isbn)?.desencolar();
      if (siguiente === undefined) return null;

      if (siguiente === USUARIO) {
        setPrestamos((actuales) => [
          ...actuales,
          { isbn, desde: new Date().toISOString(), hasta: sumarDias(7), notificacionId: null },
        ]);
      } else {
        setPrestamosExternos((actuales) => ({ ...actuales, [isbn]: (actuales[isbn] ?? 0) + 1 }));
      }
      forzar();
      return { entregado: siguiente, siguienteSoyYo: siguiente === USUARIO };
    },
    [listasEspera],
  );

  const iniciarSesion = useCallback((usuario: string, clave: string): ResultadoLogin => {
    if (usuario !== USUARIO_MOSTRADOR || clave !== CLAVE_MOSTRADOR) {
      return { ok: false, razon: 'credenciales' };
    }
    setSesion({ usuario, desde: new Date().toISOString() });
    return { ok: true };
  }, []);

  const cerrarSesion = useCallback(() => setSesion(null), []);

  const valor: BibliotecaContextValue = {
    prestamos,
    recientes: vistos.aArray().reverse(),
    sesion,
    reservar,
    devolver,
    verLibro,
    ejemplaresDisponibles,
    tamanioEspera,
    miPosicion,
    estaPrestado,
    misReservasEnEspera,
    activarRecordatorio,
    librosConCola,
    entregarAlSiguiente,
    iniciarSesion,
    cerrarSesion,
  };

  if (cargandoHidratacion) {
    return <EstadoCargando texto="Iniciando…" />;
  }

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
