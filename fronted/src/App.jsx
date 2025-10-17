import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home';
import InicioSesion from './pages/inicioSesion.jsx'

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
        <Router>
            <Routes>
                {/* Ruta principal (página de inicio) */}
                <Route path="/" element={<Home />} />

                {/* Ruta de inicio de sesión */}
                <Route path="/inicio-sesion" element={<InicioSesion />} />

                {/* Redirige cualquier otra ruta a la página principal */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    )
}

export default App