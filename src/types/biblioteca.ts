import type { Libro, Prestamo, Sesion } from './index';

export type BibliotecaContextValue = {
  prestamos: Prestamo[];
  recientes: Libro[];
  sesion: Sesion | null;
  reservar: (isbn: string) => void;
  devolver: (isbn: string) => void;
  agregarReciente: (libro: Libro) => void;
  iniciarSesion: (usuario: string) => void;
  cerrarSesion: () => void;
};
