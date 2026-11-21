import { router, useLocalSearchParams } from 'expo-router';

import { EstadoError } from '../../components/EstadoError';
import { PantallaPermiso } from '../../components/PantallaPermiso';
import type { Recurso } from '../../types';

function esRecurso(valor: string | undefined): valor is Recurso {
  return valor === 'camara' || valor === 'notificaciones';
}

export default function PermisosScreen() {
  const { recurso } = useLocalSearchParams<{ recurso: string }>();

  if (!esRecurso(recurso)) {
    return (
      <EstadoError
        titulo="Permiso desconocido"
        mensaje="No reconocemos el permiso que se quiso pedir."
        textoBoton="Cerrar"
        onReintentar={() => router.back()}
      />
    );
  }

  return <PantallaPermiso recurso={recurso} />;
}
