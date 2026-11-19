const { Router } = require('express');
const autenticar = require('../middlewares/autenticar');
const receberImagem = require('../middlewares/receberImagem');
const auth = require('../controllers/authController');
const itens = require('../controllers/itemController');
const capas = require('../controllers/capaController');
const musicas = require('../controllers/musicaController');

const rotas = Router();

rotas.get('/', (req, res) => res.json({ app: 'PinkFlix API', status: 'online 💖' }));

// Conta
rotas.post('/auth/cadastro', auth.cadastrar);
rotas.post('/auth/entrar', auth.entrar);
rotas.get('/auth/eu', autenticar, auth.eu);

// Coleção (filmes e jogos)
rotas.get('/itens', autenticar, itens.listar);
rotas.get('/itens/resumo', autenticar, itens.resumo);
rotas.get('/itens/:id', autenticar, itens.detalhar);
rotas.post('/itens', autenticar, itens.criar);
rotas.put('/itens/:id', autenticar, itens.editar);
rotas.delete('/itens/:id', autenticar, itens.excluir);

// Playlist (músicas)
rotas.get('/musicas', autenticar, musicas.listar);
rotas.post('/musicas', autenticar, musicas.criar);
rotas.put('/musicas/:id', autenticar, musicas.editar);
rotas.delete('/musicas/:id', autenticar, musicas.excluir);

// Capas (imagens)
rotas.post('/capas', autenticar, receberImagem, capas.enviar);
rotas.get('/capas/:id', capas.mostrar);

module.exports = rotas;
