import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colores, espaciado, tipografia } from '../constants/tema';
import { useBiblioteca } from '../context/BibliotecaProvider';

export function LinkPersonal() {
  const { sesion } = useBiblioteca();
  const haySesion = sesion !== null;

  return (
    <Link href={haySesion ? '/mostrador' : '/login'} asChild>
      <Pressable
        accessibilityRole="link"
        accessibilityLabel={haySesion ? 'Ir al mostrador' : 'Ingreso del personal'}
        hitSlop={8}
        style={styles.link}
      >
        <Text style={styles.texto}>{haySesion ? 'Mostrador' : 'Personal'}</Text>
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
