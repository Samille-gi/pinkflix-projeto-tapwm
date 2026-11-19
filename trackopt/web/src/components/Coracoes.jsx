// Nota de 0 a 5 em corações. Se receber onChange, vira clicável.
export default function Coracoes({ valor = 0, onChange }) {
  return (
    <span className={`coracoes ${onChange ? 'editavel' : ''}`} aria-label={`Nota ${valor} de 5`}>
      {[1, 2, 3, 4, 5].map((n) =>
        onChange ? (
          <button
            key={n}
            type="button"
            title={`${n} de 5`}
            className={n <= valor ? 'cheio' : ''}
            onClick={() => onChange(n === valor ? 0 : n)}
          >
            {n <= valor ? '♥' : '♡'}
          </button>
        ) : (
          <span key={n} className={n <= valor ? 'cheio' : ''}>{n <= valor ? '♥' : '♡'}</span>
        )
      )}
    </span>
  );
}
