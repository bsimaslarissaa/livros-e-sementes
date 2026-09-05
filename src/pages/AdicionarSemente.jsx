import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

function AdicionarSemente() {
  const navigate = useNavigate()

  const [novaSemente, setNovaSemente] = useState({
    nome: '',
    tipo: '',
    descricao: '',
    quantidade: '',
    doador: '',
    imagem: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target

    setNovaSemente({
      ...novaSemente,
      [name]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (
      !novaSemente.nome ||
      !novaSemente.tipo ||
      !novaSemente.quantidade ||
      !novaSemente.doador
    ) {
      alert('Por favor, preencha todos os campos obrigatórios!')
      return
    }

    try {
      const { error } = await supabase
        .from('sementes')
        .insert([
          {
            nome: novaSemente.nome,
            tipo: novaSemente.tipo,
            descricao: novaSemente.descricao,
            quantidade: novaSemente.quantidade,
            doador: novaSemente.doador,
            imagem: novaSemente.imagem
          }
        ])

      if (error) {
        throw error
      }

      alert('Semente postada com sucesso na comunidade!')

      setNovaSemente({
        nome: '',
        tipo: '',
        descricao: '',
        quantidade: '',
        doador: '',
        imagem: ''
      })

      navigate('/sementes')

    } catch (error) {
      console.error('Erro ao salvar semente:', error)

      alert(
        'Não foi possível salvar a semente no banco de dados.'
      )
    }
  }

  return (
    <main className="form-container">

      <div className="form-header">

        <h1>Compartilhe uma Semente</h1>

        <p>
          Preencha os dados abaixo para disponibilizar sementes ou mudas para a comunidade.
        </p>

      </div>

      <form
        onSubmit={handleSubmit}
        className="livro-form"
      >

        <div className="form-grupo">

          <label htmlFor="nome">
            Nome da Semente ou Muda *
          </label>

          <input
            type="text"
            id="nome"
            name="nome"
            value={novaSemente.nome}
            onChange={handleChange}
            placeholder="Ex: Girassol"
            required
          />

        </div>

        <div className="form-grupo">

          <label htmlFor="tipo">
            Tipo *
          </label>

          <select
            id="tipo"
            name="tipo"
            value={novaSemente.tipo}
            onChange={handleChange}
            required
          >

            <option value="">
              Selecione um tipo
            </option>

            <option value="Flor">
              Flor
            </option>

            <option value="Hortaliça">
              Hortaliça
            </option>

            <option value="Frutífera">
              Frutífera
            </option>

            <option value="Erva">
              Erva / Tempero
            </option>

            <option value="Muda">
              Muda
            </option>

            <option value="Outros">
              Outros
            </option>

          </select>

        </div>

        <div className="form-grupo">

          <label htmlFor="descricao">
            Descrição
          </label>

          <textarea
            id="descricao"
            name="descricao"
            value={novaSemente.descricao}
            onChange={handleChange}
            placeholder="Ex: Sementes de girassol para cultivo doméstico."
            rows="4"
          />

        </div>

        <div className="form-grupo">

          <label htmlFor="quantidade">
            Quantidade *
          </label>

          <input
            type="text"
            id="quantidade"
            name="quantidade"
            value={novaSemente.quantidade}
            onChange={handleChange}
            placeholder="Ex: 20 sementes"
            required
          />

        </div>

        <div className="form-grupo">

          <label htmlFor="doador">
            Seu Nome (Doador) *
          </label>

          <input
            type="text"
            id="doador"
            name="doador"
            value={novaSemente.doador}
            onChange={handleChange}
            placeholder="Ex: João"
            required
          />

        </div>

        <div className="form-grupo">

          <label htmlFor="imagem">
            Link da Imagem
          </label>

          <input
            type="url"
            id="imagem"
            name="imagem"
            value={novaSemente.imagem}
            onChange={handleChange}
            placeholder="Cole a URL de uma imagem da internet (opcional)"
          />

        </div>

        <div className="form-botoes">

          <Link
            to="/sementes"
            className="botao-secundario"
          >
            Cancelar
          </Link>

          <button
            type="submit"
            className="botao-principal"
          >
            Disponibilizar Semente
          </button>

        </div>

      </form>

    </main>
  )
}

export default AdicionarSemente