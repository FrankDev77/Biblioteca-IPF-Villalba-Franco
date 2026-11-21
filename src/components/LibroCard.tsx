import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

import { espaciado, radios, sombras, tipografia, type Paleta } from '../constants/tema';
import { useEstilos } from '../hooks/useEstilos';
import { useReducirMovimiento } from '../hooks/useReducirMovimiento';
import * as haptica from '../lib/haptica';
import type { Libro } from '../types';
import { PortadaLibro } from './PortadaLibro';

type Props = {
  libro: Libro;
  onPress: () => void;
  indice?: number;
};

function textoEjemplares(cantidad: number) {
  if (cantidad === 0) return 'Sin ejemplares';
  return cantidad === 1 ? '1 ejemplar' : `${cantidad} ejemplares`;
}

export function LibroCard({ libro, onPress, indice = 0 }: Props) {
  const styles = useEstilos(crearEstilos);
  const reducirMovimiento = useReducirMovimiento();
  const entrada = useSharedValue(0);
  const disponible = libro.ejemplares > 0;
  const ejemplares = textoEjemplares(libro.ejemplares);

  useEffect(() => {
    if (reducirMovimiento) {
      entrada.set(1);
      return;
    }
    // tope en 10 para que las últimas cards de una lista larga no esperen casi un segundo
    entrada.set(withDelay(Math.min(indice, 10) * 40, withTiming(1, { duration: 280 })));
  }, [entrada, indice, reducirMovimiento]);

  const estiloEntrada = useAnimatedStyle(() => ({
    opacity: entrada.get(),
    transform: [{ translateY: (1 - entrada.get()) * 12 }],
  }));

  const tocar = () => {
    void haptica.impactoLigero();
    onPress();
  };

  return (
    <Animated.View style={estiloEntrada}>
      <Pressable
        onPress={tocar}
        accessibilityRole="button"
        accessibilityLabel={`${libro.titulo}, de ${libro.autor}, ${libro.anio}. ${ejemplares}`}
        accessibilityHint="Abre el detalle del libro"
        style={({ pressed }) => [styles.card, pressed && styles.cardPresionada]}
      >
        <PortadaLibro isbn={libro.isbn} size="chica" titulo={libro.titulo} style={styles.portada} />
        <View style={styles.info}>
          <Text style={styles.titulo} numberOfLines={2}>
            {libro.titulo}
          </Text>
          <Text style={styles.autor} numberOfLines={1}>
            {libro.autor}
          </Text>
          <Text style={styles.anio}>{libro.anio}</Text>
        </View>
        <View style={[styles.badge, disponible ? styles.badgeDisponible : styles.badgeAgotado]}>
          <Text style={[styles.badgeTexto, disponible ? styles.badgeTextoDisponible : styles.badgeTextoAgotado]}>
            {ejemplares}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const crearEstilos = (paleta: Paleta) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: 44,
      padding: espaciado.l,
      borderRadius: radios.m,
      backgroundColor: paleta.superficie,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: paleta.borde,
      ...sombras.card,
    },
    cardPresionada: {
      opacity: 0.7,
    },
    portada: {
      marginRight: espaciado.m,
    },
    info: {
      flex: 1,
      marginRight: espaciado.m,
    },
    titulo: {
      ...tipografia.subtitulo,
      color: paleta.texto,
    },
    autor: {
      ...tipografia.cuerpo,
      color: paleta.textoSuave,
      marginTop: espaciado.xs,
    },
    anio: {
      ...tipografia.pie,
      color: paleta.textoSuave,
      marginTop: espaciado.xs,
    },
    badge: {
      paddingHorizontal: espaciado.m,
      paddingVertical: espaciado.xs,
      borderRadius: radios.pill,
    },
    badgeDisponible: {
      backgroundColor: paleta.exito,
    },
    badgeAgotado: {
      backgroundColor: paleta.silueta,
    },
    badgeTexto: {
      ...tipografia.pie,
      fontWeight: '600',
    },
    badgeTextoDisponible: {
      color: paleta.textoSobreExito,
    },
    badgeTextoAgotado: {
      color: paleta.textoSuave,
    },
  });
