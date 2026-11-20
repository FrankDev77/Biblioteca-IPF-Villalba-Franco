export class Pila<T> {
  #items: T[] = [];

  apilar(item: T): void {
    this.#items.push(item);
  }

  desapilar(): T | undefined {
    return this.#items.pop();
  }

  tope(): T | undefined {
    return this.#items.at(-1);
  }

  get tamanio(): number {
    return this.#items.length;
  }

  estaVacia(): boolean {
    return this.#items.length === 0;
  }

  aArray(): T[] {
    return [...this.#items];
  }
}