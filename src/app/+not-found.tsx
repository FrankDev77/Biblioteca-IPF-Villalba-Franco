import { Link, usePathname } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { colores, espaciado, radios, tipografia } from '../constants/tema';

export default function NotFoundScreen() {
  const pathname = usePathname();

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo} accessibilityRole="header">
        Página no encontrada
      </Text>
      <Text style={styles.detalle}>
        No encontramos la página{' '}
        <Text style={styles.ruta} selectable>
          {pathname}
        </Text>
        . ¿Querés ir al catálogo?
      </Text>
      <Link href="/" replace style={styles.link} accessibilityRole="link">
        Ir al catálogo
      </Link>
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
    ...tipografia.titulo,
    color: colores.claro.texto,
  },
  detalle: {
    ...tipografia.cuerpo,
    color: colores.claro.textoSuave,
    marginTop: espaciado.m,
    textAlign: 'center',
  },
  ruta: {
    color: colores.claro.texto,
    fontFamily: 'monospace',
  },
  link: {
    ...tipografia.subtitulo,
    color: colores.claro.primario,
    marginTop: espaciado.xl,
    minHeight: 44,
    paddingHorizontal: espaciado.l,
    paddingVertical: espaciado.m,
    borderRadius: radios.m,
  },
});
