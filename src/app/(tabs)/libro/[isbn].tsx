import { useLocalSearchParams } from 'expo-router';

import { PantallaPlaceholder } from '../../../components/PantallaPlaceholder';

export default function LibroScreen() {
  const { isbn } = useLocalSearchParams<{ isbn: string }>();
  return <PantallaPlaceholder titulo="Detalle del libro" detalle={`ISBN: ${isbn}`} />;
}
