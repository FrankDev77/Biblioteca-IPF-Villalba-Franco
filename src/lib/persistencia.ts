import AsyncStorage from '@react-native-async-storage/async-storage';

export const CLAVES = {
  prestamos: 'biblioteca:prestamos',
  vistos: 'biblioteca:vistos',
  prestamosExternos: 'biblioteca:prestamosExternos',
  sesion: 'biblioteca:sesion',
} as const;

export async function guardar<T>(clave: string, valor: T): Promise<void> {
  await AsyncStorage.setItem(clave, JSON.stringify(valor));
}

export async function leer<T>(clave: string, fallback: T): Promise<T> {
  try {
    const crudo = await AsyncStorage.getItem(clave);
    return crudo === null ? fallback : (JSON.parse(crudo) as T);
  } catch {
    return fallback;
  }
}
