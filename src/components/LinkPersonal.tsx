import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colores, espaciado, tipografia } from '../constants/tema';

export function LinkPersonal() {
  return (
    <Link href="/login" asChild>
      <Pressable
        accessibilityRole="link"
        accessibilityLabel="Ingreso del personal"
        style={styles.link}
      >
        <Text style={styles.texto}>Personal</Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  link: {
    minHeight: 44,
    minWidth: 44,
    justifyContent: 'center',
    paddingHorizontal: espaciado.l,
  },
  texto: {
    ...tipografia.cuerpo,
    fontWeight: '600',
    color: colores.claro.primario,
  },
});
