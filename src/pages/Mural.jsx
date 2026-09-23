import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

function Pedidos() {
  const [pedidosReais, setPedidosReais] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [usuario, setUsuario] = useState(null)
  const [abrindoConversa, setAbrindoConversa] = useState(null)

  const navigate = useNavigate()


  // =====================================
  // BUSCAR PEDIDOS
  // =====================================

  const buscarPedidos = async () => {
    try {
      setCarregando(true)

      const { data, error } = await supabase
        .from('pedidos')
        .select('*')
        .order('id', { ascending: false })

      if (error) {
        throw error
      }

      setPedidosReais(data)

    } catch (error) {
      console.error(
        'Erro ao buscar pedidos:',
        error
      )

      alert(
        'Não conseguimos carregar o mural de pedidos. Tente novamente!'
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
    buscarPedidos()
  }, [])


  // =====================================
  // DELETAR PEDIDO
  // =====================================

  const deletarPedido = async (id, item) => {
    const confirmar = window.confirm(
      `Deseja mesmo remover o pedido por "${item}"?`
    )

    if (!confirmar) return

    try {
      const { error } = await supabase
        .from('pedidos')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      alert('Pedido removido do mural!')

      setPedidosReais(
        pedidosReais.filter(
          pedido => pedido.id !== id
        )
      )

    } catch (error) {
      console.error(
        'Erro ao deletar pedido:',
        error
      )

      alert(
        'Não foi possível remover o pedido.'
      )
    }
  }


  // =====================================
  // FAZER OFERTA
  // =====================================

  const fazerOferta = async (pedido) => {

    // Precisa estar logado
    if (!usuario) {
      alert(
        'Você precisa entrar na sua conta para fazer uma oferta.'
      )

      navigate('/login')
      return
    }


    // Pedido antigo sem user_id
    if (!pedido.user_id) {
      alert(
        'Este pedido foi criado antes da implementação das conversas e ainda não possui um usuário vinculado.'
      )

      return
    }


    // Não permite fazer oferta para o próprio pedido
    if (usuario.id === pedido.user_id) {
      alert(
        'Este pedido foi publicado por você.'
      )

      return
    }


    try {
      setAbrindoConversa(pedido.id)


      // =====================================
      // VERIFICAR SE JÁ EXISTE CONVERSA
      // =====================================

      const {
        data: conversaExistente,
        error: erroBusca
      } = await supabase
        .from('conversas')
        .select('id')
        .eq('interessado_id', usuario.id)
        .eq('dono_id', pedido.user_id)
        .eq('pedido_id', pedido.id)
        .maybeSingle()


      if (erroBusca) {
        throw erroBusca
      }


      // Se já existir, apenas abre
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
          dono_id: pedido.user_id,

          // Não é conversa sobre livro
          livro_id: null,

          // Não é conversa sobre semente
          semente_id: null,

          // É conversa sobre pedido
          pedido_id: pedido.id
        })
        .select()
        .single()


      if (erroConversa) {
        throw erroConversa
      }


      // =====================================
      // ABRIR CONVERSA
      // =====================================
      // Não envia mensagem automática.
      // O usuário escreverá a própria oferta.

      navigate(
        `/conversa/${novaConversa.id}`
      )


    } catch (error) {
      console.error(
        'Erro ao iniciar conversa sobre o pedido:',
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
    <main className="pedidos-container">

      <div className="pedidos-header">

        <div>

          <h1>
            Mural de Pedidos
          </h1>

          <p>
            Veja o que a comunidade está precisando e ajude
            a realizar um desejo!
          </p>

        </div>


        <Link
          to="/addpedido"
          className="botao-principal"
        >
          + Fazer um Pedido
        </Link>

      </div>


      {/* =====================================
          CARREGANDO
          ===================================== */}

      {carregando ? (

        <p
          style={{
            textAlign: 'center',
            color: '#5c5148',
            fontSize: '1.2rem'
          }}
        >
          Carregando pedidos da comunidade...
        </p>

      ) : pedidosReais.length === 0 ? (

        /* =====================================
           SEM PEDIDOS
           ===================================== */

        <p
          style={{
            textAlign: 'center',
            color: '#5c5148'
          }}
        >
          Nenhum pedido aberto no momento.
          Inaugure o mural fazendo o seu!
        </p>

      ) : (

        /* =====================================
           LISTA DE PEDIDOS
           ===================================== */

        <section className="pedidos-grid">

          {pedidosReais.map((pedido) => (

            <div
              key={pedido.id}
              className="pedido-card"
            >

              <div className="pedido-info">

                <span className="pedido-categoria">
                  {pedido.categoria}
                </span>


                <h3>
                  {pedido.item_pedido}
                </h3>


                <p className="pedido-solicitante">
                  Pedido por:{' '}
                  <strong>
                    {pedido.solicitante}
                  </strong>
                </p>


                {pedido.descricao && (

                  <p className="pedido-descricao">
                    "{pedido.descricao}"
                  </p>

                )}


                <div className="card-botoes">

                  {/* =====================================
                      FAZER OFERTA
                      ===================================== */}

                  {usuario?.id !== pedido.user_id && (

                    <button
                      type="button"
                      className="botao-secundario-pequeno"
                      onClick={() =>
                        fazerOferta(pedido)
                      }
                      disabled={
                        abrindoConversa === pedido.id
                      }
                    >

                      {abrindoConversa === pedido.id
                        ? 'Abrindo...'
                        : 'Fazer oferta!'}

                    </button>

                  )}


                  {/* =====================================
                      EXCLUIR O PRÓPRIO PEDIDO
                      ===================================== */}

                  {usuario?.id === pedido.user_id && (

                    <button
                      type="button"
                      onClick={() =>
                        deletarPedido(
                          pedido.id,
                          pedido.item_pedido
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

export default Pedidos