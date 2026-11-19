// Cria a conta de teste com uma coleção de exemplo (com capas) e uma playlist.
// Rodar com:  npm run seed   (pode rodar quantas vezes quiser)
//
// 🖼️ CAPAS: salve a imagem em  api/scripts/capas/  com o nome que aparece em
//    "capa" de cada item abaixo (ex.: rapunzel.jpg ou rapunzel.png).
//    Rode o seed de novo e a capa entra sozinha nos itens que ainda não têm.
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Usuario = require('../src/models/Usuario');
const Item = require('../src/models/Item');
const Musica = require('../src/models/Musica');
const { salvarCapa } = require('../src/services/capas');

const SENHA_TESTE = 'Barbie@123';
const PASTA_CAPAS = path.join(__dirname, 'capas');
const FORMATOS = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };

// Conta de teste (já vem com coleção e playlist)
const CONTAS = [
  { nome: 'Teste PinkFlix', email: 'teste@pinkflix.com' }
];

const COLECAO = [
  // 🎬 filmes
  { capa: 'princesa-plebeia', titulo: 'Barbie: A Princesa e a Plebeia', tipo: 'filme', ano: 2004, plataforma: 'DVD', nota: 5, status: 'concluido', favorito: true, comentario: 'As músicas são incríveis!' },
  { capa: 'cavalo-magico', titulo: 'Barbie e o Cavalo Mágico', tipo: 'filme', ano: 2005, plataforma: 'DVD', nota: 4, status: 'concluido' },
  { capa: 'tres-mosqueteiras', titulo: 'Barbie e as Três Mosqueteiras', tipo: 'filme', ano: 2009, plataforma: 'DVD', nota: 5, status: 'concluido', favorito: true, comentario: 'Uma por todas e todas por uma! ⚔️' },
  { capa: 'moda-e-magia', titulo: 'Barbie: Moda e Magia', tipo: 'filme', ano: 2010, plataforma: 'DVD', nota: 4, status: 'concluido' },
  { capa: 'escola-de-princesas', titulo: 'Barbie: Escola de Princesas', tipo: 'filme', ano: 2011, plataforma: 'DVD', nota: 5, status: 'concluido', favorito: true },
  { capa: 'natal-perfeito', titulo: 'Barbie em Um Natal Perfeito', tipo: 'filme', ano: 2011, plataforma: 'DVD', nota: 4, status: 'quero', comentario: 'Guardando para assistir no Natal 🎄' },
  { capa: 'princesa-popstar', titulo: 'Barbie: A Princesa e a Pop Star', tipo: 'filme', ano: 2012, plataforma: 'DVD', nota: 5, status: 'concluido', favorito: true },
  { capa: 'sapatilhas-magicas', titulo: 'Barbie e as Sapatilhas Mágicas', tipo: 'filme', ano: 2013, plataforma: 'DVD', nota: 4, status: 'andamento' },
  { capa: 'agentes-secretas', titulo: 'Barbie e as Agentes Secretas', tipo: 'filme', ano: 2016, plataforma: 'Streaming', nota: 4, status: 'quero' },
  // 🎮 jogos clássicos do site da Barbie
  { capa: 'baby-krissy', titulo: "Let's Baby-sit Baby Krissy!", tipo: 'jogo', plataforma: 'Barbie.com (navegador)', nota: 4, status: 'concluido', comentario: 'Cuidar da irmãzinha da Barbie 🍼' },
  { capa: 'maquiagem', titulo: 'Maquiagem da Barbie', tipo: 'jogo', plataforma: 'Barbie.com (navegador)', nota: 5, status: 'concluido', favorito: true },
  { capa: 'snip-n-style', titulo: "Snip 'n Style Salon", tipo: 'jogo', plataforma: 'Barbie.com (navegador)', nota: 5, status: 'concluido', favorito: true, comentario: 'Lavar, secar e cortar o cabelo contra o relógio!' },
  { capa: 'my-scene-unhas', titulo: 'My Scene: Dazzling Nails', tipo: 'jogo', plataforma: 'MyScene.com (navegador)', nota: 4, status: 'andamento' }
];

// 🎵 Playlist de exemplo: músicas reais dos filmes e séries da Barbie
const B = 'Barbie';
const BC = 'Barbie, Chelsea';
const PLAYLIST = [
  { titulo: 'Here I Am / Princesses Just Want to Have Fun', artista: B, origem: 'Barbie: A Princesa e a Pop Star', favorita: true },
  { titulo: 'To Be a Princess / To Be a Popstar', artista: B, origem: 'Barbie: A Princesa e a Pop Star', favorita: true },
  { titulo: 'I Wish I Had Her Life', artista: B, origem: 'Barbie: A Princesa e a Pop Star' },
  { titulo: 'Perfect Day', artista: B, origem: 'Barbie: A Princesa e a Pop Star' },
  { titulo: 'Look How High We Can Fly', artista: B, origem: 'Barbie: A Princesa e a Pop Star' },
  { titulo: 'Here I Am - Keira Version', artista: B, origem: 'Barbie: A Princesa e a Pop Star' },
  { titulo: 'On Top of the World', artista: B, origem: 'Barbie: Escola de Princesas', favorita: true },
  { titulo: "You Can Tell She's a Princess", artista: B, origem: 'Barbie: Escola de Princesas' },
  { titulo: 'Life Is a Fairytale', artista: B, origem: 'Barbie: Moda e Magia' },
  { titulo: 'All for One', artista: B, origem: 'Barbie e as Três Mosqueteiras', favorita: true },
  { titulo: 'Keep on Dancing', artista: B, origem: 'Barbie e as Sapatilhas Mágicas' },
  { titulo: "We're Gonna Find It", artista: B, origem: 'Barbie and the Diamond Castle' },
  { titulo: 'If I Had Magic', artista: B, origem: 'Barbie and the Secret Door' },
  { titulo: "What's Gonna Happen", artista: B, origem: 'Barbie and the Secret Door' },
  { titulo: 'Mermaid Party', artista: B, origem: 'Barbie: The Pearl Princess' },
  { titulo: 'Do the Mermaid', artista: B, origem: 'Barbie in a Mermaid Tale 2' },
  { titulo: 'Can You Keep a Secret', artista: B, origem: 'Barbie: A Fairy Secret' },
  { titulo: 'Shooting Star', artista: B, origem: 'Barbie: Star Light Adventure' },
  { titulo: 'Finale Mash Up', artista: B, origem: "Barbie: Rock 'n Royals" },
  { titulo: 'Find Yourself in the Song', artista: B, origem: "Barbie: Rock 'n Royals" },
  { titulo: "You're the One", artista: B, origem: 'Barbie & Her Sisters in a Pony Tale' },
  { titulo: 'Work It', artista: B, origem: 'Barbie: Big City Big Dreams' },
  { titulo: 'Before Us', artista: B, origem: 'Barbie: Big City Big Dreams' },
  { titulo: 'Good Vibes', artista: B, origem: 'Barbie: Big City Big Dreams' },
  { titulo: 'See You at the Finish Line', artista: B, origem: 'Barbie: Big City Big Dreams' },
  { titulo: 'Turn It Up', artista: BC, origem: 'Barbie: Mermaid Power' },
  { titulo: 'Find Your Power', artista: BC, origem: 'Barbie: Mermaid Power' },
  { titulo: 'Make a New Day', artista: BC, origem: 'The Lost Birthday' },
  { titulo: 'Barbie Dreamhouse Adventures Theme Song', artista: B, origem: 'Barbie Dreamhouse Adventures' },
  { titulo: 'Not Your Barbie Girl', artista: 'Ava Max', origem: 'Single', favorita: true }
];

// procura "nome.jpg", "nome.png"... dentro de scripts/capas
function acharArquivoDaCapa(nome) {
  for (const extensao of Object.keys(FORMATOS)) {
    const caminho = path.join(PASTA_CAPAS, nome + extensao);
    if (fs.existsSync(caminho)) return { caminho, formato: FORMATOS[extensao] };
  }
  return null;
}

async function semear() {
  await mongoose.connect(process.env.MONGO_URI);

  for (const dados of CONTAS) {
    let conta = await Usuario.findOne({ email: dados.email });
    if (!conta) conta = new Usuario({ email: dados.email });
    conta.set({ ...dados, senha: SENHA_TESTE }); // o model criptografa a senha
    await conta.save();
    console.log(`✔ conta ${dados.email}`);
  }

  const teste = await Usuario.findOne({ email: 'teste@pinkflix.com' });

  for (const { capa, ...dados } of COLECAO) {
    let item = await Item.findOne({ conta: teste._id, titulo: dados.titulo });
    if (!item) item = await Item.create({ ...dados, conta: teste._id });

    const arquivo = !item.capa && acharArquivoDaCapa(capa);
    if (arquivo) {
      item.capa = await salvarCapa(fs.readFileSync(arquivo.caminho), {
        nome: path.basename(arquivo.caminho),
        formato: arquivo.formato,
        conta: teste._id
      });
      await item.save();
      console.log(`  🖼️  capa colocada em "${item.titulo}"`);
    }
  }
  console.log('✔ coleção de exemplo pronta em teste@pinkflix.com');

  // só adiciona as músicas que ainda não estão na playlist
  for (const musica of PLAYLIST) {
    const existe = await Musica.exists({ conta: teste._id, titulo: musica.titulo });
    if (!existe) await Musica.create({ ...musica, conta: teste._id });
  }
  console.log(`✔ playlist de exemplo com ${PLAYLIST.length} músicas`);

  console.log(`\nLogin de teste: teste@pinkflix.com  |  senha: ${SENHA_TESTE}`);
  await mongoose.disconnect();
}

semear().catch((erro) => {
  console.error('Erro no seed:', erro.message);
  process.exit(1);
});
