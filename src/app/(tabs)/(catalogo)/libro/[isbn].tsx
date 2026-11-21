import { router, Stack, useLocalSearchParams } from 'expo-router';

import { DetalleLibro } from '../../../../components/DetalleLibro';
import { EstadoError } from '../../../../components/EstadoError';

const ISBN_VALIDO = /^\d{13}$/;

export default function LibroScreen() {
  const { isbn } = useLocalSearchParams<{ isbn: string }>();

  if (!ISBN_VALIDO.test(isbn ?? '')) {
    return (
      <>
        <Stack.Screen options={{ title: 'Libro' }} />
        <EstadoError
          titulo="ISBN inválido"
          mensaje="ISBN inválido: debe tener 13 dígitos"
          textoBoton="Ir al catálogo"
          onReintentar={() => router.navigate('/')}
        />
      </>
    );
  }

  // la pantalla de tabs no se desmonta al cambiar de isbn; con la key se remonta
  // y una respuesta del isbn anterior no pisa al nuevo
  return <DetalleLibro key={isbn} isbn={isbn} />;
}
