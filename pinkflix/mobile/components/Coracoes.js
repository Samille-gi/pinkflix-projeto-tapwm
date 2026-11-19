import { Pressable, Text, View } from 'react-native';
import { cores } from '../styles/tema';

// Nota de 0 a 5 em corações. Com onChange vira clicável.
export default function Coracoes({ valor = 0, onChange, tamanho = 16 }) {
  return (
    <View style={{ flexDirection: 'row' }}>
      {[1, 2, 3, 4, 5].map((n) => {
        const cheio = n <= valor;
        const coracao = (
          <Text style={{ fontSize: tamanho, color: cheio ? cores.rosa : cores.borda, marginRight: 2 }}>
            {cheio ? '♥' : '♡'}
          </Text>
        );
        return onChange ? (
          <Pressable key={n} onPress={() => onChange(n === valor ? 0 : n)} hitSlop={6}>
            {coracao}
          </Pressable>
        ) : (
          <View key={n}>{coracao}</View>
        );
      })}
    </View>
  );
}
