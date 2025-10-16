import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [mensaje, setMensaje] = useState('')
  const [categorias, setCategorias] = useState([])

  // Probar conexión al backend
  useEffect(() => {
    fetch('http://localhost:8080/api/health')
      .then(res => res.json())
      .then(data => {
        console.log('✅ Backend conectado:', data)
        setMensaje(data.message)
      })
      .catch(err => {
        console.error('❌ Error conectando al backend:', err)
        setMensaje('Error de conexión')
      })
  }, [])

  // Obtener categorías
  const obtenerCategorias = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/categorias')
      const data = await response.json()
      setCategorias(data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div>
      <h1>Frontend NextLevelPC</h1>
      <p>Estado: {mensaje}</p>
      
      <button onClick={obtenerCategorias}>
        Obtener Categorías
      </button>

      <div>
        <h3>Categorías:</h3>
        <ul>
          {categorias.map(cat => (
            <li key={cat.id}>{cat.nombre}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default App