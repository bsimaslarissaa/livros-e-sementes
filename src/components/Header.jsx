import { useState } from 'react'
import { Link } from 'react-router-dom'

function Header({ darkMode, setDarkMode }) {
  const [menuAberto, setMenuAberto] = useState(false)

  function fecharMenu() {
    setMenuAberto(false)
  }

  return (
    <header className="site-header">

      <div className="marca">
        <Link to="/" onClick={fecharMenu}>
          <strong>Livros & Sementes</strong>
        </Link>
      </div>

      <div className="header-acoes">

        <button
          className="tema-toggle"
          onClick={() => setDarkMode(!darkMode)}
          aria-label={darkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
          title={darkMode ? 'Modo claro' : 'Modo escuro'}
        >
          {darkMode ? '☀' : '☾'}
        </button>

        <button
          className="menu-toggle"
          onClick={() => setMenuAberto(!menuAberto)}
          aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuAberto}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

      </div>

      <nav className={`menu-expansivel ${menuAberto ? 'menu-aberto' : ''}`}>

        <Link to="/" onClick={fecharMenu}>
          Início
        </Link>

        <Link to="/sobre" onClick={fecharMenu}>
          Sobre
        </Link>

        <Link to="/livros" onClick={fecharMenu}>
          Livros
        </Link>

        <Link to="/sementes" onClick={fecharMenu}>
          Sementes
        </Link>

        <Link to="/pontos-troca" onClick={fecharMenu}>
          Pontos de Troca
        </Link>

        <Link to="/login" onClick={fecharMenu}>
          Entrar
        </Link>

        <Link to="/cadastro" onClick={fecharMenu}>
          Cadastre-se
        </Link>

      </nav>

    </header>
  )
}

export default Header