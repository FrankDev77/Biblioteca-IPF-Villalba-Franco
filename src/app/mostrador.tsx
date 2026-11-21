import * as Notifications from 'expo-notifications';
import { router, Stack } from 'expo-router';
import { Alert, FlatList, StyleSheet, View } from 'react-native';

import { BotonCerrarSesion } from '../components/BotonCerrarSesion';
import { EstadoVacio } from '../components/EstadoVacio';
import { ItemMostrador } from '../components/ItemMostrador';
import { colores, espaciado } from '../constants/tema';
import { useBiblioteca } from '../context/BibliotecaProvider';
import { notificarLibroListo } from '../lib/notificaciones';
import type { LibroConCola } from '../types/biblioteca';

export default function MostradorScreen() {
  const { sesion, librosConCola, entregarAlSiguiente, cerrarSesion } = useBiblioteca();
  const libros = librosConCola();

  const salir = () => {
    cerrarSesion();
    router.replace('/');
  };

  const entregar = async (libro: LibroConCola) => {
    const resultado = entregarAlSiguiente(libro.isbn);
    if (!resultado) return;

    if (!resultado.siguienteSoyYo) {
      Alert.alert('Entregado', `Libro entregado a ${resultado.entregado}`);
      return;
    }

    // si no hay permiso no se avisa acá: el préstamo nuevo ya aparece en /reservas
    const permiso = await Notifications.getPermissionsAsync();
    if (permiso.granted) {
      await notificarLibroListo(libro.titulo).catch(() => undefined);
    }
  };

  return (
    <View style={styles.contenedor}>
      <Stack.Screen
        options={{
          title: `Mostrador · ${sesion?.usuario ?? ''}`,
          headerRight: () => <BotonCerrarSesion onPress={salir} />,
        }}
      />
      <FlatList
        data={libros}
        keyExtractor={(l) => l.isbn}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={<EstadoVacio mensaje="No hay reservas pendientes" />}
        ItemSeparatorComponent={Separador}
        renderItem={({ item }) => (
          <ItemMostrador libro={item} onEntregar={(l) => void entregar(l)} />
        )}
      />
    </View>
  );
}

function Separador() {
  return <View style={styles.separador} />;
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colores.claro.fondo,
  },
  lista: {
    flexGrow: 1,
    padding: espaciado.l,
  },
  separador: {
    height: espaciado.m,
  },
});
