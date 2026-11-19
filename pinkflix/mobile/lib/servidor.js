import axios from 'axios';
import { API_URL } from './config';

let tokenAtual = null;

// timeout grande porque o Render gratuito "dorme" e demora para acordar
export const servidor = axios.create({ baseURL: API_URL, timeout: 60000 });

servidor.interceptors.request.use((config) => {
  if (tokenAtual) config.headers.Authorization = `Bearer ${tokenAtual}`;
  return config;
});

export const usarToken = (token) => {
  tokenAtual = token;
};

export const linkCapa = (id) => (id ? `${API_URL}/capas/${id}` : null);

export const textoErro = (erro, padrao = 'Algo deu errado 😢') => {
  if (erro?.response?.data?.mensagem) return erro.response.data.mensagem;
  if (erro?.message === 'Network Error') return 'Sem conexão com o servidor. Confira o endereço da API.';
  return erro?.message && !erro.response ? erro.message : padrao;
};

// Upload com fetch (no React Native é o jeito mais estável para multipart)
export async function enviarCapa(foto) {
  const form = new FormData();
  form.append('capa', {
    uri: foto.uri,
    name: foto.fileName || 'capa.jpg',
    type: foto.mimeType || 'image/jpeg'
  });

  const resposta = await fetch(`${API_URL}/capas`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenAtual}` },
    body: form
  });
  const dados = await resposta.json().catch(() => ({}));
  if (!resposta.ok) throw new Error(dados.mensagem || 'Não foi possível enviar a capa');
  return dados.id;
}
