const multer = require('multer');

const FORMATOS = ['image/jpeg', 'image/png', 'image/webp'];

// Recebe UMA imagem no campo "capa" e deixa em memória (req.file.buffer)
const receberImagem = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, arquivo, cb) => {
    if (FORMATOS.includes(arquivo.mimetype)) return cb(null, true);
    const erro = new Error('Use uma imagem JPG, PNG ou WEBP');
    erro.status = 415;
    cb(erro);
  }
}).single('capa');

module.exports = receberImagem;
