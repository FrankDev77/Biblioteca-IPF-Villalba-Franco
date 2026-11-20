import { router } from 'expo-router';
import { FlatList, StyleSheet, View } from 'react-native';

import { EstadoCargando } from '../../components/EstadoCargando';
import { EstadoError } from '../../components/EstadoError';
import { EstadoVacio } from '../../components/EstadoVacio';
import { LibroCard } from '../../components/LibroCard';
import { colores, espaciado } from '../../constants/tema';
import { useLibros } from '../../hooks/useLibros';

export default function CatalogoScreen() {
  const { libros, cargando, error, reintentar } = useLibros();

  if (cargando) {
    return <EstadoCargando />;
  }

  if (error) {
    return <EstadoError mensaje={error} onReintentar={reintentar} />;
  }

  return (
    <FlatList
      style={styles.lista}
      contentContainerStyle={styles.contenido}
      data={libros}
      keyExtractor={(l) => l.isbn}
      ListEmptyComponent={EstadoVacio}
      ItemSeparatorComponent={Separador}
      renderItem={({ item }) => (
        <LibroCard
          libro={item}
          onPress={() => router.push({ pathname: '/libro/[isbn]', params: { isbn: item.isbn } })}
        />
      )}
    />
  );
}

function Separador() {
  return <View style={styles.separador} />;
}

const styles = StyleSheet.create({
  lista: {
    flex: 1,
    backgroundColor: colores.claro.fondo,
  },
  contenido: {
    flexGrow: 1,
    padding: espaciado.l,
  },
  separador: {
    height: espaciado.m,
  },
});
