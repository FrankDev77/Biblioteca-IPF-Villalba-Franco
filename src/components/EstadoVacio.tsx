import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

import { colores, espaciado, tipografia } from '../constants/tema';

export function EstadoVacio() {
  return (
    <View style={styles.contenedor}>
      <Ionicons
        name="book-outline"
        size={48}
        color={colores.claro.textoSuave}
        accessibilityElementsHidden
        importantForAccessibility="no"
      />
      <Text style={styles.texto}>No hay libros para mostrar</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: espaciado.xl,
  },
  texto: {
    ...tipografia.cuerpo,
    color: colores.claro.textoSuave,
    marginTop: espaciado.m,
    textAlign: 'center',
  },
});
