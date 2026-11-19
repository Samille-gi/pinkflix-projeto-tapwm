import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { servidor, enviarCapa, linkCapa, textoErro } from '../servidor';
import { STATUS, TIPOS } from '../constantes';
import Coracoes from '../components/Coracoes';

const EM_BRANCO = {
  titulo: '', tipo: 'filme', ano: '', plataforma: '', nota: 0,
  status: 'quero', favorito: false, comentario: '', capa: null
};

export default function FormItem() {
  const { id } = useParams();
  const editando = Boolean(id);
  const navegar = useNavigate();

  const [item, setItem] = useState(EM_BRANCO);
  const [arquivo, setArquivo] = useState(null);
  const [previa, setPrevia] = useState(null);
  const [carregando, setCarregando] = useState(editando);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (!editando) return;
    servidor.get(`/itens/${id}`)
      .then(({ data }) => setItem({
        ...EM_BRANCO,
        ...data,
        ano: data.ano ?? '',
        plataforma: data.plataforma ?? '',
        comentario: data.comentario ?? ''
      }))
      .catch((err) => setErro(textoErro(err, 'Item não encontrado')))
      .finally(() => setCarregando(false));
  }, [id, editando]);

  // prévia da imagem escolhida
  useEffect(() => {
    if (!arquivo) return setPrevia(null);
    const url = URL.createObjectURL(arquivo);
    setPrevia(url);
    return () => URL.revokeObjectURL(url);
  }, [arquivo]);

  const mudar = (campo, valor) => setItem((atual) => ({ ...atual, [campo]: valor }));

  const salvar = async (e) => {
    e.preventDefault();
    setErro('');
    if (!item.titulo.trim()) return setErro('Dá um título pro item 💅');

    setSalvando(true);
    try {
      const capa = arquivo ? await enviarCapa(arquivo) : item.capa;
      const corpo = {
        titulo: item.titulo.trim(),
        tipo: item.tipo,
        ano: item.ano === '' ? null : Number(item.ano),
        plataforma: item.plataforma.trim(),
        nota: item.nota,
        status: item.status,
        favorito: item.favorito,
        comentario: item.comentario.trim(),
        capa
      };
      if (editando) await servidor.put(`/itens/${id}`, corpo);
      else await servidor.post('/itens', corpo);
      navegar('/colecao');
    } catch (err) {
      setErro(textoErro(err, 'Não foi possível salvar'));
      setSalvando(false);
    }
  };

  const excluir = async () => {
    if (!window.confirm(`Excluir "${item.titulo}" da sua coleção?`)) return;
    try {
      await servidor.delete(`/itens/${id}`);
      navegar('/colecao');
    } catch (err) {
      setErro(textoErro(err, 'Não foi possível excluir'));
    }
  };

  const removerCapa = () => {
    setArquivo(null);
    mudar('capa', null);
  };

  if (carregando) return <p className="aviso-centro">Carregando... 💖</p>;

  const imagem = previa || linkCapa(item.capa);

  return (
    <form className="form-item" onSubmit={salvar}>
      <div className="form-cabecalho">
        <Link to="/colecao" className="voltar">← Voltar</Link>
        <h1>{editando ? 'Editar item' : 'Novo item ✨'}</h1>
      </div>

      <div className="form-colunas">
        <div className="form-capa">
          {imagem ? (
            <img src={imagem} alt="Capa" />
          ) : (
            <div className={`capa-vazia ${item.tipo}`}>{TIPOS[item.tipo].emoji}</div>
          )}
          <label className="btn btn-claro largo">
            📷 {imagem ? 'Trocar capa' : 'Escolher capa'}
            <input
              type="file"
              accept="image/png, image/jpeg, image/webp"
              hidden
              onChange={(e) => setArquivo(e.target.files[0] || null)}
            />
          </label>
          {imagem && (
            <button type="button" className="link-pequeno" onClick={removerCapa}>Remover capa</button>
          )}
        </div>

        <div className="form-campos">
          <div className="escolha">
            {Object.entries(TIPOS).map(([valor, t]) => (
              <button
                type="button"
                key={valor}
                className={item.tipo === valor ? 'ativa' : ''}
                onClick={() => mudar('tipo', valor)}
              >
                {t.emoji} {t.rotulo}
              </button>
            ))}
          </div>

          <label>
            Título *
            <input value={item.titulo} onChange={(e) => mudar('titulo', e.target.value)} required />
          </label>

          <div className="linha">
            <label>
              Ano
              <input type="number" min="1959" max="2100" value={item.ano} onChange={(e) => mudar('ano', e.target.value)} />
            </label>
            <label>
              {item.tipo === 'filme' ? 'Onde assistir' : 'Plataforma'}
              <input
                value={item.plataforma}
                placeholder={item.tipo === 'filme' ? 'Ex.: DVD, streaming...' : 'Ex.: PC, Switch, celular...'}
                onChange={(e) => mudar('plataforma', e.target.value)}
              />
            </label>
          </div>

          <span className="rotulo">Status</span>
          <div className="escolha">
            {Object.entries(STATUS).map(([valor, s]) => (
              <button
                type="button"
                key={valor}
                className={item.status === valor ? 'ativa' : ''}
                onClick={() => mudar('status', valor)}
              >
                {s.emoji} {s.rotulo}
              </button>
            ))}
          </div>

          <div className="linha alinhada">
            <div>
              <span className="rotulo">Sua nota</span>
              <Coracoes valor={item.nota} onChange={(n) => mudar('nota', n)} />
            </div>
            <label className="check-fav">
              <input type="checkbox" checked={item.favorito} onChange={(e) => mudar('favorito', e.target.checked)} />
              {item.favorito ? '💖' : '🤍'} Favorito
            </label>
          </div>

          <label>
            Comentário
            <textarea
              rows={4}
              maxLength={1000}
              value={item.comentario}
              placeholder="O que você achou?"
              onChange={(e) => mudar('comentario', e.target.value)}
            />
          </label>

          {erro && <p className="msg-erro">{erro}</p>}

          <div className="acoes">
            {editando && (
              <button type="button" className="btn btn-perigo" onClick={excluir}>Excluir</button>
            )}
            <button className="btn btn-rosa" disabled={salvando}>
              {salvando ? 'Salvando...' : 'Salvar 💖'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
