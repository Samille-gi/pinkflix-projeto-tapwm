const mongoose = require('mongoose');

async function conectarBanco() {
  if (!process.env.MONGO_URI) {
    throw new Error('Faltou a variável MONGO_URI no arquivo .env');
  }
  await mongoose.connect(process.env.MONGO_URI);
  console.log('💖 Banco conectado');
}

module.exports = conectarBanco;
