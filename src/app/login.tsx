import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { colores, espaciado, radios, tipografia } from '../constants/tema';
import { useBiblioteca } from '../context/BibliotecaProvider';

export default function LoginScreen() {
  const { iniciarSesion, sesion } = useBiblioteca();
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState(false);
  const [ingreso, setIngreso] = useState(false);

  // se navega recién cuando la sesion ya está en el context: si el replace va en el mismo
  // handler, Stack.Protected todavía tiene guard false y no deja entrar a /mostrador.
  // replace y no push: el login se cierra solo y "atrás" desde el mostrador no vuelve acá
  useEffect(() => {
    if (ingreso && sesion) router.replace('/mostrador');
  }, [ingreso, sesion]);

  const ingresar = () => {
    const resultado = iniciarSesion(usuario.trim(), clave);
    setError(!resultado.ok);
    setIngreso(resultado.ok);
  };

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo} accessibilityRole="header">
        Ingreso del personal
      </Text>
      <TextInput
        style={styles.input}
        value={usuario}
        onChangeText={setUsuario}
        placeholder="Usuario"
        placeholderTextColor={colores.claro.textoSuave}
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="username"
        returnKeyType="next"
        accessibilityLabel="Usuario"
      />
      <TextInput
        style={styles.input}
        value={clave}
        onChangeText={setClave}
        placeholder="Clave"
        placeholderTextColor={colores.claro.textoSuave}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="password"
        returnKeyType="go"
        onSubmitEditing={ingresar}
        accessibilityLabel="Clave"
      />
      <Pressable
        onPress={ingresar}
        accessibilityRole="button"
        accessibilityLabel="Ingresar"
        style={({ pressed }) => [styles.boton, pressed && styles.botonPresionado]}
      >
        <Text style={styles.botonTexto}>Ingresar</Text>
      </Pressable>
      {error ? (
        <Text style={styles.error} accessibilityRole="alert">
          Usuario o clave incorrectos
        </Text>
      ) : null}
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
    marginBottom: espaciado.l,
  },
  input: {
    ...tipografia.cuerpo,
    minHeight: 48,
    marginTop: espaciado.m,
    paddingHorizontal: espaciado.l,
    borderRadius: radios.m,
    borderWidth: 1,
    borderColor: colores.claro.borde,
    backgroundColor: colores.claro.superficie,
    color: colores.claro.texto,
  },
  boton: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: espaciado.xl,
    borderRadius: radios.m,
    backgroundColor: colores.claro.primario,
  },
  botonPresionado: {
    opacity: 0.8,
  },
  botonTexto: {
    ...tipografia.subtitulo,
    color: colores.claro.superficie,
  },
  error: {
    ...tipografia.cuerpo,
    color: colores.claro.error,
    marginTop: espaciado.m,
    textAlign: 'center',
  },
});
