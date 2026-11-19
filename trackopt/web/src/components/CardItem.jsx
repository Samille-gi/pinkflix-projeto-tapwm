import { Link } from 'react-router-dom';
import { linkCapa } from '../servidor';
import { STATUS, TIPOS } from '../constantes';
import Coracoes from './Coracoes';

export default function CardItem({ item, onFavoritar }) {
  const capa = linkCapa(item.capa);

  return (
    <article className="card">
      <Link to={`/colecao/${item._id}`} className="card-capa">
        {capa ? (
          <img src={capa} alt={`Capa de ${item.titulo}`} loading="lazy" />
        ) : (
          <div className={`capa-vazia ${item.tipo}`}>{TIPOS[item.tipo].emoji}</div>
        )}
        <span className="selo-tipo">{TIPOS[item.tipo].emoji} {TIPOS[item.tipo].rotulo}</span>
      </Link>

      <button
        className={`btn-fav ${item.favorito ? 'ativo' : ''}`}
        onClick={() => onFavoritar(item)}
        title={item.favorito ? 'Tirar dos favoritos' : 'Favoritar'}
      >
        {item.favorito ? '💖' : '🤍'}
      </button>

      <div className="card-info">
        <Link to={`/colecao/${item._id}`} className="card-titulo">{item.titulo}</Link>
        <p className="card-detalhe">
          {[item.ano, item.plataforma].filter(Boolean).join(' • ') || ' '}
        </p>
        <Coracoes valor={item.nota} />
        <span className={`selo-status ${item.status}`}>
          {STATUS[item.status].emoji} {STATUS[item.status].rotulo}
        </span>
      </div>
    </article>
  );
}
