# 🎀 PinkFlix: passo a passo completo

Guia para **instalar, testar em casa e entregar no GitHub**. Faça na ordem e vá marcando ✅.

> 💡 Onde aparecer um bloco de comando, copie e cole no **terminal do VS Code** (menu *Terminal → Novo Terminal*).

---

## PARTE 1 · Instalar os programas (só uma vez) ⏱️ 15 min

- [ ] **Node.js LTS**: https://nodejs.org → botão verde **LTS** → instalar clicando em *Next* até o fim.
- [ ] **Git**: https://git-scm.com/downloads → instalar com as opções padrão.
- [ ] **VS Code**: https://code.visualstudio.com
- [ ] No celular (Android ou iPhone): instalar o app **Expo Go** pela loja.

Feche e abra o VS Code de novo. Confira no terminal se instalou certo:

```bash
node -v
```
```bash
git -v
```

Os dois devem mostrar um número de versão. Se mostrarem, deu certo ✨

---

## PARTE 2 · Criar as contas (todas grátis) ⏱️ 15 min

- [ ] **GitHub** (para entregar o código): https://github.com
- [ ] **MongoDB Atlas** (o banco de dados): https://www.mongodb.com/cloud/atlas/register
- [ ] **Render** (para a API ficar na internet): https://render.com → entre com o GitHub
- [ ] **Expo** (para gerar o APK): https://expo.dev/signup
- [ ] *(opcional)* **Vercel** (para o site ficar na internet): https://vercel.com → entre com o GitHub

---

## PARTE 3 · Configurar o banco no MongoDB Atlas ⏱️ 10 min

1. Entre no Atlas e clique em **Create** para criar um cluster. Escolha o plano **M0 (Free)** e clique em *Create Deployment*.
2. Vai aparecer uma janela pedindo para criar um usuário do banco. Anote o **usuário** e a **senha**.
   > 💡 Use uma senha só com letras e números, sem `@`, `:` ou `/`. Isso evita dor de cabeça.
3. No menu da esquerda: **Network Access → Add IP Address → Allow Access from Anywhere** (`0.0.0.0/0`) → *Confirm*.
4. Volte em **Database → Connect → Drivers** e copie a *connection string*. Ela parece com:
   ```
   mongodb+srv://USUARIO:<db_password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Troque `<db_password>` pela sua senha e coloque **`pinkflix`** depois do `.net/`, assim:
   ```
   mongodb+srv://USUARIO:SENHA@cluster0.xxxxx.mongodb.net/pinkflix?retryWrites=true&w=majority
   ```
   Guarde esse texto, porque vai usar já já.

---

## PARTE 4 · Rodar a API no computador ⏱️ 5 min

1. No VS Code: **Arquivo → Abrir Pasta** e escolha a pasta `pinkflix`.
2. No terminal:
   ```bash
   cd api
   ```
   ```bash
   npm install
   ```
   ```bash
   copy .env.sample .env
   ```
3. Abra o arquivo `api/.env` e preencha:
   ```
   MONGO_URI=(cole aqui a connection string da Parte 3)
   JWT_SECRET=pinkflix_barbie_segredo_super_secreto_2026
   PORT=3000
   ```
4. Crie as contas de teste e os filmes de exemplo:
   ```bash
   npm run seed
   ```
   Tem que aparecer `✔ conta teste@pinkflix.com`, a coleção e a playlist.
   > 🖼️ **Capas:** as 13 capas dos exemplos (9 filmes e 4 jogos) já estão em `api/scripts/capas/` e entram sozinhas no seed.
   > Para trocar ou adicionar uma capa, salve a imagem lá com o nome que aparece em `capa:` no arquivo `api/scripts/seed.js` e rode `npm run seed` de novo.

5. Ligue a API:
   ```bash
   npm run dev
   ```
   Tem que aparecer **💖 Banco conectado** e **✨ PinkFlix API em http://localhost:3000**.
6. Abra http://localhost:3000 no navegador. Se aparecer `"status": "online 💖"`, está funcionando.

> ⚠️ **Deixe esse terminal aberto.** A API precisa ficar ligada enquanto você testa. Para os próximos passos, abra **outro terminal** (botão **+** no painel do terminal).

---

## PARTE 5 · Rodar o site (React) ⏱️ 5 min

No **novo terminal**:
```bash
cd web
```
```bash
npm install
```
```bash
copy .env.example .env
```
```bash
npm run dev
```

Abra http://localhost:5173 🎉

### ✅ Checklist de teste do site
- [ ] Entrar com `teste@pinkflix.com` / `Barbie@123` → aparecem os 13 itens de exemplo, já com capa
- [ ] Clicar nas abas Filmes / Jogos / Favoritos e usar a busca
- [ ] Clicar no 🤍 de um card → vira 💖
- [ ] **+ Adicionar** → criar um filme **com capa** (foto do PC) → salvar
- [ ] Abrir o item, editar e salvar; depois excluir
- [ ] Sair → **Cadastre-se** → criar uma conta nova → já entra direto, com a coleção vazia ✨
- [ ] Abrir **Playlist 🎵** → buscar "popstar", favoritar uma música, adicionar uma nova, editar e excluir

---

## PARTE 6 · Rodar o app no celular ⏱️ 10 min

1. Descubra o IP do seu computador. No terminal:
   ```bash
   ipconfig
   ```
   Procure **Endereço IPv4** (algo como `192.168.0.15`).
2. Abra `mobile/lib/config.js` e troque o endereço:
   ```js
   export const API_URL = 'http://192.168.0.15:3000';   // ← seu IP aqui
   ```
3. Em **outro terminal** (a API continua ligada):
   ```bash
   cd mobile
   ```
   ```bash
   npm install
   ```
   ```bash
   npx expo install --fix
   ```
   ```bash
   npx expo start
   ```
4. Vai aparecer um **QR Code**. No Android, abra o **Expo Go** e leia o código; no iPhone, use a **câmera**.

> ⚠️ O celular e o computador precisam estar **no mesmo Wi-Fi**.
> Se o Expo Go reclamar de versão do SDK, rode `npx expo install expo@latest` e depois `npx expo install --fix`.
> Se não conectar, o Firewall do Windows pode estar bloqueando: quando ele perguntar, clique em **Permitir acesso**.

### ✅ Checklist de teste do app
- [ ] Login com `teste@pinkflix.com`
- [ ] Abas, busca e "puxar para atualizar"
- [ ] Botão **+** → tocar na capa → **📸 Tirar foto** (fotografe um DVD ou uma imagem) → salvar
- [ ] Criar outro item escolhendo a capa pela **🖼️ Galeria**
- [ ] Editar e excluir
- [ ] Criar uma conta nova pelo app → já entra direto
- [ ] Tocar no 🎵 no topo → Playlist: buscar, favoritar, adicionar, editar e excluir música

---

## PARTE 7 · Colocar o código no GitHub ⏱️ 10 min

1. No GitHub: **New repository** → nome `pinkflix` → **Public** → *Create repository* (sem marcar README).
2. Na pasta `pinkflix`, no terminal (troque `SEU_USUARIO`):
   ```bash
   git init
   ```
   ```bash
   git add .
   ```
   ```bash
   git commit -m "PinkFlix: API, site e app"
   ```
   ```bash
   git branch -M main
   ```
   ```bash
   git remote add origin https://github.com/SEU_USUARIO/pinkflix.git
   ```
   ```bash
   git push -u origin main
   ```
3. Confira no GitHub: **o arquivo `.env` NÃO pode aparecer lá**, porque ele tem a senha do banco. O `.gitignore` já cuida disso, mas confira mesmo assim 👀
4. Para colocar os colegas: **Settings → Collaborators → Add people**.

---

## PARTE 8 · Publicar a API no Render ⏱️ 10 min

Isso faz o APK funcionar em qualquer celular, sem precisar do seu PC ligado.

1. No Render: **New + → Web Service** → escolha o repositório `pinkflix`.
2. Preencha:
   | Campo | Valor |
   |---|---|
   | Name | `pinkflix-api` |
   | Root Directory | `api` |
   | Build Command | `npm install` |
   | Start Command | `npm start` |
   | Instance Type | **Free** |
3. Em **Environment Variables**, adicione `MONGO_URI` e `JWT_SECRET` (os mesmos valores do seu `.env`).
4. Clique em **Deploy**. No fim aparece um link como `https://pinkflix-api.onrender.com`.
5. Abra esse link: tem que aparecer `"status": "online 💖"`.

> 💤 O plano grátis "dorme" quando fica parado. Na primeira vez que abrir, a resposta pode levar até 1 minuto. **Abra o link uns minutos antes de apresentar!**

### (Opcional) Publicar o site na Vercel
1. Na Vercel: **Add New → Project** → escolha `pinkflix`.
2. **Root Directory:** `web`
3. Em **Environment Variables**: `VITE_API_URL` = o link do Render.
4. Clique em **Deploy** e você ganha um link para mostrar o site ao professor 💅

---

## PARTE 9 · Gerar o APK ⏱️ 20 min (a maior parte é esperar)

1. Em `mobile/lib/config.js`, coloque o **link do Render**:
   ```js
   export const API_URL = 'https://pinkflix-api.onrender.com';
   ```
2. No terminal, dentro de `mobile`:
   ```bash
   npx eas-cli login
   ```
   ```bash
   npx eas-cli build -p android --profile apk
   ```
   - Se perguntar se quer criar um projeto EAS → **Y**
   - Se perguntar sobre a *Android keystore* → **Y** (gerar automaticamente)
3. A compilação roda nos servidores da Expo e leva uns 10 a 20 minutos. No final aparece um **link para baixar o `.apk`**.
4. Baixe o APK e renomeie para `PinkFlix.apk`. Para testar, instale num Android (pode ser preciso permitir "fontes desconhecidas").
5. Salve a mudança do `config.js` no GitHub:
   ```bash
   git add .
   ```
   ```bash
   git commit -m "App apontando para a API publicada"
   ```
   ```bash
   git push
   ```

---

## PARTE 10 · Criar o Release (a entrega!) 🎁

O professor pediu um **release**, e o GitHub tem uma área própria para isso:

1. No repositório do GitHub, na coluna da direita: **Releases → Create a new release**.
2. **Choose a tag** → digite `v1.0.0` → *Create new tag*.
3. **Release title:** `PinkFlix v1.0.0 💖`
4. Na descrição, cole o texto abaixo (já preenchendo os nomes e os links):

   ```markdown
   ## 💖 PinkFlix v1.0.0
   Coleção de filmes e jogos da Barbie: versão web (React) e mobile (React Native).

   ### 👩‍💻 Integrantes
   - NOME COMPLETO 1
   - NOME COMPLETO 2
   - NOME COMPLETO 3

   ### 🔗 Links
   - API: https://pinkflix-api.onrender.com
   - Site: (link da Vercel, se publicaram)
   - APK: arquivo PinkFlix.apk anexado abaixo

   ### 🔑 Login de teste
   - **E-mail:** teste@pinkflix.com
   - **Senha:** Barbie@123
   - Já vem com 13 filmes e jogos (com capa) e 30 músicas na playlist.

   Também dá para clicar em **Cadastre-se** e criar uma conta nova: ela já entra direto, sem aprovação.

   ### ✨ Funcionalidades principais (web e mobile)
   - Cadastro (já entra direto) e login com JWT
   - Adicionar, editar e excluir filmes e jogos
   - Capa com upload de imagem
   - Nota em corações, status e favoritos
   - Abas Filmes / Jogos / Favoritos e busca
   - Painel com totais e nota média
   - Playlist 🎵 com as músicas dos filmes (área separada)
   - Exclusivo do app: fotografar a capa com a câmera 📸

   ### 🚀 Como rodar
   Instruções completas no README.md do repositório.
   ```
5. Arraste o **`PinkFlix.apk`** para a área *"Attach binaries"*.
6. Clique em **Publish release** 🎉
7. Mande para o professor o link do repositório: `https://github.com/SEU_USUARIO/pinkflix`

---

## ✅ Checklist final da entrega

- [ ] Nomes completos de todos no `README.md` e no Release
- [ ] Código da API, do site e do app no GitHub (sem o `.env`!)
- [ ] API publicada no Render e respondendo
- [ ] Release `v1.0.0` com os logins de teste e as funcionalidades
- [ ] `PinkFlix.apk` anexado no Release
- [ ] Testaram o APK num celular Android de verdade

---

## 🆘 Deu erro?

| Problema | Solução |
|---|---|
| `'node' não é reconhecido` | Feche e abra o VS Code de novo depois de instalar o Node |
| `Erro ao conectar` / `bad auth` no banco | Confira usuário e senha no `MONGO_URI` e se liberou `0.0.0.0/0` no Network Access |
| Site abre mas diz "Algo deu errado" | A API está ligada? Confira o terminal da Parte 4 |
| App diz "Sem conexão com o servidor" | IP errado no `config.js`, Wi-Fi diferente, ou o Firewall bloqueou |
| APK abre mas não carrega nada | O `config.js` estava com o IP local em vez do link do Render. Arrume e gere o APK de novo |
| Render demora para responder | Ele estava "dormindo". Espere cerca de 1 minuto e tente de novo |
