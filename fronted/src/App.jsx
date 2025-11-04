// App.jsx
import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import InicioSesion from './pages/inicioSesion'
import Registro from './pages/Registro'
import Productos from './pages/productos'
import Servicios from './pages/Servicios'
import "./styles/App.css";
import "./styles/Global.css";


function App() {
    useEffect(() => {
        console.log('Intentando conectar con backend...')
        fetch('http://localhost:8080/api/health')
            .then(res => res.json())
            .then(data => {
                console.log('BACKEND CONECTADO - Mensaje:', data.message)
                console.log('BACKEND CONECTADO - Base de datos:', data.database)
            })
            .catch(err => {
                console.error('ERROR DE CONEXIÓN:', err.message)
            })
    }, [])

    return (
        <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/" element={<InicioSesion />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/servicios" element={<Servicios />} />
            <Route path="/productos/buscar" element={<Productos />} />
            <Route path="/productos/:id" element={<Productos />} />
        </Routes>
    )
}

export default App