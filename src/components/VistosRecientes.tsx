import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colores, espaciado, radios, tipografia } from '../constants/tema';
import { LIBROS } from '../data/libros';
import type { Libro } from '../types';

type Props = {
  recientes: string[];
};

export function VistosRecientes({ recientes }: Props) {
  if (recientes.length === 0) return null;

  const libros = recientes
    .slice(0, 3)
    .map((isbn) => LIBROS.find((l) => l.isbn === isbn))
    .filter((l): l is Libro => l !== undefined);

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo} accessibilityRole="header">
        Vistos recientemente
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.fila}
      >
        {libros.map((libro) => (
          <Pressable
            key={libro.isbn}
            onPress={() => router.push({ pathname: '/libro/[isbn]', params: { isbn: libro.isbn } })}
            accessibilityRole="button"
            accessibilityLabel={`Ver ${libro.titulo}`}
            style={({ pressed }) => [styles.chip, pressed && styles.chipPresionado]}
          >
            <Text style={styles.chipTexto} numberOfLines={1}>
              {libro.titulo}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    marginTop: espaciado.l,
  },
  titulo: {
    ...tipografia.pie,
    fontWeight: '600',
    color: colores.claro.textoSuave,
    marginBottom: espaciado.s,
  },
  fila: {
    gap: espaciado.s,
  },
  chip: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: espaciado.l,
    borderRadius: radios.pill,
    backgroundColor: colores.claro.primarioSuave,
  },
  chipPresionado: {
    opacity: 0.7,
  },
  chipTexto: {
    ...tipografia.cuerpo,
    fontWeight: '600',
    color: colores.claro.primario,
  },
});
