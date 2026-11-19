import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { linkCapa } from '../lib/servidor';
import { STATUS, TIPOS } from '../lib/constantes';
import { cores } from '../styles/tema';
import Coracoes from './Coracoes';

export default function CardItem({ item, onAbrir, onFavoritar }) {
  const capa = linkCapa(item.capa);
  const status = STATUS[item.status];

  return (
    <Pressable style={estilos.card} onPress={onAbrir}>
      <View style={estilos.capa}>
        {capa ? (
          <Image source={{ uri: capa }} style={StyleSheet.absoluteFill} resizeMode="cover" />
        ) : (
          <View style={[estilos.capaVazia, item.tipo === 'jogo' && { backgroundColor: '#e2c6ff' }]}>
            <Text style={{ fontSize: 42 }}>{TIPOS[item.tipo].emoji}</Text>
          </View>
        )}
        <Pressable style={estilos.fav} onPress={onFavoritar} hitSlop={8}>
          <Text style={{ fontSize: 18 }}>{item.favorito ? '💖' : '🤍'}</Text>
        </Pressable>
        <Text style={estilos.seloTipo}>{TIPOS[item.tipo].emoji} {TIPOS[item.tipo].rotulo}</Text>
      </View>

      <View style={estilos.info}>
        <Text style={estilos.titulo} numberOfLines={2}>{item.titulo}</Text>
        <Text style={estilos.detalhe} numberOfLines={1}>
          {[item.ano, item.plataforma].filter(Boolean).join(' • ') || ' '}
        </Text>
        <Coracoes valor={item.nota} tamanho={14} />
        <Text style={[estilos.status, { backgroundColor: status.fundo, color: status.cor }]}>
          {status.emoji} {status.rotulo}
        </Text>
      </View>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  card: {
    flex: 1,
    margin: 6,
    backgroundColor: cores.branco,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: cores.rosa,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 }
  },
  capa: { aspectRatio: 2 / 3, backgroundColor: cores.rosaClaro },
  capaVazia: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffc2e2' },
  fav: {
    position: 'absolute', top: 6, right: 6,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 20, width: 36, height: 36,
    alignItems: 'center', justifyContent: 'center'
  },
  seloTipo: {
    position: 'absolute', left: 6, bottom: 6,
    backgroundColor: 'rgba(255,255,255,0.92)',
    color: cores.rosaEscuro, fontSize: 11, fontWeight: 'bold',
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, overflow: 'hidden'
  },
  info: { padding: 10, gap: 3 },
  titulo: { fontWeight: 'bold', color: cores.texto },
  detalhe: { fontSize: 12, color: cores.textoSuave },
  status: {
    alignSelf: 'flex-start', marginTop: 4,
    fontSize: 11, fontWeight: 'bold',
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, overflow: 'hidden'
  }
});
