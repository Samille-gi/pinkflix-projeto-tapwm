import { useState } from 'react';
import {
  ImageBackground, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSessao } from '../lib/sessao';
import { textoErro } from '../lib/servidor';
import { base, cores } from '../styles/tema';
import Botao from '../components/Botao';

const FUNDO = require('../assets/img/padrao-azul.jpg');

export default function Cadastro() {
  const router = useRouter();
  const { cadastrar } = useSessao();
  const [dados, setDados] = useState({ nome: '', email: '', senha: '', confirmar: '' });
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  const mudar = (campo) => (valor) => setDados({ ...dados, [campo]: valor });

  // cria a conta e já entra direto na coleção
  const enviar = async () => {
    setErro('');
    if (!dados.nome || !dados.email || !dados.senha) return setErro('Preencha todos os campos');
    if (dados.senha !== dados.confirmar) return setErro('As senhas não são iguais');
    setEnviando(true);
    try {
      await cadastrar(dados.nome, dados.email, dados.senha);
      router.replace('/colecao');
    } catch (e) {
      setErro(textoErro(e, 'Não foi possível cadastrar'));
      setEnviando(false);
    }
  };

  return (
    <ImageBackground source={FUNDO} style={base.tela} resizeMode="cover">
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ padding: 18 }} keyboardShouldPersistTaps="handled">
          <View style={estilos.caixa}>
            <Text style={[base.rotulo, { marginTop: 0 }]}>Nome</Text>
            <TextInput style={base.input} value={dados.nome} onChangeText={mudar('nome')} />
            <Text style={base.rotulo}>E-mail</Text>
            <TextInput
              style={base.input}
              value={dados.email}
              onChangeText={mudar('email')}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <Text style={base.rotulo}>Senha (mínimo 6 caracteres)</Text>
            <TextInput style={base.input} value={dados.senha} onChangeText={mudar('senha')} secureTextEntry />
            <Text style={base.rotulo}>Confirmar senha</Text>
            <TextInput style={base.input} value={dados.confirmar} onChangeText={mudar('confirmar')} secureTextEntry />

            {!!erro && <Text style={base.erro}>{erro}</Text>}
            <Botao titulo="Criar conta e entrar ✨" onPress={enviar} carregando={enviando} style={{ marginTop: 22 }} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const estilos = StyleSheet.create({
  caixa: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 2,
    borderColor: cores.rosaClaro
  }
});
