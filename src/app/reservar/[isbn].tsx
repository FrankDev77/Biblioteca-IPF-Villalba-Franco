import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState, type ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { EstadoError } from '../../components/EstadoError';
import { colores, espaciado, radios, tipografia } from '../../constants/tema';
import { useBiblioteca } from '../../context/BibliotecaProvider';
import { LIBROS } from '../../data/libros';
import { formatearFecha } from '../../lib/fechas';
import type { ResultadoReserva } from '../../types/biblioteca';

type Aviso = {
  icono: ComponentProps<typeof Ionicons>['name'];
  color: string;
  texto: string;
};

export default function ReservarScreen() {
  const { isbn } = useLocalSearchParams<{ isbn: string }>();
  const { reservar, miPosicion } = useBiblioteca();
  const [resultado, setResultado] = useState<ResultadoReserva | null>(null);
  // reservar tiene efectos (presta o encola); el ref evita una segunda llamada si el efecto
  // se vuelve a correr para el mismo isbn (StrictMode o cambio de identidad de reservar)
  const reservado = useRef<string | null>(null);

  const libro = LIBROS.find((l) => l.isbn === isbn);

  useEffect(() => {
    if (!libro || reservado.current === isbn) return;
    reservado.current = isbn;
    setResultado(reservar(isbn));
  }, [isbn, libro, reservar]);

  if (!libro) {
    return (
      <EstadoError
        titulo="ISBN desconocido"
        mensaje={`No hay ningún libro con ISBN ${isbn ?? ''} en el catálogo.`}
        textoBoton="Ir al catálogo"
        onReintentar={() => router.replace('/')}
      />
    );
  }

  if (!resultado) {
    return <View style={styles.contenedor} />;
  }

  let aviso: Aviso;
  if (resultado.ok) {
    aviso =
      resultado.tipo === 'prestamo'
        ? {
            icono: 'checkmark-circle',
            color: colores.claro.exito,
            texto: `¡Listo! Te prestamos ${libro.titulo} hasta el ${formatearFecha(resultado.hasta)}.`,
          }
        : {
            icono: 'time-outline',
            color: colores.claro.primario,
            texto: `Sin ejemplares. Estás en posición ${resultado.posicion} de la lista de espera.`,
          };
  } else {
    aviso =
      resultado.razon === 'ya-prestado'
        ? {
            icono: 'alert-circle',
            color: colores.claro.alerta,
            texto: 'Ya tenés este libro prestado.',
          }
        : {
            icono: 'alert-circle',
            color: colores.claro.alerta,
            texto: `Ya estás en la lista de espera (posición ${miPosicion(isbn) ?? '-'}).`,
          };
  }

  return (
    <View style={styles.contenedor}>
      <Ionicons
        name={aviso.icono}
        size={64}
        color={aviso.color}
        accessibilityElementsHidden
        importantForAccessibility="no"
      />
      <Text style={styles.texto} accessibilityRole="header">
        {aviso.texto}
      </Text>
      <Pressable
        // replace y no push: el TP pide que "atrás" desde reservas no vuelva a esta confirmación
        onPress={() => router.replace('/reservas')}
        accessibilityRole="button"
        accessibilityLabel="Ver mis reservas"
        style={({ pressed }) => [styles.boton, styles.botonPrimario, pressed && styles.botonPresionado]}
      >
        <Text style={[styles.botonTexto, styles.botonTextoPrimario]}>Ver mis reservas</Text>
      </Pressable>
      <Pressable
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel="Cerrar"
        style={({ pressed }) => [styles.boton, pressed && styles.botonPresionado]}
      >
        <Text style={[styles.botonTexto, styles.botonTextoSecundario]}>Cerrar</Text>
      </Pressable>
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
  texto: {
    ...tipografia.subtitulo,
    color: colores.claro.texto,
    textAlign: 'center',
    marginTop: espaciado.l,
  },
  boton: {
    alignSelf: 'stretch',
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: espaciado.m,
    borderRadius: radios.m,
  },
  botonPrimario: {
    marginTop: espaciado.xl,
    backgroundColor: colores.claro.primario,
  },
  botonPresionado: {
    opacity: 0.8,
  },
  botonTexto: {
    ...tipografia.cuerpo,
    fontWeight: '600',
  },
  botonTextoPrimario: {
    color: colores.claro.superficie,
  },
  botonTextoSecundario: {
    color: colores.claro.primario,
  },
});
