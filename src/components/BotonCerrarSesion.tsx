import { Pressable, StyleSheet, Text } from 'react-native';

import { colores, espaciado, tipografia } from '../constants/tema';

type Props = {
  onPress: () => void;
};

export function BotonCerrarSesion({ onPress }: Props) {
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

const styles = StyleSheet.create({
  boton: {
    minHeight: 44,
    minWidth: 44,
    justifyContent: 'center',
    paddingHorizontal: espaciado.s,
  },
  texto: {
    ...tipografia.cuerpo,
    fontWeight: '600',
    color: colores.claro.error,
  },
});
