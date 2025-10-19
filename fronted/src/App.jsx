// App.jsx
import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import InicioSesion from './pages/inicioSesion'
import Registro from './pages/Registro' // Importa el nuevo componente

function App() {
    useEffect(() => {
        console.log('🔄 Intentando conectar con backend...')
        fetch('http://localhost:8080/api/health')
            .then(res => res.json())
            .then(data => {
                console.log('✅ BACKEND CONECTADO - Mensaje:', data.message)
                console.log('✅ BACKEND CONECTADO - Base de datos:', data.database)
            })
            .catch(err => {
                console.error('❌ ERROR DE CONEXIÓN:', err.message)
            })
    }, [])

    return (
        <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<InicioSesion />} />
            <Route path="/registro" element={<Registro />} /> {/* Nueva ruta */}
            <Route path="/" element={<InicioSesion />} />
        </Routes>
    )
}

export default App