import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { supabase } from '../supabaseClient'

function Cadastro() {
 const navigate = useNavigate()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    if (senha !== confirmarSenha) {
      alert('As senhas não coincidem! Por favor, verifique e tente novamente.')
      return
    }
    setCarregando(true)
    try {
      const { data, error } = await supabase.auth.signUp({
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

          <div className="cadastro-grupo">
            <label htmlFor="nome">Nome</label>

            <input
              type="text"
              id="nome"
              name="nome"
              placeholder="Digite seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div className="cadastro-grupo">
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

          <div className="cadastro-grupo">
            <label htmlFor="senha">Senha</label>

            <input
              type="password"
              id="senha"
              name="senha"
              placeholder="Crie uma senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <div className="cadastro-grupo">
            <label htmlFor="confirmarSenha">
              Confirmar senha
            </label>

            <input
              type="password"
              id="confirmarSenha"
              name="confirmarSenha"
              placeholder="Digite a senha novamente"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
            />
          </div>

          <label className="cadastro-termos">
            <input type="checkbox" required />

            <span>
              Concordo com os termos de uso e com a política
              de privacidade.
            </span>
          </label>

           <button type="submit" className="cadastro-botao" disabled={carregando}>
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