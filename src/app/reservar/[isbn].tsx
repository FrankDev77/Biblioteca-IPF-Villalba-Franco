import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState, type ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring } from 'react-native-reanimated';

import { EstadoError } from '../../components/EstadoError';
import { espaciado, radios, tipografia, type Paleta } from '../../constants/tema';
import { useBiblioteca } from '../../context/BibliotecaProvider';
import { LIBROS } from '../../data/libros';
import { useEstilos } from '../../hooks/useEstilos';
import { useReducirMovimiento } from '../../hooks/useReducirMovimiento';
import { useTema } from '../../hooks/useTema';
import { formatearFecha } from '../../lib/fechas';
import * as haptica from '../../lib/haptica';
import type { ResultadoReserva } from '../../types/biblioteca';

type Aviso = {
  icono: ComponentProps<typeof Ionicons>['name'];
  color: string;
  texto: string;
};

export default function ReservarScreen() {
  const styles = useEstilos(crearEstilos);
  const { paleta } = useTema();
  const { isbn } = useLocalSearchParams<{ isbn: string }>();
  const { reservar, miPosicion } = useBiblioteca();
  const [resultado, setResultado] = useState<ResultadoReserva | null>(null);
  // reservar tiene efectos (presta o encola); el ref evita una segunda llamada si el efecto
  // se vuelve a correr para el mismo isbn (StrictMode o cambio de identidad de reservar)
  const reservado = useRef<string | null>(null);

  const reducirMovimiento = useReducirMovimiento();
  const escalaIcono = useSharedValue(0);

  const libro = LIBROS.find((l) => l.isbn === isbn);

  useEffect(() => {
    if (!libro || reservado.current === isbn) return;
    reservado.current = isbn;
    const nuevo = reservar(isbn);
    setResultado(nuevo);
    if (!nuevo.ok) void haptica.error();
    else if (nuevo.tipo === 'prestamo') void haptica.exito();
    else void haptica.advertencia();
  }, [isbn, libro, reservar]);

  useEffect(() => {
    if (!resultado) return;
    const esPrestamo = resultado.ok && resultado.tipo === 'prestamo';
    if (!esPrestamo || reducirMovimiento) {
      escalaIcono.set(1);
      return;
    }
    escalaIcono.set(0);
    escalaIcono.set(withSequence(withSpring(1.1), withSpring(1)));
  }, [resultado, reducirMovimiento, escalaIcono]);

  const estiloIcono = useAnimatedStyle(() => ({ transform: [{ scale: escalaIcono.get() }] }));

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
            color: paleta.exito,
            texto: `¡Listo! Te prestamos ${libro.titulo} hasta el ${formatearFecha(resultado.hasta)}.`,
          }
        : {
            icono: 'time-outline',
            color: paleta.primario,
            texto: `Sin ejemplares. Estás en posición ${resultado.posicion} de la lista de espera.`,
          };
  } else {
    aviso =
      resultado.razon === 'ya-prestado'
        ? {
            icono: 'alert-circle',
            color: paleta.alerta,
            texto: 'Ya tenés este libro prestado.',
          }
        : {
            icono: 'alert-circle',
            color: paleta.alerta,
            texto: `Ya estás en la lista de espera (posición ${miPosicion(isbn) ?? '-'}).`,
          };
  }

  return (
    <View style={styles.contenedor}>
      <Animated.View style={estiloIcono}>
        <Ionicons
          name={aviso.icono}
          size={64}
          color={aviso.color}
          accessibilityElementsHidden
          importantForAccessibility="no"
        />
      </Animated.View>
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

const crearEstilos = (paleta: Paleta) =>
  StyleSheet.create({
    contenedor: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: espaciado.xl,
      backgroundColor: paleta.fondo,
    },
    texto: {
      ...tipografia.subtitulo,
      color: paleta.texto,
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
      backgroundColor: paleta.primario,
    },
    botonPresionado: {
      opacity: 0.8,
    },
    botonTexto: {
      ...tipografia.cuerpo,
      fontWeight: '600',
    },
    botonTextoPrimario: {
      color: paleta.textoSobrePrimario,
    },
    botonTextoSecundario: {
      color: paleta.primario,
    },
  });
