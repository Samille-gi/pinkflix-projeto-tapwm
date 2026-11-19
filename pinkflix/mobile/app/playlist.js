import { useCallback, useState } from 'react';
import {
  ActivityIndicator, Alert, FlatList, KeyboardAvoidingView, Modal, Platform,
  Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { servidor, textoErro } from '../lib/servidor';
import { base, cores } from '../styles/tema';
import Botao from '../components/Botao';

const EM_BRANCO = { titulo: '', artista: 'Barbie', origem: '', favorita: false };

export default function Playlist() {
  const [musicas, setMusicas] = useState([]);
  const [busca, setBusca] = useState('');
  const [soFavoritas, setSoFavoritas] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  // formulário (abre numa janela por cima da lista)
  const [aberto, setAberto] = useState(false);
  const [form, setForm] = useState(EM_BRANCO);
  const [editandoId, setEditandoId] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [erroForm, setErroForm] = useState('');

  const carregar = useCallback(async () => {
    const params = {};
    if (busca.trim()) params.busca = busca.trim();
    if (soFavoritas) params.favoritas = 'true';
    try {
      const { data } = await servidor.get('/musicas', { params });
      setMusicas(data);
      setErro('');
    } catch (e) {
      setErro(textoErro(e, 'Não foi possível carregar a playlist'));
    } finally {
      setCarregando(false);
    }
  }, [busca, soFavoritas]);

  useFocusEffect(useCallback(() => {
    const espera = setTimeout(carregar, 300);
    return () => clearTimeout(espera);
  }, [carregar]));

  const mudar = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }));

  const abrir = (musica) => {
    setErroForm('');
    if (musica) {
      setForm({
        titulo: musica.titulo, artista: musica.artista ?? '', origem: musica.origem ?? '',
        favorita: musica.favorita
      });
      setEditandoId(musica._id);
    } else {
      setForm(EM_BRANCO);
      setEditandoId(null);
    }
    setAberto(true);
  };

  const salvar = async () => {
    setErroForm('');
    if (!form.titulo.trim()) return setErroForm('Qual é o nome da música? 🎵');
    setSalvando(true);
    const corpo = {
      titulo: form.titulo.trim(), artista: form.artista.trim(), origem: form.origem.trim(),
      favorita: form.favorita
    };
    try {
      if (editandoId) await servidor.put(`/musicas/${editandoId}`, corpo);
      else await servidor.post('/musicas', corpo);
      setAberto(false);
      carregar();
    } catch (e) {
      setErroForm(textoErro(e, 'Não foi possível salvar'));
    } finally {
      setSalvando(false);
    }
  };

  const excluir = () => {
    Alert.alert('Excluir música', `Tirar "${form.titulo}" da playlist?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await servidor.delete(`/musicas/${editandoId}`);
            setAberto(false);
            carregar();
          } catch (e) {
            setErroForm(textoErro(e));
          }
        }
      }
    ]);
  };

  const favoritar = async (m) => {
    setMusicas((lista) => lista.map((x) => (x._id === m._id ? { ...x, favorita: !x.favorita } : x)));
    try {
      await servidor.put(`/musicas/${m._id}`, { favorita: !m.favorita });
    } catch (e) {
      setErro(textoErro(e));
    }
    if (soFavoritas) carregar();
  };

  const cabecalho = (
    <View>
      <View style={estilos.painel}>
        <Text style={estilos.painelTitulo}>🎵 Minha playlist</Text>
        <Text style={estilos.painelSub}>{musicas.length} músicas dos filmes da Barbie</Text>
      </View>
      <TextInput
        style={[base.input, { marginTop: 12 }]}
        placeholder="🔍 Música, artista ou filme..."
        placeholderTextColor={cores.textoSuave}
        value={busca}
        onChangeText={setBusca}
      />
      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        {[[false, '🎶 Todas'], [true, '💖 Favoritas']].map(([valor, rotulo]) => {
          const ativo = soFavoritas === valor;
          return (
            <Pressable key={rotulo} onPress={() => setSoFavoritas(valor)} style={[base.chip, ativo && base.chipAtivo]}>
              <Text style={[base.chipTexto, ativo && base.chipTextoAtivo]}>{rotulo}</Text>
            </Pressable>
          );
        })}
      </View>
      {!!erro && <Text style={base.erro}>{erro}</Text>}
    </View>
  );

  return (
    <View style={base.tela}>
      {carregando ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" color={cores.rosa} />
      ) : (
        <FlatList
          data={musicas}
          keyExtractor={(m) => m._id}
          contentContainerStyle={{ padding: 14, paddingBottom: 100 }}
          ListHeaderComponent={cabecalho}
          ListEmptyComponent={<Text style={estilos.vazio}>🎤 Nenhuma música aqui ainda.</Text>}
          renderItem={({ item, index }) => (
            <Pressable style={estilos.faixa} onPress={() => abrir(item)}>
              <Text style={estilos.num}>{index + 1}</Text>
              <View style={{ flex: 1 }}>
                <Text style={estilos.titulo} numberOfLines={1}>{item.titulo}</Text>
                <Text style={estilos.detalhe} numberOfLines={1}>
                  {[item.artista, item.origem].filter(Boolean).join(' • ')}
                </Text>
              </View>
              <Pressable hitSlop={8} onPress={() => favoritar(item)} style={estilos.botaoIcone}>
                <Text style={{ fontSize: 18 }}>{item.favorita ? '💖' : '🤍'}</Text>
              </Pressable>
            </Pressable>
          )}
        />
      )}

      <Pressable style={estilos.mais} onPress={() => abrir(null)}>
        <Text style={estilos.maisTexto}>+</Text>
      </Pressable>

      <Modal visible={aberto} animationType="slide" transparent onRequestClose={() => setAberto(false)}>
        <KeyboardAvoidingView style={estilos.fundoModal} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={estilos.janela}>
            <ScrollView keyboardShouldPersistTaps="handled">
              <Text style={estilos.janelaTitulo}>{editandoId ? 'Editar música' : 'Nova música ✨'}</Text>

              <Text style={base.rotulo}>Nome da música *</Text>
              <TextInput style={base.input} value={form.titulo} onChangeText={(v) => mudar('titulo', v)} />
              <Text style={base.rotulo}>Artista</Text>
              <TextInput style={base.input} value={form.artista} onChangeText={(v) => mudar('artista', v)} />
              <Text style={base.rotulo}>Filme / álbum</Text>
              <TextInput style={base.input} value={form.origem} onChangeText={(v) => mudar('origem', v)} />
              <View style={estilos.linhaFav}>
                <Text style={[base.rotulo, { marginTop: 0 }]}>{form.favorita ? '💖' : '🤍'} Favorita</Text>
                <Switch
                  value={form.favorita}
                  onValueChange={(v) => mudar('favorita', v)}
                  trackColor={{ true: cores.rosa, false: cores.borda }}
                  thumbColor={cores.branco}
                />
              </View>

              {!!erroForm && <Text style={base.erro}>{erroForm}</Text>}

              <Botao titulo="Salvar 🎵" onPress={salvar} carregando={salvando} />
              {editandoId && <Botao titulo="Excluir" variante="perigo" onPress={excluir} />}
              <Botao titulo="Cancelar" variante="claro" onPress={() => setAberto(false)} />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const estilos = StyleSheet.create({
  painel: { backgroundColor: '#8a2bc2', borderRadius: 20, padding: 16 },
  painelTitulo: { color: cores.branco, fontSize: 20, fontWeight: 'bold' },
  painelSub: { color: cores.branco, opacity: 0.9, marginTop: 2 },
  faixa: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: cores.branco, borderRadius: 14, padding: 12, marginBottom: 8
  },
  num: { width: 24, textAlign: 'center', color: cores.textoSuave, fontWeight: 'bold' },
  titulo: { fontWeight: 'bold', color: cores.texto },
  detalhe: { color: cores.textoSuave, fontSize: 12, marginTop: 2 },
  botaoIcone: { padding: 4 },
  vazio: { textAlign: 'center', color: cores.textoSuave, marginTop: 40, fontSize: 16 },
  mais: {
    position: 'absolute', right: 20, bottom: 30,
    width: 62, height: 62, borderRadius: 31,
    backgroundColor: cores.rosa, alignItems: 'center', justifyContent: 'center', elevation: 6
  },
  maisTexto: { color: cores.branco, fontSize: 34, lineHeight: 38 },
  fundoModal: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(74,19,56,0.45)' },
  janela: {
    backgroundColor: cores.fundo, borderTopLeftRadius: 26, borderTopRightRadius: 26,
    padding: 20, paddingBottom: 34, maxHeight: '90%'
  },
  janelaTitulo: { fontSize: 20, fontWeight: 'bold', color: cores.rosa },
  linhaFav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }
});
