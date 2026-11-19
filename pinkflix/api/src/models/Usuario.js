const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const UsuarioSchema = new Schema({
  nome: { type: String, required: [true, 'Informe o nome'], trim: true },
  email: { type: String, required: [true, 'Informe o e-mail'], unique: true, lowercase: true, trim: true },
  senha: { type: String, required: true, select: false } // guardamos só o hash
}, { timestamps: true });

// Criptografa a senha sempre que ela for definida/alterada
UsuarioSchema.pre('save', async function () {
  if (this.isModified('senha')) {
    this.senha = await bcrypt.hash(this.senha, 10);
  }
});

UsuarioSchema.methods.senhaConfere = function (senhaDigitada) {
  return bcrypt.compare(senhaDigitada, this.senha);
};

// Formato que vai para o front (sem senha)
UsuarioSchema.methods.paraFront = function () {
  return {
    id: this._id,
    nome: this.nome,
    email: this.email,
    criadoEm: this.createdAt
  };
};

module.exports = model('Usuario', UsuarioSchema);
