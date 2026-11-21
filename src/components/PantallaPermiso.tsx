import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useEffect, useRef, type ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colores, espaciado, radios, tipografia } from '../constants/tema';
import { usePermiso } from '../hooks/usePermiso';
import type { Recurso } from '../types';
import type { EstadoPermiso } from '../types/biblioteca';
import { EstadoCargando } from './EstadoCargando';

const TEXTOS: Record<Recurso, { titulo: string; mensaje: string; icono: ComponentProps<typeof Ionicons>['name'] }> = {
  camara: {
    titulo: 'Permiso de cámara',
    mensaje:
      'Usamos la cámara para escanear el código de barras del libro y abrir su detalle sin que tengas que escribir el ISBN.',
    icono: 'camera-outline',
  },
  notificaciones: {
    titulo: 'Permiso de notificaciones',
    mensaje:
      'Usamos notificaciones para recordarte cuando vence un préstamo y para avisarte cuando un libro que esperás está listo.',
    icono: 'notifications-outline',
  },
};

type Accion = {
  texto: string;
  ayuda: string | null;
  onPress: () => void;
};

function accionPara(estado: EstadoPermiso, pedir: () => void, abrirAjustes: () => void): Accion | null {
  switch (estado.tipo) {
    case 'cargando':
    case 'concedido':
      return null;
    case 'preguntable':
      return { texto: 'Continuar', ayuda: null, onPress: pedir };
    case 'bloqueado':
      return {
        texto: 'Abrir Ajustes',
        ayuda: 'Lo desactivaste antes. Para usarlo, habilitá el permiso desde los Ajustes del teléfono.',
        onPress: abrirAjustes,
      };
    default: {
      const exhaustivo: never = estado;
      return exhaustivo;
    }
  }
}

type Props = {
  recurso: Recurso;
};

export function PantallaPermiso({ recurso }: Props) {
  const { estado, pedir, abrirAjustes } = usePermiso(recurso);
  const concedidoYaManejado = useRef(false);
  const textos = TEXTOS[recurso];

  useEffect(() => {
    if (estado.tipo !== 'concedido' || concedidoYaManejado.current) return;
    concedidoYaManejado.current = true;
    router.back();
  }, [estado]);

  const accion = accionPara(estado, () => void pedir(), abrirAjustes);

  if (!accion) {
    return <EstadoCargando texto="Consultando permiso…" />;
  }

  return (
    <View style={styles.contenedor}>
      <Ionicons
        name={textos.icono}
        size={56}
        color={colores.claro.primario}
        accessibilityElementsHidden
        importantForAccessibility="no"
      />
      <Text style={styles.titulo} accessibilityRole="header">
        {textos.titulo}
      </Text>
      <Text style={styles.mensaje}>{textos.mensaje}</Text>
      {accion.ayuda ? <Text style={styles.ayuda}>{accion.ayuda}</Text> : null}
      <Pressable
        onPress={accion.onPress}
        accessibilityRole="button"
        accessibilityLabel={accion.texto}
        style={({ pressed }) => [styles.boton, styles.botonPrimario, pressed && styles.botonPresionado]}
      >
        <Text style={[styles.botonTexto, styles.botonTextoPrimario]}>{accion.texto}</Text>
      </Pressable>
      <Pressable
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel="Cancelar"
        style={({ pressed }) => [styles.boton, pressed && styles.botonPresionado]}
      >
        <Text style={[styles.botonTexto, styles.botonTextoSecundario]}>Cancelar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: espaciado.xl,
    backgroundColor: colores.claro.fondo,
  },
  titulo: {
    ...tipografia.titulo,
    color: colores.claro.texto,
    textAlign: 'center',
    marginTop: espaciado.l,
  },
  mensaje: {
    ...tipografia.cuerpo,
    color: colores.claro.textoSuave,
    textAlign: 'center',
    marginTop: espaciado.m,
  },
  ayuda: {
    ...tipografia.pie,
    color: colores.claro.alerta,
    textAlign: 'center',
    marginTop: espaciado.m,
  },
  boton: {
    alignSelf: 'stretch',
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: espaciado.m,
    borderRadius: radios.m,
  },
  botonPrimario: {
    marginTop: espaciado.xl,
    backgroundColor: colores.claro.primario,
  },
  botonPresionado: {
    opacity: 0.8,
  },
  botonTexto: {
    ...tipografia.cuerpo,
    fontWeight: '600',
  },
  botonTextoPrimario: {
    color: colores.claro.superficie,
  },
  botonTextoSecundario: {
    color: colores.claro.primario,
  },
});
