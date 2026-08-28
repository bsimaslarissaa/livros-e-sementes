import { Link } from 'react-router-dom'

function Header() {
  return (
    <header>
      <div className="marca">
        <Link to="/">
          <strong>Livros & Sementes</strong>
        </Link>
      </div>

      <nav>
        <Link to="/">Início</Link>
        <Link to="/sobre">Sobre</Link>
        <Link to="/livros">Livros</Link>
        <Link to="/sementes">Sementes</Link>
        <Link to="/pontos-troca">Pontos de Troca</Link>
        <Link to="/login">Entrar</Link>
        <Link to="/cadastro">Cadastre-se</Link>
      </nav>
    </header>
  )
}

export default Header