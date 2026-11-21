import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { BarraBusqueda } from '../components/BarraBusqueda';
import { EstadoCargando } from '../components/EstadoCargando';
import { EstadoError } from '../components/EstadoError';
import { EstadoVacio } from '../components/EstadoVacio';
import { LibroCard } from '../components/LibroCard';
import { espaciado, tipografia, type Paleta } from '../constants/tema';
import { useEstilos } from '../hooks/useEstilos';
import { useBuscarLibros } from '../hooks/useBuscarLibros';
import { useDebouncedValue } from '../hooks/useDebouncedValue';

export default function BuscarScreen() {
  const styles = useEstilos(crearEstilos);
  const { q = '' } = useLocalSearchParams<{ q?: string }>();
  const [texto, setTexto] = useState(q);
  // 300 ms: tipear "borges" rápido termina en un solo cambio de URL y una sola llamada al API
  const textoDebounced = useDebouncedValue(texto, 300);
  const { resultados, buscando, error } = useBuscarLibros(q);

  // setParams y no push: no apila una pantalla por tecla y "atrás" vuelve al catálogo
  useEffect(() => {
    router.setParams({ q: textoDebounced });
  }, [textoDebounced]);

  const cambiarTexto = (nuevoTexto: string) => setTexto(nuevoTexto);

  let contenido;
  if (q.trim() === '') {
    contenido = <Text style={styles.neutral}>Escribí para buscar</Text>;
  } else if (buscando) {
    contenido = <EstadoCargando />;
  } else if (error) {
    contenido = (
      <EstadoError
        titulo="No pudimos buscar"
        mensaje={error}
        textoBoton="Limpiar búsqueda"
        onReintentar={() => cambiarTexto('')}
      />
    );
  } else {
    contenido = (
      <FlatList
        data={resultados}
        keyExtractor={(l) => l.isbn}
        ListEmptyComponent={EstadoVacio}
        contentContainerStyle={styles.lista}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <View style={styles.item}>
            <LibroCard
              libro={item}
              onPress={() => router.push({ pathname: '/libro/[isbn]', params: { isbn: item.isbn } })}
            />
          </View>
        )}
      />
    );
  }

  return (
    <View style={styles.contenedor}>
      <View style={styles.barra}>
        <BarraBusqueda value={texto} onChangeText={cambiarTexto} />
      </View>
      {contenido}
    </View>
  );
}

const crearEstilos = (paleta: Paleta) =>
  StyleSheet.create({
    contenedor: {
      flex: 1,
      backgroundColor: paleta.fondo,
    },
    barra: {
      padding: espaciado.l,
      paddingBottom: espaciado.s,
    },
    lista: {
      flexGrow: 1,
      paddingHorizontal: espaciado.l,
      paddingBottom: espaciado.l,
    },
    item: {
      marginTop: espaciado.m,
    },
    neutral: {
      ...tipografia.cuerpo,
      color: paleta.textoSuave,
      textAlign: 'center',
      marginTop: espaciado.xxl,
    },
  });
