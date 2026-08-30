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
          {darkMode ? (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="4" />
              <line x1="12" y1="2" x2="12" y2="4" />
              <line x1="12" y1="20" x2="12" y2="22" />
              <line x1="4.93" y1="4.93" x2="6.34" y2="6.34" />
              <line x1="17.66" y1="17.66" x2="19.07" y2="19.07" />
              <line x1="2" y1="12" x2="4" y2="12" />
              <line x1="20" y1="12" x2="22" y2="12" />
              <line x1="4.93" y1="19.07" x2="6.34" y2="17.66" />
              <line x1="17.66" y1="6.34" x2="19.07" y2="4.93" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
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