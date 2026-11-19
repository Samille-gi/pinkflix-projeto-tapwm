const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// Confere o token e carrega a conta do banco em req.usuario.
// Se o token for inválido ou a conta não existir mais, bloqueia.
async function autenticar(req, res, next) {
  const [tipo, token] = (req.headers.authorization || '').split(' ');
  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({ mensagem: 'Faça login para continuar' });
  }

  let dados;
  try {
    dados = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ mensagem: 'Sua sessão expirou, entre de novo' });
  }

  const usuario = await Usuario.findById(dados.sub);
  if (!usuario) {
    return res.status(401).json({ mensagem: 'Conta não encontrada, entre de novo' });
  }

  req.usuario = usuario;
  next();
}

module.exports = autenticar;
