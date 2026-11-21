import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { EsperaCard } from '../../components/EsperaCard';
import { EstadoVacio } from '../../components/EstadoVacio';
import { PrestamoCard } from '../../components/PrestamoCard';
import { colores, espaciado, tipografia } from '../../constants/tema';
import { useBiblioteca } from '../../context/BibliotecaProvider';

export default function ReservasScreen() {
  const { prestamos, devolver, misReservasEnEspera } = useBiblioteca();
  const enEspera = misReservasEnEspera();

  if (prestamos.length === 0 && enEspera.length === 0) {
    return (
      <View style={styles.vacio}>
        <EstadoVacio mensaje="No tenés reservas ni libros prestados" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.contenedor} contentContainerStyle={styles.contenido}>
      <Text style={styles.seccion} accessibilityRole="header">
        Mis préstamos
      </Text>
      {prestamos.length === 0 ? (
        <Text style={styles.sinItems}>No tenés libros prestados.</Text>
      ) : (
        prestamos.map((p) => (
          <View key={p.isbn} style={styles.item}>
            <PrestamoCard prestamo={p} onDevolver={devolver} />
          </View>
        ))
      )}

      <Text style={[styles.seccion, styles.seccionSiguiente]} accessibilityRole="header">
        En espera
      </Text>
      {enEspera.length === 0 ? (
        <Text style={styles.sinItems}>No estás en ninguna lista de espera.</Text>
      ) : (
        enEspera.map((r) => (
          <View key={r.isbn} style={styles.item}>
            <EsperaCard reserva={r} />
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  vacio: {
    flex: 1,
    backgroundColor: colores.claro.fondo,
  },
  contenedor: {
    flex: 1,
    backgroundColor: colores.claro.fondo,
  },
  contenido: {
    padding: espaciado.l,
  },
  seccion: {
    ...tipografia.subtitulo,
    color: colores.claro.texto,
  },
  seccionSiguiente: {
    marginTop: espaciado.xl,
  },
  item: {
    marginTop: espaciado.m,
  },
  sinItems: {
    ...tipografia.cuerpo,
    color: colores.claro.textoSuave,
    marginTop: espaciado.s,
  },
});
