import { router, Stack } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colores, espaciado, radios, sombras, tipografia } from '../constants/tema';
import { useBiblioteca } from '../context/BibliotecaProvider';
import { useLibroPorIsbn } from '../hooks/useLibroPorIsbn';
import { EstadoCargando } from './EstadoCargando';
import { EstadoError } from './EstadoError';

type Props = {
  isbn: string;
};

export function DetalleLibro({ isbn }: Props) {
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
    <View style={styles.contenedor}>
      <Stack.Screen options={{ title: libro.titulo }} />
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
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    padding: espaciado.l,
    backgroundColor: colores.claro.fondo,
  },
  card: {
    padding: espaciado.xl,
    borderRadius: radios.l,
    backgroundColor: colores.claro.superficie,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colores.claro.borde,
    ...sombras.card,
  },
  titulo: {
    ...tipografia.titulo,
    color: colores.claro.texto,
  },
  autor: {
    ...tipografia.subtitulo,
    color: colores.claro.textoSuave,
    marginTop: espaciado.xs,
    marginBottom: espaciado.l,
  },
  dato: {
    ...tipografia.cuerpo,
    color: colores.claro.texto,
    marginTop: espaciado.s,
  },
  isbn: {
    ...tipografia.pie,
    color: colores.claro.textoSuave,
    marginTop: espaciado.l,
  },
  boton: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: espaciado.xl,
    paddingHorizontal: espaciado.l,
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
  badge: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: espaciado.xl,
    paddingHorizontal: espaciado.l,
    borderRadius: radios.m,
  },
  badgePrestado: {
    backgroundColor: colores.claro.silueta,
  },
  badgeEspera: {
    backgroundColor: colores.claro.primarioSuave,
  },
  badgeTexto: {
    ...tipografia.subtitulo,
  },
  badgeTextoPrestado: {
    color: colores.claro.texto,
  },
  badgeTextoEspera: {
    color: colores.claro.primario,
  },
});
