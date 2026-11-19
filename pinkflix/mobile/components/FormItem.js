import { useEffect, useState } from 'react';
import {
  ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform,
  Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { servidor, enviarCapa, linkCapa, textoErro } from '../lib/servidor';
import { STATUS, TIPOS } from '../lib/constantes';
import { base, cores } from '../styles/tema';
import Botao from './Botao';
import Coracoes from './Coracoes';

const EM_BRANCO = {
  titulo: '', tipo: 'filme', ano: '', plataforma: '', nota: 0,
  status: 'quero', favorito: false, comentario: '', capa: null
};

function Chips({ opcoes, valor, onChange }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
      {Object.entries(opcoes).map(([id, o]) => {
        const ativo = valor === id;
        return (
          <Pressable key={id} onPress={() => onChange(id)} style={[base.chip, ativo && base.chipAtivo]}>
            <Text style={[base.chipTexto, ativo && base.chipTextoAtivo]}>{o.emoji} {o.rotulo}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// Usado tanto para criar (sem id) quanto para editar (com id)
export default function FormItem({ id }) {
  const router = useRouter();
  const editando = Boolean(id);

  const [item, setItem] = useState(EM_BRANCO);
  const [fotoNova, setFotoNova] = useState(null);
  const [carregando, setCarregando] = useState(editando);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (!editando) return;
    servidor.get(`/itens/${id}`)
      .then(({ data }) => setItem({
        ...EM_BRANCO,
        ...data,
        ano: data.ano ? String(data.ano) : '',
        plataforma: data.plataforma ?? '',
        comentario: data.comentario ?? ''
      }))
      .catch((e) => setErro(textoErro(e, 'Item não encontrado')))
      .finally(() => setCarregando(false));
  }, [id, editando]);

  const mudar = (campo, valor) => setItem((atual) => ({ ...atual, [campo]: valor }));

  // opções da foto: recorta no formato de capa (2:3) e comprime um pouco
  const OPCOES_FOTO = { mediaTypes: ['images'], allowsEditing: true, aspect: [2, 3], quality: 0.7 };

  // 📸 Exclusivo do app: fotografar a capa (ex.: o DVD de verdade)
  const tirarFoto = async () => {
    const permissao = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert('Permissão negada', 'Libere o acesso à câmera para fotografar a capa.');
      return;
    }
    const resultado = await ImagePicker.launchCameraAsync(OPCOES_FOTO);
    if (!resultado.canceled) setFotoNova(resultado.assets[0]);
  };

  const escolherDaGaleria = async () => {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert('Permissão negada', 'Libere o acesso às fotos para escolher uma capa.');
      return;
    }
    const resultado = await ImagePicker.launchImageLibraryAsync(OPCOES_FOTO);
    if (!resultado.canceled) setFotoNova(resultado.assets[0]);
  };

  const escolherFoto = () => {
    Alert.alert('Capa', 'De onde vem a imagem?', [
      { text: '📸 Tirar foto', onPress: tirarFoto },
      { text: '🖼️ Galeria', onPress: escolherDaGaleria },
      { text: 'Cancelar', style: 'cancel' }
    ]);
  };

  const salvar = async () => {
    setErro('');
    if (!item.titulo.trim()) return setErro('Dá um título pro item 💅');

    setSalvando(true);
    try {
      const capa = fotoNova ? await enviarCapa(fotoNova) : item.capa;
      const corpo = {
        titulo: item.titulo.trim(),
        tipo: item.tipo,
        ano: item.ano ? Number(item.ano) : null,
        plataforma: item.plataforma.trim(),
        nota: item.nota,
        status: item.status,
        favorito: item.favorito,
        comentario: item.comentario.trim(),
        capa
      };
      if (editando) await servidor.put(`/itens/${id}`, corpo);
      else await servidor.post('/itens', corpo);
      router.back();
    } catch (e) {
      setErro(textoErro(e, 'Não foi possível salvar'));
      setSalvando(false);
    }
  };

  const excluir = () => {
    Alert.alert('Excluir item', `Excluir "${item.titulo}" da sua coleção?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await servidor.delete(`/itens/${id}`);
            router.back();
          } catch (e) {
            setErro(textoErro(e, 'Não foi possível excluir'));
          }
        }
      }
    ]);
  };

  if (carregando) {
    return <ActivityIndicator style={{ marginTop: 40 }} size="large" color={cores.rosa} />;
  }

  const imagem = fotoNova?.uri || linkCapa(item.capa);

  return (
    <KeyboardAvoidingView style={base.tela} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={estilos.conteudo} keyboardShouldPersistTaps="handled">
        <Pressable onPress={escolherFoto} style={estilos.capa}>
          {imagem ? (
            <Image source={{ uri: imagem }} style={StyleSheet.absoluteFill} />
          ) : (
            <View style={estilos.capaVazia}>
              <Text style={{ fontSize: 40 }}>{TIPOS[item.tipo].emoji}</Text>
              <Text style={estilos.capaTexto}>📸 Toque para fotografar ou escolher a capa</Text>
            </View>
          )}
        </Pressable>
        {imagem && (
          <View style={estilos.linhaCapa}>
            <Pressable onPress={escolherFoto}>
              <Text style={estilos.linkCapa}>📸 Trocar capa</Text>
            </Pressable>
            <Pressable onPress={() => { setFotoNova(null); mudar('capa', null); }}>
              <Text style={estilos.linkPequeno}>Remover</Text>
            </Pressable>
          </View>
        )}

        <Text style={base.rotulo}>Tipo</Text>
        <Chips opcoes={TIPOS} valor={item.tipo} onChange={(v) => mudar('tipo', v)} />

        <Text style={base.rotulo}>Título *</Text>
        <TextInput style={base.input} value={item.titulo} onChangeText={(v) => mudar('titulo', v)} />

        <Text style={base.rotulo}>Ano</Text>
        <TextInput
          style={base.input}
          value={item.ano}
          keyboardType="number-pad"
          maxLength={4}
          onChangeText={(v) => mudar('ano', v.replace(/\D/g, ''))}
        />

        <Text style={base.rotulo}>{item.tipo === 'filme' ? 'Onde assistir' : 'Plataforma'}</Text>
        <TextInput
          style={base.input}
          value={item.plataforma}
          placeholder={item.tipo === 'filme' ? 'Ex.: DVD, streaming...' : 'Ex.: PC, Switch, celular...'}
          placeholderTextColor={cores.textoSuave}
          onChangeText={(v) => mudar('plataforma', v)}
        />

        <Text style={base.rotulo}>Status</Text>
        <Chips opcoes={STATUS} valor={item.status} onChange={(v) => mudar('status', v)} />

        <View style={estilos.linha}>
          <View>
            <Text style={base.rotulo}>Sua nota</Text>
            <Coracoes valor={item.nota} onChange={(n) => mudar('nota', n)} tamanho={32} />
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={base.rotulo}>{item.favorito ? '💖' : '🤍'} Favorito</Text>
            <Switch
              value={item.favorito}
              onValueChange={(v) => mudar('favorito', v)}
              trackColor={{ true: cores.rosa, false: cores.borda }}
              thumbColor={cores.branco}
            />
          </View>
        </View>

        <Text style={base.rotulo}>Comentário</Text>
        <TextInput
          style={[base.input, { minHeight: 90, textAlignVertical: 'top' }]}
          value={item.comentario}
          multiline
          maxLength={1000}
          placeholder="O que você achou?"
          placeholderTextColor={cores.textoSuave}
          onChangeText={(v) => mudar('comentario', v)}
        />

        {!!erro && <Text style={base.erro}>{erro}</Text>}

        <Botao titulo="Salvar 💖" onPress={salvar} carregando={salvando} style={{ marginTop: 20 }} />
        {editando && <Botao titulo="Excluir" variante="perigo" onPress={excluir} />}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  conteudo: { padding: 20, paddingBottom: 50 },
  capa: {
    width: 170, aspectRatio: 2 / 3, alignSelf: 'center',
    borderRadius: 16, overflow: 'hidden', backgroundColor: '#ffc2e2'
  },
  capaVazia: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 10 },
  capaTexto: { textAlign: 'center', color: cores.rosaEscuro, marginTop: 8, fontWeight: '600' },
  linhaCapa: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 18, marginTop: 8 },
  linkCapa: { color: cores.rosa, fontWeight: 'bold' },
  linkPequeno: { textAlign: 'center', color: cores.textoSuave, textDecorationLine: 'underline' },
  linha: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }
});
