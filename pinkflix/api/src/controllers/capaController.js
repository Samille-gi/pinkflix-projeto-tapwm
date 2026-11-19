const { salvarCapa, buscarCapa } = require('../services/capas');

// POST /capas  (multipart, campo "capa") -> { id }
async function enviar(req, res) {
  if (!req.file) return res.status(400).json({ mensagem: 'Escolha uma imagem' });

  const id = await salvarCapa(req.file.buffer, {
    nome: req.file.originalname,
    formato: req.file.mimetype,
    conta: req.usuario._id
  });
  res.status(201).json({ id: String(id) });
}

// GET /capas/:id  (pública, para usar direto no <img src>)
async function mostrar(req, res) {
  const capa = await buscarCapa(req.params.id);
  if (!capa) return res.status(404).json({ mensagem: 'Imagem não encontrada' });

  res.type(capa.info.contentType || 'image/jpeg');
  res.set('Cache-Control', 'public, max-age=31536000, immutable');
  capa.stream.on('error', () => res.end()).pipe(res);
}

module.exports = { enviar, mostrar };
