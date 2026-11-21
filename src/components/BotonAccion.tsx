import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colores, espaciado, radios, tipografia } from '../constants/tema';

type Props = {
  texto: string;
  icono: ComponentProps<typeof Ionicons>['name'];
  onPress: () => void;
};

export function BotonAccion({ texto, icono, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={texto}
      style={({ pressed }) => [styles.boton, pressed && styles.botonPresionado]}
    >
      <Ionicons
        name={icono}
        size={24}
        color={colores.claro.superficie}
        accessibilityElementsHidden
        importantForAccessibility="no"
      />
      <Text style={styles.texto}>{texto}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  boton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    gap: espaciado.s,
    borderRadius: radios.m,
    backgroundColor: colores.claro.primario,
  },
  botonPresionado: {
    opacity: 0.8,
  },
  texto: {
    ...tipografia.subtitulo,
    color: colores.claro.superficie,
  },
});
