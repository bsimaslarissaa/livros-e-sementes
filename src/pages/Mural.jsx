import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'

function Pedidos() {
  const [pedidosReais, setPedidosReais] = useState([])
  const [carregando, setCarregando] = useState(true)
  const buscarPedidos = async () => {
    try {
      setCarregando(true)
      
      const { data, error } = await supabase
        .from('pedidos')
        .select('*')
        .order('id', { ascending: false })

      if (error) throw error

      setPedidosReais(data)

    } catch (error) {
      console.error('Erro ao buscar pedidos:', error.message)
      alert('Não conseguimos carregar o mural de pedidos. Tente novamente!')
    } finally {
      setCarregando(false)
    }
  }

  const deletarPedido = async (id, item) => {
    const confirmar = window.confirm(`Deseja mesmo remover o pedido por "${item}"?`)
    if (!confirmar) return

    try {
      const { error } = await supabase
        .from('pedidos')
        .delete()
        .eq('id', id)

      if (error) throw error

      alert('Pedido removido do mural! 🗑️')
      setPedidosReais(pedidosReais.filter(pedido => pedido.id !== id))

    } catch (error) {
      console.error('Erro ao deletar:', error.message)
      alert('Não foi possível remover o pedido.')
    }
  }

  useEffect(() => {
    buscarPedidos()
  }, [])

  return (
    <main className="pedidos-container">
      <div className="pedidos-header">
        <div>
          <h1>Mural de Pedidos</h1>
          <p>Veja o que a comunidade está precisando e ajude a realizar um desejo!</p>
        </div>
        <Link to="/addpedido" className="botao-principal">
          + Fazer um Pedido
        </Link>
      </div>

      {carregando ? (
        <p style={{ textAlign: 'center', color: '#5c5148', fontSize: '1.2rem' }}>
          🔄 Carregando pedidos da comunidade...
        </p>
      ) : pedidosReais.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#5c5148' }}>
          Nenhum pedido aberto no momento. Inaugure o mural fazendo o seu!
        </p>
      ) : (
        <section className="pedidos-grid">
          {pedidosReais.map((pedido) => (
            <div key={pedido.id} className="pedido-card">
              <div className="pedido-info">
                <span className="pedido-categoria">{pedido.categoria}</span>
                <h3>{pedido.item_pedido}</h3>
                <p className="pedido-solicitante">
                  Pedido por: <strong>{pedido.solicitante}</strong>
                </p>
                {pedido.descricao && (
                  <p className="pedido-descricao">"{pedido.descricao}"</p>
                )}
                <div className="card-botoes">
                  <button className="botao-secundario-pequeno">
                    Fazer oferta!
                  </button>
                  <button 
                    onClick={() => deletarPedido(pedido.id, pedido.item_pedido)} 
                    className="botao-deletar"
                  >
                    X
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}
    </main>
  )
}

export default Pedidos
