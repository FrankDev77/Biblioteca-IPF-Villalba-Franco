import { Link, usePathname } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { espaciado, radios, tipografia, type Paleta } from '../constants/tema';
import { useEstilos } from '../hooks/useEstilos';

export default function NotFoundScreen() {
  const styles = useEstilos(crearEstilos);
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
      ...tipografia.titulo,
      color: paleta.texto,
    },
    detalle: {
      ...tipografia.cuerpo,
      color: paleta.textoSuave,
      marginTop: espaciado.m,
      textAlign: 'center',
    },
    ruta: {
      color: paleta.texto,
      fontFamily: 'monospace',
    },
    link: {
      ...tipografia.subtitulo,
      color: paleta.primario,
      marginTop: espaciado.xl,
      minHeight: 44,
      paddingHorizontal: espaciado.l,
      paddingVertical: espaciado.m,
      borderRadius: radios.m,
    },
  });
