import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { espaciado, radios, sombras, tipografia, type Paleta } from '../constants/tema';
import { useEstilos } from '../hooks/useEstilos';
import { useTema } from '../hooks/useTema';

type Props = {
  texto: string;
  icono: ComponentProps<typeof Ionicons>['name'];
  onPress: () => void;
};

export function BotonFlotante({ texto, icono, onPress }: Props) {
  const styles = useEstilos(crearEstilos);
  const { paleta } = useTema();
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
        color={paleta.primario}
        accessibilityElementsHidden
        importantForAccessibility="no"
      />
      <Text style={styles.texto}>{texto}</Text>
    </Pressable>
  );
}

const crearEstilos = (paleta: Paleta) =>
  StyleSheet.create({
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
      backgroundColor: paleta.superficie,
      ...sombras.card,
    },
    botonPresionado: {
      opacity: 0.85,
    },
    texto: {
      ...tipografia.cuerpo,
      fontWeight: '600',
      color: paleta.primario,
    },
  });
