const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const gerarToken = (usuario) =>
  jwt.sign({ sub: String(usuario._id) }, process.env.JWT_SECRET, { expiresIn: '1d' });

// POST /auth/cadastro  -> cria a conta e já devolve o token (entra direto)
async function cadastrar(req, res) {
  const { nome, email, senha } = req.body || {};
  if (!nome?.trim() || !email?.trim() || !senha) {
    return res.status(400).json({ mensagem: 'Preencha nome, e-mail e senha' });
  }
  if (senha.length < 6) {
    return res.status(400).json({ mensagem: 'A senha precisa ter pelo menos 6 caracteres' });
  }
  if (await Usuario.exists({ email: email.toLowerCase().trim() })) {
    return res.status(409).json({ mensagem: 'Esse e-mail já está cadastrado' });
  }

  const usuario = await Usuario.create({ nome, email, senha });
  res.status(201).json({ token: gerarToken(usuario), usuario: usuario.paraFront() });
}

// POST /auth/entrar
async function entrar(req, res) {
  const { email, senha } = req.body || {};
  if (!email || !senha) {
    return res.status(400).json({ mensagem: 'Informe e-mail e senha' });
  }

  const usuario = await Usuario.findOne({ email: String(email).toLowerCase().trim() }).select('+senha');
  if (!usuario || !(await usuario.senhaConfere(senha))) {
    return res.status(401).json({ mensagem: 'E-mail ou senha incorretos' });
  }

  res.json({ token: gerarToken(usuario), usuario: usuario.paraFront() });
}

// GET /auth/eu
function eu(req, res) {
  res.json(req.usuario.paraFront());
}

module.exports = { cadastrar, entrar, eu };
