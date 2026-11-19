import { NavLink, useNavigate } from 'react-router-dom';
import { useSessao } from '../sessao';

export default function Topo() {
  const { conta, sair } = useSessao();
  const navegar = useNavigate();

  const deslogar = () => {
    sair();
    navegar('/');
  };

  return (
    <header className="topo">
      <NavLink to="/colecao" className="logo">PinkFlix</NavLink>
      <nav className="topo-links">
        <NavLink to="/colecao" end>Minha coleção</NavLink>
        <NavLink to="/playlist">Playlist 🎵</NavLink>
      </nav>
      <div className="topo-conta">
        <span>Oi, {conta.nome.split(' ')[0]}! 💕</span>
        <button className="btn btn-claro" onClick={deslogar}>Sair</button>
      </div>
    </header>
  );
}
