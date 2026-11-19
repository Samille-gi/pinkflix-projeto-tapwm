const { Schema, model } = require('mongoose');

// Música da playlist (sem imagem: é uma área separada da coleção)
const MusicaSchema = new Schema({
  conta: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true, index: true },
  titulo: { type: String, required: [true, 'Informe o nome da música'], trim: true },
  artista: { type: String, trim: true, default: 'Barbie' },
  origem: { type: String, trim: true },             // filme ou álbum de onde a música é
  favorita: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = model('Musica', MusicaSchema);
