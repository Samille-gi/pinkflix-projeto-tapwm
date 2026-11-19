import { useCallback, useState } from 'react';
import {
  ActivityIndicator, FlatList, ImageBackground, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View
} from 'react-native';
import { Redirect, Stack, useFocusEffect, useRouter } from 'expo-router';
import { useSessao } from '../../lib/sessao';
import { servidor, textoErro } from '../../lib/servidor';
import { base, cores } from '../../styles/tema';
import CardItem from '../../components/CardItem';

const GLITTER = require('../../assets/img/glitter.jpg');
const PADRAO = require('../../assets/img/padrao-rosa.jpg');

const ABAS = [
  { id: 'tudo', rotulo: '✨ Tudo' },
  { id: 'filme', rotulo: '🎬 Filmes' },
  { id: 'jogo', rotulo: '🎮 Jogos' },
  { id: 'favoritos', rotulo: '💖 Favoritos' }
];

export default function Colecao() {
  const router = useRouter();
  const { conta, sair } = useSessao();
  const [itens, setItens] = useState([]);
  const [resumo, setResumo] = useState(null);
  const [aba, setAba] = useState('tudo');
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState('');

  const carregar = useCallback(async () => {
    const params = {};
    if (aba === 'filme' || aba === 'jogo') params.tipo = aba;
    if (aba === 'favoritos') params.favorito = 'true';
    if (busca.trim()) params.busca = busca.trim();
    try {
      const [lista, numeros] = await Promise.all([
        servidor.get('/itens', { params }),
        servidor.get('/itens/resumo')
      ]);
      setItens(lista.data);
      setResumo(numeros.data);
      setErro('');
    } catch (e) {
      setErro(textoErro(e, 'Não foi possível carregar a coleção'));
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, [aba, busca]);

  // recarrega quando a tela aparece (ex.: depois de salvar) e quando muda o filtro
  // (com uma pausa para a pessoa terminar de digitar)
  useFocusEffect(useCallback(() => {
    const espera = setTimeout(carregar, 300);
    return () => clearTimeout(espera);
  }, [carregar]));

  if (!conta) return <Redirect href="/" />;

  const favoritar = async (item) => {
    setItens((lista) => lista.map((i) => (i._id === item._id ? { ...i, favorito: !i.favorito } : i)));
    try {
      await servidor.put(`/itens/${item._id}`, { favorito: !item.favorito });
    } catch (e) {
      setErro(textoErro(e));
    }
    carregar();
  };

  const cabecalho = (
    <View>
      {resumo && (
        <ImageBackground source={GLITTER} style={estilos.painel} imageStyle={{ borderRadius: 20 }}>
          <Text style={estilos.ola}>Oi, {conta.nome.split(' ')[0]}! 💕</Text>
          <View style={estilos.numeros}>
            <Numero valor={resumo.total} rotulo="itens" />
            <Numero valor={resumo.filmes} rotulo="filmes" />
            <Numero valor={resumo.jogos} rotulo="jogos" />
            <Numero valor={resumo.mediaNota || '-'} rotulo="nota ♥" />
          </View>
        </ImageBackground>
      )}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 14 }}>
        {ABAS.map((a) => {
          const ativa = aba === a.id;
          return (
            <Pressable key={a.id} onPress={() => setAba(a.id)} style={[base.chip, ativa && base.chipAtivo]}>
              <Text style={[base.chipTexto, ativa && base.chipTextoAtivo]}>{a.rotulo}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <TextInput
        style={[base.input, { marginTop: 4, marginBottom: 6 }]}
        placeholder="🔍 Buscar pelo título..."
        placeholderTextColor={cores.textoSuave}
        value={busca}
        onChangeText={setBusca}
      />
      {!!erro && <Text style={base.erro}>{erro}</Text>}
    </View>
  );

  return (
    <ImageBackground source={PADRAO} style={base.tela} imageStyle={{ opacity: 0.22 }} resizeMode="cover">
      <Stack.Screen
        options={{
          headerRight: () => (
            <View style={{ flexDirection: 'row', gap: 16 }}>
              <Pressable onPress={() => router.push('/playlist')} hitSlop={8}>
                <Text style={estilos.acaoTopo}>🎵</Text>
              </Pressable>
              <Pressable onPress={sair} hitSlop={8}>
                <Text style={estilos.acaoTopo}>Sair</Text>
              </Pressable>
            </View>
          )
        }}
      />

      {carregando ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" color={cores.rosa} />
      ) : (
        <FlatList
          data={itens}
          keyExtractor={(i) => i._id}
          numColumns={2}
          contentContainerStyle={{ padding: 10, paddingBottom: 100 }}
          ListHeaderComponent={cabecalho}
          ListEmptyComponent={
            <Text style={estilos.vazio}>
              {aba !== 'tudo' || busca ? '🔎 Nada encontrado.' : '🎀 Sua coleção está vazia!\nToque no + para adicionar.'}
            </Text>
          }
          renderItem={({ item }) => (
            <View style={{ flex: 1 / 2 }}>
              <CardItem
                item={item}
                onAbrir={() => router.push(`/colecao/${item._id}`)}
                onFavoritar={() => favoritar(item)}
              />
            </View>
          )}
          refreshControl={
            <RefreshControl
              refreshing={atualizando}
              colors={[cores.rosa]}
              onRefresh={() => { setAtualizando(true); carregar(); }}
            />
          }
        />
      )}

      <Pressable style={estilos.mais} onPress={() => router.push('/colecao/novo')}>
        <Text style={estilos.maisTexto}>+</Text>
      </Pressable>
    </ImageBackground>
  );
}

function Numero({ valor, rotulo }) {
  return (
    <View style={estilos.numero}>
      <Text style={estilos.numeroValor}>{valor}</Text>
      <Text style={estilos.numeroRotulo}>{rotulo}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  acaoTopo: { color: cores.branco, fontWeight: 'bold', fontSize: 16 },
  painel: { backgroundColor: cores.rosa, borderRadius: 20, padding: 16, marginHorizontal: 6, overflow: 'hidden' },
  ola: {
    color: cores.branco, fontSize: 18, fontWeight: 'bold',
    textShadowColor: 'rgba(74,19,56,0.5)', textShadowRadius: 4, textShadowOffset: { width: 0, height: 1 }
  },
  numeros: { flexDirection: 'row', marginTop: 10, gap: 8 },
  numero: { flex: 1, backgroundColor: 'rgba(176,21,107,0.45)', borderRadius: 12, padding: 8, alignItems: 'center' },
  numeroValor: { color: cores.branco, fontSize: 22, fontWeight: 'bold' },
  numeroRotulo: { color: cores.branco, fontSize: 11 },
  vazio: { textAlign: 'center', color: cores.textoSuave, marginTop: 40, fontSize: 16, lineHeight: 24 },
  mais: {
    position: 'absolute', right: 20, bottom: 30,
    width: 62, height: 62, borderRadius: 31,
    backgroundColor: cores.rosa, alignItems: 'center', justifyContent: 'center',
    elevation: 6, shadowColor: cores.rosa, shadowOpacity: 0.4, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }
  },
  maisTexto: { color: cores.branco, fontSize: 34, lineHeight: 38 }
});
