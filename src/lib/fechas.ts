import type { EstadoVencimiento } from '../types/biblioteca';

const MS_POR_DIA = 24 * 60 * 60 * 1000;

const formatoFecha = new Intl.DateTimeFormat('es-AR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export function sumarDias(dias: number): string {
  return new Date(Date.now() + dias * MS_POR_DIA).toISOString();
}

export function formatearFecha(iso: string): string {
  return formatoFecha.format(new Date(iso));
}

export function estadoVencimiento(iso: string): EstadoVencimiento {
  const resta = new Date(iso).getTime() - Date.now();
  if (resta < 0) return 'vencido';
  if (resta <= MS_POR_DIA) return 'por-vencer';
  return 'vigente';
}
