const Musica = require('../models/Musica');

const EDITAVEIS = ['titulo', 'artista', 'origem', 'favorita'];

function limparCorpo(corpo = {}) {
  const dados = {};
  for (const campo of EDITAVEIS) {
    if (campo in corpo) dados[campo] = corpo[campo] === '' ? null : corpo[campo];
  }
  return dados;
}

const escapar = (texto) => texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// GET /musicas?busca=&favoritas=true
// A busca procura no nome da música, no artista e no filme/álbum
async function listar(req, res) {
  const { busca, favoritas } = req.query;
  const filtro = { conta: req.usuario._id };

  if (favoritas === 'true') filtro.favorita = true;
  if (typeof busca === 'string' && busca.trim()) {
    const termo = new RegExp(escapar(busca.trim()), 'i');
    filtro.$or = [{ titulo: termo }, { artista: termo }, { origem: termo }];
  }

  const musicas = await Musica.find(filtro).sort({ createdAt: 1 });
  res.json(musicas);
}

async function acharDaConta(req, res) {
  const musica = await Musica.findOne({ _id: req.params.id, conta: req.usuario._id });
  if (!musica) res.status(404).json({ mensagem: 'Música não encontrada' });
  return musica;
}

// POST /musicas
async function criar(req, res) {
  const musica = await Musica.create({ ...limparCorpo(req.body), conta: req.usuario._id });
  res.status(201).json(musica);
}

// PUT /musicas/:id
async function editar(req, res) {
  const musica = await acharDaConta(req, res);
  if (!musica) return;
  musica.set(limparCorpo(req.body));
  await musica.save();
  res.json(musica);
}

// DELETE /musicas/:id
async function excluir(req, res) {
  const musica = await acharDaConta(req, res);
  if (!musica) return;
  await musica.deleteOne();
  res.json({ mensagem: 'Música removida da playlist' });
}

module.exports = { listar, criar, editar, excluir };
