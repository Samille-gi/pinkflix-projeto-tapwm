import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { cores } from '../styles/tema';

// variante: 'rosa' | 'claro' | 'perigo'
export default function Botao({ titulo, onPress, variante = 'rosa', carregando = false, style }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={carregando}
      style={({ pressed }) => [estilos.base, estilos[variante], pressed && { opacity: 0.8 }, style]}
    >
      {carregando ? (
        <ActivityIndicator color={variante === 'rosa' ? cores.branco : cores.rosa} />
      ) : (
        <Text style={[estilos.texto, variante !== 'rosa' && { color: variante === 'perigo' ? cores.vermelho : cores.rosa }]}>
          {titulo}
        </Text>
      )}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  base: {
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    marginTop: 12
  },
  rosa: { backgroundColor: cores.rosa },
  claro: { backgroundColor: cores.branco, borderColor: cores.rosaClaro },
  perigo: { backgroundColor: cores.branco, borderColor: cores.vermelho },
  texto: { color: cores.branco, fontWeight: 'bold', fontSize: 16 }
});
