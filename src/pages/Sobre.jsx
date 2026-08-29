import { Link } from 'react-router-dom'

function Sobre() {
  return (
    <main className="sobre">

      {/* APRESENTAÇÃO */}
      <section className="sobre-hero">

        <div className="sobre-conteudo">

          <p className="sobre-subtitulo">
            Sobre Livros & Sementes
          </p>

          <h1>
            Conectando pessoas,<br />
            histórias e natureza.
          </h1>

          <p>
            O Livros & Sementes é uma rede colaborativa criada para incentivar
            a troca gratuita de livros usados e sementes para plantio,
            aproximando pessoas por meio da leitura, da sustentabilidade e do
            compartilhamento.
          </p>

          <p>
            A proposta é transformar itens que muitas vezes ficam sem uso em
            novas oportunidades de aprendizado, cultivo e convivência entre
            pessoas da comunidade.
          </p>

        </div>

        <div className="sobre-destaque">
          <span>
            Compartilhar também é<br />
            uma forma de cultivar.
          </span>
        </div>

      </section>


      {/* CARDS */}
      <section className="sobre-blocos">

        <article className="sobre-card">
          <span className="sobre-numero">01</span>

          <h2>Nossa proposta</h2>

          <p>
            Facilitar o compartilhamento de livros e sementes, criando uma
            rede acessível e colaborativa entre os participantes.
          </p>
        </article>


        <article className="sobre-card">
          <span className="sobre-numero">02</span>

          <h2>Por que existimos</h2>

          <p>
            Muitos livros permanecem sem uso e inúmeras sementes podem ser
            reaproveitadas. O projeto busca ampliar a circulação desses
            recursos e incentivar práticas sustentáveis.
          </p>
        </article>


        <article className="sobre-card">
          <span className="sobre-numero">03</span>

          <h2>Como funciona</h2>

          <p>
            Os participantes poderão encontrar livros e sementes disponíveis,
            cadastrar itens para compartilhamento e utilizar pontos de troca
            parceiros da comunidade.
          </p>
        </article>

      </section>


      {/* MISSÃO */}
      <section className="sobre-missao">

        <div className="sobre-missao-conteudo">

          <p className="sobre-subtitulo">
            Nossa missão
          </p>

          <h2>
            Pequenas trocas podem gerar grandes transformações.
          </h2>

          <p>
            Queremos contribuir para o incentivo à leitura, a educação
            ambiental, a reutilização de recursos e o fortalecimento dos
            vínculos comunitários.
          </p>

        </div>

      </section>


      {/* CHAMADA FINAL */}
      <section className="sobre-cta">

        <div className="sobre-cta-conteudo">

          <p className="sobre-subtitulo">
            Faça parte dessa rede
          </p>

          <h2>
            Compartilhe hoje aquilo que pode transformar o amanhã.
          </h2>

          <p>
            Uma história que você já leu pode ser a próxima descoberta de
            alguém. Uma semente que você compartilha pode ser o início de um
            novo cultivo.
          </p>

          <div className="sobre-cta-botoes">

            <Link to="/livros" className="botao-principal">
              Explorar livros
            </Link>

            <Link to="/sementes" className="botao-secundario">
              Explorar sementes
            </Link>

          </div>

        </div>

      </section>

    </main>
  )
}

export default Sobre