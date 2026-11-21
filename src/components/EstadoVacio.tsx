import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

import { espaciado, tipografia, type Paleta } from '../constants/tema';
import { useEstilos } from '../hooks/useEstilos';
import { useTema } from '../hooks/useTema';

type Props = {
  mensaje?: string;
};

export function EstadoVacio({ mensaje = 'No hay libros para mostrar' }: Props) {
  const styles = useEstilos(crearEstilos);
  const { paleta } = useTema();
  return (
    <View style={styles.contenedor}>
      <Ionicons
        name="book-outline"
        size={48}
        color={paleta.textoSuave}
        accessibilityElementsHidden
        importantForAccessibility="no"
      />
      <Text style={styles.texto}>{mensaje}</Text>
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
    },
    texto: {
      ...tipografia.cuerpo,
      color: paleta.textoSuave,
      marginTop: espaciado.m,
      textAlign: 'center',
    },
  });
