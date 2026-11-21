import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export const CANAL_PRESTAMOS = 'prestamos';

// sin handler, una notificación que llega con la app abierta no se muestra
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function asegurarCanalPrestamos(): Promise<void> {
  if (Platform.OS !== 'android') return;
  const existente = await Notifications.getNotificationChannelAsync(CANAL_PRESTAMOS);
  if (existente) return;
  await Notifications.setNotificationChannelAsync(CANAL_PRESTAMOS, {
    name: 'Préstamos',
    importance: Notifications.AndroidImportance.HIGH,
  });
}

export async function notificarLibroListo(titulo: string): Promise<void> {
  await asegurarCanalPrestamos();
  await Notifications.scheduleNotificationAsync({
    content: { title: 'Libro listo', body: `Tu libro ${titulo} está listo para retirar` },
    // solo channelId equivale a trigger null (inmediata) pero en el canal de préstamos
    trigger: { channelId: CANAL_PRESTAMOS },
  });
}
