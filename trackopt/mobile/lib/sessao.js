import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { servidor, usarToken } from './servidor';

const CHAVE = 'pinkflix:token';
const SessaoContext = createContext(null);

export function SessaoProvider({ children }) {
  const [conta, setConta] = useState(null);
  const [pronto, setPronto] = useState(false);

  const sair = async () => {
    usarToken(null);
    setConta(null);
    await AsyncStorage.removeItem(CHAVE);
  };

  // Ao abrir o app, tenta recuperar o login salvo
  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem(CHAVE);
        if (token) {
          usarToken(token);
          const { data } = await servidor.get('/auth/eu');
          setConta(data);
        }
      } catch {
        await sair();
      } finally {
        setPronto(true);
      }
    })();
  }, []);

  // Token venceu? desloga
  useEffect(() => {
    const id = servidor.interceptors.response.use(
      (r) => r,
      (erro) => {
        const ehLogin = erro.config?.url?.includes('/auth/');
        if (erro.response?.status === 401 && !ehLogin) sair();
        return Promise.reject(erro);
      }
    );
    return () => servidor.interceptors.response.eject(id);
  }, []);

  // guarda o token e a conta (usado no login e no cadastro)
  const comecarSessao = async (data) => {
    usarToken(data.token);
    await AsyncStorage.setItem(CHAVE, data.token);
    setConta(data.usuario);
  };

  const entrar = async (email, senha) => {
    const { data } = await servidor.post('/auth/entrar', { email: email.trim(), senha });
    await comecarSessao(data);
  };

  // cria a conta e já entra direto
  const cadastrar = async (nome, email, senha) => {
    const { data } = await servidor.post('/auth/cadastro', { nome: nome.trim(), email: email.trim(), senha });
    await comecarSessao(data);
  };

  return (
    <SessaoContext.Provider value={{ conta, pronto, entrar, cadastrar, sair }}>
      {children}
    </SessaoContext.Provider>
  );
}

export const useSessao = () => useContext(SessaoContext);
