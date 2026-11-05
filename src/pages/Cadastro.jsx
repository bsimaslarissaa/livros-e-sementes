
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { supabase } from '../supabaseClient'

function Cadastro() {
  const navigate = useNavigate()

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')

  // Controle de visualização das senhas
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false)

  const [carregando, setCarregando] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    if (senha !== confirmarSenha) {
      alert('As senhas não coincidem! Por favor, verifique e tente novamente.')
      return
    }

    if (senha.length < 8) {
      alert('A senha deve conter pelo menos 8 ou mais caracteres!')
      return
    }

    if (!senha.match(/\d/)) {
      alert('A senha deve conter pelo menos um número!')
      return
    }

    if (!senha.match(/[a-zA-Z]/)) {
      alert('A senha deve conter pelo menos uma letra!')
      return
    }

    setCarregando(true)

    try {
      const { error } = await supabase.auth.signUp({
        email: email,
        password: senha,
        options: {
          data: {
            display_name: nome
          }
        }
      })

      if (error) throw error

      alert('Sua conta foi criada com sucesso! Boas-vindas à comunidade!')

      setNome('')
      setEmail('')
      setSenha('')
      setConfirmarSenha('')
      setMostrarSenha(false)
      setMostrarConfirmarSenha(false)

      navigate('/login')

    } catch (error) {
      console.error('Erro ao cadastrar:', error.message)
      alert(`Ops, erro ao criar conta: ${error.message}`)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <main className="cadastro-container">

      <section className="cadastro-mensagem">
        <div>
          <p className="cadastro-mensagem-subtitulo">
            Livros & Sementes
          </p>

          <h2>
            Faça parte.<br />
            Compartilhe.<br />
            Cultive.
          </h2>

          <p>
            Crie sua conta para compartilhar livros e sementes,
            encontrar novas histórias e participar de uma comunidade
            que acredita no poder das pequenas trocas.
          </p>
        </div>
      </section>

      <section className="cadastro-card">

        <div className="cadastro-header">
          <p className="cadastro-subtitulo">
            Junte-se à comunidade
          </p>

          <h1>Crie sua conta</h1>

          <p>
            Preencha seus dados para começar a compartilhar.
          </p>
        </div>

        <form className="cadastro-form" onSubmit={handleSubmit}>

          {/* CAMPO NOME */}
          <div className="cadastro-grupo">
            <label htmlFor="nome">Nome</label>

            <input
              type="text"
              id="nome"
              name="nome"
              placeholder="Digite seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              autoComplete="name"
              required
            />
          </div>

          {/* CAMPO E-MAIL */}
          <div className="cadastro-grupo">
            <label htmlFor="email">E-mail</label>

            <input
              type="email"
              id="email"
              name="email"
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          {/* CAMPO SENHA COM OLHINHO */}
          <div className="cadastro-grupo">
            <label htmlFor="senha">Senha</label>

            <div className="cadastro-senha-container">
              <input
                type={mostrarSenha ? 'text' : 'password'}
                id="senha"
                name="senha"
                placeholder="Crie uma senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                autoComplete="new-password"
                required
              />

              <button
                type="button"
                className="cadastro-mostrar-senha"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                aria-label={
                  mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'
                }
                aria-pressed={mostrarSenha}
              >
                {mostrarSenha ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M2 2l20 20" />
                    <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                    <path d="M9.9 5.1A10.9 10.9 0 0 1 12 5c5 0 9 4 10 7a13.8 13.8 0 0 1-4 5.1" />
                    <path d="M6.6 6.6A13.6 13.6 0 0 0 2 12c1 3 5 7 10 7a10.6 10.6 0 0 0 5.4-1.5" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* CONFIRMAR SENHA COM OLHINHO */}
          <div className="cadastro-grupo">
            <label htmlFor="confirmarSenha">
              Confirmar senha
            </label>

            <div className="cadastro-senha-container">
              <input
                type={mostrarConfirmarSenha ? 'text' : 'password'}
                id="confirmarSenha"
                name="confirmarSenha"
                placeholder="Digite a senha novamente"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                autoComplete="new-password"
                required
              />

              <button
                type="button"
                className="cadastro-mostrar-senha"
                onClick={() =>
                  setMostrarConfirmarSenha(!mostrarConfirmarSenha)
                }
                aria-label={
                  mostrarConfirmarSenha
                    ? 'Ocultar confirmação de senha'
                    : 'Mostrar confirmação de senha'
                }
                aria-pressed={mostrarConfirmarSenha}
              >
                {mostrarConfirmarSenha ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M2 2l20 20" />
                    <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                    <path d="M9.9 5.1A10.9 10.9 0 0 1 12 5c5 0 9 4 10 7a13.8 13.8 0 0 1-4 5.1" />
                    <path d="M6.6 6.6A13.6 13.6 0 0 0 2 12c1 3 5 7 10 7a10.6 10.6 0 0 0 5.4-1.5" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* TERMOS DE USO */}
          <label className="cadastro-termos">
            <input type="checkbox" required />

            <span>
              Concordo com os termos de uso e com a política
              de privacidade.
            </span>
          </label>

          {/* BOTÃO CRIAR CONTA */}
          <button
            type="submit"
            className="cadastro-botao"
            disabled={carregando}
          >
            {carregando ? 'Criando conta...' : 'Criar conta'}
          </button>

        </form>

        <div className="cadastro-login">
          <p>
            Já possui uma conta?{' '}
            <Link to="/login">
              Entrar
            </Link>
          </p>
        </div>

      </section>
    </main>
  )
}

export default Cadastro
