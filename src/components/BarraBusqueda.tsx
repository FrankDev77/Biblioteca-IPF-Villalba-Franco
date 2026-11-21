import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, TextInput, View } from 'react-native';

import { colores, espaciado, radios, tipografia } from '../constants/tema';

type Props = {
  value: string;
  onChangeText: (texto: string) => void;
};

export function BarraBusqueda({ value, onChangeText }: Props) {
  return (
    <View style={styles.contenedor}>
      <Ionicons
        name="search"
        size={20}
        color={colores.claro.textoSuave}
        accessibilityElementsHidden
        importantForAccessibility="no"
      />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="Buscar por título o autor"
        placeholderTextColor={colores.claro.textoSuave}
        accessibilityLabel="Buscar por título o autor"
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
        clearButtonMode="while-editing"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    paddingHorizontal: espaciado.m,
    borderRadius: radios.m,
    borderWidth: 1,
    borderColor: colores.claro.borde,
    backgroundColor: colores.claro.superficie,
  },
  input: {
    ...tipografia.cuerpo,
    flex: 1,
    minHeight: 44,
    marginLeft: espaciado.s,
    color: colores.claro.texto,
  },
});
