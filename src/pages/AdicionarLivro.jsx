import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

function AdicionarLivro() {
  const navigate = useNavigate()
  
  const [novoLivro, setNovoLivro] = useState({
    titulo: '',
    autor: '',
    genero: '',
    doador: '',
    imagem: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setNovoLivro({ ...novoLivro, [name]: value })
  }

const handleSubmit = async (e) => {
  e.preventDefault()
  if (!novoLivro.titulo || !novoLivro.autor || !novoLivro.genero || !novoLivro.doador) {
    alert('Por favor, preencha todos os campos obrigatórios!')
    return
  }

  try {
    const { data, error } = await supabase
      .from('livros')
      .insert([
        {
          titulo: novoLivro.titulo,
          autor: novoLivro.autor,
          genero: novoLivro.genero,
          doador: novoLivro.doador,
          imagem: novoLivro.imagem
        }
      ])

    if (error) {
      throw error
    }
    alert('Livro postado com sucesso na comunidade! 🎉')
    setNovoLivro({ titulo: '', autor: '', genero: '', doador: '', imagem: '' })
    navigate('/livros')
  } catch (error) {
    console.error('Erro detalhado ao salvar:', error)
    alert('Eita, deu ruim ao salvar o livro no banco de dados. Dê uma olhada no console!')
  }
}


  return (
    <main className="form-container">
      <div className="form-header">
        <h1>Compartilhe um Livro</h1>
        <p>Preencha os dados abaixo para disponibilizar sua história para a rede.</p>
      </div>

      <form onSubmit={handleSubmit} className="livro-form">
        <div className="form-grupo">
          <label htmlFor="titulo">Título do Livro *</label>
          <input 
            type="text" id="titulo" name="titulo" 
            value={novoLivro.titulo} onChange={handleChange} 
            placeholder="Ex: O Pequeno Princípe" required
          />
        </div>

        <div className="form-grupo">
          <label htmlFor="autor">Autor *</label>
          <input 
            type="text" id="autor" name="autor" 
            value={novoLivro.autor} onChange={handleChange} 
            placeholder="Ex: Antoine de Saint-Exupéry" required
          />
        </div>

        <div className="form-grupo">
          <label htmlFor="genero">Gênero *</label>
          <select 
            id="genero" name="genero" 
            value={novoLivro.genero} onChange={handleChange} required
          >
            <option value="">Selecione um gênero</option>
            <option value="Clássico">Clássico</option>
            <option value="Fábula">Fábula</option>
            <option value="Fantasia">Fantasia</option>
            <option value="Cultivo">Cultivo e Plantas</option>
            <option value="Ficção">Ficção / Outros</option>
          </select>
        </div>

        <div className="form-grupo">
          <label htmlFor="doador">Seu Nome (Doador) *</label>
          <input 
            type="text" id="doador" name="doador" 
            value={novoLivro.doador} onChange={handleChange} 
            placeholder="Ex: Júlia" required
          />
        </div>

        <div className="form-grupo">
          <label htmlFor="imagem">Link da Imagem da Capa</label>
          <input 
            type="url" id="imagem" name="imagem" 
            value={novoLivro.imagem} onChange={handleChange} 
            placeholder="Cole a URL de uma imagem da internet (opcional)"
          />
        </div>

        <div className="form-botoes">
          <Link to="/livros" className="botao-secundario">Cancelar</Link>
          <button type="submit" className="botao-principal">Disponibilizar Livro</button>
        </div>
      </form>
    </main>
  )
}

export default AdicionarLivro
