import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import './CSS/Mensagens.css'

function Mensagens() {
  const navigate = useNavigate()

  const [usuario, setUsuario] = useState(null)
  const [conversas, setConversas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')


  // ============================================
  // CARREGAR CONVERSAS
  // ============================================

  useEffect(() => {
    const carregarConversas = async () => {
      try {
        setCarregando(true)
        setErro('')


        // ----------------------------------------
        // VERIFICAR USUÁRIO LOGADO
        // ----------------------------------------

        const {
          data: { user },
          error: erroUsuario
        } = await supabase.auth.getUser()

        if (erroUsuario) {
          throw erroUsuario
        }

        if (!user) {
          navigate('/login')
          return
        }

        setUsuario(user)


        // ----------------------------------------
        // BUSCAR CONVERSAS DO USUÁRIO
        // ----------------------------------------

        const {
          data: dadosConversas,
          error: erroConversas
        } = await supabase
          .from('conversas')
          .select('*')
          .or(
            `interessado_id.eq.${user.id},dono_id.eq.${user.id}`
          )
          .order('created_at', { ascending: false })


        if (erroConversas) {
          throw erroConversas
        }


        // ----------------------------------------
        // CARREGAR INFORMAÇÕES DE CADA CONVERSA
        // ----------------------------------------

        const conversasCompletas = await Promise.all(
          (dadosConversas || []).map(async (conversa) => {

            let item = null


            // ====================================
            // LIVRO
            // ====================================

            if (conversa.livro_id) {
              const {
                data: livro,
                error: erroLivro
              } = await supabase
                .from('livros')
                .select('*')
                .eq('id', conversa.livro_id)
                .single()

              if (!erroLivro && livro) {
                item = {
                  ...livro,
                  tipoItem: 'livro'
                }
              }
            }


            // ====================================
            // SEMENTE
            // ====================================

            if (conversa.semente_id) {
              const {
                data: semente,
                error: erroSemente
              } = await supabase
                .from('sementes')
                .select('*')
                .eq('id', conversa.semente_id)
                .single()

              if (!erroSemente && semente) {
                item = {
                  ...semente,
                  tipoItem: 'semente'
                }
              }
            }


            // ====================================
            // ÚLTIMA MENSAGEM
            // ====================================

            const {
              data: ultimaMensagem,
              error: erroMensagem
            } = await supabase
              .from('mensagens')
              .select('*')
              .eq('conversa_id', conversa.id)
              .order('created_at', { ascending: false })
              .limit(1)
              .maybeSingle()


            if (erroMensagem) {
              console.error(
                'Erro ao buscar última mensagem:',
                erroMensagem
              )
            }


            return {
              ...conversa,
              item,
              ultimaMensagem: ultimaMensagem || null
            }
          })
        )


        setConversas(conversasCompletas)

      } catch (error) {
        console.error(
          'Erro ao carregar conversas:',
          error
        )

        setErro(
          'Não foi possível carregar suas conversas.'
        )

      } finally {
        setCarregando(false)
      }
    }


    carregarConversas()

  }, [navigate])


  // ============================================
  // FORMATAR DATA
  // ============================================

  const formatarData = (data) => {
    if (!data) return ''

    return new Date(data).toLocaleString(
      'pt-BR',
      {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }
    )
  }


  // ============================================
  // CARREGANDO
  // ============================================

  if (carregando) {
    return (
      <main className="mensagens-container">

        <div className="mensagens-status">
          <p>Carregando suas conversas...</p>
        </div>

      </main>
    )
  }


  // ============================================
  // ERRO
  // ============================================

  if (erro) {
    return (
      <main className="mensagens-container">

        <div className="mensagens-status">

          <h2>Não foi possível carregar</h2>

          <p>{erro}</p>

        </div>

      </main>
    )
  }


  // ============================================
  // PÁGINA
  // ============================================

  return (
    <main className="mensagens-container">

      {/* CABEÇALHO */}
      <section className="mensagens-header">

        <p className="mensagens-subtitulo">
          SUAS CONVERSAS
        </p>

        <h1>Mensagens</h1>

        <p>
          Converse com outros usuários e combine os detalhes
          das suas trocas.
        </p>

      </section>


      {/* SEM CONVERSAS */}
      {conversas.length === 0 ? (

        <section className="mensagens-vazio">

          <h2>
            Nenhuma conversa ainda
          </h2>

          <p>
            Quando você demonstrar interesse em um livro ou
            semente, ou quando alguém tiver interesse em um
            item publicado por você, a conversa aparecerá aqui.
          </p>

        </section>

      ) : (

        // ============================================
        // LISTA DE CONVERSAS
        // ============================================

        <section className="mensagens-lista">

          {conversas.map((conversa) => {

            const nomeItem =
              conversa.item?.tipoItem === 'livro'
                ? conversa.item?.titulo
                : conversa.item?.nome


            const souInteressado =
              conversa.interessado_id === usuario?.id


            return (
              <article
                key={conversa.id}
                className="mensagem-card"
                onClick={() =>
                  navigate(`/conversa/${conversa.id}`)
                }
              >

                {/* IMAGEM */}
                <div className="mensagem-card-imagem">

                  {conversa.item?.imagem ? (

                    <img
                      src={conversa.item.imagem}
                      alt={nomeItem || 'Item da conversa'}
                    />

                  ) : (

                    <div className="mensagem-sem-imagem">
                      {conversa.item?.tipoItem === 'livro'
                        ? 'Livro'
                        : 'Semente'
                      }
                    </div>

                  )}

                </div>


                {/* INFORMAÇÕES */}
                <div className="mensagem-card-conteudo">

                  <div className="mensagem-card-topo">

                    <div>

                      <span className="mensagem-tipo">
                        {conversa.item?.tipoItem === 'livro'
                          ? 'Livro'
                          : 'Semente'
                        }
                      </span>

                      <h2>
                        {nomeItem || 'Item indisponível'}
                      </h2>

                    </div>


                    <span className="mensagem-data">
                      {formatarData(
                        conversa.ultimaMensagem?.created_at ||
                        conversa.created_at
                      )}
                    </span>

                  </div>


                  {/* PAPEL DO USUÁRIO */}
                  <p className="mensagem-papel">
                    {souInteressado
                      ? 'Você demonstrou interesse neste item.'
                      : 'Alguém demonstrou interesse no seu item.'
                    }
                  </p>


                  {/* ÚLTIMA MENSAGEM */}
                  <p className="mensagem-preview">

                    {conversa.ultimaMensagem
                      ? conversa.ultimaMensagem.mensagem
                      : 'Conversa iniciada. Envie a primeira mensagem.'
                    }

                  </p>

                </div>


                {/* BOTÃO */}
                <button
                  type="button"
                  className="mensagem-abrir"
                  onClick={(event) => {
                    event.stopPropagation()

                    navigate(
                      `/conversa/${conversa.id}`
                    )
                  }}
                >
                  Abrir
                </button>

              </article>
            )
          })}

        </section>

      )}

    </main>
  )
}

export default Mensagens