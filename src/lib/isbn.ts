import { LIBROS } from '../data/libros';
import type { Libro } from '../types';

const ISBN_13 = /^\d{13}$/;

export function esIsbnValido(codigo: string): boolean {
  return ISBN_13.test(codigo);
}

export function buscarEnCatalogo(codigo: string): Libro | undefined {
  if (!esIsbnValido(codigo)) return undefined;
  return LIBROS.find((l) => l.isbn === codigo);
}
