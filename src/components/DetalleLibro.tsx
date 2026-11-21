import { router, Stack } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { espaciado, radios, sombras, tipografia, type Paleta } from '../constants/tema';
import { useEstilos } from '../hooks/useEstilos';
import { useBiblioteca } from '../context/BibliotecaProvider';
import { useLibroPorIsbn } from '../hooks/useLibroPorIsbn';
import { EstadoCargando } from './EstadoCargando';
import { EstadoError } from './EstadoError';
import { PortadaLibro } from './PortadaLibro';

type Props = {
  isbn: string;
};

export function DetalleLibro({ isbn }: Props) {
  const styles = useEstilos(crearEstilos);
  const { libro, validando, error, reintentar } = useLibroPorIsbn(isbn);
  const { verLibro, ejemplaresDisponibles, tamanioEspera, estaPrestado, miPosicion } =
    useBiblioteca();

  useEffect(() => {
    if (libro) verLibro(isbn);
  }, [isbn, libro, verLibro]);

  if (validando) {
    return (
      <>
        <Stack.Screen options={{ title: 'Libro' }} />
        <EstadoCargando />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Stack.Screen options={{ title: 'Libro' }} />
        <EstadoError
          titulo="No se pudo cargar el libro"
          mensaje={error}
          textoBoton="Reintentar"
          onReintentar={reintentar}
        />
      </>
    );
  }

  if (!libro) {
    return (
      <>
        <Stack.Screen options={{ title: 'Libro' }} />
        <EstadoError
          titulo="No encontramos ese libro"
          mensaje={`No hay ningún libro con ISBN ${isbn} en el catálogo.`}
          textoBoton="Ir al catálogo"
          onReintentar={() => router.navigate('/')}
        />
      </>
    );
  }

  const disponibles = ejemplaresDisponibles(isbn);
  const enEspera = tamanioEspera(isbn);
  const posicion = miPosicion(isbn);
  const prestado = estaPrestado(isbn);

  let accion;
  if (prestado) {
    accion = (
      <View style={[styles.badge, styles.badgePrestado]}>
        <Text style={[styles.badgeTexto, styles.badgeTextoPrestado]}>Ya lo tenés prestado</Text>
      </View>
    );
  } else if (posicion !== null) {
    accion = (
      <View style={[styles.badge, styles.badgeEspera]}>
        <Text style={[styles.badgeTexto, styles.badgeTextoEspera]}>
          En espera · posición {posicion}
        </Text>
      </View>
    );
  } else {
    const textoBoton = disponibles > 0 ? 'Reservar' : 'Anotarme en la lista de espera';
    accion = (
      <Pressable
        onPress={() => router.push({ pathname: '/reservar/[isbn]', params: { isbn } })}
        accessibilityRole="button"
        accessibilityLabel={`${textoBoton}: ${libro.titulo}`}
        style={({ pressed }) => [styles.boton, pressed && styles.botonPresionado]}
      >
        <Text style={styles.botonTexto}>{textoBoton}</Text>
      </Pressable>
    );
  }

  return (
    <ScrollView style={styles.contenedor} contentContainerStyle={styles.contenido}>
      <Stack.Screen options={{ title: libro.titulo }} />
      <PortadaLibro isbn={libro.isbn} size="grande" titulo={libro.titulo} style={styles.portada} />
      <View style={styles.card}>
        <Text style={styles.titulo} accessibilityRole="header">
          {libro.titulo}
        </Text>
        <Text style={styles.autor}>{libro.autor}</Text>
        <Text style={styles.dato}>Año: {libro.anio}</Text>
        <Text style={styles.dato}>Ejemplares disponibles: {disponibles}</Text>
        <Text style={styles.dato}>
          Lista de espera: {enEspera} {enEspera === 1 ? 'persona' : 'personas'}
        </Text>
        <Text style={styles.isbn}>ISBN {libro.isbn}</Text>
      </View>
      {accion}
    </ScrollView>
  );
}

const crearEstilos = (paleta: Paleta) =>
  StyleSheet.create({
    contenedor: {
      flex: 1,
      backgroundColor: paleta.fondo,
    },
    contenido: {
      padding: espaciado.l,
    },
    portada: {
      alignSelf: 'center',
      marginBottom: espaciado.l,
    },
    card: {
      padding: espaciado.xl,
      borderRadius: radios.l,
      backgroundColor: paleta.superficie,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: paleta.borde,
      ...sombras.card,
    },
    titulo: {
      ...tipografia.titulo,
      color: paleta.texto,
    },
    autor: {
      ...tipografia.subtitulo,
      color: paleta.textoSuave,
      marginTop: espaciado.xs,
      marginBottom: espaciado.l,
    },
    dato: {
      ...tipografia.cuerpo,
      color: paleta.texto,
      marginTop: espaciado.s,
    },
    isbn: {
      ...tipografia.pie,
      color: paleta.textoSuave,
      marginTop: espaciado.l,
    },
    boton: {
      minHeight: 48,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: espaciado.xl,
      paddingHorizontal: espaciado.l,
      borderRadius: radios.m,
      backgroundColor: paleta.primario,
    },
    botonPresionado: {
      opacity: 0.8,
    },
    botonTexto: {
      ...tipografia.subtitulo,
      color: paleta.textoSobrePrimario,
    },
    badge: {
      minHeight: 48,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: espaciado.xl,
      paddingHorizontal: espaciado.l,
      borderRadius: radios.m,
    },
    badgePrestado: {
      backgroundColor: paleta.silueta,
    },
    badgeEspera: {
      backgroundColor: paleta.primarioSuave,
    },
    badgeTexto: {
      ...tipografia.subtitulo,
    },
    badgeTextoPrestado: {
      color: paleta.texto,
    },
    badgeTextoEspera: {
      color: paleta.primario,
    },
  });
