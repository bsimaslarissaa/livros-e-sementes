import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './pages/CSS/App.css'
import './pages/CSS/Home.css'

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
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <BrowserRouter>
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

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