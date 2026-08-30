import { Link } from 'react-router-dom'

function Login() {
  function handleSubmit(event) {
    event.preventDefault()
  }

  return (
    <main className="login-container">
      <section className="login-card">
        <div className="login-header">
          <p className="login-subtitulo">
            Bem-vindo de volta
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
              required
            />
          </div>

          <div className="login-opcoes">
            <label className="login-lembrar">
              <input type="checkbox" />
              <span>Lembrar de mim</span>
            </label>

            <button type="button" className="login-esqueci">
              Esqueci minha senha
            </button>
          </div>

          <button type="submit" className="login-botao">
            Entrar
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