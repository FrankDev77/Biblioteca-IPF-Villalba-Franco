import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { BarraBusqueda } from '../components/BarraBusqueda';
import { EstadoCargando } from '../components/EstadoCargando';
import { EstadoError } from '../components/EstadoError';
import { EstadoVacio } from '../components/EstadoVacio';
import { LibroCard } from '../components/LibroCard';
import { colores, espaciado, tipografia } from '../constants/tema';
import { useBuscarLibros } from '../hooks/useBuscarLibros';

export default function BuscarScreen() {
  const { q = '' } = useLocalSearchParams<{ q?: string }>();
  const [texto, setTexto] = useState(q);
  const { resultados, buscando, error } = useBuscarLibros(q);

  // setParams y no push: no apila una pantalla por tecla y "atrás" vuelve al catálogo
  const cambiarTexto = (nuevoTexto: string) => {
    setTexto(nuevoTexto);
    router.setParams({ q: nuevoTexto });
  };

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

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colores.claro.fondo,
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
    color: colores.claro.textoSuave,
    textAlign: 'center',
    marginTop: espaciado.xxl,
  },
});
