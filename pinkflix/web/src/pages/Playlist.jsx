import { useCallback, useEffect, useState } from 'react';
import { servidor, textoErro } from '../servidor';

const EM_BRANCO = { titulo: '', artista: 'Barbie', origem: '', favorita: false };

export default function Playlist() {
  const [musicas, setMusicas] = useState([]);
  const [busca, setBusca] = useState('');
  const [soFavoritas, setSoFavoritas] = useState(false);
  const [form, setForm] = useState(EM_BRANCO);
  const [editandoId, setEditandoId] = useState(null);
  const [formAberto, setFormAberto] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  const carregar = useCallback(async () => {
    const params = {};
    if (busca.trim()) params.busca = busca.trim();
    if (soFavoritas) params.favoritas = 'true';
    try {
      const { data } = await servidor.get('/musicas', { params });
      setMusicas(data);
      setErro('');
    } catch (err) {
      setErro(textoErro(err, 'Não foi possível carregar a playlist'));
    } finally {
      setCarregando(false);
    }
  }, [busca, soFavoritas]);

  useEffect(() => {
    const espera = setTimeout(carregar, 300);
    return () => clearTimeout(espera);
  }, [carregar]);

  const mudar = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }));

  const abrirNova = () => {
    setForm(EM_BRANCO);
    setEditandoId(null);
    setFormAberto(true);
  };

  const abrirEdicao = (m) => {
    setForm({ titulo: m.titulo, artista: m.artista ?? '', origem: m.origem ?? '', favorita: m.favorita });
    setEditandoId(m._id);
    setFormAberto(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fechar = () => {
    setFormAberto(false);
    setEditandoId(null);
    setForm(EM_BRANCO);
  };

  const salvar = async (e) => {
    e.preventDefault();
    setErro('');
    if (!form.titulo.trim()) return setErro('Qual é o nome da música? 🎵');
    setSalvando(true);
    const corpo = {
      titulo: form.titulo.trim(),
      artista: form.artista.trim(),
      origem: form.origem.trim(),
      favorita: form.favorita
    };
    try {
      if (editandoId) await servidor.put(`/musicas/${editandoId}`, corpo);
      else await servidor.post('/musicas', corpo);
      fechar();
      carregar();
    } catch (err) {
      setErro(textoErro(err, 'Não foi possível salvar a música'));
    } finally {
      setSalvando(false);
    }
  };

  const favoritar = async (m) => {
    setMusicas((lista) => lista.map((x) => (x._id === m._id ? { ...x, favorita: !x.favorita } : x)));
    try {
      await servidor.put(`/musicas/${m._id}`, { favorita: !m.favorita });
      if (soFavoritas) carregar();
    } catch (err) {
      setErro(textoErro(err));
      carregar();
    }
  };

  const excluir = async (m) => {
    if (!window.confirm(`Tirar "${m.titulo}" da playlist?`)) return;
    try {
      await servidor.delete(`/musicas/${m._id}`);
      if (editandoId === m._id) fechar();
      carregar();
    } catch (err) {
      setErro(textoErro(err, 'Não foi possível excluir'));
    }
  };

  return (
    <>
      <section className="painel painel-playlist">
        <div className="painel-titulo">
          <div>
            <h1>🎵 Minha playlist</h1>
            <p className="painel-sub">As músicas dos filmes da Barbie que não saem da cabeça</p>
          </div>
          <button className="btn btn-rosa" onClick={abrirNova}>+ Adicionar música</button>
        </div>
      </section>

      {formAberto && (
        <form className="form-musica" onSubmit={salvar}>
          <h2>{editandoId ? 'Editar música' : 'Nova música ✨'}</h2>
          <div className="form-musica-campos">
            <label>Nome da música *<input value={form.titulo} onChange={(e) => mudar('titulo', e.target.value)} autoFocus /></label>
            <label>Artista<input value={form.artista} onChange={(e) => mudar('artista', e.target.value)} /></label>
            <label>Filme / álbum<input value={form.origem} placeholder="Ex.: Barbie: A Princesa e a Pop Star" onChange={(e) => mudar('origem', e.target.value)} /></label>
          </div>
          <div className="linha alinhada">
            <label className="check-fav">
              <input type="checkbox" checked={form.favorita} onChange={(e) => mudar('favorita', e.target.checked)} />
              {form.favorita ? '💖' : '🤍'} Favorita
            </label>
            <div className="acoes">
              <button type="button" className="btn btn-claro" onClick={fechar}>Cancelar</button>
              <button className="btn btn-rosa" disabled={salvando}>{salvando ? 'Salvando...' : 'Salvar 🎵'}</button>
            </div>
          </div>
        </form>
      )}

      <div className="filtros filtros-playlist">
        <input
          type="search"
          placeholder="🔍 Buscar por música, artista ou filme..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <div className="abas">
          <button className={!soFavoritas ? 'ativa' : ''} onClick={() => setSoFavoritas(false)}>🎶 Todas</button>
          <button className={soFavoritas ? 'ativa' : ''} onClick={() => setSoFavoritas(true)}>💖 Favoritas</button>
        </div>
      </div>

      {erro && <p className="msg-erro">{erro}</p>}

      {carregando ? (
        <p className="aviso-centro">Carregando a playlist... 🎵</p>
      ) : musicas.length === 0 ? (
        <div className="vazio">
          <div className="emoji-grande">🎤</div>
          <p>{busca || soFavoritas ? 'Nenhuma música encontrada.' : 'Sua playlist ainda está vazia!'}</p>
        </div>
      ) : (
        <ol className="playlist">
          <li className="playlist-cabecalho" aria-hidden="true">
            <span>#</span><span>Música</span><span className="col-origem">Filme / álbum</span><span />
          </li>
          {musicas.map((m, i) => (
            <li key={m._id} className="faixa">
              <span className="faixa-num">{i + 1}</span>
              <div className="faixa-nome">
                <strong>{m.titulo}</strong>
                <span>{m.artista}</span>
              </div>
              <span className="col-origem">{m.origem}</span>
              <div className="faixa-acoes">
                <button className="icone" title={m.favorita ? 'Desfavoritar' : 'Favoritar'} onClick={() => favoritar(m)}>
                  {m.favorita ? '💖' : '🤍'}
                </button>
                <button className="icone" title="Editar" onClick={() => abrirEdicao(m)}>✏️</button>
                <button className="icone" title="Excluir" onClick={() => excluir(m)}>🗑️</button>
              </div>
            </li>
          ))}
        </ol>
      )}
    </>
  );
}
