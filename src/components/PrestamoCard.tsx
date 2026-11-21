import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { colores, espaciado, radios, sombras, tipografia } from '../constants/tema';
import { useBiblioteca } from '../context/BibliotecaProvider';
import { LIBROS } from '../data/libros';
import { usePermiso } from '../hooks/usePermiso';
import { estadoVencimiento, formatearFecha } from '../lib/fechas';
import type { Prestamo } from '../types';

type Props = {
  prestamo: Prestamo;
  onDevolver: (isbn: string) => void;
};

export function PrestamoCard({ prestamo, onDevolver }: Props) {
  const libro = LIBROS.find((l) => l.isbn === prestamo.isbn);
  const titulo = libro?.titulo ?? prestamo.isbn;
  const vencimiento = estadoVencimiento(prestamo.hasta);
  const { activarRecordatorio } = useBiblioteca();
  const { estado: permiso } = usePermiso('notificaciones');
  const [procesando, setProcesando] = useState(false);
  const [errorRecordatorio, setErrorRecordatorio] = useState<string | null>(null);

  const cambiarRecordatorio = async (activo: boolean) => {
    if (activo && permiso.tipo === 'bloqueado') {
      router.push('/permisos/notificaciones');
      return;
    }
    setProcesando(true);
    setErrorRecordatorio(null);
    try {
      await activarRecordatorio(prestamo.isbn, activo);
    } catch (e: unknown) {
      setErrorRecordatorio(e instanceof Error ? e.message : 'No pudimos programar el recordatorio.');
    } finally {
      setProcesando(false);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.titulo}>{titulo}</Text>
      {libro ? <Text style={styles.autor}>{libro.autor}</Text> : null}
      <Text
        style={[
          styles.vence,
          vencimiento === 'vencido' && styles.venceVencido,
          vencimiento === 'por-vencer' && styles.vencePorVencer,
        ]}
      >
        {vencimiento === 'vencido' ? 'Venció el' : 'Vence el'} {formatearFecha(prestamo.hasta)}
      </Text>
      <View style={styles.fila}>
        <View style={styles.recordatorio}>
          <Switch
            value={prestamo.notificacionId !== null}
            onValueChange={(activo) => {
              void cambiarRecordatorio(activo);
            }}
            disabled={procesando}
            trackColor={{ false: colores.claro.borde, true: colores.claro.primario }}
            accessibilityLabel={`Recordarme el vencimiento de ${titulo}`}
          />
          <Text style={styles.recordatorioTexto}>Recordarme</Text>
        </View>
        <Pressable
          onPress={() => onDevolver(prestamo.isbn)}
          accessibilityRole="button"
          accessibilityLabel={`Devolver ${titulo}`}
          style={({ pressed }) => [styles.boton, pressed && styles.botonPresionado]}
        >
          <Text style={styles.botonTexto}>Devolver</Text>
        </Pressable>
      </View>
      {errorRecordatorio ? (
        <Text style={styles.error} accessibilityRole="alert">
          {errorRecordatorio}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: espaciado.l,
    borderRadius: radios.m,
    backgroundColor: colores.claro.superficie,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colores.claro.borde,
    ...sombras.card,
  },
  titulo: {
    ...tipografia.subtitulo,
    color: colores.claro.texto,
  },
  autor: {
    ...tipografia.cuerpo,
    color: colores.claro.textoSuave,
    marginTop: espaciado.xs,
  },
  vence: {
    ...tipografia.pie,
    color: colores.claro.textoSuave,
    marginTop: espaciado.s,
  },
  venceVencido: {
    color: colores.claro.error,
    fontWeight: '600',
  },
  vencePorVencer: {
    color: colores.claro.alerta,
    fontWeight: '600',
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: espaciado.m,
  },
  recordatorio: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaciado.s,
  },
  recordatorioTexto: {
    ...tipografia.cuerpo,
    color: colores.claro.textoSuave,
  },
  boton: {
    minHeight: 44,
    minWidth: 44,
    justifyContent: 'center',
    paddingHorizontal: espaciado.l,
    borderRadius: radios.m,
    borderWidth: 1,
    borderColor: colores.claro.primario,
  },
  botonPresionado: {
    opacity: 0.7,
  },
  botonTexto: {
    ...tipografia.cuerpo,
    fontWeight: '600',
    color: colores.claro.primario,
  },
  error: {
    ...tipografia.pie,
    color: colores.claro.error,
    marginTop: espaciado.s,
  },
});
