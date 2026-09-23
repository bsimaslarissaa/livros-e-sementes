import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

function Livros() {
  const [livrosExemplo, setLivrosExemplo] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [usuario, setUsuario] = useState(null)
  const [iniciandoConversa, setIniciandoConversa] = useState(null)

  const navigate = useNavigate()


  // ============================================
  // BUSCAR LIVROS
  // ============================================

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

      alert(
        'Não conseguimos carregar os livros do banco de dados.'
      )

    } finally {
      setCarregando(false)
    }
  }


  // ============================================
  // BUSCAR USUÁRIO LOGADO
  // ============================================

  const buscarUsuario = async () => {
    const {
      data: { user }
    } = await supabase.auth.getUser()

    setUsuario(user)
  }


  useEffect(() => {
    buscarUsuario()
    buscarLivros()
  }, [])


  // ============================================
  // DELETAR LIVRO
  // ============================================

  const deletarLivro = async (id, titulo) => {
    const confirmar = window.confirm(
      `Tem certeza que deseja remover o livro "${titulo}"?`
    )

    if (!confirmar) return

    try {
      const { error } = await supabase
        .from('livros')
        .delete()
        .eq('id', id)
        .eq('user_id', usuario.id)

      if (error) {
        throw error
      }

      alert('Livro removido com sucesso!')

      setLivrosExemplo(
        livrosExemplo.filter(
          livro => livro.id !== id
        )
      )

    } catch (error) {
      console.error(
        'Erro ao deletar livro:',
        error
      )

      alert(
        'Não foi possível apagar o livro. Tente novamente!'
      )
    }
  }


  // ============================================
  // TENHO INTERESSE
  // ============================================

  const tenhoInteresse = async (livro) => {

    // Usuário não está logado
    if (!usuario) {
      alert(
        'Você precisa entrar na sua conta para demonstrar interesse.'
      )

      navigate('/login')
      return
    }


    // Usuário não pode demonstrar interesse
    // no próprio livro
    if (usuario.id === livro.user_id) {
      alert(
        'Este livro foi publicado por você.'
      )

      return
    }


    // Livro antigo sem proprietário associado
    if (!livro.user_id) {
      alert(
        'Não foi possível identificar o usuário que publicou este livro.'
      )

      return
    }


    try {
      setIniciandoConversa(livro.id)


      // ============================================
      // VERIFICAR SE A CONVERSA JÁ EXISTE
      // ============================================

      const {
        data: conversaExistente,
        error: erroBusca
      } = await supabase
        .from('conversas')
        .select('id')
        .eq('interessado_id', usuario.id)
        .eq('livro_id', livro.id)
        .maybeSingle()


      if (erroBusca) {
        throw erroBusca
      }


      // ============================================
      // SE JÁ EXISTE, ABRIR A CONVERSA
      // ============================================

      if (conversaExistente) {
        navigate(
          `/conversa/${conversaExistente.id}`
        )

        return
      }


      // ============================================
      // CRIAR NOVA CONVERSA
      // ============================================

      const {
        data: novaConversa,
        error: erroCriacao
      } = await supabase
        .from('conversas')
        .insert([
          {
            interessado_id: usuario.id,
            dono_id: livro.user_id,
            livro_id: livro.id,
            semente_id: null
          }
        ])
        .select('id')
        .single()


      if (erroCriacao) {
        throw erroCriacao
      }


      // ============================================
      // ABRIR A NOVA CONVERSA
      // ============================================

      navigate(
        `/conversa/${novaConversa.id}`
      )


    } catch (error) {
      console.error(
        'Erro ao iniciar conversa:',
        error
      )

      alert(
        'Não foi possível iniciar a conversa. Tente novamente.'
      )

    } finally {
      setIniciandoConversa(null)
    }
  }


  // ============================================
  // CONTEÚDO DA PÁGINA
  // ============================================

  return (
    <main className="livros-container">

      <div className="livros-header">

        <div>
          <h1>
            Livros Disponíveis
          </h1>

          <p>
            Encontre histórias para trocar e novos conhecimentos para cultivar.
          </p>
        </div>


        <Link
          to="/addlivro"
          className="botao-principal"
        >
          + Postar um Livro
        </Link>

      </div>


      {carregando ? (

        <p
          style={{
            textAlign: 'center',
            color: '#5c5148',
            fontSize: '1.2rem'
          }}
        >
          Carregando livros da comunidade...
        </p>

      ) : livrosExemplo.length === 0 ? (

        <p
          style={{
            textAlign: 'center',
            color: '#5c5148'
          }}
        >
          Nenhum livro cadastrado ainda. Seja o primeiro!
        </p>

      ) : (

        <section className="livros-grid">

          {livrosExemplo.map((livro) => (

            <div
              key={livro.id}
              className="livro-card"
            >

              <div className="card-capa">

                {livro.imagem ? (

                  <img
                    src={livro.imagem}
                    alt={`Capa do livro ${livro.titulo}`}
                  />

                ) : (

                  <span
                    style={{
                      color: '#5c5148',
                      fontSize: '0.9rem'
                    }}
                  >
                    📚 Sem Capa
                  </span>

                )}

              </div>


              <div className="card-info">

                <span className="card-genero">
                  {livro.genero}
                </span>

                <h3>
                  {livro.titulo}
                </h3>

                <p className="card-autor">
                  Por: {livro.autor}
                </p>

                <p className="card-doador">
                  Com: <strong>{livro.doador}</strong>
                </p>


                <div className="cardbotoes">

                  {/* TENHO INTERESSE */}
                  {usuario?.id !== livro.user_id && (

                    <button
                      className="botao-secundario-pequeno"
                      onClick={() =>
                        tenhoInteresse(livro)
                      }
                      disabled={
                        iniciandoConversa === livro.id
                      }
                    >
                      {iniciandoConversa === livro.id
                        ? 'Abrindo...'
                        : 'Tenho Interesse'
                      }
                    </button>

                  )}


                  {/* EXCLUIR LIVRO */}
                  {usuario?.id === livro.user_id && (

                    <button
                      onClick={() =>
                        deletarLivro(
                          livro.id,
                          livro.titulo
                        )
                      }
                      className="botao-deletar"
                    >
                      X
                    </button>

                  )}

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