const express = require('express');
const cors = require('cors');
const rotas = require('./routes');

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.use(rotas);

// Rota que não existe
app.use((req, res) => res.status(404).json({ mensagem: 'Rota não encontrada' }));

// Erros (o Express 5 já manda pra cá os erros das funções async)
// eslint-disable-next-line no-unused-vars
app.use((erro, req, res, next) => {
  if (erro.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ mensagem: 'Imagem muito grande (máximo 5 MB)' });
  }
  if (erro.name === 'ValidationError') {
    const primeiro = Object.values(erro.errors)[0];
    return res.status(400).json({ mensagem: primeiro?.message || 'Dados inválidos' });
  }
  if (erro.name === 'CastError') {
    return res.status(400).json({ mensagem: 'Valor inválido' });
  }
  if (erro.status) {
    return res.status(erro.status).json({ mensagem: erro.message });
  }
  console.error(erro);
  res.status(500).json({ mensagem: 'Ops! Erro no servidor' });
});

module.exports = app;
