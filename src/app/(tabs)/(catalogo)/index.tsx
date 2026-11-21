import { router } from 'expo-router';
import { FlatList, StyleSheet, View } from 'react-native';

import { BotonAccion } from '../../../components/BotonAccion';
import { EstadoCargando } from '../../../components/EstadoCargando';
import { EstadoError } from '../../../components/EstadoError';
import { EstadoVacio } from '../../../components/EstadoVacio';
import { LibroCard } from '../../../components/LibroCard';
import { VistosRecientes } from '../../../components/VistosRecientes';
import { espaciado, type Paleta } from '../../../constants/tema';
import { useEstilos } from '../../../hooks/useEstilos';
import { useBiblioteca } from '../../../context/BibliotecaProvider';
import { useLibros } from '../../../hooks/useLibros';

export default function CatalogoScreen() {
  const styles = useEstilos(crearEstilos);
  const { libros, cargando, error, reintentar } = useLibros();
  const { recientes } = useBiblioteca();

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
      ListHeaderComponent={
        <View style={styles.header}>
          <View style={styles.acciones}>
            <BotonAccion texto="Buscar" icono="search" onPress={() => router.push('/buscar')} />
            <BotonAccion texto="Escanear" icono="barcode-outline" onPress={() => router.push('/escanear')} />
          </View>
          <VistosRecientes recientes={recientes} />
        </View>
      }
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
