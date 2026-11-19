import { Navigate, Route, Routes } from 'react-router-dom';
import { useSessao } from './sessao';
import Topo from './components/Topo';
import Entrar from './pages/Entrar';
import Cadastro from './pages/Cadastro';
import Colecao from './pages/Colecao';
import FormItem from './pages/FormItem';
import Playlist from './pages/Playlist';

function Protegida({ children }) {
  const { conta, carregando } = useSessao();
  if (carregando) return <p className="aviso-centro">Carregando... 💖</p>;
  if (!conta) return <Navigate to="/" replace />;
  return (
    <>
      <Topo />
      <main className="conteudo">{children}</main>
    </>
  );
}

function SoVisitante({ children }) {
  const { conta, carregando } = useSessao();
  if (carregando) return <p className="aviso-centro">Carregando... 💖</p>;
  return conta ? <Navigate to="/colecao" replace /> : children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SoVisitante><Entrar /></SoVisitante>} />
      <Route path="/cadastro" element={<SoVisitante><Cadastro /></SoVisitante>} />
      <Route path="/colecao" element={<Protegida><Colecao /></Protegida>} />
      <Route path="/colecao/novo" element={<Protegida><FormItem /></Protegida>} />
      <Route path="/colecao/:id" element={<Protegida><FormItem /></Protegida>} />
      <Route path="/playlist" element={<Protegida><Playlist /></Protegida>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
