import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { espaciado, tipografia, type Paleta } from '../constants/tema';
import { useEstilos } from '../hooks/useEstilos';
import { useTema } from '../hooks/useTema';

type Props = {
  texto?: string;
};

export function EstadoCargando({ texto = 'Cargando catálogo…' }: Props) {
  const styles = useEstilos(crearEstilos);
  const { paleta } = useTema();
  return (
    <View
      style={styles.contenedor}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={texto}
      accessibilityState={{ busy: true }}
    >
      <ActivityIndicator size="large" color={paleta.primario} />
      <Text style={styles.texto}>{texto}</Text>
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
    texto: {
      ...tipografia.cuerpo,
      color: paleta.textoSuave,
      marginTop: espaciado.m,
    },
  });
