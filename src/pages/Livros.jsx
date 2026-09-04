import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'

function Livros() {
  const [livrosExemplo, setLivrosExemplo] = useState([])
  const [carregando, setCarregando] = useState(true)

  const buscarLivros = async () => {
    try {
      setCarregando(true)
      const { data, error } = await supabase
        .from('livros')
        .select('*')
        .order('id', { ascending: false })

      if (error) {
        throw error
      }

      setLivrosExemplo(data)

    } catch (error) {
      console.error('Erro ao buscar livros:', error)
      alert('Não conseguimos carregar os livros do banco de dados.')
    } finally {
      setCarregando(false)
    }
  }
  useEffect(() => {
    buscarLivros()
  }, [])

const deletarLivro = async (id, titulo) => {
  const confirmar = window.confirm(`Tem certeza que deseja remover o livro "${titulo}"?`)
  
  if (!confirmar) return

  try {
    const { error } = await supabase
      .from('livros')
      .delete()
      .eq('id', id)

    if (error) throw error

    alert('Livro removido com sucesso!')
    setLivrosExemplo(livrosExemplo.filter(livro => livro.id !== id))

  } catch (error) {
    console.error('Erro ao deletar livro:', error)
    alert('Não foi possível apagar o livro. Tente novamente!')
  }
}



  return (
    <main className="livros-container">
      <div className="livros-header">
        <div>
          <h1>Livros Disponíveis</h1>
          <p>Encontre histórias para trocar e novos conhecimentos para cultivar.</p>
        </div>
        <Link to="/addlivro" className="botao-principal">
          + Postar um Livro
        </Link>
      </div>

      {carregando ? (
        <p style={{ textAlign: 'center', color: '#5c5148', fontSize: '1.2rem' }}>
           Carregando livros da comunidade...
        </p>
      ) : livrosExemplo.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#5c5148' }}>
          Nenhum livro cadastrado ainda. Seja o primeiro!
        </p>
      ) : (
        <section className="livros-grid">
          {livrosExemplo.map((livro) => (
            <div key={livro.id} className="livro-card">
              <div className="card-capa">
                {livro.imagem ? (
                  <img src={livro.imagem} alt={`Capa do livro ${livro.titulo}`} />
                ) : (
                  <span style={{ color: '#5c5148', fontSize: '0.9rem' }}>📚 Sem Capa</span>
                )}
              </div>
              <div className="card-info">
                <span className="card-genero">{livro.genero}</span>
                <h3>{livro.titulo}</h3>
                <p className="card-autor">Por: {livro.autor}</p>
                <p className="card-doador">Com: <strong>{livro.doador}</strong></p>
                <div className='cardbotoes'>
                <button className="botao-secundario-pequeno">Tenho Interesse</button>
                <button onClick={() => deletarLivro(livro.id, livro.titulo)} className="botao-deletar">
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

export default Livros
