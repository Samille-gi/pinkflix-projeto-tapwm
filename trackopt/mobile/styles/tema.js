import { StyleSheet } from 'react-native';

export const cores = {
  rosa: '#e0218a',
  rosaEscuro: '#b0156b',
  rosaClaro: '#ffd6ec',
  fundo: '#fff0f7',
  lilas: '#c77dff',
  texto: '#4a1338',
  textoSuave: '#8a5a78',
  borda: '#f6c1dd',
  branco: '#ffffff',
  vermelho: '#d6336c',
  verde: '#2e9d6a'
};

export const base = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  input: {
    backgroundColor: cores.branco,
    borderWidth: 2,
    borderColor: cores.borda,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    color: cores.texto
  },
  rotulo: { fontWeight: '600', color: cores.texto, marginBottom: 6, marginTop: 14 },
  erro: {
    backgroundColor: '#ffe0ea',
    color: cores.vermelho,
    padding: 10,
    borderRadius: 12,
    marginTop: 12,
    overflow: 'hidden'
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: cores.borda,
    backgroundColor: cores.branco,
    marginRight: 8,
    marginBottom: 8
  },
  chipAtivo: { backgroundColor: cores.rosa, borderColor: cores.rosa },
  chipTexto: { color: cores.texto, fontWeight: '500' },
  chipTextoAtivo: { color: cores.branco }
});
