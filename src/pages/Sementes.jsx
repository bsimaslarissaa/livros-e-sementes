import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'

function Sementes() {
  const [sementes, setSementes] = useState([])
  const [carregando, setCarregando] = useState(true)

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
      alert('Não conseguimos carregar as sementes do banco de dados.')
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    buscarSementes()
  }, [])

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

      if (error) throw error

      alert('Semente removida com sucesso!')

      setSementes(
        sementes.filter(semente => semente.id !== id)
      )

    } catch (error) {
      console.error('Erro ao deletar semente:', error)
      alert('Não foi possível apagar a semente. Tente novamente!')
    }
  }

  return (
    <main className="sementes-container">

      <div className="sementes-header">

        <div>
          <h1>Sementes Disponíveis</h1>

          <p>
            Encontre sementes e mudas para cultivar, trocar e fazer novas vidas florescerem.
          </p>
        </div>

        <Link
          to="/addsemente"
          className="botao-principal"
        >
          + Postar uma Semente
        </Link>

      </div>

      {carregando ? (

        <p className="mensagem-sementes">
          Carregando sementes da comunidade...
        </p>

      ) : sementes.length === 0 ? (

        <p className="mensagem-sementes">
          Nenhuma semente cadastrada ainda. Seja o primeiro!
        </p>

      ) : (

        <section className="sementes-grid">

          {sementes.map((semente) => (

            <div
              key={semente.id}
              className="semente-card"
            >

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
                  Com: <strong>{semente.doador}</strong>
                </p>

                <div className="cardbotoes">

                  <button className="botao-secundario-pequeno">
                    Tenho Interesse
                  </button>

                  <button
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