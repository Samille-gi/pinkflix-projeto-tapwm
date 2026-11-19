import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSessao } from '../sessao';
import { textoErro } from '../servidor';

export default function Cadastro() {
  const { cadastrar } = useSessao();
  const [dados, setDados] = useState({ nome: '', email: '', senha: '', confirmar: '' });
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  const mudar = (campo) => (e) => setDados({ ...dados, [campo]: e.target.value });

  // cria a conta e já entra (o App manda para a coleção sozinho)
  const enviar = async (e) => {
    e.preventDefault();
    setErro('');
    if (dados.senha !== dados.confirmar) return setErro('As senhas não são iguais');
    setEnviando(true);
    try {
      await cadastrar(dados.nome, dados.email, dados.senha);
    } catch (err) {
      setErro(textoErro(err, 'Não foi possível cadastrar'));
      setEnviando(false);
    }
  };

  return (
    <div className="tela-acesso azul">
      <form className="caixa-acesso" onSubmit={enviar}>
        <h1 className="logo grande">PinkFlix</h1>
        <p className="subtitulo">Crie sua conta 💅</p>

        <label>Nome<input value={dados.nome} onChange={mudar('nome')} required /></label>
        <label>E-mail<input type="email" value={dados.email} onChange={mudar('email')} required /></label>
        <label>Senha<input type="password" value={dados.senha} onChange={mudar('senha')} minLength={6} required /></label>
        <label>Confirmar senha<input type="password" value={dados.confirmar} onChange={mudar('confirmar')} required /></label>

        {erro && <p className="msg-erro">{erro}</p>}

        <button className="btn btn-rosa largo" disabled={enviando}>
          {enviando ? 'Criando...' : 'Criar conta e entrar ✨'}
        </button>
        <p className="troca-acesso">Já tem conta? <Link to="/">Entrar</Link></p>
      </form>
    </div>
  );
}
