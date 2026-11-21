import * as Haptics from 'expo-haptics';

// no todos los dispositivos tienen motor de vibración: si falla, la acción sigue igual
async function sinFallar(accion: () => Promise<void>): Promise<void> {
  try {
    await accion();
  } catch {
    // nada que hacer, el háptico es un extra
  }
}

export function exito(): Promise<void> {
  return sinFallar(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
}

export function error(): Promise<void> {
  return sinFallar(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error));
}

export function advertencia(): Promise<void> {
  return sinFallar(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning));
}

export function impactoLigero(): Promise<void> {
  return sinFallar(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
}

export function impactoMedio(): Promise<void> {
  return sinFallar(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium));
}
