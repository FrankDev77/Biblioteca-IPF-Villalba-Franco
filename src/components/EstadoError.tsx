import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { espaciado, radios, tipografia, type Paleta } from '../constants/tema';
import { useEstilos } from '../hooks/useEstilos';
import { useTema } from '../hooks/useTema';

type Props = {
  onReintentar: () => void;
  mensaje?: string;
  titulo?: string;
  textoBoton?: string;
};

export function EstadoError({
  onReintentar,
  mensaje,
  titulo = 'No pudimos cargar el catálogo',
  textoBoton = 'Reintentar',
}: Props) {
  const styles = useEstilos(crearEstilos);
  const { paleta } = useTema();
  return (
    <View style={styles.contenedor}>
      <Ionicons
        name="cloud-offline-outline"
        size={48}
        color={paleta.error}
        accessibilityElementsHidden
        importantForAccessibility="no"
      />
      <Text style={styles.titulo} accessibilityRole="header">
        {titulo}
      </Text>
      <Text style={styles.mensaje}>
        {mensaje ?? 'Revisá tu conexión e intentá de nuevo.'}
      </Text>
      <Pressable
        onPress={onReintentar}
        accessibilityRole="button"
        accessibilityLabel={textoBoton}
        style={({ pressed }) => [styles.boton, pressed && styles.botonPresionado]}
      >
        <Text style={styles.botonTexto}>{textoBoton}</Text>
      </Pressable>
    </View>
  );
}

const crearEstilos = (paleta: Paleta) =>
  StyleSheet.create({
    contenedor: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: espaciado.xl,
      backgroundColor: paleta.fondo,
    },
    titulo: {
      ...tipografia.subtitulo,
      color: paleta.texto,
      marginTop: espaciado.l,
      textAlign: 'center',
    },
    mensaje: {
      ...tipografia.cuerpo,
      color: paleta.textoSuave,
      marginTop: espaciado.s,
      textAlign: 'center',
    },
    boton: {
      minHeight: 44,
      minWidth: 44,
      justifyContent: 'center',
      marginTop: espaciado.xl,
      paddingHorizontal: espaciado.xl,
      borderRadius: radios.m,
      backgroundColor: paleta.primario,
    },
    botonPresionado: {
      opacity: 0.8,
    },
    botonTexto: {
      ...tipografia.cuerpo,
      fontWeight: '600',
      color: paleta.textoSobrePrimario,
    },
  });
