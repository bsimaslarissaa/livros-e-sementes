import { useState } from 'react'
import { Link } from 'react-router-dom'

function Pedidos() {
  const [pedidosExemplo] = useState([
    { id: 1, item: 'Muda de Macieira', categoria: 'Muda', solicitante: 'Lucas', descricao: 'Tenho um espaço no quintal e gostaria muito de plantar uma macieira para os meus filhos.' },
    { id: 2, titulo: 'Livro exemplo', categoria: 'Livro', solicitante: 'Beatriz', descricao: 'Estou estudando sobre hortas urbanas e precisava muito de qualquer livro sobre.' },
    { id: 3, item: 'Sementes de Girassol', categoria: 'Semente', solicitante: 'Gabriel', descricao: 'Quero plantar girassóis na minha calçada para atrair polinizadores para o bairro.' },
  ])

  return (
    <main className="pedidos-container">
      <div className="pedidos-header">
        <div>
          <h1>Mural de Pedidos</h1>
          <p>Veja o que a comunidade está precisando e ajude a realizar um desejo!</p>
        </div>
        <Link to="/pedidos/novo" className="botao-principal">
          + Fazer um Pedido
        </Link>
      </div>

      <section className="pedidos-grid">
        {pedidosExemplo.map((pedido) => (
          <div key={pedido.id} className="pedido-card">
            <div className="pedido-info">
              <span className="pedido-categoria">{pedido.categoria}</span>
              
              <h3>{pedido.item || pedido.titulo}</h3>
              
              <p className="pedido-solicitante">Pedido por: <strong>{pedido.solicitante}</strong></p>
              
              <p className="pedido-descricao">"{pedido.descricao}"</p>
              
              <button className="botao-secundario-pequeno" style={{ marginTop: 'auto' }}>
                Fazer oferta!
              </button>
            </div>
          </div>
        ))}
      </section>
    </main>
  )
}

export default Pedidos
