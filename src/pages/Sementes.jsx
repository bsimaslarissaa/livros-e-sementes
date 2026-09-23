import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

function Sementes() {
  const [sementes, setSementes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [usuario, setUsuario] = useState(null)
  const [abrindoConversa, setAbrindoConversa] = useState(null)

  const navigate = useNavigate()


  // =====================================
  // BUSCAR SEMENTES
  // =====================================

  const buscarSementes = async () => {
    try {
      setCarregando(true)

      const { data, error } = await supabase
        .from('sementes')
        .select('*')
        .order('id', { ascending: false })

      if (error) {
        throw error
      }

      setSementes(data)

    } catch (error) {
      console.error('Erro ao buscar sementes:', error)

      alert(
        'Não conseguimos carregar as sementes do banco de dados.'
      )

    } finally {
      setCarregando(false)
    }
  }


  // =====================================
  // BUSCAR USUÁRIO LOGADO
  // =====================================

  const buscarUsuario = async () => {
    const {
      data: { user }
    } = await supabase.auth.getUser()

    setUsuario(user)
  }


  useEffect(() => {
    buscarUsuario()
    buscarSementes()
  }, [])


  // =====================================
  // DELETAR SEMENTE
  // =====================================

  const deletarSemente = async (id, nome) => {
    const confirmar = window.confirm(
      `Tem certeza que deseja remover "${nome}"?`
    )

    if (!confirmar) return

    try {
      const { error } = await supabase
        .from('sementes')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      alert('Semente removida com sucesso!')

      setSementes(
        sementes.filter(
          semente => semente.id !== id
        )
      )

    } catch (error) {
      console.error(
        'Erro ao deletar semente:',
        error
      )

      alert(
        'Não foi possível apagar a semente. Tente novamente!'
      )
    }
  }


  // =====================================
  // TENHO INTERESSE
  // =====================================

  const demonstrarInteresse = async (semente) => {

    // Usuário precisa estar logado
    if (!usuario) {
      alert(
        'Você precisa entrar na sua conta para demonstrar interesse.'
      )

      navigate('/login')
      return
    }


    // Não permite abrir conversa com a própria semente
    if (usuario.id === semente.user_id) {
      alert(
        'Esta semente foi cadastrada por você.'
      )

      return
    }


    try {
      setAbrindoConversa(semente.id)


      // =====================================
      // VERIFICAR SE A CONVERSA JÁ EXISTE
      // =====================================

      const {
        data: conversaExistente,
        error: erroBusca
      } = await supabase
        .from('conversas')
        .select('id')
        .eq('interessado_id', usuario.id)
        .eq('dono_id', semente.user_id)
        .eq('semente_id', semente.id)
        .maybeSingle()


      if (erroBusca) {
        throw erroBusca
      }


      // Se a conversa já existe, apenas abre
      if (conversaExistente) {
        navigate(
          `/conversa/${conversaExistente.id}`
        )

        return
      }


      // =====================================
      // CRIAR NOVA CONVERSA
      // =====================================

      const {
        data: novaConversa,
        error: erroConversa
      } = await supabase
        .from('conversas')
        .insert({
          interessado_id: usuario.id,
          dono_id: semente.user_id,
          livro_id: null,
          semente_id: semente.id
        })
        .select()
        .single()


      if (erroConversa) {
        throw erroConversa
      }


      // =====================================
      // ABRIR A CONVERSA
      // =====================================
      // Nenhuma mensagem é enviada automaticamente.
      // O usuário escreverá a própria mensagem no chat.

      navigate(
        `/conversa/${novaConversa.id}`
      )

    } catch (error) {

      console.error(
        'Erro ao iniciar conversa sobre a semente:',
        error
      )

      alert(
        'Não foi possível iniciar a conversa. Tente novamente.'
      )

    } finally {
      setAbrindoConversa(null)
    }
  }


  // =====================================
  // PÁGINA
  // =====================================

  return (
    <main className="sementes-container">

      <div className="sementes-header">

        <div>

          <h1>
            Sementes Disponíveis
          </h1>

          <p>
            Encontre sementes e mudas para cultivar,
            trocar e fazer novas vidas florescerem.
          </p>

        </div>


        <Link
          to="/addsemente"
          className="botao-principal"
        >
          + Postar uma Semente
        </Link>

      </div>


      {/* =====================================
          CARREGANDO
          ===================================== */}

      {carregando ? (

        <p className="mensagem-sementes">
          Carregando sementes da comunidade...
        </p>

      ) : sementes.length === 0 ? (

        /* =====================================
           SEM SEMENTES
           ===================================== */

        <p className="mensagem-sementes">
          Nenhuma semente cadastrada ainda.
          Seja o primeiro!
        </p>

      ) : (

        /* =====================================
           LISTA DE SEMENTES
           ===================================== */

        <section className="sementes-grid">

          {sementes.map((semente) => (

            <div
              key={semente.id}
              className="semente-card"
            >

              {/* IMAGEM */}

              <div className="card-imagem">

                {semente.imagem ? (

                  <img
                    src={semente.imagem}
                    alt={semente.nome}
                  />

                ) : (

                  <span>
                    Sem imagem
                  </span>

                )}

              </div>


              {/* INFORMAÇÕES */}

              <div className="card-info">

                <span className="card-tipo">
                  {semente.tipo}
                </span>


                <h3>
                  {semente.nome}
                </h3>


                <p className="card-descricao">
                  {semente.descricao}
                </p>


                <p className="card-quantidade">
                  Quantidade: {semente.quantidade}
                </p>


                <p className="card-doador">
                  Com:{' '}
                  <strong>
                    {semente.doador}
                  </strong>
                </p>


                {/* =====================================
                    BOTÕES
                    ===================================== */}

                <div className="cardbotoes">

                  {/* TENHO INTERESSE */}

                  {usuario?.id !== semente.user_id && (

                    <button
                      type="button"
                      className="botao-secundario-pequeno"
                      onClick={() =>
                        demonstrarInteresse(semente)
                      }
                      disabled={
                        abrindoConversa === semente.id
                      }
                    >

                      {abrindoConversa === semente.id
                        ? 'Abrindo...'
                        : 'Tenho Interesse'}

                    </button>

                  )}


                  {/* EXCLUIR SOMENTE A PRÓPRIA SEMENTE */}

                  {usuario?.id === semente.user_id && (

                    <button
                      type="button"
                      onClick={() =>
                        deletarSemente(
                          semente.id,
                          semente.nome
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

export default Sementes