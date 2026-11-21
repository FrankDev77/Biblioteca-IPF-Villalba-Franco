import * as Notifications from 'expo-notifications';
import { useCallback } from 'react';

import { asegurarCanalPrestamos, CANAL_PRESTAMOS } from '../lib/notificaciones';

export function useRecordatorio() {
  const programar = useCallback(async (isbn: string, titulo: string): Promise<string> => {
    // el canal va antes del permiso: en Android 13+ el diálogo de notificaciones no aparece
    // si la app todavía no creó ningún canal (D2c)
    await asegurarCanalPrestamos();

    let permiso = await Notifications.getPermissionsAsync();
    if (!permiso.granted && permiso.canAskAgain) {
      permiso = await Notifications.requestPermissionsAsync();
    }
    if (!permiso.granted) {
      throw new Error('Sin permiso para enviar notificaciones.');
    }

    return Notifications.scheduleNotificationAsync({
      content: { title: 'Devolvé tu libro', body: titulo, data: { isbn } },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        // demo: en produccion seria hasta - 1 dia
        seconds: 15,
        channelId: CANAL_PRESTAMOS,
      },
    });
  }, []);

  const cancelar = useCallback(async (id: string | null): Promise<void> => {
    if (id === null) return;
    await Notifications.cancelScheduledNotificationAsync(id);
  }, []);

  return { programar, cancelar };
}
