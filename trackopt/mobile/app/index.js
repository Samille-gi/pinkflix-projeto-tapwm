import { useState } from 'react';
import {
  ActivityIndicator, ImageBackground, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View
} from 'react-native';
import { Link, Redirect } from 'expo-router';
import { useSessao } from '../lib/sessao';
import { textoErro } from '../lib/servidor';
import { base, cores } from '../styles/tema';
import Botao from '../components/Botao';

const FUNDO = require('../assets/img/mosaico-capas.jpg');

export default function Entrar() {
  const { conta, pronto, entrar } = useSessao();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (!pronto) {
    return (
      <ImageBackground source={FUNDO} style={[estilos.fundo, { justifyContent: 'center' }]} resizeMode="cover">
        <ActivityIndicator size="large" color={cores.branco} />
      </ImageBackground>
    );
  }
  if (conta) return <Redirect href="/colecao" />;

  const enviar = async () => {
    setErro('');
    if (!email || !senha) return setErro('Preencha e-mail e senha');
    setEnviando(true);
    try {
      await entrar(email, senha);
    } catch (e) {
      setErro(textoErro(e, 'Não foi possível entrar'));
      setEnviando(false);
    }
  };

  return (
    <ImageBackground source={FUNDO} style={estilos.fundo} resizeMode="cover">
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={estilos.rolagem} keyboardShouldPersistTaps="handled">
          <View style={estilos.caixa}>
            <Text style={estilos.logo}>PinkFlix</Text>
            <Text style={estilos.slogan}>Sua coleção de filmes e jogos da Barbie 💖</Text>

            <Text style={[base.rotulo, { marginTop: 4 }]}>E-mail</Text>
            <TextInput
              style={base.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <Text style={base.rotulo}>Senha</Text>
            <TextInput style={base.input} value={senha} onChangeText={setSenha} secureTextEntry />

            {!!erro && <Text style={base.erro}>{erro}</Text>}

            <Botao titulo="Entrar ✨" onPress={enviar} carregando={enviando} style={{ marginTop: 20 }} />
            <Link href="/cadastro" style={estilos.link}>Ainda não tem conta? Cadastre-se</Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const estilos = StyleSheet.create({
  fundo: { flex: 1, backgroundColor: cores.rosa },
  // empurra o formulário para baixo, deixando o mosaico de capas aparecer em cima
  rolagem: { flexGrow: 1, justifyContent: 'flex-end', padding: 18, paddingBottom: 36 },
  caixa: {
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: 26,
    padding: 22,
    borderWidth: 2,
    borderColor: cores.rosaClaro
  },
  logo: { fontSize: 40, fontWeight: 'bold', fontStyle: 'italic', color: cores.rosa, textAlign: 'center' },
  slogan: { color: cores.textoSuave, textAlign: 'center', marginBottom: 8 },
  link: { color: cores.rosa, textAlign: 'center', marginTop: 16, fontWeight: '600' }
});
