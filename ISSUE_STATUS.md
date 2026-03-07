# Estado de Issues – NextLevelPC Store

Análisis del estado actual de los issues de GitHub según el código implementado.

---

## ✅ Issues COMPLETADOS (se pueden cerrar)

### #5 – Endpoints Funcionales - Documentación
Todos los endpoints están implementados y funcionando:
- `/api/servicios` (CRUD completo)
- `/api/categorias` (CRUD completo)
- `/api/productos` (CRUD + filtros + imágenes + destacados)
- `/api/usuarios` (CRUD + autenticación)
- `/api/roles`, `/api/ordenes`, `/api/orden-items`, `/api/citas-servicios`, `/api/pagos`

### #6 – Catálogo de Productos con Galería de Imágenes
- [x] Diseñar componente de tarjeta de producto → `ProductCard` en `productos.jsx`
- [x] Implementar galería de imágenes por producto → `ImagenProducto` model + galería en `ProductDetail`
- [x] Mostrar especificaciones técnicas → tabla de specs en `ProductDetail`
- [x] Implementar zoom en imágenes → lightbox modal en `productos.jsx`
- [x] Optimizar carga de imágenes → manejo de errores con imagen de respaldo

### #12 – Reporte de stock negativo
- [x] Encontrar la fuente del error
- [x] Establecer una validación que impida que el stock sea menor a 0 → `ProductosDto.js`
- [x] Hacer la respectiva prueba unitaria → `backend/__tests__/ProductosDto.test.js` (5 tests para stock)

### #13 – Reporte de precio negativo
- [x] Identificar donde se está generando el error
- [x] Implementar una validación en el backend → `ProductosDto.js`
- [x] Hacer las respectivas verificaciones → `backend/__tests__/ProductosDto.test.js` (5 tests para precio)

---

## 🔄 Issues con NUEVAS tareas completadas (actualizar checklist)

### #1 – Solicitud de Plan de Mantenimiento
**Nuevos ítems completados:**
- [x] Crear formulario de solicitud de mantenimiento → `AgendarServicioModal.jsx`
- [x] Formulario incluye validación de campos obligatorios → atributo `required` en todos los campos
- [x] Sistema registra la solicitud con fecha y tipo de servicio → `CitaServicio.create()` guarda `fecha_cita` y `servicio_id`

**Aún pendiente:**
- [ ] Se genera confirmación automática al usuario (email de confirmación no implementado)

### #3 – Carrito de Compras
**Nuevos ítems completados:**
- [x] Calcular totales automáticamente → `reduce()` en `Checkout.jsx`
- [x] Persistir carrito entre sesiones → `localStorage` en `CartContext.jsx`
- [x] Implementar actualización de cantidades → `updateQuantity()` en `CartContext.jsx`
- [x] Mostrar resumen de compra → sección "Resumen del Pedido" en `Checkout.jsx`
- [x] Productos persisten en el carrito al navegar → `localStorage`
- [x] Usuario puede modificar cantidades y eliminar items → `updateQuantity` + `removeFromCart`

**Aún pendiente:**
- [ ] Carrito muestra total correcto **con impuestos** (el total se calcula pero no incluye IVA)

### #4 – Configuración Base de Datos
**Nuevos ítems completados:**
- [x] Crear script de creación de tablas → `Documentación/nextlevel.sql`
- [x] Implementar relaciones foreign key → definidas en el SQL
- [x] Configurar índices para optimización → índices definidos en el SQL
- [x] Crear datos de prueba (seed data) → `INSERT INTO` en el SQL
- [x] Documentar estructura de BD → `Documentación/nextlevel.sql` + `Documentación/nextlevelpc.md`

**Aún pendiente:**
- [ ] Configurar backups automáticos
- [ ] Implementar migraciones de base de datos

---

## ⏳ Issues ABIERTOS con trabajo pendiente

### #2 – Categorías y Filtros de Productos
**Completado:**
- [x] Crear sistema de categorías de productos
- [x] Productos organizados en categorías claras
- [x] Filtro por categoría funcional (`categoria_id` en `obtenerProductosFiltrados`)

**Pendiente:**
- [ ] Implementar filtros por **marca** y **precio** (solo categoría está implementada)
- [ ] Desarrollar filtro de compatibilidad técnica
- [ ] Búsqueda en tiempo real (actualmente es por URL params)

### #7 – Sistema de Reseñas y Calificaciones
- Ninguna tarea implementada. Requiere nuevo modelo, controller, service y UI.

---

## 🆕 Nuevos Issues recomendados

| Título | Descripción |
|--------|-------------|
| **Panel de Administración** | CRUD de productos, usuarios y órdenes desde una interfaz web |
| **Notificaciones por Email** | Enviar confirmación automática al usuario al pagar o agendar servicio |
| **Cálculo de IVA en el Carrito** | Mostrar el desglose de impuestos antes de pagar |
| **Filtros avanzados: precio y marca** | Completar los filtros del issue #2 |
| **Pruebas de Frontend** | Tests con Vitest y React Testing Library para componentes principales |
| **Sistema de Migraciones DB** | Implementar Knex.js o similar para migraciones versionadas |

---

## 🧪 Pruebas unitarias añadidas en este PR

Archivo: `backend/__tests__/ProductosDto.test.js`

```
✓ CreateProductoDto → stock negativo genera error
✓ CreateProductoDto → stock 0 es válido
✓ CreateProductoDto → stock positivo es válido
✓ CreateProductoDto → sin stock usa valor por defecto 0
✓ CreateProductoDto → precio negativo genera error
✓ CreateProductoDto → precio 0 es válido
✓ CreateProductoDto → precio positivo es válido
✓ CreateProductoDto → precio undefined genera error requerido
✓ CreateProductoDto → nombre vacío genera error
✓ CreateProductoDto → nombre válido no genera error
✓ CreateProductoDto → datos correctos no generan errores
✓ CreateProductoDto → toModel() convierte correctamente
✓ UpdateProductoDto → stock negativo en actualización genera error
✓ UpdateProductoDto → stock 0 en actualización es válido
✓ UpdateProductoDto → sin campo stock no genera error
✓ UpdateProductoDto → precio negativo en actualización genera error
✓ UpdateProductoDto → precio positivo en actualización es válido
✓ UpdateProductoDto → sin campo precio no genera error
✓ UpdateProductoDto → toPatchObject solo incluye campos enviados
✓ UpdateProductoDto → toPatchObject retorna vacío si no hay campos
```

Total: **20 tests pasando** ✅
