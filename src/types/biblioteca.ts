import type { Prestamo, Sesion } from './index';

export type BibliotecaContextValue = {
  prestamos: Prestamo[];
  recientes: string[];
  sesion: Sesion | null;
  reservar: (isbn: string) => void;
  devolver: (isbn: string) => void;
  verLibro: (isbn: string) => void;
  tamanioEspera: (isbn: string) => number;
  iniciarSesion: (usuario: string) => void;
  cerrarSesion: () => void;
};
