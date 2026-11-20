import { StyleSheet, Text, View } from 'react-native';

import { colores, espaciado, tipografia } from '../constants/tema';

type Props = {
  titulo: string;
  detalle?: string;
};

export function PantallaPlaceholder({ titulo, detalle }: Props) {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo} accessibilityRole="header">
        {titulo}
      </Text>
      {detalle ? <Text style={styles.detalle}>{detalle}</Text> : null}
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
  titulo: {
    ...tipografia.titulo,
    color: colores.claro.texto,
  },
  detalle: {
    ...tipografia.cuerpo,
    color: colores.claro.textoSuave,
    marginTop: espaciado.s,
  },
});
