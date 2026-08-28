import { useState } from 'react'
import { Link } from 'react-router-dom'

function Header() {
  const [menuAberto, setMenuAberto] = useState(false)

  function fecharMenu() {
    setMenuAberto(false)
  }

  return (
    <header>
      <div className="marca">
        <Link to="/" onClick={fecharMenu}>
          <strong>Livros & Sementes</strong>
        </Link>
      </div>

      <button
        className="menu-mobile"
        onClick={() => setMenuAberto(!menuAberto)}
        aria-label="Abrir menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav className={menuAberto ? 'nav-aberto' : ''}>
        <Link to="/" onClick={fecharMenu}>Início</Link>
        <Link to="/sobre" onClick={fecharMenu}>Sobre</Link>
        <Link to="/livros" onClick={fecharMenu}>Livros</Link>
        <Link to="/sementes" onClick={fecharMenu}>Sementes</Link>
        <Link to="/pontos-troca" onClick={fecharMenu}>
          Pontos de Troca
        </Link>
        <Link to="/login" onClick={fecharMenu}>Entrar</Link>
        <Link to="/cadastro" onClick={fecharMenu}>Cadastre-se</Link>
      </nav>
    </header>
  )
}

export default Header