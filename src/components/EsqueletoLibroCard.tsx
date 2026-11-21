import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { espaciado, radios, type Paleta } from '../constants/tema';
import { useEstilos } from '../hooks/useEstilos';
import { useReducirMovimiento } from '../hooks/useReducirMovimiento';

export function EsqueletoLibroCard() {
  const styles = useEstilos(crearEstilos);
  const reducirMovimiento = useReducirMovimiento();
  const opacidad = useSharedValue(1);

  useEffect(() => {
    if (reducirMovimiento) {
      cancelAnimation(opacidad);
      opacidad.set(1);
      return;
    }
    opacidad.set(withRepeat(withTiming(0.6, { duration: 300 }), -1, true));
    return () => cancelAnimation(opacidad);
  }, [opacidad, reducirMovimiento]);

  const estiloPulso = useAnimatedStyle(() => ({ opacity: opacidad.get() }));

  return (
    <Animated.View style={[styles.card, estiloPulso]}>
      <View style={styles.portada} />
      <View style={styles.info}>
        <View style={[styles.linea, styles.lineaTitulo]} />
        <View style={[styles.linea, styles.lineaAutor]} />
        <View style={[styles.linea, styles.lineaAnio]} />
      </View>
    </Animated.View>
  );
}

const crearEstilos = (paleta: Paleta) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: espaciado.l,
      borderRadius: radios.m,
      backgroundColor: paleta.superficie,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: paleta.borde,
    },
    portada: {
      width: 40,
      height: 60,
      marginRight: espaciado.m,
      borderRadius: radios.s,
      backgroundColor: paleta.silueta,
    },
    info: {
      flex: 1,
      gap: espaciado.s,
    },
    linea: {
      height: 12,
      borderRadius: radios.s,
      backgroundColor: paleta.silueta,
    },
    lineaTitulo: {
      width: '75%',
      height: 16,
    },
    lineaAutor: {
      width: '50%',
    },
    lineaAnio: {
      width: '20%',
    },
  });
