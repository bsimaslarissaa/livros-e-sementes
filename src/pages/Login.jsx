
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const [recuperandoSenha, setRecuperandoSenha] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setCarregando(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: senha,
      })

      if (error) throw error

      alert('Login realizado com sucesso! Que bom ter você de volta.')

      setEmail('')
      setSenha('')
      setMostrarSenha(false)
      navigate('/livros')

    } catch (error) {
      console.error('Erro ao fazer login:', error.message)

      if (error.message === 'Invalid login credentials') {
        alert('E-mail ou senha incorretos! Verifique os dados e tente novamente.')
      } else {
        alert(`Ops, erro ao entrar: ${error.message}`)
      }
    } finally {
      setCarregando(false)
    }
  }

  async function handleEsqueciSenha() {
    if (!email.trim()) {
      alert('Digite seu e-mail no campo acima para recuperar sua senha.')
      return
    }

    try {
      setRecuperandoSenha(true)

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/redefinir-senha`,
      })

      if (error) {
        throw error
      }

      alert(
        'Se o e-mail estiver cadastrado, você receberá um link de recuperação. Verifique também a caixa de spam.'
      )

    } catch (error) {
      console.error('Erro ao recuperar senha:', error.message)

      alert(`Não foi possível solicitar a recuperação de senha: ${error.message}`)
    } finally {
      setRecuperandoSenha(false)
    }
  }

  return (
    <main className="login-container">
      <section className="login-card">
        <div className="login-header">
          <p className="login-subtitulo">
            Boas vindas de volta!
          </p>

          <h1>Entrar</h1>

          <p>
            Acesse sua conta para acompanhar suas trocas e participar da comunidade.
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>

          {/* CAMPO DE E-MAIL */}
          <div className="login-grupo">
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

          {/* CAMPO DE SENHA COM OLHINHO */}
          <div className="login-grupo">
            <label htmlFor="senha">Senha</label>

            <div className="login-senha-container">
              <input
                type={mostrarSenha ? 'text' : 'password'}
                id="senha"
                name="senha"
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="login-mostrar-senha"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
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
                    <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                    <path d="M9.9 5.1A10.9 10.9 0 0 1 12 5c5 0 9 4 10 7a13.8 13.8 0 0 1-4 5.1" />
                    <path d="M6.6 6.6A13.6 13.6 0 0 0 2 12c1 3 5 7 10 7a10.6 10.6 0 0 0 5.4-1.5" />
                    <path d="M2 2l20 20" />
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

          {/* OPÇÕES DO LOGIN */}
          <div className="login-opcoes">
            <label className="login-lembrar">
              <input type="checkbox" />
              <span>Lembrar de mim</span>
            </label>

            <button
              type="button"
              className="login-esqueci"
              onClick={handleEsqueciSenha}
              disabled={recuperandoSenha}
            >
              {recuperandoSenha
                ? 'Enviando...'
                : 'Esqueci minha senha'}
            </button>
          </div>

          {/* BOTÃO ENTRAR */}
          <button
            type="submit"
            className="login-botao"
            disabled={carregando}
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        {/* LINK PARA CADASTRO */}
        <div className="login-cadastro">
          <p>
            Ainda não tem uma conta?
            {' '}
            <Link to="/cadastro">
              Cadastre-se
            </Link>
          </p>
        </div>
      </section>

      {/* MENSAGEM LATERAL */}
      <section className="login-mensagem">
        <div>
          <p className="login-mensagem-subtitulo">
            Livros & Sementes
          </p>

          <h2>
            Histórias circulam.<br />
            Ideias florescem.
          </h2>

          <p>
            Entre para encontrar novas leituras, compartilhar sementes e fazer
            parte de uma rede construída por pequenas trocas.
          </p>
        </div>
      </section>
    </main>
  )
}

export default Login
