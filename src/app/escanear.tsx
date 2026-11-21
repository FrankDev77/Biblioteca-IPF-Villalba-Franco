import { CameraView, type BarcodeScanningResult } from 'expo-camera';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { BotonFlotante } from '../components/BotonFlotante';
import { EntradaIsbnManual } from '../components/EntradaIsbnManual';
import { EstadoCargando } from '../components/EstadoCargando';
import { EstadoError } from '../components/EstadoError';
import { MarcoEscaner } from '../components/MarcoEscaner';
import { type Paleta } from '../constants/tema';
import { useEstilos } from '../hooks/useEstilos';
import { usePermiso } from '../hooks/usePermiso';
import { buscarEnCatalogo } from '../lib/isbn';

export default function EscanearScreen() {
  const styles = useEstilos(crearEstilos);
  const { manual } = useLocalSearchParams<{ manual?: string }>();
  const enManual = manual === '1';
  const { estado } = usePermiso('camara');
  const previaMostrada = useRef(false);
  // useRef y no useState: el callback se dispara varias veces por segundo y un setState
  // recién se ve en el próximo render, así que la segunda lectura todavía vería false (C2)
  const escaneadoRef = useRef(false);
  const ultimoDesconocido = useRef<string | null>(null);

  useEffect(() => {
    if (enManual || previaMostrada.current) return;
    if (estado.tipo === 'preguntable' || estado.tipo === 'bloqueado') {
      previaMostrada.current = true;
      // push y no replace: cuando el modal concede y hace back() volvemos a la cámara.
      // Se muestra una sola vez; si cancela queda la pantalla de "sin acceso" y no un loop
      router.push('/permisos/camara');
    }
  }, [estado, enManual]);

  const abrirLibro = (isbn: string) => {
    // replace: "atrás" desde el detalle no tiene que volver a la cámara (C2c)
    router.replace({ pathname: '/libro/[isbn]', params: { isbn } });
  };

  const onEscaneado = ({ data }: BarcodeScanningResult) => {
    if (escaneadoRef.current) return;
    escaneadoRef.current = true;

    const codigo = data.trim();
    if (buscarEnCatalogo(codigo)) {
      abrirLibro(codigo);
      return;
    }

    // el mismo código sigue frente a la cámara al cerrar el aviso; sin esto reaparece en loop (C2d)
    if (ultimoDesconocido.current === codigo) {
      escaneadoRef.current = false;
      return;
    }
    ultimoDesconocido.current = codigo;
    Alert.alert('ISBN desconocido', 'Ese código no está en el catálogo.', [
      {
        text: 'OK',
        onPress: () => {
          escaneadoRef.current = false;
        },
      },
    ], { cancelable: false });
  };

  const irAManual = () => router.setParams({ manual: '1' });

  if (enManual) {
    return (
      <EntradaIsbnManual
        onEncontrado={abrirLibro}
        onUsarCamara={() => router.setParams({ manual: '' })}
      />
    );
  }

  if (estado.tipo === 'cargando') {
    return <EstadoCargando texto="Preparando la cámara…" />;
  }

  if (estado.tipo !== 'concedido') {
    return (
      <View style={styles.contenedor}>
        <EstadoError
          titulo="Sin acceso a la cámara"
          mensaje="Podés dar el permiso o escribir el ISBN a mano."
          textoBoton="Dar permiso"
          onReintentar={() => router.push('/permisos/camara')}
        />
        <BotonFlotante texto="Escribir ISBN a mano" icono="create-outline" onPress={irAManual} />
      </View>
    );
  }

  return (
    <View style={styles.camara}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['ean13'] }}
        onBarcodeScanned={onEscaneado}
      />
      <MarcoEscaner />
      <BotonFlotante texto="Escribir ISBN a mano" icono="create-outline" onPress={irAManual} />
    </View>
  );
}

const crearEstilos = (paleta: Paleta) =>
  StyleSheet.create({
    contenedor: {
      flex: 1,
      backgroundColor: paleta.fondo,
    },
    camara: {
      flex: 1,
      backgroundColor: paleta.velo,
    },
  });
