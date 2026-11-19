const { Schema, model } = require('mongoose');

// Cada item da coleção é um filme ou um jogo
const ItemSchema = new Schema({
  conta: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true, index: true },
  titulo: { type: String, required: [true, 'Informe o título'], trim: true },
  tipo: { type: String, enum: { values: ['filme', 'jogo'], message: 'Tipo deve ser filme ou jogo' }, required: true },
  ano: { type: Number, min: [1959, 'Ano inválido'], max: [2100, 'Ano inválido'] },
  plataforma: { type: String, trim: true },  // filme: onde assistir | jogo: console/PC/celular
  nota: { type: Number, min: 0, max: 5, default: 0 },
  status: {
    type: String,
    enum: { values: ['quero', 'andamento', 'concluido'], message: 'Status inválido' },
    default: 'quero'
  },
  favorito: { type: Boolean, default: false },
  comentario: { type: String, trim: true, maxlength: [1000, 'Comentário muito longo'] },
  capa: { type: Schema.Types.ObjectId, default: null } // id da imagem salva no GridFS
}, { timestamps: true });

module.exports = model('Item', ItemSchema);
