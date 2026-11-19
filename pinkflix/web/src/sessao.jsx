import { createContext, useContext, useEffect, useState } from 'react';
import { servidor, guardarToken, temToken } from './servidor';

const SessaoContext = createContext(null);

export function SessaoProvider({ children }) {
  const [conta, setConta] = useState(null);
  const [carregando, setCarregando] = useState(temToken());

  const sair = () => {
    guardarToken(null);
    setConta(null);
  };

  // Ao abrir o site, se tem token salvo, busca a conta logada
  useEffect(() => {
    if (!temToken()) return;
    servidor.get('/auth/eu')
      .then(({ data }) => setConta(data))
      .catch(sair)
      .finally(() => setCarregando(false));
  }, []);

  // Se a API responder 401 (token vencido), desloga
  useEffect(() => {
    const id = servidor.interceptors.response.use(
      (resposta) => resposta,
      (erro) => {
        const ehLogin = erro.config?.url?.includes('/auth/');
        if (erro.response?.status === 401 && !ehLogin) sair();
        return Promise.reject(erro);
      }
    );
    return () => servidor.interceptors.response.eject(id);
  }, []);

  // guarda o token e a conta (usado no login e no cadastro)
  const comecarSessao = (data) => {
    guardarToken(data.token);
    setConta(data.usuario);
  };

  const entrar = async (email, senha) => {
    const { data } = await servidor.post('/auth/entrar', { email, senha });
    comecarSessao(data);
  };

  // cria a conta e já entra direto
  const cadastrar = async (nome, email, senha) => {
    const { data } = await servidor.post('/auth/cadastro', { nome, email, senha });
    comecarSessao(data);
  };

  return (
    <SessaoContext.Provider value={{ conta, carregando, entrar, cadastrar, sair }}>
      {children}
    </SessaoContext.Provider>
  );
}

export const useSessao = () => useContext(SessaoContext);
