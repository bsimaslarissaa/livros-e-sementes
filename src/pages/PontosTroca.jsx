import '../pages/CSS/PontosTroca.css'
import casaDiVo from '../assets/casa-di-vo.png'

function PontosTroca() {
  return (
    <main className="pontos-container">

      {/* CABEÇALHO */}
      <section className="pontos-header">
        <p className="pontos-subtitulo">ONDE COMPARTILHAR</p>

        <h1>Pontos de Troca</h1>

        <p className="pontos-introducao">
          Conheça espaços parceiros onde livros, sementes e boas ideias
          podem circular livremente.
        </p>
      </section>


      {/* ABAS DOS PONTOS */}
      <section className="pontos-abas">
        <button className="ponto-aba ponto-aba-ativa">
          Casa Di Vó
        </button>

        {/*
          Novos pontos poderão ser adicionados aqui futuramente.
        */}
      </section>


      {/* PONTO DE TROCA - CASA DI VÓ */}
      <section className="ponto-detalhes">

        {/* IMAGEM */}
        <div className="ponto-imagem">
          <img
            src={casaDiVo}
            alt="Casa Di Vó, ponto de troca de livros em Saquarema"
          />
        </div>


        {/* CONTEÚDO */}
        <div className="ponto-conteudo">

          <span className="ponto-etiqueta">
            Ponto de troca
          </span>

          <h2>Casa Di Vó</h2>

          <p className="ponto-tipo">
            Cafeteria
          </p>

          <p className="ponto-descricao">
            Na Casa Di Vó, os livros circulam livremente. A cafeteria
            possui uma estante disponível para quem quiser descobrir
            uma nova leitura enquanto aproveita um café.
          </p>

          <p className="ponto-descricao">
            Você pode pegar um livro, deixar um livro para outra pessoa,
            fazer uma troca ou simplesmente escolher uma leitura para
            aproveitar no próprio local.
          </p>


          {/* LOCALIZAÇÃO */}
          <div className="ponto-localizacao">

            <div className="ponto-localizacao-numero">
              01
            </div>

            <div>
              <h3>Onde encontrar</h3>

              <p>
                R. Cel. Madureira, 40 - Loja 2
                <br />
                Centro, Saquarema - RJ, 28990-756
              </p>
            </div>

          </div>


          {/* CONTATO */}
          <div className="ponto-contato">

            <div className="ponto-contato-numero">
              02
            </div>

            <div>
              <strong>Telefone</strong>
              <p>(22) 99777-4513</p>
            </div>

          </div>


          {/* GOOGLE MAPS */}
          <a
            className="ponto-mapa"
            href="https://www.google.com/maps/search/?api=1&query=Casa+Di+Vo+Saquarema&query_place_id=ChIJCdRvDL1flwARUbs_mXh7x28"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ver localização no Google Maps
          </a>

        </div>

      </section>


      {/* COMO PARTICIPAR */}
      <section className="ponto-como-funciona">

        <div className="ponto-como-header">

          <p className="pontos-subtitulo">
            COMO PARTICIPAR
          </p>

          <h2>Encontre um ponto e participe</h2>

          <p>
            Cada ponto parceiro pode ter sua própria forma de funcionamento.
            Antes de realizar uma troca, consulte as informações do local
            escolhido.
          </p>

        </div>


        <div className="ponto-acoes">

          {/* CARD 01 */}
          <article className="ponto-acao-card">

            <span className="ponto-acao-numero">
              01
            </span>

            <h3>Escolha um ponto</h3>

            <p>
              Consulte os pontos parceiros disponíveis e encontre o local
              mais adequado para você.
            </p>

          </article>


          {/* CARD 02 */}
          <article className="ponto-acao-card">

            <span className="ponto-acao-numero">
              02
            </span>

            <h3>Veja como funciona</h3>

            <p>
              Confira as informações do ponto escolhido, pois cada parceiro
              pode possuir suas próprias regras de troca e compartilhamento.
            </p>

          </article>


          {/* CARD 03 */}
          <article className="ponto-acao-card">

            <span className="ponto-acao-numero">
              03
            </span>

            <h3>Visite o local</h3>

            <p>
              Consulte o endereço do ponto parceiro e utilize o mapa para
              facilitar sua chegada ao local.
            </p>

          </article>


          {/* CARD 04 */}
          <article className="ponto-acao-card">

            <span className="ponto-acao-numero">
              04
            </span>

            <h3>Faça parte</h3>

            <p>
              Participe das trocas e ajude livros, sementes e boas ideias
              a continuarem circulando.
            </p>

          </article>

        </div>

      </section>


      {/* MENSAGEM FINAL */}
      <section className="ponto-mensagem-final">

        <p className="pontos-subtitulo">
          COMPARTILHE E PARTICIPE
        </p>

        <h2>
          Cada ponto tem seu jeito de compartilhar.
        </h2>

        <p>
          Conheça as orientações de cada parceiro, participe das trocas
          e ajude livros, sementes e conhecimento a continuarem circulando.
        </p>

      </section>

    </main>
  )
}

export default PontosTroca