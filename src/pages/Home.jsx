import { Link } from 'react-router-dom'
import heroImagem from '../assets/hero-livros-sementes.png'
import { useState, useEffect } from 'react'

function Home() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    if(darkMode) {document.documentElement.classList.add('dark')}
    else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])
  return (
    <main className="home">
       <button 
        onClick={() => setDarkMode(!darkMode)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          padding: '10px 16px',
          borderRadius: '20px',
          border: 'none',
          backgroundColor: darkMode ? '#517541' : '#3f5d32',
          color: 'white',
          cursor: 'pointer',
          fontWeight: 'bold',
          zIndex: 1000
        }}
      >
        {darkMode ? 'Modo Claro' : 'Modo Escuro'}
      </button>
      <section className="hero">

        <div className="hero-conteudo">
          <p className="hero-subtitulo">
            Rede colaborativa de leitura, cultivo e compartilhamento
          </p>

          <h1>
            Troque histórias.<br />
            Plante ideias.<br />
            Cultive futuros.
          </h1>

          <p className="hero-descricao">
            Compartilhe livros, sementes e conhecimento. Faça parte de uma
            comunidade que acredita em pequenas trocas capazes de gerar grandes
            transformações.
          </p>

          <div className="hero-botoes">
            <Link to="/livros" className="botao-principal">
              Explorar livros
            </Link>

            <Link to="/sementes" className="botao-secundario">
              Explorar sementes
            </Link>
          </div>
        </div>

        <div className="hero-ilustracao">
          <div className="hero-imagem">
            <img
              src={heroImagem}
              alt="Livros, sementes e plantas representando o projeto Livros & Sementes"
            />

            <p>
              Conhecimento que circula. Vida que floresce.
            </p>
          </div>
        </div>

      </section>
    </main>
  )
}

export default Home