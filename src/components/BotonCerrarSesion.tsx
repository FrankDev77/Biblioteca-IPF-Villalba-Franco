import { Pressable, StyleSheet, Text } from 'react-native';

import { espaciado, tipografia, type Paleta } from '../constants/tema';
import { useEstilos } from '../hooks/useEstilos';

type Props = {
  onPress: () => void;
};

export function BotonCerrarSesion({ onPress }: Props) {
  const styles = useEstilos(crearEstilos);
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Cerrar sesión"
      style={styles.boton}
    >
      <Text style={styles.texto}>Cerrar sesión</Text>
    </Pressable>
  );
}

const crearEstilos = (paleta: Paleta) =>
  StyleSheet.create({
    boton: {
      minHeight: 44,
      minWidth: 44,
      justifyContent: 'center',
      paddingHorizontal: espaciado.s,
    },
    texto: {
      ...tipografia.cuerpo,
      fontWeight: '600',
      color: paleta.error,
    },
  });
