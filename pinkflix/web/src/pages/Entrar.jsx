import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSessao } from '../sessao';
import { textoErro } from '../servidor';

export default function Entrar() {
  const { entrar } = useSessao();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  const enviar = async (e) => {
    e.preventDefault();
    setErro('');
    setEnviando(true);
    try {
      await entrar(email, senha);
    } catch (err) {
      setErro(textoErro(err, 'Não foi possível entrar'));
      setEnviando(false);
    }
  };

  return (
    <div className="tela-acesso">
      <div className="acesso-duplo">
        <div className="acesso-arte" role="img" aria-label="Capas de filmes da Barbie" />
        <form className="caixa-acesso" onSubmit={enviar}>
          <h1 className="logo grande">PinkFlix</h1>
          <p className="subtitulo">Sua coleção de filmes e jogos da Barbie 💖</p>

          <label>
            E-mail
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </label>
          <label>
            Senha
            <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required autoComplete="current-password" />
          </label>

          {erro && <p className="msg-erro">{erro}</p>}

          <button className="btn btn-rosa largo" disabled={enviando}>
            {enviando ? 'Entrando...' : 'Entrar ✨'}
          </button>
          <p className="troca-acesso">
            Ainda não tem conta? <Link to="/cadastro">Cadastre-se</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
