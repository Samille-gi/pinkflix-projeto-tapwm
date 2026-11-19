const Item = require('../models/Item');
const { apagarCapa } = require('../services/capas');

// Campos que o front pode mandar (conta nunca vem do corpo)
const EDITAVEIS = ['titulo', 'tipo', 'ano', 'plataforma', 'nota', 'status', 'favorito', 'comentario', 'capa'];

function limparCorpo(corpo = {}) {
  const dados = {};
  for (const campo of EDITAVEIS) {
    if (campo in corpo) dados[campo] = corpo[campo] === '' ? null : corpo[campo];
  }
  return dados;
}

const ORDENACOES = {
  recentes: { createdAt: -1 },
  nota: { nota: -1, titulo: 1 },
  ano: { ano: -1, titulo: 1 },
  titulo: { titulo: 1 }
};

const escapar = (texto) => texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// GET /itens?tipo=&status=&favorito=true&busca=&ordem=
async function listar(req, res) {
  const { tipo, status, favorito, busca, ordem } = req.query;
  const filtro = { conta: req.usuario._id };

  if (tipo === 'filme' || tipo === 'jogo') filtro.tipo = tipo;
  if (['quero', 'andamento', 'concluido'].includes(status)) filtro.status = status;
  if (favorito === 'true') filtro.favorito = true;
  if (typeof busca === 'string' && busca.trim()) {
    filtro.titulo = new RegExp(escapar(busca.trim()), 'i');
  }

  const itens = await Item.find(filtro).sort(ORDENACOES[ordem] || ORDENACOES.recentes);
  res.json(itens);
}

// GET /itens/resumo
async function resumo(req, res) {
  const itens = await Item.find({ conta: req.usuario._id }, 'tipo status favorito nota').lean();
  const comNota = itens.filter((i) => i.nota > 0);

  res.json({
    total: itens.length,
    filmes: itens.filter((i) => i.tipo === 'filme').length,
    jogos: itens.filter((i) => i.tipo === 'jogo').length,
    favoritos: itens.filter((i) => i.favorito).length,
    concluidos: itens.filter((i) => i.status === 'concluido').length,
    mediaNota: comNota.length
      ? Math.round((comNota.reduce((soma, i) => soma + i.nota, 0) / comNota.length) * 10) / 10
      : 0
  });
}

async function acharDaConta(req, res) {
  const item = await Item.findOne({ _id: req.params.id, conta: req.usuario._id });
  if (!item) res.status(404).json({ mensagem: 'Item não encontrado' });
  return item;
}

// GET /itens/:id
async function detalhar(req, res) {
  const item = await acharDaConta(req, res);
  if (item) res.json(item);
}

// POST /itens
async function criar(req, res) {
  const item = await Item.create({ ...limparCorpo(req.body), conta: req.usuario._id });
  res.status(201).json(item);
}

// PUT /itens/:id
async function editar(req, res) {
  const item = await acharDaConta(req, res);
  if (!item) return;

  const capaAntiga = item.capa;
  item.set(limparCorpo(req.body));
  await item.save(); // save() roda as validações do schema

  if (capaAntiga && String(capaAntiga) !== String(item.capa)) {
    await apagarCapa(capaAntiga);
  }
  res.json(item);
}

// DELETE /itens/:id
async function excluir(req, res) {
  const item = await acharDaConta(req, res);
  if (!item) return;
  await item.deleteOne();
  await apagarCapa(item.capa);
  res.json({ mensagem: 'Item excluído' });
}

module.exports = { listar, resumo, detalhar, criar, editar, excluir };
