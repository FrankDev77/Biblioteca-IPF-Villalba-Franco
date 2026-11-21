import { describe, expect, test } from '@jest/globals';

import { Cola } from '../Cola';

describe('Cola', () => {
  test('encolar y desencolar respetan FIFO', () => {
    const cola = new Cola<string>();
    cola.encolar('Ana');
    cola.encolar('Juan');

    expect(cola.frente()).toBe('Ana');
    expect(cola.desencolar()).toBe('Ana');
    expect(cola.desencolar()).toBe('Juan');
  });

  test('cola vacía: desencolar devuelve undefined y estaVacia es true', () => {
    const cola = new Cola<string>();

    expect(cola.estaVacia()).toBe(true);
    expect(cola.desencolar()).toBeUndefined();
    expect(cola.tamanio).toBe(0);
  });

  test('desencolar varias veces mantiene el orden y baja el tamanio', () => {
    const cola = new Cola<number>();
    [1, 2, 3, 4].forEach((n) => cola.encolar(n));

    expect(cola.desencolar()).toBe(1);
    expect(cola.tamanio).toBe(3);
    expect(cola.desencolar()).toBe(2);
    expect(cola.tamanio).toBe(2);
    expect(cola.aArray()).toEqual([3, 4]);
  });

  test('sigue en orden después de compactar el array interno', () => {
    const cola = new Cola<number>();
    for (let i = 0; i < 100; i += 1) cola.encolar(i);
    for (let i = 0; i < 60; i += 1) cola.desencolar();

    expect(cola.tamanio).toBe(40);
    expect(cola.frente()).toBe(60);
    expect(cola.incluye((n) => n === 99)).toBe(true);
    expect(cola.incluye((n) => n === 10)).toBe(false);
  });
});
