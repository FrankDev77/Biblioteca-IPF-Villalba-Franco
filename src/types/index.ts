export type Libro = {
  isbn: string;
  titulo: string;
  autor: string;
  anio: number;
  ejemplares: number;
};

export type Prestamo = {
  isbn: string;
  desde: string;
  hasta: string;
  notificacionId: string | null;
};

export type ReservaEnEspera = {
  isbn: string;
  posicion: number;
};

export type Sesion = {
  usuario: string;
  desde: string;
};

export type Recurso = 'camara' | 'notificaciones';