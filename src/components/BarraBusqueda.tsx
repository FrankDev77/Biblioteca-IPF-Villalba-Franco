import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, TextInput, View } from 'react-native';

import { espaciado, radios, tipografia, type Paleta } from '../constants/tema';
import { useEstilos } from '../hooks/useEstilos';
import { useTema } from '../hooks/useTema';

type Props = {
  value: string;
  onChangeText: (texto: string) => void;
};

export function BarraBusqueda({ value, onChangeText }: Props) {
  const styles = useEstilos(crearEstilos);
  const { paleta } = useTema();
  return (
    <View style={styles.contenedor}>
      <Ionicons
        name="search"
        size={20}
        color={paleta.textoSuave}
        accessibilityElementsHidden
        importantForAccessibility="no"
      />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="Buscar por título o autor"
        placeholderTextColor={paleta.textoSuave}
        accessibilityLabel="Buscar por título o autor"
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
        clearButtonMode="while-editing"
      />
    </View>
  );
}

const crearEstilos = (paleta: Paleta) =>
  StyleSheet.create({
    contenedor: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: 44,
      paddingHorizontal: espaciado.m,
      borderRadius: radios.m,
      borderWidth: 1,
      borderColor: paleta.borde,
      backgroundColor: paleta.superficie,
    },
    input: {
      ...tipografia.cuerpo,
      flex: 1,
      minHeight: 44,
      marginLeft: espaciado.s,
      color: paleta.texto,
    },
  });
