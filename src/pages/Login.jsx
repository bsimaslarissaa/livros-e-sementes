import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [recuperandoSenha, setRecuperandoSenha] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setCarregando(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: senha,
      })

      if (error) throw error

      alert('Login realizado com sucesso! Que bom ter você de volta.')

      setEmail('')
      setSenha('')
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
    if (!email) {
      alert('Digite seu e-mail no campo acima para recuperar sua senha.')
      return
    }

    try {
      setRecuperandoSenha(true)

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/redefinir-senha`,
      })

      if (error) {
        throw error
      }

      alert(
        'Enviamos um link de recuperação para o seu e-mail. Verifique também a caixa de spam.'
      )

    } catch (error) {
      console.error('Erro ao recuperar senha:', error.message)

      alert(`Não foi possível enviar o e-mail de recuperação: ${error.message}`)
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
          <div className="login-grupo">
            <label htmlFor="email">E-mail</label>

            <input
              type="email"
              id="email"
              name="email"
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="login-grupo">
            <label htmlFor="senha">Senha</label>

            <input
              type="password"
              id="senha"
              name="senha"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

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

          <button
            type="submit"
            className="login-botao"
            disabled={carregando}
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

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