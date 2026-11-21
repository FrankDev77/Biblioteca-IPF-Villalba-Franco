import { StyleSheet, Text, View } from 'react-native';

import { colores, espaciado, radios, tipografia } from '../constants/tema';
import { LIBROS } from '../data/libros';
import type { ReservaEnEspera } from '../types';

type Props = {
  reserva: ReservaEnEspera;
};

export function EsperaCard({ reserva }: Props) {
  const libro = LIBROS.find((l) => l.isbn === reserva.isbn);

  return (
    <View style={styles.card}>
      <Text style={styles.titulo} numberOfLines={2}>
        {libro?.titulo ?? reserva.isbn}
      </Text>
      <View style={styles.badge}>
        <Text style={styles.badgeTexto}>Posición {reserva.posicion}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: espaciado.l,
    borderRadius: radios.m,
    backgroundColor: colores.claro.superficie,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colores.claro.borde,
  },
  titulo: {
    ...tipografia.subtitulo,
    flex: 1,
    marginRight: espaciado.m,
    color: colores.claro.texto,
  },
  badge: {
    paddingHorizontal: espaciado.m,
    paddingVertical: espaciado.xs,
    borderRadius: radios.pill,
    backgroundColor: colores.claro.primarioSuave,
  },
  badgeTexto: {
    ...tipografia.pie,
    fontWeight: '600',
    color: colores.claro.primario,
  },
});
