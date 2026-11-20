import { useLocalSearchParams } from 'expo-router';

import { PantallaPlaceholder } from '../../components/PantallaPlaceholder';
import type { Recurso } from '../../types';

export default function PermisosScreen() {
  const { recurso } = useLocalSearchParams<{ recurso: Recurso }>();
  return <PantallaPlaceholder titulo="Permisos" detalle={recurso} />;
}
