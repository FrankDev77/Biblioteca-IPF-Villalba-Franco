import { router } from 'expo-router';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';

import { BotonAccion } from '../../../components/BotonAccion';
import { EstadoError } from '../../../components/EstadoError';
import { EstadoVacio } from '../../../components/EstadoVacio';
import { EsqueletoCatalogo } from '../../../components/EsqueletoCatalogo';
import { LibroCard } from '../../../components/LibroCard';
import { VistosRecientes } from '../../../components/VistosRecientes';
import { espaciado, type Paleta } from '../../../constants/tema';
import { useBiblioteca } from '../../../context/BibliotecaProvider';
import { useEstilos } from '../../../hooks/useEstilos';
import { useLibros } from '../../../hooks/useLibros';
import { useTema } from '../../../hooks/useTema';

export default function CatalogoScreen() {
  const styles = useEstilos(crearEstilos);
  const { paleta } = useTema();
  const { libros, cargando, error, reintentar } = useLibros();
  const { recientes } = useBiblioteca();

  // el skeleton es solo para la primera carga; en un pull-to-refresh la lista queda y alcanza con el spinner
  if (cargando && libros.length === 0) {
    return <EsqueletoCatalogo />;
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
      refreshControl={
        <RefreshControl
          refreshing={cargando}
          onRefresh={reintentar}
          tintColor={paleta.primario}
          colors={[paleta.primario]}
          progressBackgroundColor={paleta.superficie}
        />
      }
      ListHeaderComponent={
        <View style={styles.header}>
          <View style={styles.acciones}>
            <BotonAccion texto="Buscar" icono="search" onPress={() => router.push('/buscar')} />
            <BotonAccion texto="Escanear" icono="barcode-outline" onPress={() => router.push('/escanear')} />
          </View>
          <VistosRecientes recientes={recientes} />
        </View>
      }
      renderItem={({ item, index }) => (
        <LibroCard
          libro={item}
          indice={index}
          onPress={() => router.push({ pathname: '/libro/[isbn]', params: { isbn: item.isbn } })}
        />
      )}
    />
  );
}

function Separador() {
  const styles = useEstilos(crearEstilos);
  return <View style={styles.separador} />;
}

const crearEstilos = (paleta: Paleta) =>
  StyleSheet.create({
    lista: {
      flex: 1,
      backgroundColor: paleta.fondo,
    },
    contenido: {
      flexGrow: 1,
      padding: espaciado.l,
    },
    header: {
      marginBottom: espaciado.l,
    },
    acciones: {
      flexDirection: 'row',
      gap: espaciado.m,
    },
    separador: {
      height: espaciado.m,
    },
  });
