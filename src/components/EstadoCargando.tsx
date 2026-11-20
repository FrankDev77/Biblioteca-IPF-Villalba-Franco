import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { colores, espaciado, tipografia } from '../constants/tema';

export function EstadoCargando() {
  return (
    <View
      style={styles.contenedor}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel="Cargando catálogo"
      accessibilityState={{ busy: true }}
    >
      <ActivityIndicator size="large" color={colores.claro.primario} />
      <Text style={styles.texto}>Cargando catálogo…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: espaciado.xl,
    backgroundColor: colores.claro.fondo,
  },
  texto: {
    ...tipografia.cuerpo,
    color: colores.claro.textoSuave,
    marginTop: espaciado.m,
  },
});
