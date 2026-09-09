import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

function AdicionarPedido() {
  const navigate = useNavigate()
  const [carregando, setCarregando] = useState(false)
  
  const [novoPedido, setNovoPedido] = useState({
    item_pedido: '',
    categoria: '',
    descricao: '',
    solicitante: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setNovoPedido({ ...novoPedido, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!novoPedido.item_pedido || !novoPedido.categoria || !novoPedido.solicitante) {
      alert('Por favor, preencha todos os campos obrigatórios! ⚠️')
      return
    }

    setCarregando(true)

    try {
      const { error } = await supabase
        .from('pedidos')
        .insert([
          {
            item_pedido: novoPedido.item_pedido,
            categoria: novoPedido.categoria,
            descricao: novoPedido.descricao,
            solicitante: novoPedido.solicitante
          }
        ])

      if (error) throw error

      console.log('Pedido publicado com sucesso:', novoPedido)
      alert('Pedido publicado com sucesso no mural!')
      
      setNovoPedido({ item_pedido: '', categoria: '', descricao: '', solicitante: '' })
      navigate('/pedidos')

    } catch (error) {
      console.error('Erro ao salvar pedido:', error.message)
      alert(`Ops, erro ao salvar pedido: ${error.message}`)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <main className="form-container">
      <div className="form-header">
        <h1>O que você está procurando?</h1>
        <p>Faça um pedido para a comunidade. Alguém pode ter exatamente o que você precisa!</p>
      </div>

      <form onSubmit={handleSubmit} className="livro-form">
        <div className="form-grupo">
          <label htmlFor="item_pedido">O que você precisa? *</label>
          <input 
            type="text" 
            id="item_pedido" 
            name="item_pedido" 
            value={novoPedido.item_pedido} 
            onChange={handleChange} 
            placeholder="Ex: Muda de Macieira, Livro de Botânica..." 
            required
          />
        </div>

        <div className="form-grupo">
          <label htmlFor="categoria">Categoria *</label>
          <select 
            id="categoria" 
            name="categoria" 
            value={novoPedido.categoria} 
            onChange={handleChange} 
            required
          >
            <option value="">Selecione uma categoria</option>
            <option value="Livro">Livro</option>
            <option value="Muda">Muda</option>
            <option value="Semente">Semente</option>
            <option value="Outros">Outros</option>
          </select>
        </div>

        <div className="form-grupo">
          <label htmlFor="solicitante">Seu Nome *</label>
          <input 
            type="text" 
            id="solicitante" 
            name="solicitante" 
            value={novoPedido.solicitante} 
            onChange={handleChange} 
            placeholder="Ex: Lucas, Beatriz..." 
            required
          />
        </div>

        <div className="form-grupo">
          <label htmlFor="descricao">Explique o seu pedido (Opcional)</label>
          <textarea 
            id="descricao" 
            name="descricao" 
            value={novoPedido.descricao} 
            onChange={handleChange} 
            placeholder="Conte um pouco sobre por que você quer esse item..." 
            rows="4"
            style={{
              padding: '12px 14px',
              border: '2px solid #eaddca',
              borderRadius: '8px',
              fontSize: '1rem',
              color: '#5c5148',
              outline: 'none',
              backgroundColor: '#fdfbf7',
              fontFamily: 'inherit',
              resize: 'none'
            }}
          />
        </div>

        <div className="form-botoes">
          <Link to="/pedidos" className="botao-secundario">Cancelar</Link>
          <button type="submit" className="botao-principal" disabled={carregando}>
            {carregando ? 'Publicando...' : 'Publicar Pedido'}
          </button>
        </div>
      </form>
    </main>
  )
}

export default AdicionarPedido