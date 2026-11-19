import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { servidor, textoErro } from '../servidor';
import { STATUS } from '../constantes';
import CardItem from '../components/CardItem';

const ABAS = [
  { id: 'tudo', rotulo: '✨ Tudo' },
  { id: 'filme', rotulo: '🎬 Filmes' },
  { id: 'jogo', rotulo: '🎮 Jogos' },
  { id: 'favoritos', rotulo: '💖 Favoritos' }
];

export default function Colecao() {
  const [itens, setItens] = useState([]);
  const [resumo, setResumo] = useState(null);
  const [aba, setAba] = useState('tudo');
  const [busca, setBusca] = useState('');
  const [status, setStatus] = useState('');
  const [ordem, setOrdem] = useState('recentes');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const carregar = useCallback(async () => {
    const params = { ordem };
    if (aba === 'filme' || aba === 'jogo') params.tipo = aba;
    if (aba === 'favoritos') params.favorito = 'true';
    if (status) params.status = status;
    if (busca.trim()) params.busca = busca.trim();

    try {
      const [lista, numeros] = await Promise.all([
        servidor.get('/itens', { params }),
        servidor.get('/itens/resumo')
      ]);
      setItens(lista.data);
      setResumo(numeros.data);
      setErro('');
    } catch (err) {
      setErro(textoErro(err, 'Não foi possível carregar sua coleção'));
    } finally {
      setCarregando(false);
    }
  }, [aba, busca, status, ordem]);

  // espera a pessoa parar de digitar antes de buscar
  useEffect(() => {
    const espera = setTimeout(carregar, 300);
    return () => clearTimeout(espera);
  }, [carregar]);

  const favoritar = async (item) => {
    setItens((lista) => lista.map((i) => (i._id === item._id ? { ...i, favorito: !i.favorito } : i)));
    try {
      await servidor.put(`/itens/${item._id}`, { favorito: !item.favorito });
      carregar();
    } catch (err) {
      setErro(textoErro(err));
      carregar();
    }
  };

  const filtrando = aba !== 'tudo' || busca || status;

  return (
    <>
      <section className="painel">
        <div className="painel-titulo">
          <h1>Minha coleção</h1>
          <Link to="/colecao/novo" className="btn btn-rosa">+ Adicionar</Link>
        </div>

        {resumo && (
          <div className="numeros">
            <div><strong>{resumo.total}</strong><span>itens</span></div>
            <div><strong>{resumo.filmes}</strong><span>filmes 🎬</span></div>
            <div><strong>{resumo.jogos}</strong><span>jogos 🎮</span></div>
            <div><strong>{resumo.concluidos}</strong><span>concluídos ✅</span></div>
            <div><strong>{resumo.mediaNota || '-'}</strong><span>nota média ♥</span></div>
          </div>
        )}
      </section>

      <div className="abas">
        {ABAS.map((a) => (
          <button key={a.id} className={aba === a.id ? 'ativa' : ''} onClick={() => setAba(a.id)}>
            {a.rotulo}
          </button>
        ))}
      </div>

      <div className="filtros">
        <input
          type="search"
          placeholder="🔍 Buscar pelo título..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Todos os status</option>
          {Object.entries(STATUS).map(([id, s]) => (
            <option key={id} value={id}>{s.emoji} {s.rotulo}</option>
          ))}
        </select>
        <select value={ordem} onChange={(e) => setOrdem(e.target.value)}>
          <option value="recentes">Mais recentes</option>
          <option value="nota">Maior nota</option>
          <option value="ano">Ano (mais novo)</option>
          <option value="titulo">Título (A-Z)</option>
        </select>
      </div>

      {erro && <p className="msg-erro">{erro}</p>}

      {carregando ? (
        <p className="aviso-centro">Carregando sua coleção... 💖</p>
      ) : itens.length === 0 ? (
        <div className="vazio">
          <div className="emoji-grande">{filtrando ? '🔎' : '🎀'}</div>
          <p>{filtrando ? 'Nada encontrado com esses filtros.' : 'Sua coleção ainda está vazia!'}</p>
          {!filtrando && <Link to="/colecao/novo" className="btn btn-rosa">Adicionar o primeiro</Link>}
        </div>
      ) : (
        <div className="grade">
          {itens.map((item) => (
            <CardItem key={item._id} item={item} onFavoritar={favoritar} />
          ))}
        </div>
      )}
    </>
  );
}
