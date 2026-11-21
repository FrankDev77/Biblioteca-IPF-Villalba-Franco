import type { Prestamo, ReservaEnEspera, Sesion } from './index';

export type ResultadoReserva =
  | { ok: true; tipo: 'prestamo'; hasta: string }
  | { ok: true; tipo: 'cola'; posicion: number }
  | { ok: false; razon: 'ya-prestado' | 'ya-en-cola' };

export type EstadoVencimiento = 'vigente' | 'por-vencer' | 'vencido';

export type BibliotecaContextValue = {
  prestamos: Prestamo[];
  recientes: string[];
  sesion: Sesion | null;
  reservar: (isbn: string) => ResultadoReserva;
  devolver: (isbn: string) => void;
  verLibro: (isbn: string) => void;
  ejemplaresDisponibles: (isbn: string) => number;
  tamanioEspera: (isbn: string) => number;
  miPosicion: (isbn: string) => number | null;
  estaPrestado: (isbn: string) => boolean;
  misReservasEnEspera: () => ReservaEnEspera[];
  iniciarSesion: (usuario: string) => void;
  cerrarSesion: () => void;
};
