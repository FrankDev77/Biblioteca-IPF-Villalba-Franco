import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colores, espaciado, radios, tipografia } from '../constants/tema';

type Props = {
  onReintentar: () => void;
  mensaje?: string;
};

export function EstadoError({ onReintentar, mensaje }: Props) {
  return (
    <View style={styles.contenedor}>
      <Ionicons
        name="cloud-offline-outline"
        size={48}
        color={colores.claro.error}
        accessibilityElementsHidden
        importantForAccessibility="no"
      />
      <Text style={styles.titulo} accessibilityRole="header">
        No pudimos cargar el catálogo
      </Text>
      <Text style={styles.mensaje}>
        {mensaje ?? 'Revisá tu conexión e intentá de nuevo.'}
      </Text>
      <Pressable
        onPress={onReintentar}
        accessibilityRole="button"
        accessibilityLabel="Reintentar cargar el catálogo"
        style={({ pressed }) => [styles.boton, pressed && styles.botonPresionado]}
      >
        <Text style={styles.botonTexto}>Reintentar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: espaciado.xl,
    backgroundColor: colores.claro.fondo,
  },
  titulo: {
    ...tipografia.subtitulo,
    color: colores.claro.texto,
    marginTop: espaciado.l,
    textAlign: 'center',
  },
  mensaje: {
    ...tipografia.cuerpo,
    color: colores.claro.textoSuave,
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
    backgroundColor: colores.claro.primario,
  },
  botonPresionado: {
    opacity: 0.8,
  },
  botonTexto: {
    ...tipografia.cuerpo,
    fontWeight: '600',
    color: colores.claro.superficie,
  },
});
