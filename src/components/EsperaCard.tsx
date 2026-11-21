import { StyleSheet, Text, View } from 'react-native';

import { espaciado, radios, tipografia, type Paleta } from '../constants/tema';
import { useEstilos } from '../hooks/useEstilos';
import { LIBROS } from '../data/libros';
import type { ReservaEnEspera } from '../types';

type Props = {
  reserva: ReservaEnEspera;
};

export function EsperaCard({ reserva }: Props) {
  const styles = useEstilos(crearEstilos);
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

const crearEstilos = (paleta: Paleta) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: espaciado.l,
      borderRadius: radios.m,
      backgroundColor: paleta.superficie,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: paleta.borde,
    },
    titulo: {
      ...tipografia.subtitulo,
      flex: 1,
      marginRight: espaciado.m,
      color: paleta.texto,
    },
    badge: {
      paddingHorizontal: espaciado.m,
      paddingVertical: espaciado.xs,
      borderRadius: radios.pill,
      backgroundColor: paleta.primarioSuave,
    },
    badgeTexto: {
      ...tipografia.pie,
      fontWeight: '600',
      color: paleta.primario,
    },
  });
