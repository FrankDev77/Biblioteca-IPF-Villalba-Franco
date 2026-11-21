import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { espaciado, radios, sombras, tipografia, type Paleta } from '../constants/tema';
import { useEstilos } from '../hooks/useEstilos';
import { useTema } from '../hooks/useTema';
import { useBiblioteca } from '../context/BibliotecaProvider';
import { LIBROS } from '../data/libros';
import { usePermiso } from '../hooks/usePermiso';
import { estadoVencimiento, formatearFecha } from '../lib/fechas';
import * as haptica from '../lib/haptica';
import type { Prestamo } from '../types';
import { PortadaLibro } from './PortadaLibro';

type Props = {
  prestamo: Prestamo;
  onDevolver: (isbn: string) => void;
};

export function PrestamoCard({ prestamo, onDevolver }: Props) {
  const styles = useEstilos(crearEstilos);
  const { paleta } = useTema();
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
      <View style={styles.cabecera}>
        <PortadaLibro isbn={prestamo.isbn} size="chica" titulo={titulo} style={styles.portada} />
        <View style={styles.cabeceraTexto}>
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
        </View>
      </View>
      <View style={styles.fila}>
        <View style={styles.recordatorio}>
          <Switch
            value={prestamo.notificacionId !== null}
            onValueChange={(activo) => {
              void cambiarRecordatorio(activo);
            }}
            disabled={procesando}
            trackColor={{ false: paleta.borde, true: paleta.primario }}
            accessibilityLabel={`Recordarme el vencimiento de ${titulo}`}
          />
          <Text style={styles.recordatorioTexto}>Recordarme</Text>
        </View>
        <Pressable
          onPress={() => {
            void haptica.impactoLigero();
            onDevolver(prestamo.isbn);
          }}
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

const crearEstilos = (paleta: Paleta) =>
  StyleSheet.create({
    card: {
      padding: espaciado.l,
      borderRadius: radios.m,
      backgroundColor: paleta.superficie,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: paleta.borde,
      ...sombras.card,
    },
    cabecera: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    portada: {
      marginRight: espaciado.m,
    },
    cabeceraTexto: {
      flex: 1,
    },
    titulo: {
      ...tipografia.subtitulo,
      color: paleta.texto,
    },
    autor: {
      ...tipografia.cuerpo,
      color: paleta.textoSuave,
      marginTop: espaciado.xs,
    },
    vence: {
      ...tipografia.pie,
      color: paleta.textoSuave,
      marginTop: espaciado.s,
    },
    venceVencido: {
      color: paleta.error,
      fontWeight: '600',
    },
    vencePorVencer: {
      color: paleta.alerta,
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
      color: paleta.textoSuave,
    },
    boton: {
      minHeight: 44,
      minWidth: 44,
      justifyContent: 'center',
      paddingHorizontal: espaciado.l,
      borderRadius: radios.m,
      borderWidth: 1,
      borderColor: paleta.primario,
    },
    botonPresionado: {
      opacity: 0.7,
    },
    botonTexto: {
      ...tipografia.cuerpo,
      fontWeight: '600',
      color: paleta.primario,
    },
    error: {
      ...tipografia.pie,
      color: paleta.error,
      marginTop: espaciado.s,
    },
  });
