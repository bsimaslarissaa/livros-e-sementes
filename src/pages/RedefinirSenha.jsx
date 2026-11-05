
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

function RedefinirSenha() {
  const navigate = useNavigate()

  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')

  // Controle dos olhinhos
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false)
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false)

  const [salvando, setSalvando] = useState(false)
  const [verificando, setVerificando] = useState(true)
  const [recuperacaoValida, setRecuperacaoValida] = useState(false)
  const [mensagemErro, setMensagemErro] = useState('')

  useEffect(() => {
    let ativo = true
    let recuperacaoConfirmada = false

    const hash = new URLSearchParams(
      window.location.hash.substring(1)
    )

    const query = new URLSearchParams(window.location.search)

    const erroLink = hash.get('error_description') ||
      query.get('error_description')

    const possuiParametrosRecuperacao =
      hash.get('type') === 'recovery' ||
      query.get('type') === 'recovery' ||
      hash.has('access_token') ||
      query.has('code')

    if (erroLink) {
      setMensagemErro(
        'O link de recuperação é inválido ou expirou. Solicite um novo.'
      )
      setVerificando(false)
      return
    }

    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((event, session) => {

        if (!ativo) return

        if (event === 'PASSWORD_RECOVERY' && session) {
          recuperacaoConfirmada = true
          setRecuperacaoValida(true)
          setMensagemErro('')
          setVerificando(false)
        }

        if (event === 'SIGNED_OUT' && !recuperacaoConfirmada) {
          setRecuperacaoValida(false)
        }
      })

    const verificar = async () => {
      try {
        const { error } = await supabase.auth.getSession()

        if (!ativo) return

        if (error) throw error

        if (!recuperacaoConfirmada) {
          setMensagemErro(
            possuiParametrosRecuperacao
              ? 'Não foi possível validar o link. Solicite uma nova recuperação.'
              : 'Acesse esta página pelo link enviado ao seu e-mail.'
          )
        }
      } catch (error) {
        if (ativo) {
          console.error(
            'Erro ao verificar recuperação:',
            error.message
          )

          setMensagemErro(
            'Não foi possível validar o link de recuperação.'
          )
        }
      } finally {
        if (ativo) setVerificando(false)
      }
    }

    verificar()

    return () => {
      ativo = false
      subscription.unsubscribe()
    }
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()

    if (!recuperacaoValida || salvando) {
      alert(
        'A recuperação não foi validada. Solicite um novo link.'
      )
      return
    }

    if (!novaSenha || !confirmarSenha) {
      alert('Preencha os dois campos de senha.')
      return
    }

    if (novaSenha.length < 6) {
      alert(
        'A nova senha deve ter pelo menos 6 caracteres.'
      )
      return
    }

    if (novaSenha !== confirmarSenha) {
      alert('As senhas não coincidem.')
      return
    }

    try {
      setSalvando(true)

      const { error } = await supabase.auth.updateUser({
        password: novaSenha,
      })

      if (error) throw error

      // Limpa os campos após atualizar a senha
      setNovaSenha('')
      setConfirmarSenha('')
      setMostrarNovaSenha(false)
      setMostrarConfirmarSenha(false)

      // Encerra a sessão de recuperação
      const { error: erroSaida } =
        await supabase.auth.signOut()

      if (erroSaida) {
        console.error(
          'Senha alterada, mas houve erro ao sair:',
          erroSaida.message
        )
      }

      // Redireciona para o login
      navigate('/login', { replace: true })

      alert(
        'Senha alterada com sucesso! Faça login com sua nova senha.'
      )

    } catch (error) {
      console.error(
        'Erro ao redefinir senha:',
        error.message
      )

      alert(
        `Não foi possível alterar a senha: ${error.message}`
      )
    } finally {
      setSalvando(false)
    }
  }

  return (
    <main className="login-container">
      <section className="login-card">
        <div className="login-header">
          <p className="login-subtitulo">
            Recuperação de acesso
          </p>

          <h1>Redefinir senha</h1>

          <p>
            Digite sua nova senha abaixo para recuperar o acesso à sua conta.
          </p>
        </div>

        {verificando ? (
          <p>
            Verificando link de recuperação...
          </p>
        ) : !recuperacaoValida ? (
          <div className="login-form">
            <p role="alert">
              {mensagemErro ||
                'Não foi possível validar a recuperação de senha.'}
            </p>

            <p>
              <Link to="/login">
                Voltar para o login e solicitar outro link
              </Link>
            </p>
          </div>
        ) : (
          <form
            className="login-form"
            onSubmit={handleSubmit}
          >

            {/* NOVA SENHA COM OLHINHO */}
            <div className="login-grupo">
              <label htmlFor="novaSenha">
                Nova senha
              </label>

              <div className="login-senha-container">
                <input
                  type={mostrarNovaSenha ? 'text' : 'password'}
                  id="novaSenha"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  placeholder="Digite a nova senha"
                  autoComplete="new-password"
                  minLength={6}
                  required
                />

                <button
                  type="button"
                  className="login-mostrar-senha"
                  onClick={() => setMostrarNovaSenha(!mostrarNovaSenha)}
                  aria-label={
                    mostrarNovaSenha
                      ? 'Ocultar nova senha'
                      : 'Mostrar nova senha'
                  }
                  aria-pressed={mostrarNovaSenha}
                >
                  {mostrarNovaSenha ? (
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

            {/* CONFIRMAR NOVA SENHA COM OLHINHO */}
            <div className="login-grupo">
              <label htmlFor="confirmarSenha">
                Confirmar nova senha
              </label>

              <div className="login-senha-container">
                <input
                  type={mostrarConfirmarSenha ? 'text' : 'password'}
                  id="confirmarSenha"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  placeholder="Digite novamente a nova senha"
                  autoComplete="new-password"
                  minLength={6}
                  required
                />

                <button
                  type="button"
                  className="login-mostrar-senha"
                  onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
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

            {/* BOTÃO ALTERAR SENHA */}
            <button
              type="submit"
              className="login-botao"
              disabled={salvando}
            >
              {salvando
                ? 'Alterando...'
                : 'Alterar senha'}
            </button>

          </form>
        )}
      </section>

      {/* MENSAGEM LATERAL */}
      <section className="login-mensagem">
        <div>
          <p className="login-mensagem-subtitulo">
            Livros & Sementes
          </p>

          <h2>
            Um novo começo.<br />
            A mesma comunidade.
          </h2>

          <p>
            Escolha uma nova senha para continuar compartilhando livros,
            sementes e histórias.
          </p>
        </div>
      </section>
    </main>
  )
}

export default RedefinirSenha
