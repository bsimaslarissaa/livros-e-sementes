import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import './CSS/Conversa.css'

function Conversa() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [usuario, setUsuario] = useState(null)
  const [conversa, setConversa] = useState(null)
  const [item, setItem] = useState(null)
  const [mensagens, setMensagens] = useState([])

  const [novaMensagem, setNovaMensagem] = useState('')

  const [carregando, setCarregando] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')


  // ============================================
  // CARREGAR CONVERSA
  // ============================================

  useEffect(() => {
    const carregarConversa = async () => {
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
        // BUSCAR CONVERSA
        // ----------------------------------------

        const {
          data: dadosConversa,
          error: erroConversa
        } = await supabase
          .from('conversas')
          .select('*')
          .eq('id', id)
          .single()

        if (erroConversa) {
          throw erroConversa
        }

        if (!dadosConversa) {
          setErro('Conversa não encontrada.')
          return
        }

        setConversa(dadosConversa)


        // ----------------------------------------
        // BUSCAR LIVRO OU SEMENTE DA CONVERSA
        // ----------------------------------------

        if (dadosConversa.livro_id) {
          const {
            data: livro,
            error: erroLivro
          } = await supabase
            .from('livros')
            .select('*')
            .eq('id', dadosConversa.livro_id)
            .single()

          if (erroLivro) {
            throw erroLivro
          }

          setItem({
            ...livro,
            tipoItem: 'livro'
          })
        }


        if (dadosConversa.semente_id) {
          const {
            data: semente,
            error: erroSemente
          } = await supabase
            .from('sementes')
            .select('*')
            .eq('id', dadosConversa.semente_id)
            .single()

          if (erroSemente) {
            throw erroSemente
          }

          setItem({
            ...semente,
            tipoItem: 'semente'
          })
        }


        // ----------------------------------------
        // BUSCAR MENSAGENS
        // ----------------------------------------

        const {
          data: dadosMensagens,
          error: erroMensagens
        } = await supabase
          .from('mensagens')
          .select('*')
          .eq('conversa_id', id)
          .order('created_at', { ascending: true })

        if (erroMensagens) {
          throw erroMensagens
        }

        setMensagens(dadosMensagens || [])


        // ----------------------------------------
        // MARCAR MENSAGENS RECEBIDAS COMO LIDAS
        // ----------------------------------------

        const mensagensNaoLidas =
          (dadosMensagens || []).filter(
            (mensagem) =>
              mensagem.usuario_id !== user.id &&
              mensagem.lida === false
          )

        if (mensagensNaoLidas.length > 0) {
          const idsMensagensNaoLidas =
            mensagensNaoLidas.map(
              (mensagem) => mensagem.id
            )

          const { error: erroLeitura } = await supabase
            .from('mensagens')
            .update({ lida: true })
            .in('id', idsMensagensNaoLidas)

          if (erroLeitura) {
            console.error(
              'Erro ao marcar mensagens como lidas:',
              erroLeitura
            )
          } else {
            setMensagens((mensagensAtuais) =>
              mensagensAtuais.map((mensagem) =>
                idsMensagensNaoLidas.includes(mensagem.id)
                  ? { ...mensagem, lida: true }
                  : mensagem
              )
            )
          }
        }

      } catch (error) {
        console.error(
          'Erro ao carregar conversa:',
          error
        )

        setErro(
          'Não foi possível carregar esta conversa.'
        )

      } finally {
        setCarregando(false)
      }
    }

    carregarConversa()

  }, [id, navigate])


  // ============================================
  // ENVIAR MENSAGEM
  // ============================================

  const enviarMensagem = async (event) => {
    event.preventDefault()

    const texto = novaMensagem.trim()

    if (!texto) {
      return
    }

    if (!usuario || !conversa) {
      return
    }

    try {
      setEnviando(true)

      const {
        data: mensagemCriada,
        error: erroMensagem
      } = await supabase
        .from('mensagens')
        .insert([
          {
            conversa_id: conversa.id,
            usuario_id: usuario.id,
            mensagem: texto
          }
        ])
        .select()
        .single()

      if (erroMensagem) {
        throw erroMensagem
      }

      // Adiciona imediatamente a mensagem na tela
      setMensagens((mensagensAtuais) => [
        ...mensagensAtuais,
        mensagemCriada
      ])

      // Limpa o campo
      setNovaMensagem('')

    } catch (error) {
      console.error(
        'Erro ao enviar mensagem:',
        error
      )

      alert(
        'Não foi possível enviar a mensagem. Tente novamente.'
      )

    } finally {
      setEnviando(false)
    }
  }


  // ============================================
  // FORMATAR HORÁRIO
  // ============================================

  const formatarHorario = (data) => {
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
      <main className="conversa-container">
        <div className="conversa-status">
          <p>Carregando conversa...</p>
        </div>
      </main>
    )
  }


  // ============================================
  // ERRO
  // ============================================

  if (erro) {
    return (
      <main className="conversa-container">

        <div className="conversa-status">

          <h2>Não foi possível abrir a conversa</h2>

          <p>
            {erro}
          </p>

          <Link
            to="/livros"
            className="botao-principal"
          >
            Voltar
          </Link>

        </div>

      </main>
    )
  }


  // ============================================
  // NOME DO ITEM
  // ============================================

  const nomeItem =
    item?.tipoItem === 'livro'
      ? item?.titulo
      : item?.nome


  // ============================================
  // TELA DA CONVERSA
  // ============================================

  return (
    <main className="conversa-container">

      <section className="conversa-box">

        {/* CABEÇALHO */}
        <header className="conversa-header">

          <div className="conversa-header-info">

            <span className="conversa-etiqueta">
              {item?.tipoItem === 'livro'
                ? 'Conversa sobre livro'
                : 'Conversa sobre semente'
              }
            </span>

            <h1>
              {nomeItem}
            </h1>

            {item?.tipoItem === 'livro' && (
              <p>
                {item.autor
                  ? `Por: ${item.autor}`
                  : 'Livro disponível para troca'
                }
              </p>
            )}

            {item?.tipoItem === 'semente' && (
              <p>
                Item disponível para troca
              </p>
            )}

          </div>


          {/* IMAGEM DO ITEM */}
          {item?.imagem && (

            <div className="conversa-item-imagem">

              <img
                src={item.imagem}
                alt={
                  item?.tipoItem === 'livro'
                    ? `Capa do livro ${nomeItem}`
                    : `Imagem de ${nomeItem}`
                }
              />

            </div>

          )}

        </header>


        {/* ÁREA DAS MENSAGENS */}
        <div className="conversa-mensagens">

          {mensagens.length === 0 ? (

            <div className="conversa-vazia">

              <h2>
                Comece a conversa
              </h2>

              <p>
                Envie uma mensagem para combinar os detalhes
                da troca.
              </p>

            </div>

          ) : (

            mensagens.map((mensagem) => {

              const minhaMensagem =
                mensagem.usuario_id === usuario.id

              return (
                <div
                  key={mensagem.id}
                  className={
                    minhaMensagem
                      ? 'mensagem-linha minha-mensagem'
                      : 'mensagem-linha outra-mensagem'
                  }
                >

                  <div className="mensagem-balao">

                    <p>
                      {mensagem.mensagem}
                    </p>

                    <span>
                      {formatarHorario(
                        mensagem.created_at
                      )}
                    </span>

                  </div>

                </div>
              )
            })

          )}

        </div>


        {/* CAMPO PARA ENVIAR MENSAGEM */}
        <form
          className="conversa-form"
          onSubmit={enviarMensagem}
        >

          <textarea
            value={novaMensagem}
            onChange={(event) =>
              setNovaMensagem(event.target.value)
            }
            placeholder="Digite sua mensagem..."
            maxLength={1000}
            rows="2"
          />


          <button
            type="submit"
            className="conversa-enviar"
            disabled={
              enviando ||
              !novaMensagem.trim()
            }
          >
            {enviando
              ? 'Enviando...'
              : 'Enviar'
            }
          </button>

        </form>

      </section>

    </main>
  )
}

export default Conversa