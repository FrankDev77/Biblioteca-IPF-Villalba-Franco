import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

export function useReducirMovimiento(): boolean {
  const [reducir, setReducir] = useState(false);

  useEffect(() => {
    let cancelado = false;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((valor) => {
        if (!cancelado) setReducir(valor);
      })
      .catch(() => undefined);

    const suscripcion = AccessibilityInfo.addEventListener('reduceMotionChanged', setReducir);
    return () => {
      cancelado = true;
      suscripcion.remove();
    };
  }, []);

  return reducir;
}
