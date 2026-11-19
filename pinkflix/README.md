# 💖 PinkFlix

Coleção pessoal de **filmes e jogos da Barbie**, com uma **playlist** das músicas dos filmes. Cada pessoa cria sua conta, registra o que já assistiu/jogou, dá nota em corações, marca favoritos e coloca a capa de cada item.

Projeto de PWEB (FATEC) com **versão web (React)** e **versão mobile (React Native / Expo)**, usando uma **API própria** em Node.js + MongoDB.

## 👩‍💻 Integrantes do grupo

- NOME COMPLETO 1
- NOME COMPLETO 2
- NOME COMPLETO 3

---

## 🔑 Release: configurações para teste

| E-mail | Senha | O que tem |
|---|---|---|
| `teste@pinkflix.com` | `Barbie@123` | 13 filmes e jogos com capa e 30 músicas na playlist |

> Essa conta é criada pelo comando `npm run seed` na pasta `api`.

**Quer testar do zero?** Clique em **Cadastre-se**, crie uma conta com qualquer e-mail e você **já entra direto**, sem precisar de aprovação. Cada conta tem a sua própria coleção e playlist.

---

## ✨ Funcionalidades (web e mobile)

- Cadastro de conta (já entra direto) e login com token JWT (a sessão fica salva)
- Coleção separada por pessoa: cada uma só vê os próprios itens
- Criar, editar e excluir filmes e jogos
- Campos: título, tipo (filme/jogo), ano, onde assistir/plataforma, status (*quero ver/jogar*, *vendo/jogando*, *já vi/zerei*), nota de 0 a 5 corações, favorito e comentário
- Upload da **capa** (foto salva no MongoDB com GridFS)
- Abas **Tudo / Filmes / Jogos / Favoritos** e busca pelo título
- Painel com total de itens, filmes, jogos e nota média
- **Playlist 🎵** (área separada, sem fotos): adicionar, editar e excluir músicas, com artista, filme/álbum e favoritas, e busca por música, artista ou filme
- Web: filtro por status e ordenação (recentes, nota, ano, título)
- Mobile: **📸 fotografar a capa com a câmera** (ex.: o DVD de verdade) ou escolher da galeria, puxar para atualizar e botão “+” flutuante

---

## 🗂️ Estrutura

```
pinkflix/
├── api/      → Node.js + Express + MongoDB (Mongoose) + JWT + GridFS
├── web/      → React + Vite + React Router + Axios
└── mobile/   → React Native + Expo + Expo Router + Axios
```

---

## 🚀 Como rodar

Você precisa do **Node.js LTS** instalado e de um banco no **MongoDB Atlas** (o plano gratuito M0 serve).

### 1) API
```bash
cd api
npm install
copy .env.sample .env      # no Windows (no Mac/Linux: cp .env.sample .env)
```
Abra o `.env` e preencha:
- `MONGO_URI`: a connection string do Atlas
- `JWT_SECRET`: qualquer texto grande e secreto

```bash
npm run seed    # cria as contas de teste e a coleção de exemplo
npm run dev     # sobe a API em http://localhost:3000
```

### 2) Web
```bash
cd web
npm install
copy .env.example .env     # VITE_API_URL = endereço da API
npm run dev                # abre em http://localhost:5173
```

### 3) Mobile
1. Abra `mobile/lib/config.js` e coloque o endereço da API em `API_URL`:
   - celular na mesma rede Wi-Fi do PC: `http://IP_DO_PC:3000` (para ver o IP, rode `ipconfig` no Windows)
   - emulador Android: `http://10.0.2.2:3000`
   - API publicada: `https://...onrender.com`
2. Rode:
```bash
cd mobile
npm install
npx expo install --fix     # ajusta as versões para o SDK do Expo
npx expo start
```
3. Leia o QR Code com o app **Expo Go** no celular.

> Se o Expo Go pedir um SDK mais novo, rode `npx expo install expo@latest` e depois `npx expo install --fix`.

---

## 🌐 Publicar a API (Render, grátis)

Para o APK funcionar em qualquer celular, a API precisa estar na internet:
1. Suba o projeto para o GitHub.
2. No [Render](https://render.com): **New → Web Service** e escolha o repositório.
3. **Root Directory:** `api` · **Build:** `npm install` · **Start:** `npm start`
4. Em **Environment**, adicione `MONGO_URI` e `JWT_SECRET`.
5. No MongoDB Atlas, em **Network Access**, libere `0.0.0.0/0`.
6. Use a URL gerada (`https://xxxx.onrender.com`) no `web/.env` e no `mobile/lib/config.js`.

> O plano grátis do Render “dorme” depois de um tempo parado; a primeira requisição pode levar uns 50 segundos.

## 📦 Gerar o APK

1. Confirme que `mobile/lib/config.js` aponta para a **API publicada** (https).
2. Crie uma conta gratuita em [expo.dev](https://expo.dev).
3. Rode:
```bash
cd mobile
npx eas-cli login
npx eas-cli build -p android --profile apk
```
4. No final aparece um link para baixar o **.apk**. Coloque ele na entrega.

---

## 📡 Rotas da API

| Método | Rota | Acesso | O que faz |
|---|---|---|---|
| POST | `/auth/cadastro` | público | Cria conta e já devolve `{ token, usuario }` |
| POST | `/auth/entrar` | público | Login, devolve `{ token, usuario }` |
| GET | `/auth/eu` | com login | Dados da conta logada |
| GET | `/itens` | com login | Lista (filtros: `tipo`, `status`, `favorito`, `busca`, `ordem`) |
| GET | `/itens/resumo` | com login | Números do painel |
| GET | `/itens/:id` | com login | Detalhe de um item |
| POST | `/itens` | com login | Cria item |
| PUT | `/itens/:id` | com login | Edita item |
| DELETE | `/itens/:id` | com login | Exclui item (e a capa) |
| POST | `/capas` | com login | Upload da capa (multipart, campo `capa`), devolve `{ id }` |
| GET | `/capas/:id` | público | Mostra a imagem |
| GET | `/musicas` | com login | Playlist (filtros: `busca`, `favoritas`) |
| POST | `/musicas` | com login | Adiciona música |
| PUT | `/musicas/:id` | com login | Edita música |
| DELETE | `/musicas/:id` | com login | Remove música |
