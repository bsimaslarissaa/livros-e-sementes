import { useState } from 'react'
import { Link } from 'react-router-dom'
import imgCrimeECastigo from '/src/pages/imagens/crimeecastigo.jpg'
import imgRevolucaoBichos from '/src/pages/imagens/revolucaodosbichos.webp'
import imgPrincipeCruel from '/src/pages/imagens/principecruel.jpg'

function Livros() {
  const [livrosExemplo] = useState([
    { id: 1, titulo: 'Crime e Castigo', autor: 'Fiódor Dostoiévski', genero: 'Clássico', doador: 'Ana', imagem: imgCrimeECastigo },
    { id: 2, titulo: 'A Revolução dos Bichos', autor: 'George Orwell', genero: 'Fábula', doador: 'Carlos', imagem: imgRevolucaoBichos },
    { id: 3, titulo: 'O Príncipe Cruel', autor: 'Holly Black', genero: 'Fantasia', doador: 'Mariana', imagem: imgPrincipeCruel },
  ])

  return (
    <main className="livros-container">
      <div className="livros-header">
        <div>
          <h1>Livros Disponíveis</h1>
          <p>Encontre histórias para trocar e novos conhecimentos para cultivar.</p>
          <Link to="/addlivro" className="botao-principal">
              + Postar Livro
          </Link>
        </div>
      </div>

      <section className="livros-grid">
        {livrosExemplo.map((livro) => (
          <div key={livro.id} className="livro-card">
            <div className="card-capa">
              <img src={livro.imagem} alt={`Capa do livro ${livro.titulo}`} />
            </div>
            <div className="card-info">
              <span className="card-genero">{livro.genero}</span>
              <h3>{livro.titulo}</h3>
              <p className="card-autor">Por: {livro.autor}</p>
              <p className="card-doador"> Com: <strong>{livro.doador}</strong></p>
              <button className="botao-secundario-pequeno">Tenho Interesse</button>
            </div>
          </div>
        ))}
      </section>
    </main>
  )
}

export default Livros
