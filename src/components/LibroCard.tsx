import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colores, espaciado, radios, sombras, tipografia } from '../constants/tema';
import type { Libro } from '../types';

type Props = {
  libro: Libro;
  onPress: () => void;
};

function textoEjemplares(cantidad: number) {
  if (cantidad === 0) return 'Sin ejemplares';
  return cantidad === 1 ? '1 ejemplar' : `${cantidad} ejemplares`;
}

export function LibroCard({ libro, onPress }: Props) {
  const disponible = libro.ejemplares > 0;
  const ejemplares = textoEjemplares(libro.ejemplares);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${libro.titulo}, de ${libro.autor}, ${libro.anio}. ${ejemplares}`}
      accessibilityHint="Abre el detalle del libro"
      style={({ pressed }) => [styles.card, pressed && styles.cardPresionada]}
    >
      <View style={styles.info}>
        <Text style={styles.titulo} numberOfLines={2}>
          {libro.titulo}
        </Text>
        <Text style={styles.autor} numberOfLines={1}>
          {libro.autor}
        </Text>
        <Text style={styles.anio}>{libro.anio}</Text>
      </View>
      <View style={[styles.badge, disponible ? styles.badgeDisponible : styles.badgeAgotado]}>
        <Text style={[styles.badgeTexto, disponible ? styles.badgeTextoDisponible : styles.badgeTextoAgotado]}>
          {ejemplares}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    padding: espaciado.l,
    borderRadius: radios.m,
    backgroundColor: colores.claro.superficie,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colores.claro.borde,
    ...sombras.card,
  },
  cardPresionada: {
    opacity: 0.7,
  },
  info: {
    flex: 1,
    marginRight: espaciado.m,
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
  anio: {
    ...tipografia.pie,
    color: colores.claro.textoSuave,
    marginTop: espaciado.xs,
  },
  badge: {
    paddingHorizontal: espaciado.m,
    paddingVertical: espaciado.xs,
    borderRadius: radios.pill,
  },
  badgeDisponible: {
    backgroundColor: colores.claro.exito,
  },
  badgeAgotado: {
    backgroundColor: colores.claro.silueta,
  },
  badgeTexto: {
    ...tipografia.pie,
    fontWeight: '600',
  },
  badgeTextoDisponible: {
    color: colores.claro.superficie,
  },
  badgeTextoAgotado: {
    color: colores.claro.textoSuave,
  },
});
