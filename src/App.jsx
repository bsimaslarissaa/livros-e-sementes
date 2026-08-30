import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

import Header from './components/Header'
import Home from './pages/Home'
import Sobre from './pages/Sobre'
import Livros from './pages/Livros'
import Sementes from './pages/Sementes'
import PontosTroca from './pages/PontosTroca'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import AdicionarLivro from './pages/AdicionarLivro'

function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/livros" element={<Livros />} />
        <Route path="/sementes" element={<Sementes />} />
        <Route path="/pontos-troca" element={<PontosTroca />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/addlivro" element={<AdicionarLivro />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App