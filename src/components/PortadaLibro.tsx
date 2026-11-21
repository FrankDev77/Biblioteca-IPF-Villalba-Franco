import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { radios, type Paleta } from '../constants/tema';
import { useEstilos } from '../hooks/useEstilos';
import { useTema } from '../hooks/useTema';

type Tamanio = 'chica' | 'mediana' | 'grande';

const MEDIDAS: Record<Tamanio, { letra: 'S' | 'M' | 'L'; icono: number }> = {
  chica: { letra: 'S', icono: 20 },
  mediana: { letra: 'M', icono: 32 },
  grande: { letra: 'L', icono: 56 },
};

type Props = {
  isbn: string;
  size: Tamanio;
  titulo?: string;
  style?: StyleProp<ViewStyle>;
};

export function PortadaLibro({ isbn, size, titulo, style }: Props) {
  const styles = useEstilos(crearEstilos);
  const { paleta } = useTema();
  // se guarda el isbn que falló y no un boolean: si el componente se reusa con otro isbn, vuelve a intentar
  const [isbnSinPortada, setIsbnSinPortada] = useState<string | null>(null);
  const medidas = MEDIDAS[size];

  // OpenLibrary devuelve un gif transparente de 1x1 si no tiene la portada;
  // con default=false responde 404 y así salta onError y mostramos el ícono
  const url = `https://covers.openlibrary.org/b/isbn/${isbn}-${medidas.letra}.jpg?default=false`;

  return (
    <View
      style={[styles.contenedor, styles[size], style]}
      accessible
      accessibilityRole="image"
      accessibilityLabel={titulo ? `Portada de ${titulo}` : 'Portada del libro'}
    >
      <LinearGradient colors={[paleta.silueta, paleta.superficie]} style={StyleSheet.absoluteFill} />
      {isbnSinPortada === isbn ? (
        <View style={styles.fallback}>
          <Ionicons name="book-outline" size={medidas.icono} color={paleta.textoSuave} />
        </View>
      ) : (
        <Image
          source={{ uri: url }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={200}
          onError={() => setIsbnSinPortada(isbn)}
        />
      )}
    </View>
  );
}

const crearEstilos = (paleta: Paleta) =>
  StyleSheet.create({
    contenedor: {
      overflow: 'hidden',
      borderRadius: radios.s,
      backgroundColor: paleta.silueta,
    },
    // siempre 2:3
    chica: { width: 40, height: 60 },
    mediana: { width: 80, height: 120 },
    grande: { width: 160, height: 240 },
    fallback: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
