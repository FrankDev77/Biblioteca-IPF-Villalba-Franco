import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { espaciado, radios, tipografia, type Paleta } from '../constants/tema';
import { useEstilos } from '../hooks/useEstilos';
import { useTema } from '../hooks/useTema';
import * as haptica from '../lib/haptica';

type Props = {
  texto: string;
  icono: ComponentProps<typeof Ionicons>['name'];
  onPress: () => void;
};

export function BotonAccion({ texto, icono, onPress }: Props) {
  const styles = useEstilos(crearEstilos);
  const { paleta } = useTema();
  return (
    <Pressable
      onPress={() => {
        void haptica.impactoLigero();
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel={texto}
      style={({ pressed }) => [styles.boton, pressed && styles.botonPresionado]}
    >
      <Ionicons
        name={icono}
        size={24}
        color={paleta.textoSobrePrimario}
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
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 56,
      gap: espaciado.s,
      borderRadius: radios.m,
      backgroundColor: paleta.primario,
    },
    botonPresionado: {
      opacity: 0.8,
    },
    texto: {
      ...tipografia.subtitulo,
      color: paleta.textoSobrePrimario,
    },
  });
