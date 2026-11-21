import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { colores, espaciado, radios, tipografia } from '../constants/tema';
import { buscarEnCatalogo, esIsbnValido } from '../lib/isbn';

type Props = {
  onEncontrado: (isbn: string) => void;
  onUsarCamara: () => void;
};

export function EntradaIsbnManual({ onEncontrado, onUsarCamara }: Props) {
  const [texto, setTexto] = useState('');
  const [error, setError] = useState<string | null>(null);

  const confirmar = () => {
    const codigo = texto.trim();
    if (!esIsbnValido(codigo)) {
      setError('ISBN inválido: debe tener 13 dígitos.');
      return;
    }
    if (!buscarEnCatalogo(codigo)) {
      setError('Ese código no está en el catálogo.');
      return;
    }
    onEncontrado(codigo);
  };

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo} accessibilityRole="header">
        Escribí el ISBN
      </Text>
      <Text style={styles.ayuda}>Son los 13 números que están debajo del código de barras.</Text>
      <TextInput
        style={styles.input}
        value={texto}
        onChangeText={(nuevo) => {
          setTexto(nuevo);
          setError(null);
        }}
        placeholder="9788437604947"
        placeholderTextColor={colores.claro.textoSuave}
        keyboardType="number-pad"
        maxLength={13}
        autoFocus
        returnKeyType="search"
        onSubmitEditing={confirmar}
        accessibilityLabel="ISBN de 13 dígitos"
      />
      {error ? (
        <Text style={styles.error} accessibilityRole="alert">
          {error}
        </Text>
      ) : null}
      <Pressable
        onPress={confirmar}
        accessibilityRole="button"
        accessibilityLabel="Ver libro"
        style={({ pressed }) => [styles.boton, styles.botonPrimario, pressed && styles.botonPresionado]}
      >
        <Text style={[styles.botonTexto, styles.botonTextoPrimario]}>Ver libro</Text>
      </Pressable>
      <Pressable
        onPress={onUsarCamara}
        accessibilityRole="button"
        accessibilityLabel="Usar la cámara"
        style={({ pressed }) => [styles.boton, pressed && styles.botonPresionado]}
      >
        <Text style={[styles.botonTexto, styles.botonTextoSecundario]}>Usar la cámara</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    padding: espaciado.xl,
    backgroundColor: colores.claro.fondo,
  },
  titulo: {
    ...tipografia.titulo,
    color: colores.claro.texto,
  },
  ayuda: {
    ...tipografia.cuerpo,
    color: colores.claro.textoSuave,
    marginTop: espaciado.s,
  },
  input: {
    ...tipografia.subtitulo,
    minHeight: 48,
    marginTop: espaciado.xl,
    paddingHorizontal: espaciado.l,
    borderRadius: radios.m,
    borderWidth: 1,
    borderColor: colores.claro.borde,
    backgroundColor: colores.claro.superficie,
    color: colores.claro.texto,
    letterSpacing: 1,
  },
  error: {
    ...tipografia.pie,
    color: colores.claro.error,
    marginTop: espaciado.s,
  },
  boton: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: espaciado.m,
    borderRadius: radios.m,
  },
  botonPrimario: {
    marginTop: espaciado.xl,
    backgroundColor: colores.claro.primario,
  },
  botonPresionado: {
    opacity: 0.8,
  },
  botonTexto: {
    ...tipografia.cuerpo,
    fontWeight: '600',
  },
  botonTextoPrimario: {
    color: colores.claro.superficie,
  },
  botonTextoSecundario: {
    color: colores.claro.primario,
  },
});
