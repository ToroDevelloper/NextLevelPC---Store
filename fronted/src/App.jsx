import { useEffect } from 'react'

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
}

export default App