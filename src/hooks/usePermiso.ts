import { useCameraPermissions, type PermissionResponse } from 'expo-camera';
import * as Notifications from 'expo-notifications';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { AppState, Linking } from 'react-native';

import { asegurarCanalPrestamos } from '../lib/notificaciones';
import type { Recurso } from '../types';
import type { EstadoPermiso } from '../types/biblioteca';

// 4 estados y no un boolean: cargando mientras consultamos, preguntable si podemos volver a pedir,
// bloqueado si el usuario eligió no permitir y el sistema ya no deja volver a pedir (D1)
function derivarEstado(respuesta: PermissionResponse): EstadoPermiso {
  if (respuesta.granted) return { tipo: 'concedido' };
  return respuesta.canAskAgain ? { tipo: 'preguntable' } : { tipo: 'bloqueado' };
}

export function usePermiso(recurso: Recurso) {
  const [estado, setEstado] = useState<EstadoPermiso>({ tipo: 'cargando' });
  const [, pedirCamara, consultarCamara] = useCameraPermissions({ get: false });

  const consultar = useCallback(async () => {
    const respuesta =
      recurso === 'camara' ? await consultarCamara() : await Notifications.getPermissionsAsync();
    setEstado(derivarEstado(respuesta));
  }, [recurso, consultarCamara]);

  const pedir = useCallback(async () => {
    let respuesta: PermissionResponse;
    if (recurso === 'camara') {
      respuesta = await pedirCamara();
    } else {
      await asegurarCanalPrestamos();
      respuesta = await Notifications.requestPermissionsAsync();
    }
    setEstado(derivarEstado(respuesta));
  }, [recurso, pedirCamara]);

  const abrirAjustes = useCallback(() => {
    void Linking.openSettings();
  }, []);

  useFocusEffect(
    useCallback(() => {
      void consultar();
    }, [consultar]),
  );

  // al volver de Ajustes la pantalla nunca perdió el foco, así que hay que reconsultar a mano
  useEffect(() => {
    const suscripcion = AppState.addEventListener('change', (estadoApp) => {
      if (estadoApp === 'active') void consultar();
    });
    return () => suscripcion.remove();
  }, [consultar]);

  return { estado, pedir, abrirAjustes };
}
