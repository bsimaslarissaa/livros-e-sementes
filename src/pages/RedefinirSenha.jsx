import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

function RedefinirSenha() {
  const navigate = useNavigate()

  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [salvando, setSalvando] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    if (!novaSenha || !confirmarSenha) {
      alert('Preencha os dois campos de senha.')
      return
    }

    if (novaSenha.length < 6) {
      alert('A nova senha deve ter pelo menos 6 caracteres.')
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

      if (error) {
        throw error
      }

      alert('Senha alterada com sucesso!')

      await supabase.auth.signOut()

      navigate('/login')

    } catch (error) {
      console.error('Erro ao redefinir senha:', error.message)

      alert(`Não foi possível alterar a senha: ${error.message}`)
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

        <form className="login-form" onSubmit={handleSubmit}>

          <div className="login-grupo">
            <label htmlFor="novaSenha">
              Nova senha
            </label>

            <input
              type="password"
              id="novaSenha"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              placeholder="Digite a nova senha"
              required
            />
          </div>

          <div className="login-grupo">
            <label htmlFor="confirmarSenha">
              Confirmar nova senha
            </label>

            <input
              type="password"
              id="confirmarSenha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              placeholder="Digite novamente a nova senha"
              required
            />
          </div>

          <button
            type="submit"
            className="login-botao"
            disabled={salvando}
          >
            {salvando ? 'Alterando...' : 'Alterar senha'}
          </button>

        </form>
      </section>

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