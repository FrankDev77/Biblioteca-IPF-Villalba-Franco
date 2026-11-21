import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colores, espaciado, radios, sombras, tipografia } from '../constants/tema';
import type { LibroConCola } from '../types/biblioteca';

type Props = {
  libro: LibroConCola;
  onEntregar: (libro: LibroConCola) => void;
};

export function ItemMostrador({ libro, onEntregar }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.titulo}>{libro.titulo}</Text>
      <Text style={styles.autor}>{libro.autor}</Text>
      <View style={styles.fila}>
        <Text style={styles.dato}>Al frente: {libro.siguiente}</Text>
        <Text style={styles.dato}>Esperan: {libro.cuantosEsperan}</Text>
      </View>
      <Pressable
        onPress={() => onEntregar(libro)}
        accessibilityRole="button"
        accessibilityLabel={`Entregar ${libro.titulo} a ${libro.siguiente}`}
        style={({ pressed }) => [styles.boton, pressed && styles.botonPresionado]}
      >
        <Text style={styles.botonTexto}>Entregar al siguiente</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: espaciado.l,
    borderRadius: radios.m,
    backgroundColor: colores.claro.superficie,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colores.claro.borde,
    ...sombras.card,
  },
  titulo: {
    ...tipografia.subtitulo,
    color: colores.claro.texto,
  },
  autor: {
    ...tipografia.cuerpo,
    color: colores.claro.textoSuave,
    marginTop: espaciado.xs,
  },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: espaciado.m,
  },
  dato: {
    ...tipografia.cuerpo,
    color: colores.claro.texto,
  },
  boton: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: espaciado.m,
    borderRadius: radios.m,
    backgroundColor: colores.claro.primario,
  },
  botonPresionado: {
    opacity: 0.8,
  },
  botonTexto: {
    ...tipografia.cuerpo,
    fontWeight: '600',
    color: colores.claro.superficie,
  },
});
