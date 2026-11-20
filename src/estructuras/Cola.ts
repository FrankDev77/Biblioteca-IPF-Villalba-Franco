export class Cola<T> {
  #items: T[] = [];
  #inicio = 0;

  encolar(item: T): void {
    this.#items.push(item);
  }

  desencolar(): T | undefined {
    if (this.#inicio >= this.#items.length) return undefined;
    const item = this.#items[this.#inicio];
    this.#inicio += 1;
    if (this.#inicio > 32 && this.#inicio * 2 > this.#items.length) {
      this.#items = this.#items.slice(this.#inicio);
      this.#inicio = 0;
    }
    return item;
  }

  frente(): T | undefined {
    return this.#items[this.#inicio];
  }

  get tamanio(): number {
    return this.#items.length - this.#inicio;
  }

  estaVacia(): boolean {
    return this.tamanio === 0;
  }

  aArray(): T[] {
    return this.#items.slice(this.#inicio);
  }

  incluye(predicado: (item: T) => boolean): boolean {
    for (let i = this.#inicio; i < this.#items.length; i += 1) {
      if (predicado(this.#items[i])) return true;
    }
    return false;
  }
}