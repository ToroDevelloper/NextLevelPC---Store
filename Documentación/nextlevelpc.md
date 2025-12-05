# Script Completo de Base de Datos - NextLevelPC Store

Este documento describe el script SQL completo para la base de datos del sistema NextLevelPC Store, incluyendo todas las tablas, relaciones, índices y datos de ejemplo.

---

## Información General

- **Archivo**: `script_db_completo.sql`
- **Base de Datos**: `nextlevel`
- **Charset**: `utf8mb4`
- **Collation**: `utf8mb4_general_ci`
- **Motor**: InnoDB
- **Fecha de Creación**: 21 de Noviembre 2025

---

## Estructura de la Base de Datos

### Tablas Incluidas (13 tablas)

1. **roles** - Roles de usuario (admin, cliente, empleado)
2. **estado** - Estados para productos (activo/inactivo)
3. **usuarios** - Usuarios del sistema
4. **refresh_tokens** - Tokens de autenticación JWT
5. **categorias** - Categorías de productos
6. **productos** - Catálogo de productos
7. **imagenes_productos** - Imágenes de productos
8. **servicios** - Servicios técnicos ofrecidos
9. **servicio_imagenes** - Galería de imágenes para servicios
10. **ordenes** - Órdenes de compra
11. **orden_items** - Items de cada orden
12. **citas_servicios** - Citas agendadas para servicios

---

## Usuarios de Ejemplo

Todos los usuarios de ejemplo tienen la contraseña: **`password123`**

| ID | Nombre | Email | Rol |
|----|--------|-------|-----|
| 1 | Admin Sistema | admin@nextlevel.com | Admin |
| 2 | Juan Pérez | juan.perez@email.com | Cliente |
| 3 | María González | maria.gonzalez@email.com | Cliente |
| 6 | Luis Hernández | luis.hernandez@email.com | Empleado |

*Total: 10 usuarios de ejemplo*

---

## Productos (40 productos en 10 categorías)

### Categorías de Productos

1. **Procesadores** (4 productos)
   - AMD Ryzen 9 7950X - $2,500,000
   - Intel Core i9-13900K - $2,450,000
   - AMD Ryzen 7 7700X - $1,500,000
   - Intel Core i5-13600K - $1,350,000

2. **Tarjetas Gráficas** (4 productos)
   - NVIDIA RTX 4090 - $6,800,000
   - AMD Radeon RX 7900 XTX - $4,200,000
   - NVIDIA RTX 4070 Ti - $3,400,000
   - AMD Radeon RX 7800 XT - $2,300,000


Cada producto incluye:
- Nombre descriptivo
- Descripción corta (marketing)
- Descripción detallada (información completa)
- Especificaciones técnicas (JSON-compatible)
- Precio actual
- Stock disponible
- Estado (activo/inactivo)

---

## Servicios (12 servicios: 6 básicos + 6 avanzados)

### Servicios Básicos

| Servicio | Precio | Descripción |
|----------|--------|-------------|
| Instalación de Windows/Linux | $80,000 | Instalación limpia de SO con drivers y configuración |
| Limpieza y Mantenimiento Básico | $60,000 | Limpieza física y optimización de software |
| Instalación de Office y Programas | $50,000 | Suite Office y programas esenciales |
| Diagnóstico de Problemas | $40,000 | Diagnóstico completo con reporte detallado |
| Configuración de Router WiFi | $50,000 | Configuración y optimización de red WiFi |
| Respaldo de Datos (Backup) | $90,000 | Backup completo con verificación de integridad |

### Servicios Avanzados

| Servicio | Precio | Descripción |
|----------|--------|-------------|
| Ensamblaje de PC Gaming/Workstation | $150,000 | Armado profesional con garantía 6 meses |
| Reparación Avanzada de Laptops | $250,000 | Reballing, cambio de pantalla, upgrades |
| Recuperación de Datos Profesional | $350,000 | Recuperación con software forense |
| Instalación de Red Empresarial | $1,500,000 | Red completa con cableado y switches |
| Configuración de Servidor | $800,000 | Windows Server/Linux con AD, DNS, DHCP |
| Plan de Soporte Técnico Empresarial | $500,000 | Soporte 24/7 con visitas incluidas |

### Galería de Imágenes

Cada servicio incluye:
- Imagen principal
- Galería de 3-4 imágenes adicionales
- Textos alternativos para SEO
- Orden de visualización
- Soft delete (activo/inactivo)

---

## Sistema de Pagos y Órdenes

### Características de Órdenes

- Número único de orden (formato: `ORD-timestamp`)
- Relación con usuario/cliente
- Tipo: producto, servicio o mixto
- Estado de orden: pendiente, procesando, completada, cancelada
- Estado de pago: pendiente, pagado, reembolsado
- Integración con Stripe (payment_intent_id)
- Fecha de pago registrada

### Relación con Citas de Servicio

Las órdenes están vinculadas bidireccionalmente con citas:
- Una orden puede tener una cita asociada
- Una cita puede tener una orden de pago asociada
- Actualización automática vía webhooks de Stripe

---

## Citas de Servicios

### Campos de Cita

- Información del cliente (nombre, email, teléfono, dirección)
- Servicio solicitado
- Fecha y hora de la cita
- Descripción del problema
- Estado de la cita: pendiente, confirmada, cancelada, completada
- Estado de pago: pendiente, pagado, cancelado
- Relación con orden de pago

### Flujo de Pago para Servicios

1. Usuario agenda cita desde detalle del servicio
2. Modal muestra opciones: "Pagar Ahora" / "Pagar Más Tarde"
3. Al pagar: crea orden → PaymentIntent → pago exitoso
4. Webhook actualiza estado_pago de cita y orden
5. Vincula automáticamente orden_id ↔ cita_servicio_id

---

## Foreign Keys y Relaciones

### Relaciones Principales

```
usuarios (1) ──→ (N) ordenes
usuarios (1) ──→ (N) refresh_tokens
categorias (1) ──→ (N) productos
productos (1) ──→ (N) imagenes_productos
productos (1) ──→ (N) orden_items
servicios (1) ──→ (N) servicio_imagenes
servicios (1) ──→ (N) citas_servicios
ordenes (1) ──→ (N) orden_items
ordenes (1) ↔ (1) citas_servicios [bidireccional]
roles (1) ──→ (N) usuarios
estado (1) ──→ (N) productos
```

### Integridad Referencial

- **ON DELETE CASCADE**: Elimina registros relacionados automáticamente
- **ON DELETE SET NULL**: Mantiene registro pero elimina la relación
- **ON UPDATE CASCADE**: Actualiza cambios en cascada

---

## Índices para Optimización

### Índices Creados

- `idx_user_id` en refresh_tokens
- `idx_stripe_payment_intent` en ordenes
- `idx_cita_estado_pago` en citas_servicios
- `idx_cita_orden_id` en citas_servicios
- `idx_orden_cita_id` en ordenes (Nuevo)
- `idx_servicio_activo` en servicio_imagenes
- `idx_servicio_orden` en servicio_imagenes
- `idx_principal` en servicio_imagenes

---

## Cómo Usar el Script

### Opción 1: Importar en HeidiSQL/phpMyAdmin

```bash
1. Abrir HeidiSQL o phpMyAdmin
2. Crear nueva conexión a MySQL/MariaDB
3. Archivo → Ejecutar archivo SQL
4. Seleccionar: script_db_completo.sql
5. Ejecutar
```

### Opción 2: Línea de comandos

```bash
# Importar script completo
mysql -u root -p < script_db_completo.sql

# O si ya estás en MySQL
mysql> source d:/Angel/Documentos/NextLevelPC---Store/Documentación/script_db_completo.sql
```

### Opción 3: Desde el código backend

```javascript
// Node.js con mysql2
const fs = require('fs');
const mysql = require('mysql2/promise');

const sql = fs.readFileSync('./Documentación/script_db_completo.sql', 'utf8');
const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'tu_password',
  multipleStatements: true
});

await connection.query(sql);
console.log('Base de datos creada exitosamente');
```

---

## Notas Importantes

> [!WARNING]
> Este script **ELIMINA** la base de datos `nextlevel` si existe y la crea nuevamente.
> Todos los datos existentes se perderán. Haz un backup antes de ejecutar.

> [!IMPORTANT]
> Las contraseñas de los usuarios de ejemplo están hasheadas con bcrypt.
> La contraseña para todos es: `password123`

> [!NOTE]
> Los datos de ejemplo (productos, servicios, órdenes) están diseñados para pruebas y desarrollo.
> En producción, deberás reemplazarlos con datos reales.

---

## Changelog

### 2025-11-21 - Versión Completa
- Creación de script completo con todas las tablas
- 40 productos en 10 categorías con especificaciones completas
- 12 servicios (6 básicos + 6 avanzados)
- 10 usuarios de ejemplo con roles
- 6 órdenes de ejemplo con items
- 4 citas de servicio de ejemplo
- Integración completa con Stripe
- Relación bidireccional ordenes ↔ citas
- Galerías de imágenes para servicios
- Índices de optimización
- Foreign keys con integridad referencial

### 2025-11-22 - Actualización de Schema y Usuarios
- **Tabla Ordenes**: Se agregó el tipo 'mixto' al ENUM de `tipo`.
- **Tabla Ordenes**: Se añadió la columna `cita_servicio_id` y su índice correspondiente `idx_orden_cita_id`.
- **Usuarios**: Se recrearon los usuarios de ejemplo con contraseñas encriptadas (bcrypt).
- **Integridad**: Se reforzaron las relaciones entre órdenes y citas de servicio.
- **Precios**: Se actualizaron todos los precios a Pesos Colombianos (COP).
- **Imágenes**: Se reemplazaron las URLs de imágenes por placeholders confiables (`placehold.co`).

---

## Archivos Relacionados

- [`nextlevel.sql`](./nextlevel.sql) - Estructura de tablas (solo DDL)
- [`script_db_completo.sql`](./script_db_completo.sql) - **Script completo con datos** 
- [`Documentacion.txt`](./Documentacion.txt) - Historial de cambios del proyecto

---

## Soporte

Si encuentras algún problema con el script o necesitas ayuda:

1. Verifica que MySQL/MariaDB esté corriendo
2. Confirma que tienes permisos de creación de base de datos
3. Revisa el log de errores de MySQL
4. Consulta la documentación en `Documentacion.txt`

---

**Última actualización**: 22 de Noviembre 2025
