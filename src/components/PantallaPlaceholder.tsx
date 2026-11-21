import { StyleSheet, Text, View } from 'react-native';

import { espaciado, tipografia, type Paleta } from '../constants/tema';
import { useEstilos } from '../hooks/useEstilos';

type Props = {
  titulo: string;
  detalle?: string;
};

export function PantallaPlaceholder({ titulo, detalle }: Props) {
  const styles = useEstilos(crearEstilos);
  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo} accessibilityRole="header">
        {titulo}
      </Text>
      {detalle ? <Text style={styles.detalle}>{detalle}</Text> : null}
    </View>
  );
}

const crearEstilos = (paleta: Paleta) =>
  StyleSheet.create({
    contenedor: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: espaciado.xl,
      backgroundColor: paleta.fondo,
    },
    titulo: {
      ...tipografia.titulo,
      color: paleta.texto,
    },
    detalle: {
      ...tipografia.cuerpo,
      color: paleta.textoSuave,
      marginTop: espaciado.s,
    },
  });
