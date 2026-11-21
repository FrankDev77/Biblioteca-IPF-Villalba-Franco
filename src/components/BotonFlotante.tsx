import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colores, espaciado, radios, sombras, tipografia } from '../constants/tema';

type Props = {
  texto: string;
  icono: ComponentProps<typeof Ionicons>['name'];
  onPress: () => void;
};

export function BotonFlotante({ texto, icono, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={texto}
      style={({ pressed }) => [styles.boton, pressed && styles.botonPresionado]}
    >
      <Ionicons
        name={icono}
        size={20}
        color={colores.claro.primario}
        accessibilityElementsHidden
        importantForAccessibility="no"
      />
      <Text style={styles.texto}>{texto}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  boton: {
    position: 'absolute',
    bottom: espaciado.xxl,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaciado.s,
    minHeight: 48,
    paddingHorizontal: espaciado.xl,
    borderRadius: radios.pill,
    backgroundColor: colores.claro.superficie,
    ...sombras.card,
  },
  botonPresionado: {
    opacity: 0.85,
  },
  texto: {
    ...tipografia.cuerpo,
    fontWeight: '600',
    color: colores.claro.primario,
  },
});
