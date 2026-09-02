import { Link } from 'react-router-dom'
import heroImagem from '../assets/hero-livros-sementes.png'

function Home() {
  return (
    <main className="home">
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