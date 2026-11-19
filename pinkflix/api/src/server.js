require('dotenv').config();
const app = require('./app');
const conectarBanco = require('./config/banco');

const PORTA = process.env.PORT || 3000;

// Só abre a porta depois que o banco conectou
conectarBanco()
  .then(() => app.listen(PORTA, () => console.log(`✨ PinkFlix API em http://localhost:${PORTA}`)))
  .catch((erro) => {
    console.error('Não foi possível iniciar a API:', erro.message);
    process.exit(1);
  });
