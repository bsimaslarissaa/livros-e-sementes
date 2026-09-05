import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

function AdicionarLivro() {
  const navigate = useNavigate()

  const [novoLivro, setNovoLivro] = useState({
    titulo: '',
    autor: '',
    genero: '',
    doador: ''
  })

  const [arquivoImagem, setArquivoImagem] = useState(null)
  const [salvando, setSalvando] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target

    setNovoLivro({
      ...novoLivro,
      [name]: value
    })
  }

  const handleImagem = (e) => {
    const arquivo = e.target.files[0]

    if (!arquivo) return

    if (!arquivo.type.startsWith('image/')) {
      alert('Selecione um arquivo de imagem.')
      return
    }

    setArquivoImagem(arquivo)
  }

  const fazerUploadImagem = async () => {
    if (!arquivoImagem) return null

    const extensao = arquivoImagem.name.split('.').pop()
    const nomeArquivo = `${Date.now()}-${crypto.randomUUID()}.${extensao}`

    const { error: uploadError } = await supabase.storage
      .from('livros')
      .upload(nomeArquivo, arquivoImagem)

    if (uploadError) {
      throw uploadError
    }

    const { data } = supabase.storage
      .from('livros')
      .getPublicUrl(nomeArquivo)

    return data.publicUrl
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (
      !novoLivro.titulo ||
      !novoLivro.autor ||
      !novoLivro.genero ||
      !novoLivro.doador
    ) {
      alert('Por favor, preencha todos os campos obrigatórios!')
      return
    }

    try {
      setSalvando(true)

      const urlImagem = await fazerUploadImagem()

      const { error } = await supabase
        .from('livros')
        .insert([
          {
            titulo: novoLivro.titulo,
            autor: novoLivro.autor,
            genero: novoLivro.genero,
            doador: novoLivro.doador,
            imagem: urlImagem
          }
        ])

      if (error) {
        throw error
      }

      alert('Livro postado com sucesso na comunidade!')

      navigate('/livros')

    } catch (error) {
      console.error('Erro ao salvar livro:', error)
      alert('Não foi possível salvar o livro.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <main className="form-container">

      <div className="form-header">
        <h1>Compartilhe um Livro</h1>
        <p>
          Preencha os dados abaixo para disponibilizar sua história para a rede.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="livro-form"
      >

        <div className="form-grupo">
          <label htmlFor="titulo">
            Título do Livro *
          </label>

          <input
            type="text"
            id="titulo"
            name="titulo"
            value={novoLivro.titulo}
            onChange={handleChange}
            placeholder="Ex: O Pequeno Príncipe"
            required
          />
        </div>

        <div className="form-grupo">
          <label htmlFor="autor">
            Autor *
          </label>

          <input
            type="text"
            id="autor"
            name="autor"
            value={novoLivro.autor}
            onChange={handleChange}
            placeholder="Ex: Antoine de Saint-Exupéry"
            required
          />
        </div>

        <div className="form-grupo">
          <label htmlFor="genero">
            Gênero *
          </label>

          <select
            id="genero"
            name="genero"
            value={novoLivro.genero}
            onChange={handleChange}
            required
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
          <label htmlFor="doador">
            Seu Nome (Doador) *
          </label>

          <input
            type="text"
            id="doador"
            name="doador"
            value={novoLivro.doador}
            onChange={handleChange}
            placeholder="Ex: Júlia"
            required
          />
        </div>

        <div className="form-grupo">
          <label htmlFor="imagem">
            Foto da Capa do Livro
          </label>

          <input
            type="file"
            id="imagem"
            accept="image/*"
            onChange={handleImagem}
          />
        </div>

        <div className="form-botoes">

          <Link
            to="/livros"
            className="botao-secundario"
          >
            Cancelar
          </Link>

          <button
            type="submit"
            className="botao-principal"
            disabled={salvando}
          >
            {salvando ? 'Salvando...' : 'Disponibilizar Livro'}
          </button>

        </div>

      </form>

    </main>
  )
}

export default AdicionarLivro