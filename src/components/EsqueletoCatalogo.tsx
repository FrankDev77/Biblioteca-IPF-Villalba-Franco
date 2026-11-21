import { StyleSheet, View } from 'react-native';

import { espaciado, type Paleta } from '../constants/tema';
import { useEstilos } from '../hooks/useEstilos';
import { EsqueletoLibroCard } from './EsqueletoLibroCard';

const CANTIDAD = 6;

export function EsqueletoCatalogo() {
  const styles = useEstilos(crearEstilos);

  return (
    <View
      style={styles.contenedor}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel="Cargando catálogo"
      accessibilityState={{ busy: true }}
    >
      {Array.from({ length: CANTIDAD }, (_, i) => (
        <View key={i} style={i > 0 ? styles.separado : undefined}>
          <EsqueletoLibroCard />
        </View>
      ))}
    </View>
  );
}

const crearEstilos = (paleta: Paleta) =>
  StyleSheet.create({
    contenedor: {
      flex: 1,
      padding: espaciado.l,
      backgroundColor: paleta.fondo,
    },
    separado: {
      marginTop: espaciado.m,
    },
  });
