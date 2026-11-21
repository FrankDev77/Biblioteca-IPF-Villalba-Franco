import { StyleSheet, Text, View } from 'react-native';

import { espaciado, radios, tipografia, type Paleta } from '../constants/tema';
import { useEstilos } from '../hooks/useEstilos';

const LADO_MARCO = 240;
const LARGO_ESQUINA = 32;
const GROSOR_ESQUINA = 4;

export function MarcoEscaner() {
  const styles = useEstilos(crearEstilos);
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={styles.aviso}>
        <View style={styles.avisoFondo} />
        <Text style={styles.avisoTexto}>Apuntá al código de barras del libro</Text>
      </View>
      <View style={styles.centro}>
        <View style={styles.marco}>
          <View style={[styles.esquina, styles.arribaIzquierda]} />
          <View style={[styles.esquina, styles.arribaDerecha]} />
          <View style={[styles.esquina, styles.abajoIzquierda]} />
          <View style={[styles.esquina, styles.abajoDerecha]} />
        </View>
      </View>
    </View>
  );
}

const crearEstilos = (paleta: Paleta) =>
  StyleSheet.create({
    aviso: {
      position: 'absolute',
      top: espaciado.xl,
      left: espaciado.l,
      right: espaciado.l,
      alignItems: 'center',
      paddingVertical: espaciado.s,
      paddingHorizontal: espaciado.l,
      borderRadius: radios.pill,
      overflow: 'hidden',
    },
    avisoFondo: {
      ...StyleSheet.absoluteFill,
      backgroundColor: paleta.velo,
      opacity: 0.6,
    },
    avisoTexto: {
      ...tipografia.cuerpo,
      fontWeight: '600',
      color: paleta.textoSobreVelo,
      textAlign: 'center',
    },
    centro: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    marco: {
      width: LADO_MARCO,
      height: LADO_MARCO,
      borderRadius: radios.l,
    },
    esquina: {
      position: 'absolute',
      width: LARGO_ESQUINA,
      height: LARGO_ESQUINA,
      borderColor: paleta.textoSobreVelo,
    },
    arribaIzquierda: {
      top: 0,
      left: 0,
      borderTopWidth: GROSOR_ESQUINA,
      borderLeftWidth: GROSOR_ESQUINA,
      borderTopLeftRadius: radios.l,
    },
    arribaDerecha: {
      top: 0,
      right: 0,
      borderTopWidth: GROSOR_ESQUINA,
      borderRightWidth: GROSOR_ESQUINA,
      borderTopRightRadius: radios.l,
    },
    abajoIzquierda: {
      bottom: 0,
      left: 0,
      borderBottomWidth: GROSOR_ESQUINA,
      borderLeftWidth: GROSOR_ESQUINA,
      borderBottomLeftRadius: radios.l,
    },
    abajoDerecha: {
      bottom: 0,
      right: 0,
      borderBottomWidth: GROSOR_ESQUINA,
      borderRightWidth: GROSOR_ESQUINA,
      borderBottomRightRadius: radios.l,
    },
  });
