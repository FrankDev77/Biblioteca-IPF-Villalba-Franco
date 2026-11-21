import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { espaciado, tipografia, type Paleta } from '../constants/tema';
import { useEstilos } from '../hooks/useEstilos';
import { useBiblioteca } from '../context/BibliotecaProvider';

export function LinkPersonal() {
  const styles = useEstilos(crearEstilos);
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

const crearEstilos = (paleta: Paleta) =>
  StyleSheet.create({
    link: {
      minHeight: 44,
      minWidth: 44,
      justifyContent: 'center',
      paddingHorizontal: espaciado.l,
    },
    texto: {
      ...tipografia.cuerpo,
      fontWeight: '600',
      color: paleta.primario,
    },
  });
