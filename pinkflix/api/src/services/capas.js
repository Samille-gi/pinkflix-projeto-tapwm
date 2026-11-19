// Guarda as capas dentro do próprio MongoDB usando GridFS
const mongoose = require('mongoose');

const balde = () => new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'capas' });
const paraId = (id) => new mongoose.Types.ObjectId(String(id));

function salvarCapa(buffer, { nome, formato, conta }) {
  return new Promise((resolve, reject) => {
    const envio = balde().openUploadStream(nome || 'capa', {
      contentType: formato,
      metadata: { conta: String(conta) }
    });
    envio.once('error', reject);
    envio.once('finish', () => resolve(envio.id));
    envio.end(buffer);
  });
}

async function buscarCapa(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  const [info] = await balde().find({ _id: paraId(id) }).toArray();
  if (!info) return null;
  return { info, stream: balde().openDownloadStream(info._id) };
}

async function apagarCapa(id) {
  if (!id) return;
  try {
    await balde().delete(paraId(id));
  } catch {
    // se já não existia, tudo bem
  }
}

module.exports = { salvarCapa, buscarCapa, apagarCapa };
