# NextLevelPC – Plataforma de Tienda en Línea

NextLevelPC es una aplicación **full‑stack** para la gestión y venta de productos y servicios tecnológicos. El proyecto está organizado en dos módulos principales:

- **Backend** (`backend/`): API REST construida con **Node.js + Express**, base de datos **MySQL** y vistas de administración con **EJS**.
- **Frontend** (`fronted/`): aplicación **React** creada con **Vite**, que consume la API del backend para la tienda pública (catálogo, detalle de productos, carrito, etc.).

---

## 1. Características principales

### Backend

- Gestión de:
  - Usuarios, roles y autenticación (JWT).
  - Productos, categorías, servicios e imágenes asociadas.
  - Órdenes de compra e ítems de orden.
  - Citas de servicios.
- Integración con **MySQL** mediante `mysql2`.
- Vistas de administración con **EJS** y `express-ejs-layouts`.
- Middlewares de autenticación/autorización (roles, protección de rutas).
- Manejo de archivos (subida de imágenes) con **multer**.

### Frontend

- SPA en **React** con **Vite**.
- Navegación cliente con **react-router-dom**.
- Manejo de sesión y carrito de compras en el cliente.
- Páginas principales:
  - Home con productos destacados.
  - Listado y detalle de productos.
  - Módulo de servicios y agendamiento.
  - Registro y perfil de usuario.

---

## 2. Requisitos previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- **Node.js** v18 o superior.
- **npm** (o yarn; en los ejemplos se usa npm).
- **MySQL** en ejecución y acceso a una base de datos para NextLevelPC.

Además, en la carpeta `Documentación/` dispones de:

- `nextlevel.sql`: script SQL con el esquema y datos base.
- `Documentacion.txt` y diagramas de la BD para referencia.

---

## 3. Puesta en marcha

### 3.1 Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd NextLevelPC---Store
```

### 3.2 Backend (API + administración)

1. Entrar a la carpeta `backend/` e instalar dependencias:

   ```bash
   cd backend
   npm install
   ```

2. Crear un archivo `.env` en `backend/` con los datos de conexión a MySQL y configuración básica. Ejemplo:

   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=tu_usuario
   DB_PASSWORD=tu_password
   DB_NAME=nextlevelpc

   JWT_SECRET=un_secreto_seguro
   PORT=8080
   ```

3. Importar la base de datos desde `Documentación/nextlevel.sql` en tu servidor MySQL.

4. Iniciar el servidor backend en modo desarrollo:

   ```bash
   npm run dev
   ```

   Por defecto, la API quedará disponible en algo como `http://localhost:8080`.

### 3.3 Frontend (tienda React)

1. En otra terminal, desde la raíz del proyecto, entra en `fronted/` e instala dependencias:

   ```bash
   cd fronted
   npm install
   ```

2. Inicia el servidor de desarrollo de Vite:

   ```bash
   npm run dev
   ```

3. Abre el navegador en la URL que te indique Vite (normalmente `http://localhost:5173`).

> **Importante:** El frontend asume que el backend está disponible en `http://localhost:8080`. Si cambias el puerto o la URL, revisa las constantes `API_BASE` en los archivos de páginas (por ejemplo `src/pages/Home.jsx`, `src/pages/productos.jsx`).

---

## 4. Scripts disponibles

### Backend (`backend/package.json`)

- `npm run dev`
  Inicia el servidor Express con **nodemon** usando `index.js`.

### Frontend (`fronted/package.json`)

- `npm run dev`
  Levanta el servidor de desarrollo de Vite.
- `npm run build`
  Genera el build de producción del frontend.
- `npm run preview`
  Sirve el build de producción localmente para pruebas.
- `npm run lint`
  Ejecuta las reglas de ESLint configuradas para el proyecto React.

---

## 5. Docker (historial)

Este repositorio tenía configuraciones de Docker que fueron eliminadas a petición del propietario.

Si en algún momento necesitas volver a usar Docker, puedes restaurar los archivos desde el historial de Git:

- `docker-compose.yml`
- `backend/Dockerfile`

Ejemplo de consulta sin modificar `main`:

```bash
git log --oneline
# localizar el commit que tenga los archivos

git show <HASH>:docker-compose.yml
```

---

## 6. Estructura del proyecto

```text
NextLevelPC---Store/
├─ backend/           # API REST y vistas de administración (Express + EJS)
│  ├─ config/         # Configuración de base de datos
│  ├─ controllers/    # Controladores de la lógica de negocio
│  ├─ dto/            # Objetos de transferencia de datos (DTOs)
│  ├─ middlewares/    # Autenticación, autorización y otros middlewares
│  ├─ models/         # Modelos de acceso a datos (MySQL)
│  ├─ routes/         # Rutas de la API
│  ├─ routesViews/    # Rutas para vistas EJS de administración
│  ├─ services/       # Servicios que encapsulan la lógica de negocio
│  ├─ views/          # Vistas EJS (panel de administración)
│  └─ uploads/        # Archivos subidos (por ejemplo imágenes de productos)
│
├─ fronted/           # Aplicación React (Vite)
│  ├─ public/         # Recursos estáticos
│  └─ src/
│     ├─ components/  # Componentes reutilizables (Navbar, Layout, etc.)
│     ├─ pages/       # Páginas (Home, Productos, Servicios, Perfil, etc.)
│     ├─ styles/      # Hojas de estilo CSS
│     └─ utils/       # Utilidades (contextos, helpers, etc.)
│
└─ Documentación/     # SQL, documentación funcional y diagramas
```

---

## 7. Notas finales

- Este README resume cómo levantar el entorno local y la estructura general del proyecto.
- Para despliegues en producción, deberás adaptar:
  - Variables de entorno (credenciales de BD, secretos JWT, URLs públicas).
  - Configuración de servidor (reverse proxy, HTTPS, balanceo de carga, etc.).
- Cuando se realicen cambios importantes en el modelo de datos o en los flujos de negocio, se recomienda actualizar también la carpeta `Documentación/` para mantener la documentación alineada con el código.

