import { useLocalSearchParams } from 'expo-router';

import { PantallaPlaceholder } from '../../components/PantallaPlaceholder';

export default function ReservarScreen() {
  const { isbn } = useLocalSearchParams<{ isbn: string }>();
  return <PantallaPlaceholder titulo="Reservar" detalle={`ISBN: ${isbn}`} />;
}
