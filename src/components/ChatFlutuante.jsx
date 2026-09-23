import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import '../pages/CSS/ChatFlutuante.css'

function ChatFlutuante() {
  const [usuario, setUsuario] = useState(null)
  const [aberto, setAberto] = useState(false)
  const [conversas, setConversas] = useState([])
  const [carregando, setCarregando] = useState(false)
  const [totalNaoLidas, setTotalNaoLidas] = useState(0)

  // =====================================
  // USUÁRIO LOGADO
  // =====================================

  useEffect(() => {
    async function buscarUsuario() {
      const {
        data: { user }
      } = await supabase.auth.getUser()

      setUsuario(user)
    }

    buscarUsuario()

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUsuario(session?.user ?? null)

      if (!session?.user) {
        setAberto(false)
        setConversas([])
        setTotalNaoLidas(0)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // =====================================
  // BUSCAR CONVERSAS
  // =====================================

  useEffect(() => {
    if (usuario) {
      buscarConversas()
    }
  }, [usuario])

  useEffect(() => {
    if (usuario && aberto) {
      buscarConversas()
    }
  }, [aberto])

  async function buscarConversas() {
    if (!usuario) return

    try {
      setCarregando(true)

      const { data: conversasData, error: conversasError } =
        await supabase
          .from('conversas')
          .select(`
            id,
            created_at,
            interessado_id,
            dono_id,
            livro_id,
            semente_id,
            pedido_id
          `)
          .or(
            `interessado_id.eq.${usuario.id},dono_id.eq.${usuario.id}`
          )
          .order('created_at', { ascending: false })

      if (conversasError) {
        throw conversasError
      }

      if (!conversasData || conversasData.length === 0) {
        setConversas([])
        setTotalNaoLidas(0)
        return
      }

      const conversasCompletas = await Promise.all(
        conversasData.map(async (conversa) => {
          let item = null
          let tipo = ''

          // =====================================
          // LIVRO
          // =====================================

          if (conversa.livro_id) {
            const { data: livro } = await supabase
              .from('livros')
              .select('id, titulo, autor, imagem')
              .eq('id', conversa.livro_id)
              .maybeSingle()

            if (livro) {
              item = livro
              tipo = 'Livro'
            }
          }

          // =====================================
          // SEMENTE
          // =====================================

          if (conversa.semente_id) {
            const { data: semente } = await supabase
              .from('sementes')
              .select('id, nome, imagem')
              .eq('id', conversa.semente_id)
              .maybeSingle()

            if (semente) {
              item = {
                ...semente,
                titulo: semente.nome
              }

              tipo = 'Semente'
            }
          }

          // =====================================
          // PEDIDO
          // =====================================

          if (conversa.pedido_id) {
            const { data: pedido } = await supabase
              .from('pedidos')
              .select('id, item_pedido, categoria')
              .eq('id', conversa.pedido_id)
              .maybeSingle()

            if (pedido) {
              item = {
                ...pedido,
                titulo: pedido.item_pedido,
                imagem: null
              }

              tipo = pedido.categoria || 'Pedido'
            }
          }

          // =====================================
          // ÚLTIMA MENSAGEM
          // =====================================

          const { data: ultimaMensagem } = await supabase
            .from('mensagens')
            .select(`
              id,
              mensagem,
              created_at,
              usuario_id,
              lida
            `)
            .eq('conversa_id', conversa.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle()

          // =====================================
          // NOME DE QUEM ENVIOU
          // =====================================

          let nomeRemetente = ''

          if (ultimaMensagem?.usuario_id) {
            if (ultimaMensagem.usuario_id === usuario.id) {
              nomeRemetente = 'Você'
            } else {
              const { data: perfil } = await supabase
                .from('perfis')
                .select('nome')
                .eq('id', ultimaMensagem.usuario_id)
                .maybeSingle()

              nomeRemetente = perfil?.nome || 'Usuário'
            }
          }

          // =====================================
          // MENSAGENS NÃO LIDAS
          // =====================================

          const { count: naoLidas } = await supabase
            .from('mensagens')
            .select('*', {
              count: 'exact',
              head: true
            })
            .eq('conversa_id', conversa.id)
            .eq('lida', false)
            .neq('usuario_id', usuario.id)

          return {
            ...conversa,
            item,
            tipo,
            ultimaMensagem,
            nomeRemetente,
            naoLidas: naoLidas || 0
          }
        })
      )

      // =====================================
      // ORDENAR PELA MENSAGEM MAIS RECENTE
      // =====================================

      conversasCompletas.sort((a, b) => {
        const dataA = new Date(
          a.ultimaMensagem?.created_at || a.created_at
        )

        const dataB = new Date(
          b.ultimaMensagem?.created_at || b.created_at
        )

        return dataB - dataA
      })

      // =====================================
      // TOTAL DE NÃO LIDAS
      // =====================================

      const total = conversasCompletas.reduce(
        (soma, conversa) => soma + conversa.naoLidas,
        0
      )

      setTotalNaoLidas(total)

      // Apenas 3 conversas no painel
      setConversas(conversasCompletas.slice(0, 3))

    } catch (error) {
      console.error(
        'Erro ao buscar conversas do chat flutuante:',
        error
      )
    } finally {
      setCarregando(false)
    }
  }

  // =====================================
  // FORMATAR DATA
  // =====================================

  function formatarHorario(data) {
    if (!data) return ''

    return new Date(data).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // =====================================
  // RESUMIR MENSAGEM
  // =====================================

  function resumirMensagem(texto) {
    if (!texto) {
      return 'Conversa iniciada'
    }

    if (texto.length <= 38) {
      return texto
    }

    return `${texto.substring(0, 38)}...`
  }

  // =====================================
  // NÃO MOSTRAR PARA DESLOGADO
  // =====================================

  if (!usuario) {
    return null
  }

  return (
    <div className="chat-flutuante">

      {/* PAINEL */}

      {aberto && (
        <div className="chat-flutuante-painel">

          <div className="chat-flutuante-header">

            <div>
              <span className="chat-flutuante-subtitulo">
                CONVERSAS
              </span>

              <h2>Mensagens</h2>
            </div>

            <button
              type="button"
              className="chat-fechar"
              onClick={() => setAberto(false)}
              aria-label="Fechar mensagens"
            >
              ×
            </button>

          </div>

          <div className="chat-flutuante-conteudo">

            {carregando ? (

              <p className="chat-status">
                Carregando conversas...
              </p>

            ) : conversas.length === 0 ? (

              <div className="chat-sem-conversas">

                <p>
                  Você ainda não possui conversas.
                </p>

                <span>
                  Demonstre interesse em um livro ou semente
                  para iniciar uma conversa.
                </span>

              </div>

            ) : (

              <div className="chat-lista">

                {conversas.map((conversa) => (

                  <Link
                    key={conversa.id}
                    to={`/conversa/${conversa.id}`}
                    className={`chat-conversa-item ${
                      conversa.naoLidas > 0
                        ? 'chat-conversa-nao-lida'
                        : ''
                    }`}
                    onClick={() => setAberto(false)}
                  >

                    {/* IMAGEM */}

                    <div className="chat-conversa-imagem">

                      {conversa.item?.imagem ? (

                        <img
                          src={conversa.item.imagem}
                          alt={conversa.item.titulo}
                        />

                      ) : (

                        <span>
                          {conversa.tipo === 'Livro'
                            ? 'L'
                            : conversa.tipo === 'Semente'
                              ? 'S'
                              : 'P'}
                        </span>

                      )}

                    </div>

                    {/* INFORMAÇÕES */}

                    <div className="chat-conversa-info">

                      <div className="chat-conversa-topo">

                        <span className="chat-conversa-tipo">
                          {conversa.tipo || 'Conversa'}
                        </span>

                        <span className="chat-conversa-hora">
                          {formatarHorario(
                            conversa.ultimaMensagem?.created_at ||
                            conversa.created_at
                          )}
                        </span>

                      </div>

                      <div className="chat-titulo-linha">

                        <strong className="chat-conversa-titulo">
                          {conversa.item?.titulo ||
                            'Item indisponível'}
                        </strong>

                        {conversa.naoLidas > 0 && (
                          <span className="chat-nao-lidas">
                            {conversa.naoLidas > 9
                              ? '9+'
                              : conversa.naoLidas}
                          </span>
                        )}

                      </div>

                      <p className="chat-conversa-mensagem">

                        {conversa.nomeRemetente && (
                          <strong>
                            {conversa.nomeRemetente}:{' '}
                          </strong>
                        )}

                        {resumirMensagem(
                          conversa.ultimaMensagem?.mensagem
                        )}

                      </p>

                    </div>

                  </Link>

                ))}

              </div>

            )}

            <Link
              to="/mensagens"
              className="chat-ver-mensagens"
              onClick={() => setAberto(false)}
            >
              Ver todas as mensagens
            </Link>

          </div>

        </div>
      )}

      {/* BOTÃO FLUTUANTE */}

      <button
        type="button"
        className={`chat-flutuante-botao ${
          aberto ? 'chat-aberto' : ''
        }`}
        onClick={() => setAberto(!aberto)}
        aria-label={aberto ? 'Fechar chat' : 'Abrir mensagens'}
        title="Mensagens"
      >

        {aberto ? (

          <span className="chat-icone-fechar">
            ×
          </span>

        ) : (

          <>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
            </svg>

            {totalNaoLidas > 0 && (
              <span className="chat-badge-total">
                {totalNaoLidas > 9 ? '9+' : totalNaoLidas}
              </span>
            )}
          </>

        )}

      </button>

    </div>
  )
}

export default ChatFlutuante