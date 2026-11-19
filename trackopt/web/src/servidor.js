import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const CHAVE_TOKEN = 'pinkflix:token';

export const servidor = axios.create({ baseURL: API_URL, timeout: 60000 });

// Coloca o token em todas as requisições
servidor.interceptors.request.use((config) => {
  const token = localStorage.getItem(CHAVE_TOKEN);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const guardarToken = (token) =>
  token ? localStorage.setItem(CHAVE_TOKEN, token) : localStorage.removeItem(CHAVE_TOKEN);

export const temToken = () => Boolean(localStorage.getItem(CHAVE_TOKEN));

export const linkCapa = (id) => (id ? `${API_URL}/capas/${id}` : null);

export const textoErro = (erro, padrao = 'Algo deu errado 😢') =>
  erro?.response?.data?.mensagem || (erro?.code === 'ECONNABORTED' ? 'O servidor demorou para responder' : padrao);

export async function enviarCapa(arquivo) {
  const form = new FormData();
  form.append('capa', arquivo);
  const { data } = await servidor.post('/capas', form);
  return data.id;
}
