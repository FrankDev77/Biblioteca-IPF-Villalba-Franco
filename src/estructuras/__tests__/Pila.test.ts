import { describe, expect, test } from '@jest/globals';

import { Pila } from '../Pila';

describe('Pila', () => {
  test('apilar incrementa el tamanio y tope devuelve el último', () => {
    const pila = new Pila<string>();
    pila.apilar('a');
    pila.apilar('b');

    expect(pila.tamanio).toBe(2);
    expect(pila.tope()).toBe('b');
  });

  test('desapilar devuelve el tope y decrementa el tamanio', () => {
    const pila = new Pila<number>();
    pila.apilar(1);
    pila.apilar(2);

    expect(pila.desapilar()).toBe(2);
    expect(pila.tamanio).toBe(1);
    expect(pila.tope()).toBe(1);
  });

  test('aArray devuelve una copia y no la referencia interna', () => {
    const pila = new Pila<string>();
    pila.apilar('a');

    const copia = pila.aArray();
    copia.push('intruso');
    copia.length = 0;

    expect(pila.tamanio).toBe(1);
    expect(pila.aArray()).toEqual(['a']);
  });

  test('pila vacía: desapilar y tope devuelven undefined', () => {
    const pila = new Pila<string>();

    expect(pila.estaVacia()).toBe(true);
    expect(pila.desapilar()).toBeUndefined();
    expect(pila.tope()).toBeUndefined();
  });
});
