-- --------------------------------------------------------
-- Host:                         34.27.58.232
-- Server version:               8.4.7-google - (Google)
-- Server OS:                    Linux
-- HeidiSQL Version:             12.10.0.7000
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for nextlevel
CREATE DATABASE IF NOT EXISTS `nextlevel` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `nextlevel`;

-- Dumping structure for table nextlevel.categorias
CREATE TABLE IF NOT EXISTS `categorias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `tipo` enum('producto','servicio') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table nextlevel.categorias: ~10 rows (approximately)
INSERT INTO `categorias` (`id`, `nombre`, `tipo`) VALUES
	(1, 'Procesadores', 'producto'),
	(2, 'Tarjetas Gráficas', 'producto'),
	(3, 'Memorias RAM', 'producto'),
	(4, 'Almacenamiento', 'producto'),
	(5, 'Placas Madre', 'producto'),
	(6, 'Fuentes de Poder', 'producto'),
	(7, 'Gabinetes', 'producto'),
	(8, 'Refrigeración', 'producto'),
	(9, 'Periféricos', 'producto'),
	(10, 'Monitores', 'producto'),
	(11, 'Ratones', 'producto');

-- Dumping structure for table nextlevel.citas_servicios
CREATE TABLE IF NOT EXISTS `citas_servicios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `servicio_id` int NOT NULL,
  `nombre_cliente` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email_cliente` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `telefono_cliente` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `direccion_cliente` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `fecha_cita` datetime NOT NULL,
  `descripcion_problema` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `estado` enum('pendiente','confirmada','cancelada','completada') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'pendiente',
  `estado_pago` enum('pendiente','pagado','cancelado') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'pendiente',
  `orden_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `servicio_id` (`servicio_id`),
  KEY `idx_cita_estado_pago` (`estado_pago`),
  KEY `idx_cita_orden_id` (`orden_id`),
  CONSTRAINT `citas_servicios_ibfk_1` FOREIGN KEY (`servicio_id`) REFERENCES `servicios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cita_orden` FOREIGN KEY (`orden_id`) REFERENCES `ordenes` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table nextlevel.citas_servicios: ~10 rows (approximately)
INSERT INTO `citas_servicios` (`id`, `servicio_id`, `nombre_cliente`, `email_cliente`, `telefono_cliente`, `direccion_cliente`, `fecha_cita`, `descripcion_problema`, `estado`, `estado_pago`, `orden_id`, `created_at`) VALUES
	(7, 4, 'nia', 'nia@stripe.com', '13135735', 'calle-121', '2025-11-30 00:00:00', 'el pc se enciende y se apaga', 'confirmada', 'pagado', 12, '2025-11-28 14:56:35'),
	(8, 3, 'nia', 'nia@stripe.com', '13135735', 'calle-121', '2025-12-01 00:00:00', 'Ensambla mi pc', 'confirmada', 'pagado', 13, '2025-11-28 14:57:48'),
	(9, 2, 'pepe', 'juan.perez@email.com', '4498489498', 'Shop 14, Bridge Market, Sector 17-D', '2025-12-01 00:00:00', 'dfghj', 'confirmada', 'pagado', 15, '2025-11-29 02:32:41'),
	(10, 2, 'Cliente Ejemplo', 'cliente@example.com', '1234567890', 'Calle 123 #45-67', '2024-12-25 10:00:00', 'El PC no enciende', 'completada', 'pendiente', NULL, '2025-12-01 16:15:48'),
	(11, 5, 'pepe', 'juan.perez@email.com', '4498489498', 'Shop 14, Bridge Market, Sector 17-D', '2025-12-18 00:00:00', 'er', 'confirmada', 'pagado', 24, '2025-12-16 01:24:02'),
	(12, 5, 'pepe', 'juan.perez@email.com', '4498489498', 'Shop 14, Bridge Market, Sector 17-D', '2025-12-18 00:00:00', 'er', 'confirmada', 'pagado', 24, '2025-12-16 01:24:02'),
	(13, 5, 'pepe', 'juan.perez@email.com', 'ssss', 'Shop 14, Bridge Market, Sector 17-D', '2025-12-26 00:00:00', 'ww', 'confirmada', 'pagado', 25, '2025-12-17 20:08:37'),
	(14, 5, 'pepe', 'juan.perez@email.com', 'ssss', 'Shop 14, Bridge Market, Sector 17-D', '2025-12-26 00:00:00', 'ww', 'confirmada', 'pagado', 25, '2025-12-17 20:08:38'),
	(15, 5, 'bhhbv', 'juan.perez@email.com', '4498489498', 'Shop 14, Bridge Market, Sector 17-D', '2025-12-18 00:00:00', 'sd', 'confirmada', 'pagado', 28, '2025-12-17 20:17:25'),
	(16, 5, 'bhhbv', 'juan.perez@email.com', '4498489498', 'Shop 14, Bridge Market, Sector 17-D', '2025-12-18 00:00:00', 'sd', 'confirmada', 'pagado', 28, '2025-12-17 20:17:26');

-- Dumping structure for table nextlevel.estado
CREATE TABLE IF NOT EXISTS `estado` (
  `id` tinyint NOT NULL DEFAULT '1',
  `nombre` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table nextlevel.estado: ~2 rows (approximately)
INSERT INTO `estado` (`id`, `nombre`) VALUES
	(1, 'activo'),
	(2, 'inactivo');

-- Dumping structure for table nextlevel.imagenes_productos
CREATE TABLE IF NOT EXISTS `imagenes_productos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `producto_id` int NOT NULL,
  `url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `es_principal` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `producto_id` (`producto_id`),
  CONSTRAINT `imagenes_productos_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table nextlevel.imagenes_productos: ~22 rows (approximately)
INSERT INTO `imagenes_productos` (`id`, `producto_id`, `url`, `es_principal`) VALUES
	(1, 1, 'https://tpucdn.com/review/intel-core-i9-14900k/images/title.jpg', 1),
	(2, 1, 'https://tpucdn.com/review/intel-core-i9-14900k/images/logo.jpg', 0),
	(3, 2, 'https://tigercomputadores.com/wp-content/uploads/x1-1004.jpg', 1),
	(4, 2, 'https://tigercomputadores.com/wp-content/uploads/x1-1004.jpg', 0),
	(5, 3, 'https://enjoyvideogames.com.co/wp-content/uploads/2025/10/20-374-431-10-1000x1000.webp.webp', 1),
	(6, 3, 'https://enjoyvideogames.com.co/wp-content/uploads/2025/10/20-374-431-09-768x768.webp.webp', 0),
	(7, 4, 'https://enjoyvideogames.com.co/wp-content/uploads/2025/11/20-250-247-02-1000x1000.webp.webp', 1),
	(8, 4, 'https://enjoyvideogames.com.co/wp-content/uploads/2025/11/20-250-247-02-1000x1000.webp.webp', 0),
	(9, 5, 'https://http2.mlstatic.com/D_NQ_NP_2X_840119-CBT76812228244_062024-F.webp', 1),
	(10, 5, 'https://http2.mlstatic.com/D_NQ_NP_2X_840119-CBT76812228244_062024-F.webp', 0),
	(11, 6, 'https://seasonic.com/wp-content/uploads/2024/07/Vertex-PX-GX-850-1000-1200-connector-plate-leveled.webp', 1),
	(12, 6, 'https://seasonic.com/wp-content/uploads/2024/04/Vertex-PX-GX-750-vertical.webp', 0),
	(13, 7, 'https://nzxt.com/cdn/shop/files/Case_H9_Flow_WH_Carousel_Hero_EN_6c6f2fc0-18de-4729-94c9-608b22094825.png?v=1765345278&width=1000', 1),
	(14, 7, 'https://nzxt.com/cdn/shop/files/Case_H9_Flow_BK_Carousel_Hero_EN_1a68cd6b-db7a-462f-ae20-d70f5ddcf6d0.png?v=1765346724&width=1000', 0),
	(15, 8, 'https://assets.corsair.com/image/upload/c_pad,q_85,h_1100,w_1100,f_auto/products/Custom-Cooling/CW-9060075-WW/-base-elite-lcd-xt-cooler-config-Gallery-H150i-ELITE-LCD-XT-01.webp', 1),
	(16, 8, 'https://assets.corsair.com/image/upload/f_auto,q_auto/v1/akamai/pdp/cooling/xt-series/elite-lcd/assets/images/Panel11_image.webp', 0),
	(17, 9, 'https://media.falabella.com/falabellaCO/119617119_01/w=1200,h=1200,fit=pad', 1),
	(18, 9, 'https://media.falabella.com/falabellaCO/119617119_01/w=1200,h=1200,fit=pad', 0),
	(19, 10, 'https://assets3.razerzone.com/WK6eJTr2orY0AkNKkZmdJtYKM_g=/1500x1000/https%3A%2F%2Fmedias-p1.phoenix.razer.com%2Fsys-master-phoenix-images-container%2Fhe5%2Fhe0%2F9910830956574%2F250521-deathadder-v3-pro-black-1500x1000-1.jpg', 1),
	(20, 10, 'https://assets3.razerzone.com/ClIYX60Ofa3vPA5pWdbvjAbi2CI=/1500x1000/https%3A%2F%2Fmedias-p1.phoenix.razer.com%2Fsys-master-phoenix-images-container%2Fh68%2Fh92%2F9910831153182%2F250521-deathadder-v3-pro-black-1500x1000-2.jpg', 0),
	(21, 11, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuqtJRy_EmoPQF9HQyumiCfCllO_F0zHt8SA&s', 0),
	(22, 11, 'https://m.media-amazon.com/images/I/71qXEzhuWDL.jpg', 1);

-- Dumping structure for table nextlevel.ordenes
CREATE TABLE IF NOT EXISTS `ordenes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cliente_id` int DEFAULT NULL,
  `tipo` enum('producto','servicio','mixto') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `cita_servicio_id` int DEFAULT NULL COMMENT 'ID de la cita de servicio asociada',
  `numero_orden` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `total` decimal(12,2) DEFAULT '0.00',
  `estado_orden` enum('pendiente','procesando','completada','cancelada') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'pendiente',
  `estado_pago` enum('pendiente','pagado','reembolsado','cancelada') COLLATE utf8mb4_general_ci DEFAULT 'pendiente',
  `stripe_payment_intent_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fecha_pago` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `numero_orden` (`numero_orden`),
  KEY `cliente_id` (`cliente_id`),
  KEY `idx_stripe_payment_intent` (`stripe_payment_intent_id`),
  KEY `idx_orden_cita_id` (`cita_servicio_id`),
  CONSTRAINT `fk_orden_cita` FOREIGN KEY (`cita_servicio_id`) REFERENCES `citas_servicios` (`id`) ON DELETE SET NULL,
  CONSTRAINT `ordenes_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table nextlevel.ordenes: ~45 rows (approximately)
INSERT INTO `ordenes` (`id`, `cliente_id`, `tipo`, `cita_servicio_id`, `numero_orden`, `total`, `estado_orden`, `estado_pago`, `stripe_payment_intent_id`, `fecha_pago`, `created_at`) VALUES
	(1, 2, 'producto', NULL, 'ORD-1732234567890', 5000000.00, 'completada', 'pagado', NULL, NULL, '2025-11-15 10:30:00'),
	(2, 3, 'producto', NULL, 'ORD-1732234567891', 2300000.00, 'completada', 'pagado', NULL, NULL, '2025-11-16 14:20:00'),
	(3, 2, 'servicio', NULL, 'ORD-1732234567892', 80000.00, 'completada', 'pagado', NULL, NULL, '2025-11-17 09:15:00'),
	(4, 3, 'producto', NULL, 'ORD-1732234567893', 11000000.00, 'procesando', 'pagado', NULL, NULL, '2025-11-18 16:45:00'),
	(5, 2, 'servicio', NULL, 'ORD-1732234567894', 1500000.00, 'pendiente', 'pagado', NULL, NULL, '2025-11-19 11:30:00'),
	(6, 3, 'producto', NULL, 'ORD-1732234567895', 3400000.00, 'completada', 'pagado', NULL, NULL, '2025-11-20 13:10:00'),
	(7, 7, 'producto', NULL, 'ORD-1763867136684', 2300000.00, 'completada', 'pagado', NULL, NULL, '2025-11-23 03:05:36'),
	(8, 2, 'servicio', NULL, 'ORD-1763931164444', 120000.00, 'completada', 'pagado', NULL, NULL, '2025-11-23 20:52:43'),
	(9, 2, 'servicio', NULL, 'ORD-1764172392029', 50000.00, 'completada', 'pagado', NULL, NULL, '2025-11-26 15:53:12'),
	(10, 9, 'producto', NULL, 'ORD-1764172792955', 10500000.00, 'completada', 'pagado', NULL, NULL, '2025-11-26 15:59:53'),
	(11, 7, 'producto', NULL, 'ORD-1764341676589', 1250000.00, 'completada', 'pagado', NULL, NULL, '2025-11-28 14:54:36'),
	(12, 7, 'servicio', 7, 'ORD-1764341774954', 60000.00, 'completada', 'pagado', NULL, NULL, '2025-11-28 14:56:14'),
	(13, 7, 'mixto', 8, 'ORD-1764341847472', 2220000.00, 'completada', 'pagado', NULL, NULL, '2025-11-28 14:57:27'),
	(14, 2, 'producto', NULL, 'ORD-1764383041030', 380000.00, 'completada', 'pagado', NULL, NULL, '2025-11-29 02:24:01'),
	(15, 2, 'servicio', 9, 'ORD-1764383551349', 35000.00, 'completada', 'pagado', NULL, NULL, '2025-11-29 02:32:31'),
	(16, 1, 'producto', NULL, 'ORD-1764605255554', 1500000.00, 'pendiente', 'pendiente', NULL, NULL, '2025-12-01 16:07:30'),
	(17, 2, 'producto', NULL, 'ORD-1764606395851', 380000.00, 'completada', 'pagado', NULL, NULL, '2025-12-01 16:26:30'),
	(18, 2, 'producto', NULL, 'ORD-1764635538136', 280000.00, 'completada', 'pagado', NULL, NULL, '2025-12-02 00:32:18'),
	(19, 2, 'servicio', NULL, 'ORD-1764635636878', 35000.00, 'pendiente', 'pendiente', NULL, NULL, '2025-12-02 00:33:56'),
	(20, 8, 'producto', NULL, 'ORD-1765129409167', 750000.00, 'pendiente', 'pendiente', NULL, NULL, '2025-12-07 17:43:29'),
	(21, 8, 'producto', NULL, 'ORD-1765129424592', 750000.00, 'pendiente', 'pendiente', NULL, NULL, '2025-12-07 17:43:44'),
	(22, 2, 'servicio', NULL, 'ORD-1765848058346', 50000.00, 'pendiente', 'pendiente', NULL, NULL, '2025-12-16 01:20:54'),
	(23, 2, 'servicio', NULL, 'ORD-1765848076784', 50000.00, 'pendiente', 'pendiente', NULL, NULL, '2025-12-16 01:21:12'),
	(24, 2, 'servicio', 12, 'ORD-1765848200350', 50000.00, 'completada', 'pagado', NULL, NULL, '2025-12-16 01:23:20'),
	(25, 2, 'servicio', 14, 'ORD-1766002110326', 50000.00, 'completada', 'pagado', NULL, NULL, '2025-12-17 20:08:30'),
	(26, 2, 'servicio', NULL, 'ORD-1766002446922', 50000.00, 'pendiente', 'pendiente', NULL, NULL, '2025-12-17 20:13:59'),
	(27, 2, 'servicio', NULL, 'ORD-1766002540131', 50000.00, 'pendiente', 'pendiente', NULL, NULL, '2025-12-17 20:15:32'),
	(28, 2, 'servicio', 16, 'ORD-1766002636955', 50000.00, 'completada', 'pagado', NULL, NULL, '2025-12-17 20:17:09'),
	(29, 8, 'producto', NULL, 'ORD-1766004906268', 920000.00, 'pendiente', 'pendiente', NULL, NULL, '2025-12-17 20:55:15'),
	(30, 8, 'producto', NULL, 'ORD-1766004933749', 920000.00, 'pendiente', 'pendiente', NULL, NULL, '2025-12-17 20:55:42'),
	(31, 8, 'producto', NULL, 'ORD-1766004966646', 920000.00, 'pendiente', 'pendiente', NULL, NULL, '2025-12-17 20:56:15'),
	(32, 8, 'producto', NULL, 'ORD-1766005666808', 920000.00, 'pendiente', 'pendiente', NULL, NULL, '2025-12-17 21:07:55'),
	(33, 8, 'producto', NULL, 'ORD-1766007138065', 920000.00, 'pendiente', 'pendiente', NULL, NULL, '2025-12-17 21:32:27'),
	(34, 2, 'producto', NULL, 'ORD-1766012710938', 4800000.00, 'completada', 'pagado', NULL, NULL, '2025-12-17 23:05:03'),
	(35, 2, 'producto', NULL, 'ORD-1768439669564', 1670000.00, 'pendiente', 'pendiente', NULL, NULL, '2026-01-15 01:13:58'),
	(36, 2, 'producto', NULL, 'ORD-1768440879458', 1950000.00, 'completada', 'pagado', NULL, NULL, '2026-01-15 01:34:08'),
	(37, 13, 'producto', NULL, 'ORD-1771620658168', 1950000.00, 'pendiente', 'pendiente', NULL, NULL, '2026-02-20 20:50:58'),
	(38, 2, 'producto', NULL, 'ORD-1771623615037', 1350000.00, 'completada', 'pagado', NULL, NULL, '2026-02-20 21:40:13'),
	(39, 15, 'producto', NULL, 'ORD-1771625255284', 2850000.00, 'pendiente', 'pendiente', NULL, NULL, '2026-02-20 22:07:39'),
	(40, 16, 'producto', NULL, 'ORD-1771633905065', 1670000.00, 'pendiente', 'pendiente', NULL, NULL, '2026-02-21 00:31:46'),
	(41, 15, 'producto', NULL, 'ORD-1772237625173', 2850000.00, 'pendiente', 'pendiente', NULL, NULL, '2026-02-28 00:13:47'),
	(42, 15, 'producto', NULL, 'ORD-1772239828286', 2850000.00, 'pendiente', 'pendiente', NULL, NULL, '2026-02-28 00:50:30'),
	(43, 15, 'producto', NULL, 'ORD-1772239873341', 4250000.00, 'pendiente', 'pendiente', NULL, NULL, '2026-02-28 00:51:15'),
	(44, 8, 'producto', NULL, 'ORD-1772240205065', 750000.00, 'completada', 'pagado', NULL, NULL, '2026-02-28 00:56:50'),
	(45, 8, 'producto', NULL, 'ORD-1772240325406', 850000.00, 'completada', 'pagado', NULL, NULL, '2026-02-28 00:58:50');

-- Dumping structure for table nextlevel.orden_items
CREATE TABLE IF NOT EXISTS `orden_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `orden_id` int DEFAULT NULL,
  `producto_id` int DEFAULT NULL,
  `servicio_id` int DEFAULT NULL,
  `tipo` enum('producto','servicio') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `descripcion` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cantidad` int DEFAULT '1',
  `precio_unitario` decimal(12,2) DEFAULT NULL,
  `subtotal` decimal(12,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `orden_id` (`orden_id`),
  KEY `producto_id` (`producto_id`),
  KEY `idx_servicio_id` (`servicio_id`),
  CONSTRAINT `fk_orden_items_servicio` FOREIGN KEY (`servicio_id`) REFERENCES `servicios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `orden_items_ibfk_1` FOREIGN KEY (`orden_id`) REFERENCES `ordenes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `orden_items_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table nextlevel.orden_items: ~49 rows (approximately)
INSERT INTO `orden_items` (`id`, `orden_id`, `producto_id`, `servicio_id`, `tipo`, `descripcion`, `cantidad`, `precio_unitario`, `subtotal`) VALUES
	(1, 1, 1, NULL, 'producto', 'AMD Ryzen 9 7950X', 1, 2500000.00, 2500000.00),
	(2, 1, 1, NULL, 'producto', 'AMD Ryzen 9 7950X', 1, 2500000.00, 2500000.00),
	(3, 2, 8, NULL, 'producto', 'AMD Radeon RX 7800 XT', 1, 2300000.00, 2300000.00),
	(4, 3, NULL, NULL, 'servicio', 'Instalación de Windows/Linux', 1, 80000.00, 80000.00),
	(5, 4, 5, NULL, 'producto', 'NVIDIA RTX 4090', 1, 6800000.00, 6800000.00),
	(6, 4, 6, NULL, 'producto', 'AMD Radeon RX 7900 XTX', 1, 4200000.00, 4200000.00),
	(7, 5, NULL, NULL, 'servicio', 'Ensamblaje de PC Gaming/Workstation', 1, 1500000.00, 1500000.00),
	(8, 6, 38, NULL, 'producto', 'LG 27GP950-B', 1, 3400000.00, 3400000.00),
	(9, 7, 8, NULL, 'producto', 'AMD Radeon RX 7800 XT', 1, 2300000.00, 2300000.00),
	(10, 8, NULL, NULL, 'servicio', 'Optimización WiFi Premium', 1, 120000.00, 120000.00),
	(11, 9, NULL, NULL, 'servicio', 'Configuración de Router WiFi', 1, 50000.00, 50000.00),
	(12, 10, 8, NULL, 'producto', 'AMD Radeon RX 7800 XT', 1, 2300000.00, 2300000.00),
	(13, 10, 6, NULL, 'producto', 'AMD Radeon RX 7900 XTX', 1, 4200000.00, 4200000.00),
	(14, 10, 3, NULL, 'producto', 'AMD Ryzen 7 7700X', 1, 1500000.00, 1500000.00),
	(15, 10, 1, NULL, 'producto', 'AMD Ryzen 9 7950X', 1, 2500000.00, 2500000.00),
	(16, 11, 1, NULL, 'producto', 'Procesador AMD Ryzen 7 5800X', 1, 1250000.00, 1250000.00),
	(17, 12, NULL, 4, 'servicio', 'Diagnóstico y Reparación de Hardware', 1, 60000.00, 60000.00),
	(18, 13, 2, NULL, 'producto', 'Tarjeta Gráfica NVIDIA RTX 4060 Ti 8GB', 1, 2100000.00, 2100000.00),
	(19, 13, NULL, 3, 'servicio', 'Ensamble de PC Gamer / Workstation', 1, 120000.00, 120000.00),
	(20, 14, 16, NULL, 'producto', 'WD Black SN770 1TB', 1, 380000.00, 380000.00),
	(21, 15, NULL, 2, 'servicio', 'Upgrade de Hardware (RAM/SSD)', 1, 35000.00, 35000.00),
	(22, 17, 16, NULL, 'producto', 'WD Black SN770 1TB', 1, 380000.00, 380000.00),
	(23, 18, NULL, NULL, 'producto', 'Adata XPG Lancer 16GB', 1, 280000.00, 280000.00),
	(24, 19, NULL, 2, 'servicio', 'Upgrade de Hardware (RAM/SSD)', 1, 35000.00, 35000.00),
	(25, 20, 9, NULL, 'producto', 'Logitech G Pro X Superlight 2', 1, 750000.00, 750000.00),
	(26, 21, 9, NULL, 'producto', 'Logitech G Pro X Superlight 2', 1, 750000.00, 750000.00),
	(27, 22, NULL, 5, 'servicio', 'Mantenimiento Preventivo', 1, 50000.00, 50000.00),
	(28, 23, NULL, 5, 'servicio', 'Mantenimiento Preventivo', 1, 50000.00, 50000.00),
	(29, 24, NULL, 5, 'servicio', 'Mantenimiento Preventivo', 1, 50000.00, 50000.00),
	(30, 25, NULL, 5, 'servicio', 'Mantenimiento Preventivo', 1, 50000.00, 50000.00),
	(31, 26, NULL, 5, 'servicio', 'Mantenimiento Preventivo', 1, 50000.00, 50000.00),
	(32, 27, NULL, 5, 'servicio', 'Mantenimiento Preventivo', 1, 50000.00, 50000.00),
	(33, 28, NULL, 5, 'servicio', 'Mantenimiento Preventivo', 1, 50000.00, 50000.00),
	(34, 29, 4, NULL, 'producto', 'Samsung 990 PRO 2TB NVMe SSD', 1, 920000.00, 920000.00),
	(35, 30, 4, NULL, 'producto', 'Samsung 990 PRO 2TB NVMe SSD', 1, 920000.00, 920000.00),
	(36, 31, 4, NULL, 'producto', 'Samsung 990 PRO 2TB NVMe SSD', 1, 920000.00, 920000.00),
	(37, 32, 4, NULL, 'producto', 'Samsung 990 PRO 2TB NVMe SSD', 1, 920000.00, 920000.00),
	(38, 33, 4, NULL, 'producto', 'Samsung 990 PRO 2TB NVMe SSD', 1, 920000.00, 920000.00),
	(39, 34, 10, NULL, 'producto', 'Alienware AW3423DWF QD-OLED', 1, 4800000.00, 4800000.00),
	(40, 35, 9, NULL, 'producto', 'Logitech G Pro X Superlight 2', 1, 750000.00, 750000.00),
	(41, 35, 4, NULL, 'producto', 'Samsung 990 PRO 2TB NVMe SSD', 1, 920000.00, 920000.00),
	(42, 36, 1, NULL, 'producto', 'AMD Ryzen 7 7800X3D', 1, 1950000.00, 1950000.00),
	(43, 37, 1, NULL, 'producto', 'AMD Ryzen 7 7800X3D', 1, 1950000.00, 1950000.00),
	(44, 38, 8, NULL, 'producto', 'Corsair iCUE H150i ELITE LCD XT', 1, 1350000.00, 1350000.00),
	(45, 39, 1, NULL, 'producto', 'Intel Core i9-14900K', 1, 2850000.00, 2850000.00),
	(46, 40, 4, NULL, 'producto', 'WD Black SN850X 2TB NVMe Gen4 SSD', 1, 850000.00, 850000.00),
	(47, 40, 10, NULL, 'producto', 'Razer DeathAdder V3 Pro', 1, 820000.00, 820000.00),
	(48, 41, 1, NULL, 'producto', 'Intel Core i9-14900K', 1, 2850000.00, 2850000.00),
	(49, 42, 1, NULL, 'producto', 'Intel Core i9-14900K', 1, 2850000.00, 2850000.00),
	(50, 43, 3, NULL, 'producto', 'G.Skill Trident Z5 RGB DDR5 32GB (2x16GB) 6400MHz', 1, 750000.00, 750000.00),
	(51, 43, 4, NULL, 'producto', 'WD Black SN850X 2TB NVMe Gen4 SSD', 2, 850000.00, 1700000.00),
	(52, 43, 10, NULL, 'producto', 'Razer DeathAdder V3 Pro', 1, 820000.00, 820000.00),
	(53, 43, 6, NULL, 'producto', 'Seasonic VERTEX GX-1000 1000W 80+ Gold ATX 3.0', 1, 980000.00, 980000.00),
	(54, 44, 3, NULL, 'producto', 'G.Skill Trident Z5 RGB DDR5 32GB (2x16GB) 6400MHz', 1, 750000.00, 750000.00),
	(55, 45, 4, NULL, 'producto', 'WD Black SN850X 2TB NVMe Gen4 SSD', 1, 850000.00, 850000.00);

-- Dumping structure for table nextlevel.productos
CREATE TABLE IF NOT EXISTS `productos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `descripcion_corta` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `descripcion_detallada` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `especificaciones` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `categoria_id` int NOT NULL,
  `precio_actual` decimal(12,2) NOT NULL,
  `stock` int DEFAULT '0',
  `estado` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `categoria_id` (`categoria_id`),
  KEY `estado` (`estado`),
  CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`),
  CONSTRAINT `productos_ibfk_2` FOREIGN KEY (`estado`) REFERENCES `estado` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table nextlevel.productos: ~11 rows (approximately)
INSERT INTO `productos` (`id`, `nombre`, `descripcion_corta`, `descripcion_detallada`, `especificaciones`, `categoria_id`, `precio_actual`, `stock`, `estado`) VALUES
	(1, 'Intel Core i9-14900K', 'El procesador de escritorio más potente de Intel para gaming y creación de contenido.', 'El Intel Core i9-14900K lleva el rendimiento de escritorio al siguiente nivel con 24 núcleos (8P + 16E) y 32 hilos. La arquitectura híbrida Raptor Lake Refresh ofrece frecuencias turbo de hasta 6.0 GHz, logrando puntuaciones récord en benchmarks de un solo hilo y multi-hilo. Ideal para juegos AAA en resoluciones extremas, streaming simultáneo y workloads profesionales de renderizado.', 'Núcleos: 24 (8P + 16E)\nHilos: 32\nReloj base P-Core: 3.2 GHz\nReloj turbo máx: 6.0 GHz\nCaché L3: 36 MB\nTDP: 125W (PBP) / 253W (MTP)\nSocket: LGA1700\nProceso: Intel 7', 1, 2850000.00, 18, 1),
	(2, 'NVIDIA GeForce RTX 4070 Ti SUPER', 'GPU de gama alta para gaming 1440p y 4K con DLSS 3.5 y ray tracing.', 'La RTX 4070 Ti SUPER es la opción perfecta para quienes buscan rendimiento excepcional en resolución 1440p y una experiencia sólida en 4K. Con 16 GB de VRAM GDDR6X y soporte para DLSS 3.5 con generación de frames, ofrece tasas de cuadros fluidas en los juegos más exigentes del mercado. Arquitectura Ada Lovelace de última generación.', 'Memoria: 16 GB GDDR6X\nNúcleos CUDA: 8448\nBus de memoria: 256-bit\nReloj boost: 2.61 GHz\nConsumo: 285W\nDLSS 3.5: Sí\nRay Tracing: 3ª generación\nConector: 1x 16-pin', 2, 5200000.00, 12, 1),
	(3, 'G.Skill Trident Z5 RGB DDR5 32GB (2x16GB) 6400MHz', 'Kit de memoria DDR5 de alto rendimiento con iluminación RGB cristalina.', 'El kit G.Skill Trident Z5 RGB DDR5 combina velocidades extremas de 6400 MHz con latencias ajustadas CL32. Diseñado para plataformas Intel y AMD de última generación, su difusor de aluminio de doble textura y la iluminación LED RGB de arco completo lo convierten en la pieza central de cualquier build premium. Compatibilidad verificada con perfiles XMP 3.0 e EXPO.', 'Capacidad: 32 GB (2 x 16 GB)\nTipo: DDR5\nVelocidad: 6400 MHz\nLatencia: CL32-39-39-102\nVoltaje: 1.40V\nPerfil: XMP 3.0 / EXPO\nAltura: 42 mm', 3, 750000.00, 45, 1),
	(4, 'WD Black SN850X 2TB NVMe Gen4 SSD', 'SSD PCIe 4.0 de alto rendimiento para gaming y cargas profesionales.', 'El WD Black SN850X ofrece velocidades de lectura de hasta 7300 MB/s gracias a su controlador propietario y memoria NAND TLC de última generación. Diseñado específicamente para gaming con el panel de control WD_BLACK Dashboard, tecnología Game Mode 2.0 y compatibilidad con DirectStorage para tiempos de carga prácticamente instantáneos.', 'Capacidad: 2 TB\nInterfaz: PCIe Gen 4.0 x4 NVMe\nLectura secuencial: Hasta 7300 MB/s\nEscritura secuencial: Hasta 6600 MB/s\nTBW: 1200 TB\nFormato: M.2 2280\nGame Mode 2.0: Sí', 4, 850000.00, 30, 1),
	(5, 'MSI MPG Z790 Carbon WiFi', 'Placa base ATX premium con WiFi 6E y soporte DDR5 para Intel 13ª/14ª gen.', 'La MSI MPG Z790 Carbon WiFi es una placa base diseñada para entusiastas que exigen lo mejor. Con un VRM de 19+1+1 fases, soporta overclocking extremo de procesadores Intel. Incluye cinco ranuras M.2, WiFi 6E integrado, Bluetooth 5.3, audio Realtek ALC4080 y conectividad USB 3.2 Gen 2x2. Estética oscura premium con iluminación RGB Mystic Light.', 'Socket: LGA1700\nChipset: Z790\nFormato: ATX\nMemoria: DDR5 hasta 7800+ MHz (OC)\nRanuras M.2: 5 (1x PCIe 5.0)\nWiFi: 6E (802.11ax)\nBluetooth: 5.3\nUSB traseros: 11 puertos\nVRM: 19+1+1 fases', 5, 2100000.00, 14, 1),
	(6, 'Seasonic VERTEX GX-1000 1000W 80+ Gold ATX 3.0', 'Fuente modular ATX 3.0 con conector nativo 12VHPWR para GPUs de nueva gen.', 'La Seasonic VERTEX GX-1000 es una fuente de poder totalmente modular de 1000W certificada 80 PLUS Gold con soporte nativo ATX 3.0 y PCIe 5.0. Incluye conector 12VHPWR de 600W para las GPUs más exigentes del mercado. Su ventilador FDB de 120mm con modo semi-fanless garantiza operación silenciosa bajo cargas ligeras. Garantía de 12 años.', 'Potencia: 1000W\nCertificación: 80 PLUS Gold\nEstándar: ATX 3.0\nModular: Full Modular\n12VHPWR: Sí (nativo 600W)\nVentilador: 120mm FDB\nModo Fanless: Sí (Hybrid)\nGarantía: 12 años', 6, 980000.00, 20, 1),
	(7, 'NZXT H9 Flow', 'Gabinete full-tower con flujo de aire excepcional y doble panel de vidrio.', 'El NZXT H9 Flow es un gabinete full-tower que redefine la estética y el rendimiento térmico. Con paneles frontales y laterales de vidrio templado y un panel superior perforado, permite exhibir tu hardware mientras mantiene temperaturas óptimas. Soporta builds completos con radiadores de hasta 360mm en múltiples posiciones y GPUs de hasta 435mm.', 'Tipo: Full Tower\nMaterial: Acero SGCC, Vidrio Templado\nSoporte placa: E-ATX, ATX, mATX, ITX\nBahías SSD: 2+2\nRadiadores: Hasta 360mm (top, frontal, lateral)\nGPU máx: 435mm\nCooler CPU máx: 165mm\nVentiladores incluidos: 4 x 120mm', 7, 950000.00, 15, 1),
	(8, 'Corsair iCUE H150i ELITE LCD XT', 'AIO 360mm con pantalla LCD IPS de 2.1" y ventiladores AF ELITE RGB.', 'El Corsair iCUE H150i ELITE LCD XT combina refrigeración de alto rendimiento con personalización visual gracias a su pantalla IPS LCD de 2.1 pulgadas en el bloque de la bomba. Muestra temperaturas, GIFs personalizados o información del sistema en tiempo real. Los tres ventiladores AF ELITE de 120mm con tecnología AirGuide antivibraciones entregan un flujo de aire concentrado manteniendo niveles de ruido mínimos.', 'Radiador: 360mm\nPantalla: IPS LCD 2.1" (480x480)\nVentiladores: 3 x AF120 ELITE RGB\nRPM bomba: 2100 RPM\nCompatibilidad: Intel LGA1700/1200/115x, AMD AM5/AM4\nSoftware: iCUE\nRuido máx: 33 dBA', 8, 1350000.00, 16, 1),
	(9, 'Samsung Odyssey OLED G8 34" WQHD', 'Monitor curvo ultrawide OLED de 34" con 175Hz y 0.03ms para gaming inmersivo.', 'El Samsung Odyssey OLED G8 ofrece la mejor experiencia visual gaming con su panel OLED QD de 34 pulgadas ultrawide. Con resolución WQHD (3440x1440), tasa de refresco de 175Hz y tiempo de respuesta de 0.03ms GtG, cada frame se ve nítido y fluido. Compatible con AMD FreeSync Premium Pro y NVIDIA G-Sync. Smart TV integrado con Samsung Gaming Hub y streaming sin necesidad de PC.', 'Tamaño: 34 pulgadas\nResolución: 3440 x 1440 (UWQHD)\nPanel: QD-OLED\nRefresco: 175Hz\nTiempo de resp: 0.03ms GtG\nCurvatura: 1800R\nHDR: HDR True Black 400\nPuertos: 1x HDMI 2.1, 1x microHDMI, 1x USB-C (65W PD)\nSmart Hub: Sí', 10, 5500000.00, 8, 1),
	(10, 'Razer DeathAdder V3 Pro', 'Ratón gaming inalámbrico ergonómico ultraligero de 63g para esports.', 'El Razer DeathAdder V3 Pro es la evolución definitiva del ratón gaming ergonómico más vendido del mundo. Con solo 63 gramos, sensor Focus Pro 30K con resolución de 30,000 DPI, switches ópticos Gen-3 de 90 millones de clics y tecnología HyperSpeed Wireless para latencia virtualmente cero. Diseño refinado con ingenieros de esports para sesiones competitivas prolongadas sin fatiga.', 'Peso: 63g\nSensor: Focus Pro 30K (30,000 DPI)\nSwitches: Razer Optical Gen-3 (90M clics)\nConexión: HyperSpeed Wireless / Bluetooth / USB-C\nPolling Rate: 4000Hz (con dongle)\nBatería: Hasta 90 horas\nAgarre: Ergonómico (diestros)', 11, 820000.00, 28, 1),
	(11, 'Samsung Odyssey G5 curva', 'El Samsung Odyssey G5 curvo es un monitor gaming inmersivo de 32 pulgadas con curvatura 1000R', 'El Samsung Odyssey G5 curvo es un monitor gaming inmersivo de 32 pulgadas con curvatura 1000R, diseñado para adaptarse al campo visual humano.\r\nOfrece una resolución WQHD (2560x1440), alta tasa de refresco (144Hz-165Hz) y 1ms de tiempo de respuesta, siendo ideal para juegos competitivos y fluidos.', 'Características Principales:\r\nCurvatura 1000R: Máxima inmersión que reduce la fatiga visual al coincidir con la forma del ojo humano.\r\nResolución y Panel: Resolución WQHD (1440p) con panel VA, lo que ofrece negros profundos y alto contraste (\r\n).\r\nRendimiento Gaming: 144Hz o 165Hz de actualización con 1ms (MPRT) de tiempo de respuesta para eliminar el retraso.\r\nCompatibilidad: AMD FreeSync Premium para evitar cortes de imagen (stuttering/tearing).\r\nDiseño: Estética futurista con bordes delgados, ideal para configuraciones de varios monitores.', 10, 1000000.00, 2, 1);

-- Dumping structure for table nextlevel.reembolsos
CREATE TABLE IF NOT EXISTS `reembolsos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `orden_id` int NOT NULL,
  `stripe_refund_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `monto` decimal(12,2) NOT NULL,
  `razon` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `estado` enum('pendiente','completado','fallido') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'completado',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `stripe_refund_id` (`stripe_refund_id`),
  KEY `orden_id` (`orden_id`),
  KEY `idx_stripe_refund_id` (`stripe_refund_id`),
  KEY `idx_reembolso_estado` (`estado`),
  KEY `idx_reembolsos_orden_fecha` (`orden_id`,`created_at`),
  KEY `idx_reembolsos_estado_fecha` (`estado`,`created_at`),
  CONSTRAINT `reembolsos_ibfk_1` FOREIGN KEY (`orden_id`) REFERENCES `ordenes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table nextlevel.reembolsos: ~0 rows (approximately)

-- Dumping structure for table nextlevel.refresh_tokens
CREATE TABLE IF NOT EXISTS `refresh_tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `token` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  KEY `idx_user_id` (`user_id`),
  CONSTRAINT `refresh_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=161 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table nextlevel.refresh_tokens: ~150 rows (approximately)
INSERT INTO `refresh_tokens` (`id`, `user_id`, `token`, `expires_at`, `created_at`) VALUES
	(1, 7, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiY29ycmVvIjoibmlhQHN0cmlwZS5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzYzODY3MTM2LCJleHAiOjE3NjQ0NzE5MzZ9.CSLrzU_UCiRboqiULe7GajfusASBDt88afogFWoT-Nc', '2025-11-30 03:05:36', '2025-11-23 03:05:35'),
	(2, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiY29ycmVvIjoianVhbi5wZXJlekBlbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzYzOTMxMDc4LCJleHAiOjE3NjQ1MzU4Nzh9.RrapZjundezuiUvLNwBqvIEKuMYnu7fpBP1Fsjw2CA8', '2025-11-30 20:51:18', '2025-11-23 20:51:16'),
	(3, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiY29ycmVvIjoibWFjaG9hbmRyZXMxMkBnbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzYzOTYwODYyLCJleHAiOjE3NjQ1NjU2NjJ9.0XDo86b6Y0ua_YgJS09GOibWSEDcrur6MjGUQT5bS7U', '2025-12-01 05:07:42', '2025-11-24 05:07:52'),
	(4, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiY29ycmVvIjoibWFjaG9hbmRyZXMxMkBnbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzYzOTYwOTc0LCJleHAiOjE3NjQ1NjU3NzR9.olKV5fdD1y_vCRBWiqQGzeENqF5OIidNPdK43E6lvbU', '2025-12-01 05:09:34', '2025-11-24 05:09:45'),
	(5, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiY29ycmVvIjoibWFjaG9hbmRyZXMxMkBnbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY0MDA2OTQ4LCJleHAiOjE3NjQ2MTE3NDh9.cekM9OLfhzqYIVYHobI8A_6_Letjl24n1uM2Serv8pU', '2025-12-01 17:55:48', '2025-11-24 17:55:58'),
	(6, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiY29ycmVvIjoibWFjaG9hbmRyZXMxMkBnbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY0MDE0MzU1LCJleHAiOjE3NjQ2MTkxNTV9.3jFrozXGG5yvJOCPpXurwZK3xOV0qgPahBjAHjoqjMc', '2025-12-01 19:59:15', '2025-11-24 19:59:25'),
	(7, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiY29ycmVvIjoianVhbi5wZXJlekBlbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY0MTA0NDU4LCJleHAiOjE3NjQ3MDkyNTh9.OowGUN9gjOwQeIRlyUBYrvljSSlbNZ4zU2wzllOjjus', '2025-12-02 21:00:58', '2025-11-25 21:00:58'),
	(8, 9, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwiY29ycmVvIjoidGVzaXRvQGdtYWlsLmNvbSIsInJvbCI6ImNsaWVudGUiLCJpYXQiOjE3NjQxMDQ4NzUsImV4cCI6MTc2NDcwOTY3NX0.zpPDYmcxvM3hkv5lMFDz4E2iCzQyRHoiXtGt03Odf1M', '2025-12-02 21:07:55', '2025-11-25 21:07:55'),
	(9, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiY29ycmVvIjoianVhbi5wZXJlekBlbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY0MTcwMzA1LCJleHAiOjE3NjQ3NzUxMDV9.TrnQ8aLY07sPqn5efM1pyVAmHWpewg1JFzGZDQVDvvE', '2025-12-03 15:18:25', '2025-11-26 15:18:26'),
	(10, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiY29ycmVvIjoianVhbi5wZXJlekBlbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY0MTcwNjUxLCJleHAiOjE3NjQ3NzU0NTF9.0Z6TC9BfKUTp7WbviCqfxxjIqCcfhospF2L2klr_YN8', '2025-12-03 15:24:11', '2025-11-26 15:24:11'),
	(11, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiY29ycmVvIjoianVhbi5wZXJlekBlbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY0MTcxMTY3LCJleHAiOjE3NjQ3NzU5Njd9.ZRxd6-SiYGjtZRvlZeYSuAbJ0MduW07_-cGmUoRd-KM', '2025-12-03 15:32:47', '2025-11-26 15:32:47'),
	(12, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiY29ycmVvIjoianVhbi5wZXJlekBlbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY0MTcxMjQ2LCJleHAiOjE3NjQ3NzYwNDZ9.hJ4AdzvrOBGWwbkCdIZFF6KHDEO3KZwMmbKDGcQJKOc', '2025-12-03 15:34:06', '2025-11-26 15:34:07'),
	(13, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiY29ycmVvIjoianVhbi5wZXJlekBlbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY0MTcxMzcxLCJleHAiOjE3NjQ3NzYxNzF9.HT-MdtuwjrYBfcoNx7Tfu2wvIb2BfgxC43OozdzNyYk', '2025-12-03 15:36:11', '2025-11-26 15:36:11'),
	(14, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiY29ycmVvIjoianVhbi5wZXJlekBlbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY0MTcxODEwLCJleHAiOjE3NjQ3NzY2MTB9.HufNp6u2BwlLAbeaGVrtvrK_yNZSEp23EvtCGMi79vk', '2025-12-03 15:43:30', '2025-11-26 15:43:30'),
	(15, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiY29ycmVvIjoianVhbi5wZXJlekBlbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY0MTcxODQ0LCJleHAiOjE3NjQ3NzY2NDR9.BM8V2YaMwOopFCEj_aM_3c49lHC9vxVUiHGuN_Yjbh0', '2025-12-03 15:44:04', '2025-11-26 15:44:04'),
	(16, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiY29ycmVvIjoianVhbi5wZXJlekBlbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY0MTcyMzg2LCJleHAiOjE3NjQ3NzcxODZ9.dft8WUsKl9QH0unEs2HoJhUWTmX7ni0LO8ffQzqPVbI', '2025-12-03 15:53:06', '2025-11-26 15:53:06'),
	(17, 9, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwiY29ycmVvIjoidGVzaXRvQGdtYWlsLmNvbSIsInJvbCI6ImNsaWVudGUiLCJpYXQiOjE3NjQxNzI3ODYsImV4cCI6MTc2NDc3NzU4Nn0.Ci7L7kDuZLurZb7x6za1J52cadcubLUthe3o9us1ccg', '2025-12-03 15:59:46', '2025-11-26 15:59:46'),
	(19, 7, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiY29ycmVvIjoibmlhQHN0cmlwZS5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY0MzQxNjcxLCJleHAiOjE3NjQ5NDY0NzF9.utly5Rvc02pz6lhjxw1-rLPru9J22zTulI20SzKgrOI', '2025-12-05 14:54:31', '2025-11-28 14:54:31'),
	(20, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiY29ycmVvIjoibWFjaG9hbmRyZXMxMkBnbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY0Mzc1MTQwLCJleHAiOjE3NjQ5Nzk5NDB9.VU2FtNbqd-YeW42FLVTSfyp9_IdpWqlKVHmPQ5nxlW8', '2025-12-06 00:12:20', '2025-11-29 00:12:20'),
	(21, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29ycmVvIjoiYWRtaW5AbmV4dGxldmVsLmNvbSIsInJvbCI6ImFkbWluIiwiaWF0IjoxNzY0MzgyMzc5LCJleHAiOjE3NjQ5ODcxNzl9.W_PEOLHaZ-ELrvKEoMedvmxLvmcMQglKjRgSFGXwobo', '2025-12-06 02:12:59', '2025-11-29 02:12:59'),
	(22, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29ycmVvIjoiYWRtaW5AbmV4dGxldmVsLmNvbSIsInJvbCI6ImFkbWluIiwiaWF0IjoxNzY0MzgyNjQyLCJleHAiOjE3NjQ5ODc0NDJ9.T5Ob-tBjomWq0519xFWhr8KH_qEiz1n6XaiyQlNcMx4', '2025-12-06 02:17:22', '2025-11-29 02:17:21'),
	(23, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiY29ycmVvIjoianVhbi5wZXJlekBlbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY0MzgyNzE3LCJleHAiOjE3NjQ5ODc1MTd9.CraWFkUi6vPwdMrA-RnKjXvYI9b8WJPVJ88BF4UeDSU', '2025-12-06 02:18:37', '2025-11-29 02:18:37'),
	(24, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiY29ycmVvIjoianVhbi5wZXJlekBlbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY0MzgzNTI1LCJleHAiOjE3NjQ5ODgzMjV9.PhwFex_ooBfo9TIUdUmIUcSksVXIWki9hIlcXZMCkuw', '2025-12-06 02:32:05', '2025-11-29 02:32:05'),
	(27, 11, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsImNvcnJlbyI6Imp1YW5AZXhhbXBsZS5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY0NjAyODIxLCJleHAiOjE3NjUyMDc2MjF9.mugQZMXB1tLaxEVcs-snxovLIXVtnddm80Z2lK3hmVk', '2025-12-08 15:27:01', '2025-12-01 15:27:01'),
	(28, 11, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsImNvcnJlbyI6Imp1YW5AZXhhbXBsZS5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY0NjAzMDE3LCJleHAiOjE3NjUyMDc4MTd9.oTa4C6aicbUNkIH46m6_VzizW7AuVhW93559Om3epVo', '2025-12-08 15:30:17', '2025-12-01 15:30:11'),
	(29, 11, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsImNvcnJlbyI6Imp1YW5AZXhhbXBsZS5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY0NjAzMDgwLCJleHAiOjE3NjUyMDc4ODB9.qWXviosAJJnCioHFncdsXtDnT5LxauqIni_JvqQgziw', '2025-12-08 15:31:20', '2025-12-01 15:31:15'),
	(30, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29ycmVvIjoiYWRtaW5AbmV4dGxldmVsLmNvbSIsInJvbCI6ImFkbWluIiwiaWF0IjoxNzY0NjAzMzEwLCJleHAiOjE3NjUyMDgxMTB9.yIiNSmRtJjq5l684IeG0FVbeee2wQeGO-ZJ_1uyRrE8', '2025-12-08 15:35:10', '2025-12-01 15:35:05'),
	(31, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29ycmVvIjoiYWRtaW5AbmV4dGxldmVsLmNvbSIsInJvbCI6ImFkbWluIiwiaWF0IjoxNzY0NjAzOTkzLCJleHAiOjE3NjUyMDg3OTN9.1mFJCvB5SJqN5nOzeohjG8t0WVyEVROxRHz35o_0Rq0', '2025-12-08 15:46:33', '2025-12-01 15:46:28'),
	(32, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29ycmVvIjoiYWRtaW5AbmV4dGxldmVsLmNvbSIsInJvbCI6ImFkbWluIiwiaWF0IjoxNzY0NjA1MDk1LCJleHAiOjE3NjUyMDk4OTV9.JcKSxIpwueD2klsc3Ahe_m2mJqNKxPtRwukcrhZhuZM', '2025-12-08 16:04:55', '2025-12-01 16:04:49'),
	(33, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiY29ycmVvIjoianVhbi5wZXJlekBlbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY0NjA2MzkxLCJleHAiOjE3NjUyMTExOTF9.V61ngQOriYv_-xxQ72mQ5D3aqVND8ynWDht0NIMeXW8', '2025-12-08 16:26:31', '2025-12-01 16:26:25'),
	(34, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiY29ycmVvIjoianVhbi5wZXJlekBlbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY0NjM1NDk5LCJleHAiOjE3NjUyNDAyOTl9.Oz9cZx_T5k1n4YQEc8CsYUm3ET_HHiCQzgC1Od-e124', '2025-12-09 00:31:39', '2025-12-02 00:31:39'),
	(35, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiY29ycmVvIjoibWFjaG9hbmRyZXMxMkBnbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY1MDU0NzQwLCJleHAiOjE3NjU2NTk1NDB9.rGnx0c52QTjeSlTUADfjoJAt8F6ecZgQYPxrglAiBUI', '2025-12-13 20:59:00', '2025-12-06 20:59:09'),
	(36, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiY29ycmVvIjoibWFjaG9hbmRyZXMxMkBnbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY1MDU1OTc3LCJleHAiOjE3NjU2NjA3Nzd9.dcsCKlI5jQQuJlx2M87r5tuYqHEK2LTqsALfXS58yEU', '2025-12-13 21:19:37', '2025-12-06 21:19:46'),
	(37, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiY29ycmVvIjoibWFjaG9hbmRyZXMxMkBnbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY1MDU3MjYyLCJleHAiOjE3NjU2NjIwNjJ9.gahufqOeSgH4u5-l0faiOkHjNtCQetvklxHLjQw6oVA', '2025-12-13 21:41:02', '2025-12-06 21:41:11'),
	(38, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiY29ycmVvIjoibWFjaG9hbmRyZXMxMkBnbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY1MDU3Njg3LCJleHAiOjE3NjU2NjI0ODd9.ssSUrh0izJdC1MpCEfsTS2Whr24IqKpX5fREVxpkG1M', '2025-12-13 21:48:07', '2025-12-06 21:48:17'),
	(39, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiY29ycmVvIjoibWFjaG9hbmRyZXMxMkBnbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY1MDU3NzUxLCJleHAiOjE3NjU2NjI1NTF9.opBJJEywvRKAlbEvU0OkIKyjTphWsqLr5UZwcWDRb08', '2025-12-13 21:49:11', '2025-12-06 21:49:20'),
	(40, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiY29ycmVvIjoibWFjaG9hbmRyZXMxMkBnbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY1MDU4MTMwLCJleHAiOjE3NjU2NjI5MzB9.4xzLuoAP1FDueVUngbrZ-QwPbGh21FtYPvSTIeQ487E', '2025-12-13 21:55:30', '2025-12-06 21:55:39'),
	(41, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiY29ycmVvIjoibWFjaG9hbmRyZXMxMkBnbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY1MDU5NjA3LCJleHAiOjE3NjU2NjQ0MDd9.9vjAaGGbzJV2z_Q9AX0wEvLio_UNADMqarX45k4FBUs', '2025-12-13 22:20:07', '2025-12-06 22:20:17'),
	(42, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiY29ycmVvIjoibWFjaG9hbmRyZXMxMkBnbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY1MDYxMDM2LCJleHAiOjE3NjU2NjU4MzZ9.vGuPDKU_DTGCIlbej4fvUgck0wK2VeelhI0Tj_uXleo', '2025-12-13 22:43:56', '2025-12-06 22:44:05'),
	(43, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiY29ycmVvIjoibWFjaG9hbmRyZXMxMkBnbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY1MDYxOTIwLCJleHAiOjE3NjU2NjY3MjB9.AKZsCw2lkzRQLMsLWnQE1Ssnrr-LQKxcyskDEeiDK5Q', '2025-12-13 22:58:40', '2025-12-06 22:58:50'),
	(44, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiY29ycmVvIjoibWFjaG9hbmRyZXMxMkBnbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY1MDYxOTQ3LCJleHAiOjE3NjU2NjY3NDd9.eR5qEuQREALGwKiRVunhAEq-Z7FnoY3f6KINjfEDasI', '2025-12-13 22:59:07', '2025-12-06 22:59:17'),
	(45, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiY29ycmVvIjoibWFjaG9hbmRyZXMxMkBnbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY1MDYyMjIyLCJleHAiOjE3NjU2NjcwMjJ9.Q9byQBu_nxhmoHH5a3ov2jlo-c5syAaj3IMZ_H43NIU', '2025-12-13 23:03:42', '2025-12-06 23:03:51'),
	(46, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiY29ycmVvIjoibWFjaG9hbmRyZXMxMkBnbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY1MDYyMjY3LCJleHAiOjE3NjU2NjcwNjd9.0cI3Hd-mwVHumPFU03hq3d0fmLhDToeIBVY-l1F4ID8', '2025-12-13 23:04:27', '2025-12-06 23:04:37'),
	(47, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiY29ycmVvIjoibWFjaG9hbmRyZXMxMkBnbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY1MDYyMzY5LCJleHAiOjE3NjU2NjcxNjl9.IvyHOg_nt7qFzA_bT24BTWcyF15-jVvwXfunAmUMPso', '2025-12-13 23:06:09', '2025-12-06 23:06:18'),
	(48, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiY29ycmVvIjoibWFjaG9hbmRyZXMxMkBnbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY1MDYyMzk0LCJleHAiOjE3NjU2NjcxOTR9.iIrqfhRE1UpNYU3PjJDYgu3XZbmG3grkQBwn09Wmf90', '2025-12-13 23:06:34', '2025-12-06 23:06:43'),
	(49, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiY29ycmVvIjoibWFjaG9hbmRyZXMxMkBnbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY1MDYyNTMyLCJleHAiOjE3NjU2NjczMzJ9.Zc29KvZCx59meQ8ebd1YjBu3ezP1B9L3s0h1ifLP-SI', '2025-12-13 23:08:52', '2025-12-06 23:09:01'),
	(50, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiY29ycmVvIjoibWFjaG9hbmRyZXMxMkBnbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY1MDYyNTQyLCJleHAiOjE3NjU2NjczNDJ9.UxKXPcfVieKAEoGJ3sSCZqeClHg7DREg7xTycg4poRM', '2025-12-13 23:09:02', '2025-12-06 23:09:11'),
	(51, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiY29ycmVvIjoibWFjaG9hbmRyZXMxMkBnbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY1MDYyNjEyLCJleHAiOjE3NjU2Njc0MTJ9.fQSZusSkPgPkxNX4tqyyo7FFVB3jJAP-HzJ5sXYbxjA', '2025-12-13 23:10:12', '2025-12-06 23:10:21'),
	(52, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiY29ycmVvIjoibWFjaG9hbmRyZXMxMkBnbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY1MDYyNjIxLCJleHAiOjE3NjU2Njc0MjF9.2w0x1CZckjyjWwBFLTYS7mmMXXfmQ6eFOwpltERsmFI', '2025-12-13 23:10:21', '2025-12-06 23:10:30'),
	(53, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiY29ycmVvIjoibWFjaG9hbmRyZXMxMkBnbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY1MDYyNjgwLCJleHAiOjE3NjU2Njc0ODB9.OQtkFNHSect8exH6xjZIoWrz2xzx2hFOQ47ziigZ7eA', '2025-12-13 23:11:20', '2025-12-06 23:11:29'),
	(54, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiY29ycmVvIjoibWFjaG9hbmRyZXMxMkBnbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY1MDYyNzg4LCJleHAiOjE3NjU2Njc1ODh9.kCC7B5o9g_mLe4LY-VBoFc0dRWJlcgFepgFq9QrsOmc', '2025-12-13 23:13:08', '2025-12-06 23:13:17'),
	(55, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiY29ycmVvIjoibWFjaG9hbmRyZXMxMkBnbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY1MDYyODIxLCJleHAiOjE3NjU2Njc2MjF9.tIeRrg1GHAolme93D4_Hs3mbacHPEs5ELangiFloU6Y', '2025-12-13 23:13:41', '2025-12-06 23:13:51'),
	(56, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiY29ycmVvIjoibWFjaG9hbmRyZXMxMkBnbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY1MDYyODU2LCJleHAiOjE3NjU2Njc2NTZ9.8SfZ1R3lzf3ypOfPWap5VPCX2jfFjQMbasflSfAlMAo', '2025-12-13 23:14:16', '2025-12-06 23:14:25'),
	(57, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiY29ycmVvIjoibWFjaG9hbmRyZXMxMkBnbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY1MDYyOTM4LCJleHAiOjE3NjU2Njc3Mzh9.KfozmDKLlbIISGVuE2SY-TsBrZvcY9xhkYBEPTxBqi4', '2025-12-13 23:15:38', '2025-12-06 23:15:47'),
	(58, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiY29ycmVvIjoibWFjaG9hbmRyZXMxMkBnbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY1MDYyOTczLCJleHAiOjE3NjU2Njc3NzN9.zXgUYYre_QskwYSfd2j6BWphna92bGPADXnAg7ohu7Q', '2025-12-13 23:16:13', '2025-12-06 23:16:22'),
	(59, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiY29ycmVvIjoibWFjaG9hbmRyZXMxMkBnbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY1MDYzNzcwLCJleHAiOjE3NjU2Njg1NzB9.VODHyfHaIk0j822cYLEj-9pnhYLBDD5DvNSvXLAbKZc', '2025-12-13 23:29:30', '2025-12-06 23:29:39'),
	(60, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiY29ycmVvIjoibWFjaG9hbmRyZXMxMkBnbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY1MDYzODM1LCJleHAiOjE3NjU2Njg2MzV9.mssO8joDaP_j8LitcBTtAGsdHle2yt_7_r6tpzATgOg', '2025-12-13 23:30:35', '2025-12-06 23:30:44'),
	(61, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiY29ycmVvIjoibWFjaG9hbmRyZXMxMkBnbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY1MDYzOTIxLCJleHAiOjE3NjU2Njg3MjF9.djrk7WBYpoLXGg0dtsR07gVcLTdBeu5N_JzDFyKibUw', '2025-12-13 23:32:01', '2025-12-06 23:32:10'),
	(62, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiY29ycmVvIjoibWFjaG9hbmRyZXMxMkBnbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY1MDY0Mjg5LCJleHAiOjE3NjU2NjkwODl9.3mdWhm57eIeUaFwz5Yn9KZJE1x5L5HV3Me6OYM7JDg8', '2025-12-13 23:38:09', '2025-12-06 23:38:19'),
	(63, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiY29ycmVvIjoibWFjaG9hbmRyZXMxMkBnbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY1MDY3NTY1LCJleHAiOjE3NjU2NzIzNjV9.pgHOw99xy2KGEMBl62ho16ypU4S7JISJBV86Z4osWe8', '2025-12-14 00:32:45', '2025-12-07 00:32:55'),
	(64, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiY29ycmVvIjoibWFjaG9hbmRyZXMxMkBnbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY1MTI5MzkzLCJleHAiOjE3NjU3MzQxOTN9.hm1VqnvaWtRLXSxHgM4LrhI4Y_T75lKbajfUXKmSUSQ', '2025-12-14 17:43:13', '2025-12-07 17:43:13'),
	(65, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiY29ycmVvIjoibWFjaG9hbmRyZXMxMkBnbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY1MTI5NDkwLCJleHAiOjE3NjU3MzQyOTB9.LBUYjHpUWZD3KingO80IXbJ_7Db_KNi_x92ZmTqQn6I', '2025-12-14 17:44:50', '2025-12-07 17:45:00'),
	(66, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29ycmVvIjoiYWRtaW5AbmV4dGxldmVsLmNvbSIsInJvbCI6ImFkbWluIiwiaWF0IjoxNzY1MTQ3NzQzLCJleHAiOjE3NjU3NTI1NDN9.uiFPGH7iwgMVA3p8UVivoCh4XGUbWwei7AMj7wLIt5E', '2025-12-14 22:49:03', '2025-12-07 22:48:58'),
	(67, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29ycmVvIjoiYWRtaW5AbmV4dGxldmVsLmNvbSIsInJvbCI6ImFkbWluIiwiaWF0IjoxNzY1MTQ4MjMwLCJleHAiOjE3NjU3NTMwMzB9.5sMKVd0YLOthzP4FVwzJ6iQGp0zfRaVBaPeHfwjd7F0', '2025-12-14 22:57:10', '2025-12-07 22:57:06'),
	(68, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29ycmVvIjoiYWRtaW5AbmV4dGxldmVsLmNvbSIsInJvbCI6ImFkbWluIiwiaWF0IjoxNzY1MTQ4NjMwLCJleHAiOjE3NjU3NTM0MzB9.g5rH4oEFgVaZfRsXze50XqNnLxZ49N2dLwDT68BQYGw', '2025-12-14 23:03:50', '2025-12-07 23:03:46'),
	(69, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29ycmVvIjoiYWRtaW5AbmV4dGxldmVsLmNvbSIsInJvbCI6ImFkbWluIiwiaWF0IjoxNzY1MTQ4NzQ4LCJleHAiOjE3NjU3NTM1NDh9.qj3UpxTPqkkrosgYDxQ5smVcQ1TX3iFsOIC-33qnsic', '2025-12-14 23:05:48', '2025-12-07 23:05:44'),
	(70, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29ycmVvIjoiYWRtaW5AbmV4dGxldmVsLmNvbSIsInJvbCI6ImFkbWluIiwiaWF0IjoxNzY1MTQ5MDE0LCJleHAiOjE3NjU3NTM4MTR9.92iihlqEmxfikZGJTdLTl89obdQZ9VZc9IlSie5O_OE', '2025-12-14 23:10:14', '2025-12-07 23:10:09'),
	(71, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29ycmVvIjoiYWRtaW5AbmV4dGxldmVsLmNvbSIsInJvbCI6ImFkbWluIiwiaWF0IjoxNzY1MTQ5MDI4LCJleHAiOjE3NjU3NTM4Mjh9.RfDttzl1rFIxAJZZaeLoWDHxwHijMusulXpp4Vf1C90', '2025-12-14 23:10:28', '2025-12-07 23:10:24'),
	(72, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29ycmVvIjoiYWRtaW5AbmV4dGxldmVsLmNvbSIsInJvbCI6ImFkbWluIiwiaWF0IjoxNzY1MTQ5MTc0LCJleHAiOjE3NjU3NTM5NzR9.IA9gDFtGCKDU66GrZaDHm4z0EbPcwRN4UaMt95PvxFc', '2025-12-14 23:12:54', '2025-12-07 23:12:50'),
	(73, 6, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiY29ycmVvIjoibHVpcy5oZXJuYW5kZXpAZW1haWwuY29tIiwicm9sIjoiZW1wbGVhZG8iLCJpYXQiOjE3NjUxNDkyNDUsImV4cCI6MTc2NTc1NDA0NX0._ZsGD4rMSYfgSj8rLoom7ut9bCekylDb0DnIifjt2XQ', '2025-12-14 23:14:05', '2025-12-07 23:14:00'),
	(74, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiY29ycmVvIjoianVhbi5wZXJlekBlbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY1MTQ5MjUyLCJleHAiOjE3NjU3NTQwNTJ9.qjJPAg-67Myv1Jf-1E3Ye7UOEcB51wsvp4dP0d7XjMs', '2025-12-14 23:14:12', '2025-12-07 23:14:07'),
	(75, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29ycmVvIjoiYWRtaW5AbmV4dGxldmVsLmNvbSIsInJvbCI6ImFkbWluIiwiaWF0IjoxNzY1MTQ5MzQ0LCJleHAiOjE3NjU3NTQxNDR9.sBeEHE7BUeAgG0KNS21dzCzhnGLLsEzP-zIuF-eg_YE', '2025-12-14 23:15:44', '2025-12-07 23:15:39'),
	(76, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29ycmVvIjoiYWRtaW5AbmV4dGxldmVsLmNvbSIsInJvbCI6ImFkbWluIiwiaWF0IjoxNzY1MTQ5NDg4LCJleHAiOjE3NjU3NTQyODh9.0-HaLXku1JzLDk3v2Ada-QLlxkn9B0-amBN6hzECoe8', '2025-12-14 23:18:08', '2025-12-07 23:18:04'),
	(77, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29ycmVvIjoiYWRtaW5AbmV4dGxldmVsLmNvbSIsInJvbCI6ImFkbWluIiwiaWF0IjoxNzY1MTQ5NjY0LCJleHAiOjE3NjU3NTQ0NjR9.L0bq5jc80F8JmxaxGDVhjGwUqJKp7FbOMf8LAL1SPcw', '2025-12-14 23:21:04', '2025-12-07 23:21:00'),
	(78, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29ycmVvIjoiYWRtaW5AbmV4dGxldmVsLmNvbSIsInJvbCI6ImFkbWluIiwiaWF0IjoxNzY1MTQ5ODAxLCJleHAiOjE3NjU3NTQ2MDF9.VTu0YZCPsTpSWgFpAuBxukmvZH7pn0YTa9YfYgELUXY', '2025-12-14 23:23:21', '2025-12-07 23:23:16'),
	(79, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29ycmVvIjoiYWRtaW5AbmV4dGxldmVsLmNvbSIsInJvbCI6ImFkbWluIiwiaWF0IjoxNzY1MTQ5OTA3LCJleHAiOjE3NjU3NTQ3MDd9.SLXokmvabCJ0qet7wTuKYjNQZYy7IsEyuQiEpCfyvIo', '2025-12-14 23:25:07', '2025-12-07 23:25:02'),
	(80, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29ycmVvIjoiYWRtaW5AbmV4dGxldmVsLmNvbSIsInJvbCI6ImFkbWluIiwiaWF0IjoxNzY1MjEwMzQ0LCJleHAiOjE3NjU4MTUxNDR9.JuS2eM9ivpmZOykfyT-9NG74r5r7nv1iYSQY2J4e0gk', '2025-12-15 16:12:24', '2025-12-08 16:12:18'),
	(81, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29ycmVvIjoiYWRtaW5AbmV4dGxldmVsLmNvbSIsInJvbCI6ImFkbWluIiwiaWF0IjoxNzY1MjEwNjk0LCJleHAiOjE3NjU4MTU0OTR9.Kdsgo408fmEFkQM7sNdb8GtGg-O1G-ZXYCsbS1iz5kM', '2025-12-15 16:18:14', '2025-12-08 16:18:07'),
	(82, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29ycmVvIjoiYWRtaW5AbmV4dGxldmVsLmNvbSIsInJvbCI6ImFkbWluIiwiaWF0IjoxNzY1MjExMDE0LCJleHAiOjE3NjU4MTU4MTR9.v9teJMdmCAXcHxvP45dnKiLbBM6jj85KQ2K8JR5NpGo', '2025-12-15 16:23:34', '2025-12-08 16:23:27'),
	(83, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29ycmVvIjoiYWRtaW5AbmV4dGxldmVsLmNvbSIsInJvbCI6ImFkbWluIiwiaWF0IjoxNzY1MjExMjg0LCJleHAiOjE3NjU4MTYwODR9.kYUk-8slPqrqPt90OV-5NAdGsmLmaNej8VTDW6ORze4', '2025-12-15 16:28:04', '2025-12-08 16:27:57'),
	(84, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29ycmVvIjoiYWRtaW5AbmV4dGxldmVsLmNvbSIsInJvbCI6ImFkbWluIiwiaWF0IjoxNzY1MjExOTg5LCJleHAiOjE3NjU4MTY3ODl9.qgRnU8CQ3wkrTkj8YINA9FIx6bJk9cYJSedplg9Iyfw', '2025-12-15 16:39:49', '2025-12-08 16:39:43'),
	(85, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29ycmVvIjoiYWRtaW5AbmV4dGxldmVsLmNvbSIsInJvbCI6ImFkbWluIiwiaWF0IjoxNzY1MjEyMjY1LCJleHAiOjE3NjU4MTcwNjV9.hTEHTsJlz1lEXjqujZt4ApVa2mRaDQEBq9wfmSpS34s', '2025-12-15 16:44:25', '2025-12-08 16:44:18'),
	(86, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29ycmVvIjoiYWRtaW5AbmV4dGxldmVsLmNvbSIsInJvbCI6ImFkbWluIiwiaWF0IjoxNzY1MjEyMjczLCJleHAiOjE3NjU4MTcwNzN9.z1SfHdNzPSQdvG5wz2cpEPjoAinG7VAV4pj8K-l-ZsE', '2025-12-15 16:44:33', '2025-12-08 16:44:27'),
	(87, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29ycmVvIjoiYWRtaW5AbmV4dGxldmVsLmNvbSIsInJvbCI6ImFkbWluIiwiaWF0IjoxNzY1MjEyMjc4LCJleHAiOjE3NjU4MTcwNzh9.59zpDYUtwn8OvLYL-xOuxDgpUH0LmNwiV95dDXTgjpU', '2025-12-15 16:44:38', '2025-12-08 16:44:31'),
	(88, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29ycmVvIjoiYWRtaW5AbmV4dGxldmVsLmNvbSIsInJvbCI6ImFkbWluIiwiaWF0IjoxNzY1MjEzMjAyLCJleHAiOjE3NjU4MTgwMDJ9.ee_nlkh5C3QcQI8OXbYReIt9p5ov_R_Go4r16Ha_0yg', '2025-12-15 17:00:02', '2025-12-08 16:59:56'),
	(89, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29ycmVvIjoiYWRtaW5AbmV4dGxldmVsLmNvbSIsInJvbCI6ImFkbWluIiwiaWF0IjoxNzY1MjE0MzEzLCJleHAiOjE3NjU4MTkxMTN9.-b3S2t0Cje24QMsnjK7giUidCMWS9s1-eTt692__bQA', '2025-12-15 17:18:33', '2025-12-08 17:18:26'),
	(90, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29ycmVvIjoiYWRtaW5AbmV4dGxldmVsLmNvbSIsInJvbCI6ImFkbWluIiwiaWF0IjoxNzY1MjE0NTkxLCJleHAiOjE3NjU4MTkzOTF9.Nknft6SuO0RkGuGysorIsKFhxzUtfutVurnzHEZaLYc', '2025-12-15 17:23:11', '2025-12-08 17:23:04'),
	(91, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiY29ycmVvIjoianVhbi5wZXJlekBlbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY1MjE0NjEzLCJleHAiOjE3NjU4MTk0MTN9.xtOYIQmtCgWyFdzcz_aKUXd_UcyATHZv4OP9lrtTfmM', '2025-12-15 17:23:33', '2025-12-08 17:23:26'),
	(92, 6, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiY29ycmVvIjoibHVpcy5oZXJuYW5kZXpAZW1haWwuY29tIiwicm9sIjoiZW1wbGVhZG8iLCJpYXQiOjE3NjUyMTQ2MjYsImV4cCI6MTc2NTgxOTQyNn0.1mnYUOr8OU3faRDTSB56vi-bzbZi1WD_5_f9QaV-0Q0', '2025-12-15 17:23:46', '2025-12-08 17:23:39'),
	(93, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29ycmVvIjoiYWRtaW5AbmV4dGxldmVsLmNvbSIsInJvbCI6ImFkbWluIiwiaWF0IjoxNzY1MjE0NjYxLCJleHAiOjE3NjU4MTk0NjF9.Gl1FhJmYV4fwTCZH0MHTVZJ1UHif9ZmaAN6sAmSldAs', '2025-12-15 17:24:21', '2025-12-08 17:24:14'),
	(94, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiY29ycmVvIjoianVhbi5wZXJlekBlbWFpbC5jb20iLCJyb2wiOiJlbXBsZWFkbyIsImlhdCI6MTc2NTIxNTIzNSwiZXhwIjoxNzY1ODIwMDM1fQ.aQye5aCrk_g8jTBNoVxgvfkYkTdjZlAG0UZ0uhdo7g8', '2025-12-15 17:33:55', '2025-12-08 17:33:49'),
	(95, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiY29ycmVvIjoianVhbi5wZXJlekBlbWFpbC5jb20iLCJyb2wiOiJlbXBsZWFkbyIsImlhdCI6MTc2NTIxNTI1MSwiZXhwIjoxNzY1ODIwMDUxfQ.cTsGoZfEWKoT9sIlNk02fqPRCtvOROzBFta2SrpfvTI', '2025-12-15 17:34:11', '2025-12-08 17:34:05'),
	(96, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29ycmVvIjoiYWRtaW5AbmV4dGxldmVsLmNvbSIsInJvbCI6ImFkbWluIiwiaWF0IjoxNzY1MjE1NjAyLCJleHAiOjE3NjU4MjA0MDJ9.yVWhO_JmUnd1t6hUX7fLGhJuzq5wVMUR1Mwmvh_P1j0', '2025-12-15 17:40:02', '2025-12-08 17:39:56'),
	(97, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29ycmVvIjoiYWRtaW5AbmV4dGxldmVsLmNvbSIsInJvbCI6ImFkbWluIiwiaWF0IjoxNzY1MjE1ODQxLCJleHAiOjE3NjU4MjA2NDF9.MPOsbdpmK0QMPOPirXP_o6pjWHfV9CHqVGqIh4K3MvQ', '2025-12-15 17:44:01', '2025-12-08 17:43:55'),
	(98, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29ycmVvIjoiYWRtaW5AbmV4dGxldmVsLmNvbSIsInJvbCI6ImFkbWluIiwiaWF0IjoxNzY1MjE1ODU1LCJleHAiOjE3NjU4MjA2NTV9.Rd5u_lRtIf1wO8IysUQ08oBRlNW5RYj7kfnMp_d-ky0', '2025-12-15 17:44:15', '2025-12-08 17:44:09'),
	(99, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29ycmVvIjoiYWRtaW5AbmV4dGxldmVsLmNvbSIsInJvbCI6ImFkbWluIiwiaWF0IjoxNzY1MjE1ODc4LCJleHAiOjE3NjU4MjA2Nzh9.-pojXHU40pLL7Bj5W2IPEooamHA3CkojMnpORqzfbMg', '2025-12-15 17:44:38', '2025-12-08 17:44:31'),
	(100, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29ycmVvIjoiYWRtaW5AbmV4dGxldmVsLmNvbSIsInJvbCI6ImFkbWluIiwiaWF0IjoxNzY1MjE1ODg5LCJleHAiOjE3NjU4MjA2ODl9._chjmKzQSnOyE9NAk7yzuikU4r5icf-wS8gQjBq4YYE', '2025-12-15 17:44:49', '2025-12-08 17:44:43'),
	(101, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29ycmVvIjoiYWRtaW5AbmV4dGxldmVsLmNvbSIsInJvbCI6ImFkbWluIiwiaWF0IjoxNzY1MjE1OTA2LCJleHAiOjE3NjU4MjA3MDZ9.l13PZww84yOl0NoMwbWZPqTNdvUmhEisP3XphvJnV3o', '2025-12-15 17:45:06', '2025-12-08 17:44:59'),
	(102, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29ycmVvIjoiYWRtaW5AbmV4dGxldmVsLmNvbSIsInJvbCI6ImFkbWluIiwiaWF0IjoxNzY1MjE1OTE3LCJleHAiOjE3NjU4MjA3MTd9.IunPGIT43qhKpcx9T0GhNqMvN5vZwpp7u9hpd1CPkyc', '2025-12-15 17:45:17', '2025-12-08 17:45:10'),
	(103, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29ycmVvIjoiYWRtaW5AbmV4dGxldmVsLmNvbSIsInJvbCI6ImFkbWluIiwiaWF0IjoxNzY1NTg1MDAwLCJleHAiOjE3NjYxODk4MDB9.34OYT8ZRi3ex7U00kObcRm-WV10Q1BvCbFoNwTrWafY', '2025-12-20 00:16:40', '2025-12-13 00:16:40'),
	(104, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29ycmVvIjoiYWRtaW5AbmV4dGxldmVsLmNvbSIsInJvbCI6ImFkbWluIiwiaWF0IjoxNzY1ODQ0Njc5LCJleHAiOjE3NjY0NDk0Nzl9.0Go5RjTaeT0XW9jlNYBE9TrGsdpQGXJaa7I2It7EOYM', '2025-12-23 00:24:39', '2025-12-16 00:24:35'),
	(105, 6, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiY29ycmVvIjoibHVpcy5oZXJuYW5kZXpAZW1haWwuY29tIiwicm9sIjoiZW1wbGVhZG8iLCJpYXQiOjE3NjU4NDgwMTQsImV4cCI6MTc2NjQ1MjgxNH0.Hl6VsrlSb2IBdZB2lAIuqMxKJBGbyeFNRn9kjjQkTnY', '2025-12-23 01:20:14', '2025-12-16 01:20:10'),
	(106, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiY29ycmVvIjoianVhbi5wZXJlekBlbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY1ODQ4MDI3LCJleHAiOjE3NjY0NTI4Mjd9.LuL1ViveEOYAstB82vlRpUuydttVpVkgdSMC665ZxRU', '2025-12-23 01:20:27', '2025-12-16 01:20:23'),
	(107, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29ycmVvIjoiYWRtaW5AbmV4dGxldmVsLmNvbSIsInJvbCI6ImFkbWluIiwiaWF0IjoxNzY1ODQ4MTIyLCJleHAiOjE3NjY0NTI5MjJ9.xVi_P0e2y_58XbYue7KiELHvXRbyAH0NGxoJPcf5VFw', '2025-12-23 01:22:02', '2025-12-16 01:21:57'),
	(108, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiY29ycmVvIjoianVhbi5wZXJlekBlbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY1ODQ4MTgzLCJleHAiOjE3NjY0NTI5ODN9.8tMhMF-Tglu1BCJQc7sZyIv-STis7eR_8srAUTqQFuI', '2025-12-23 01:23:03', '2025-12-16 01:23:03'),
	(109, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiY29ycmVvIjoibWFjaG9hbmRyZXMxMkBnbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY1OTg3MjQyLCJleHAiOjE3NjY1OTIwNDJ9.7vl7n3F9rDxbdF8upUk74kw5RKcqOYSjUsRmR6JWqM8', '2025-12-24 16:00:42', '2025-12-17 16:00:51'),
	(110, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiY29ycmVvIjoibWFjaG9hbmRyZXMxMkBnbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY1OTg3ODU2LCJleHAiOjE3NjY1OTI2NTZ9.6dFEjvsL0yTRd0voBDJ2rwJebUIt5ESc5WEMy8YutBY', '2025-12-24 16:10:56', '2025-12-17 16:11:05'),
	(111, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiY29ycmVvIjoibWFjaG9hbmRyZXMxMkBnbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY1OTkxNTk1LCJleHAiOjE3NjY1OTYzOTV9.JvnpaWOCNJSo8Y6i1RBKq3U_ZvHyMD4vEHPllaOhsZA', '2025-12-24 17:13:15', '2025-12-17 17:13:25'),
	(112, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiY29ycmVvIjoibWFjaG9hbmRyZXMxMkBnbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY1OTkyNTUwLCJleHAiOjE3NjY1OTczNTB9.BJmvUTKjBdOXQwLhUVpwyFV4bd_IfWridhzB6HADRoc', '2025-12-24 17:29:10', '2025-12-17 17:29:19'),
	(113, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiY29ycmVvIjoibWFjaG9hbmRyZXMxMkBnbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY1OTkzMDk1LCJleHAiOjE3NjY1OTc4OTV9.Esho-6NvBGogTuNIOrfQ4HiRcS-oQc95QZbVcjZyJzk', '2025-12-24 17:38:15', '2025-12-17 17:38:25'),
	(114, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiY29ycmVvIjoibWFjaG9hbmRyZXMxMkBnbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY1OTkzMTU2LCJleHAiOjE3NjY1OTc5NTZ9.cJW0GnLT6OYsAeYQRVkKjtWqn0pUTM-_E2BEpMtTU-E', '2025-12-24 17:39:16', '2025-12-17 17:39:25'),
	(115, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiY29ycmVvIjoibWFjaG9hbmRyZXMxMkBnbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY1OTk3OTUzLCJleHAiOjE3NjY2MDI3NTN9.ZB5HtSa-7clpG3H_Fjk1l0lTOGRzuXYXaZx_BcMa6Fs', '2025-12-24 18:59:13', '2025-12-17 18:59:23'),
	(116, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiY29ycmVvIjoibWFjaG9hbmRyZXMxMkBnbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY1OTk4OTMyLCJleHAiOjE3NjY2MDM3MzJ9.g9_acBVi6LWbnc-7USIfVVyM6Q___9LCyprMIPpzl5M', '2025-12-24 19:15:32', '2025-12-17 19:15:42'),
	(117, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiY29ycmVvIjoibWFjaG9hbmRyZXMxMkBnbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY1OTk5MTM2LCJleHAiOjE3NjY2MDM5MzZ9.x-h2hdWu13IF07YQJzWGA1du91IK5Svm9V_Woj6_52Q', '2025-12-24 19:18:56', '2025-12-17 19:19:06'),
	(118, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiY29ycmVvIjoibWFjaG9hbmRyZXMxMkBnbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY1OTk5MzA5LCJleHAiOjE3NjY2MDQxMDl9.ZiLj_HnAxe-CJNXmfauw4hEb5hfhnZpOhV0WhET6mDg', '2025-12-24 19:21:49', '2025-12-17 19:21:59'),
	(119, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiY29ycmVvIjoibWFjaG9hbmRyZXMxMkBnbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY2MDAwMjc1LCJleHAiOjE3NjY2MDUwNzV9.tVGtUjhiouyueFv2FKKMF7b02FgBrH9cNng5LHsFPqk', '2025-12-24 19:37:55', '2025-12-17 19:38:05'),
	(120, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiY29ycmVvIjoibWFjaG9hbmRyZXMxMkBnbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY2MDAwNTA2LCJleHAiOjE3NjY2MDUzMDZ9.-WgR4e8kbBwDWjD6aj0nXGKoNR9pq0N8pERVepk649Q', '2025-12-24 19:41:46', '2025-12-17 19:41:56'),
	(121, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiY29ycmVvIjoibWFjaG9hbmRyZXMxMkBnbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY2MDAwNTg3LCJleHAiOjE3NjY2MDUzODd9.0DuMykIsi37k6_uA5jLT8pFxArjTB65bgENBlHtpM1Q', '2025-12-24 19:43:07', '2025-12-17 19:43:17'),
	(122, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiY29ycmVvIjoibWFjaG9hbmRyZXMxMkBnbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY2MDAxMTIwLCJleHAiOjE3NjY2MDU5MjB9.PZeRlxvKhLtY4xawpoOrUCM7JqlvSA6p7Pq1pi0cZII', '2025-12-24 19:52:00', '2025-12-17 19:52:10'),
	(123, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiY29ycmVvIjoibWFjaG9hbmRyZXMxMkBnbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY2MDAxNTEyLCJleHAiOjE3NjY2MDYzMTJ9.8b40BUFcBD9P_icCb7JUcu-KtkmFFLHNi0aoJdA1FXI', '2025-12-24 19:58:32', '2025-12-17 19:58:41'),
	(125, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiY29ycmVvIjoianVhbi5wZXJlekBlbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY2MDAxODg0LCJleHAiOjE3NjY2MDY2ODR9.9rg0kHj3x2kZgiXW78boyfzZj63nQaXtkCIgIyGslOA', '2025-12-24 20:04:44', '2025-12-17 20:04:36'),
	(126, 12, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIsImNvcnJlbyI6ImNhcmFjb2xlc2NvbG9yZXNAZ21haWwuY29tIiwicm9sIjoiY2xpZW50ZSIsImlhdCI6MTc2NjAwMTk3MCwiZXhwIjoxNzY2NjA2NzcwfQ.aZmmhR__2W6iAm168pXs33RkGiUBVCF6qoViTWWxIx0', '2025-12-24 20:06:10', '2025-12-17 20:06:11'),
	(127, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiY29ycmVvIjoibWFjaG9hbmRyZXMxMkBnbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY2MDAxOTk0LCJleHAiOjE3NjY2MDY3OTR9.noSvkqv5ILhcf7WfEJ42_rz9z9RkCS_nQv5xZ_Ji4_E', '2025-12-24 20:06:34', '2025-12-17 20:06:43'),
	(128, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiY29ycmVvIjoianVhbi5wZXJlekBlbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY2MDAyMDg1LCJleHAiOjE3NjY2MDY4ODV9.naIV2qY5hirVMt9OZQZ4Pkq9FC3SQtN6LknsxrYHf04', '2025-12-24 20:08:05', '2025-12-17 20:08:05'),
	(129, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiY29ycmVvIjoianVhbi5wZXJlekBlbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY2MDAyMTQ0LCJleHAiOjE3NjY2MDY5NDR9.BJHJQ0s5_x_kXSb4ui5P04mQoxoMUMpI2AAaHywozTM', '2025-12-24 20:09:04', '2025-12-17 20:08:56'),
	(130, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiY29ycmVvIjoianVhbi5wZXJlekBlbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY2MDAyMjc0LCJleHAiOjE3NjY2MDcwNzR9.oy83M4HE9eYpIGF8mDTi9vf3uZF-CVOpCo1LwELz1ys', '2025-12-24 20:11:14', '2025-12-17 20:11:06'),
	(131, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiY29ycmVvIjoianVhbi5wZXJlekBlbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY2MDAyNDQyLCJleHAiOjE3NjY2MDcyNDJ9.rB0hCwf_FZA9ooT0Pi4DEvo3qLE6op3Dk-drvJ1WSJA', '2025-12-24 20:14:02', '2025-12-17 20:13:54'),
	(132, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiY29ycmVvIjoibWFjaG9hbmRyZXMxMkBnbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY2MDAyNzM1LCJleHAiOjE3NjY2MDc1MzV9.pUzrxmCXmyLn1V4cea7Elzk_qXataPyRsofsxYaD5vE', '2025-12-24 20:18:55', '2025-12-17 20:19:05'),
	(133, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiY29ycmVvIjoianVhbi5wZXJlekBlbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY2MDAzMDg5LCJleHAiOjE3NjY2MDc4ODl9.fkZxH7KCG8s-ltOD-gmtAnUq7jQbq3e_rLCr-U4TJ_E', '2025-12-24 20:24:49', '2025-12-17 20:24:42'),
	(134, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiY29ycmVvIjoibWFjaG9hbmRyZXMxMkBnbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY2MDAzNDAwLCJleHAiOjE3NjY2MDgyMDB9.a4Ih25NaqSkiZtz1zLPttjCtvLtzRLi030ooliHFmBU', '2025-12-24 20:30:00', '2025-12-17 20:30:09'),
	(135, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiY29ycmVvIjoibWFjaG9hbmRyZXMxMkBnbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY2MDA2NjAzLCJleHAiOjE3NjY2MTE0MDN9.WnJBY2PNITVEaBNpBytbtIPwFSQ3sIx2PeGAjOQaD-A', '2025-12-24 21:23:23', '2025-12-17 21:23:32'),
	(136, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiY29ycmVvIjoianVhbi5wZXJlekBlbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY2MDEwNjczLCJleHAiOjE3NjY2MTU0NzN9.T_TpdkBo_A5Me8Qi_AhzkhmSUWWXM-2tuuOxgE9XreE', '2025-12-24 22:31:13', '2025-12-17 22:31:06'),
	(137, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiY29ycmVvIjoibWFjaG9hbmRyZXMxMkBnbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY2MDExMDE3LCJleHAiOjE3NjY2MTU4MTd9.G-I9wk3jsgZmc976v9wHTH5ofxeZJfGoqEfLDV5TZ5I', '2025-12-24 22:36:57', '2025-12-17 22:37:06'),
	(138, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29ycmVvIjoiYWRtaW5AbmV4dGxldmVsLmNvbSIsInJvbCI6ImFkbWluIiwiaWF0IjoxNzY2MDExMTE3LCJleHAiOjE3NjY2MTU5MTd9.YtOM2QA0oMLV_1PTk3GZ2qJA1RKvkg4DJC4mKAhpR7A', '2025-12-24 22:38:37', '2025-12-17 22:38:30'),
	(139, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiY29ycmVvIjoibWFjaG9hbmRyZXMxMkBnbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY2MDExMjEyLCJleHAiOjE3NjY2MTYwMTJ9.8jZBlmIaVo6cJTo8uK6ktGpHQgWlrjnA5459yQo4XGA', '2025-12-24 22:40:12', '2025-12-17 22:40:21'),
	(140, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiY29ycmVvIjoianVhbi5wZXJlekBlbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY2MDEyNjQyLCJleHAiOjE3NjY2MTc0NDJ9.eUxkA_iQKyXHlpytri0dRkGin8Su3fgJtCYRWRzFsZc', '2025-12-24 23:04:02', '2025-12-17 23:03:55'),
	(141, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29ycmVvIjoiYWRtaW5AbmV4dGxldmVsLmNvbSIsInJvbCI6ImFkbWluIiwiaWF0IjoxNzY4NDM4NjkzLCJleHAiOjE3NjkwNDM0OTN9.h43P4aBjPdLruX7eEsMlhy0uZ4CfkvLauPG74QP05ps', '2026-01-22 00:58:13', '2026-01-15 00:57:42'),
	(142, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29ycmVvIjoiYWRtaW5AbmV4dGxldmVsLmNvbSIsInJvbCI6ImFkbWluIiwiaWF0IjoxNzY4NDM5MTA4LCJleHAiOjE3NjkwNDM5MDh9.xPJU9FncuUhL5o7LvYF3iDuvyX6hHAeVmd9IlK44tRs', '2026-01-22 01:05:08', '2026-01-15 01:04:37'),
	(143, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29ycmVvIjoiYWRtaW5AbmV4dGxldmVsLmNvbSIsInJvbCI6ImFkbWluIiwiaWF0IjoxNzY4NDM5Mjg1LCJleHAiOjE3NjkwNDQwODV9.DNZxN5v5uJ0AmnorfaBXbEvvPXaCYwFgjuX2vEdPq18', '2026-01-22 01:08:05', '2026-01-15 01:07:34'),
	(144, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiY29ycmVvIjoianVhbi5wZXJlekBlbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzY4NDM5NDc3LCJleHAiOjE3NjkwNDQyNzd9.IDHaIaPmNfctuXcCqI7m9bB54Z-FXbLf8kECWWsou9k', '2026-01-22 01:11:17', '2026-01-15 01:10:46'),
	(145, 13, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMsImNvcnJlbyI6ImFuZEBnbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzcxNjIwNjQwLCJleHAiOjE3NzIyMjU0NDB9.umy45gQGdilHFi9vOtHFqsItVB5IYOz_VKWak8VIEpw', '2026-02-27 20:50:40', '2026-02-20 20:50:40'),
	(146, 13, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMsImNvcnJlbyI6ImFuZEBnbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzcxNjIzNTY3LCJleHAiOjE3NzIyMjgzNjd9.MmUy7q6ljGBPsURvqsvZd1jZol140SnFwqaPzAyHo-M', '2026-02-27 21:39:27', '2026-02-20 21:39:31'),
	(147, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiY29ycmVvIjoianVhbi5wZXJlekBlbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzcxNjIzNjA2LCJleHAiOjE3NzIyMjg0MDZ9.0zcHZw4JDThoroSE0poe2GosXfbWJ1KF26tLh5rWmcY', '2026-02-27 21:40:06', '2026-02-20 21:40:05'),
	(148, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29ycmVvIjoiYWRtaW5AbmV4dGxldmVsLmNvbSIsInJvbCI6ImFkbWluIiwiaWF0IjoxNzcxNjIzNzc1LCJleHAiOjE3NzIyMjg1NzV9.v0qD2T8_raZddOuMKTcZdia8Eexj1Ir7TRkSBsrPcvU', '2026-02-27 21:42:55', '2026-02-20 21:42:53'),
	(149, 14, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImNvcnJlbyI6Im1haWtsZW8yMDE5QGdtYWlsLmNvbSIsInJvbCI6ImNsaWVudGUiLCJpYXQiOjE3NzE2MjM4MTMsImV4cCI6MTc3MjIyODYxM30.8hwZs7Ug2FtpPRHwOiUsc1g1IsvUl29taq7Jq_wdsb4', '2026-02-27 21:43:33', '2026-02-20 21:43:38'),
	(150, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiY29ycmVvIjoianVhbi5wZXJlekBlbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzcxNjIzODkxLCJleHAiOjE3NzIyMjg2OTF9.5sdJpI7XkeERGglvuIe8dNw9AHqLG7aL8g4mvaGIcMU', '2026-02-27 21:44:51', '2026-02-20 21:44:51'),
	(151, 14, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImNvcnJlbyI6Im1haWtsZW8yMDE5QGdtYWlsLmNvbSIsInJvbCI6ImFkbWluIiwiaWF0IjoxNzcxNjIzOTczLCJleHAiOjE3NzIyMjg3NzN9.wX7Dnf3ihx36MXVzvGbC1c8nDibZob0XTudHtUWPaLo', '2026-02-27 21:46:13', '2026-02-20 21:46:18'),
	(152, 14, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImNvcnJlbyI6Im1haWtsZW8yMDE5QGdtYWlsLmNvbSIsInJvbCI6ImFkbWluIiwiaWF0IjoxNzcxNjI0ODUzLCJleHAiOjE3NzIyMjk2NTN9.Lkale-eP65fuI0pdj8U5hgISUnOeBSIiJf2elL5ZlLM', '2026-02-27 22:00:53', '2026-02-20 22:00:57'),
	(153, 15, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTUsImNvcnJlbyI6InZpZWpvY2FjaG9uZG9AZ21haWwuY29tIiwicm9sIjoiY2xpZW50ZSIsImlhdCI6MTc3MTYyNDkwNywiZXhwIjoxNzcyMjI5NzA3fQ.WbApFUBQRT9oTcM667QVxIGrQOuQi8zpNoecte3L_-E', '2026-02-27 22:01:47', '2026-02-20 22:01:52'),
	(154, 16, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTYsImNvcnJlbyI6InBlcmV6MjBAZ21haWwuY29tIiwicm9sIjoiY2xpZW50ZSIsImlhdCI6MTc3MTYzMzg5MiwiZXhwIjoxNzcyMjM4NjkyfQ.akHWNNHADOCNuQVxB4W_4Zzv3oA6JvZ9GqA-8ThSYBo', '2026-02-28 00:31:32', '2026-02-21 00:31:32'),
	(155, 15, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTUsImNvcnJlbyI6InZpZWpvY2FjaG9uZG9AZ21haWwuY29tIiwicm9sIjoiY2xpZW50ZSIsImlhdCI6MTc3MjIzNzYxOCwiZXhwIjoxNzcyODQyNDE4fQ.Y8N5H-9XgcSysYBKNraEKoYXc3hqC2E2WyHa8nDOQQU', '2026-03-07 00:13:38', '2026-02-28 00:13:40'),
	(156, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiY29ycmVvIjoibWFjaG9hbmRyZXMxMkBnbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzcyMjQwMTE5LCJleHAiOjE3NzI4NDQ5MTl9.GC2WFQRyrDbqZzuLzieeOWRSMSC9ntuCwRDfd0K9IWc', '2026-03-07 00:55:19', '2026-02-28 00:55:24'),
	(157, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiY29ycmVvIjoianVhbi5wZXJlekBlbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzcyMjQwNjUwLCJleHAiOjE3NzI4NDU0NTB9.HGMK9Yl9LzbEjM52E-St3drYXbvOnCYM_078CfDS-bo', '2026-03-07 01:04:10', '2026-02-28 01:04:10'),
	(158, 17, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsImNvcnJlbyI6InBydWViYUBnbWFpbC5jb20iLCJyb2wiOiJjbGllbnRlIiwiaWF0IjoxNzcyMjQxMjQ2LCJleHAiOjE3NzI4NDYwNDZ9.VVw9lVI02q5b2c_0v9_dU0AqBwke6gtWAGj1m1qA5RU', '2026-03-07 01:14:06', '2026-02-28 01:14:11'),
	(159, 18, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTgsImNvcnJlbyI6InByQGdtYWlsLmNvbSIsInJvbCI6ImNsaWVudGUiLCJpYXQiOjE3NzIyNDIyNTUsImV4cCI6MTc3Mjg0NzA1NX0.-xEmp1aNNVt69B8FKwJ2AwsxNqR71sOS1nj4zjfGVK0', '2026-03-07 01:30:55', '2026-02-28 01:31:01'),
	(160, 19, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTksImNvcnJlbyI6IjEyQGdtYWlsLmNvbSIsInJvbCI6ImNsaWVudGUiLCJpYXQiOjE3NzIyNDMwOTksImV4cCI6MTc3Mjg0Nzg5OX0.nBSmJfR-CBPZE24HrSHfdlKWoqqeUrsKJgSqVZVagOg', '2026-03-07 01:44:59', '2026-02-28 01:45:05');

-- Dumping structure for table nextlevel.roles
CREATE TABLE IF NOT EXISTS `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table nextlevel.roles: ~3 rows (approximately)
INSERT INTO `roles` (`id`, `nombre`) VALUES
	(1, 'admin'),
	(2, 'cliente'),
	(3, 'empleado');

-- Dumping structure for table nextlevel.servicios
CREATE TABLE IF NOT EXISTS `servicios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `precio` decimal(12,2) NOT NULL,
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `imagen_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `activo` tinyint(1) DEFAULT '1',
  `tipo` enum('basico','avanzado') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'basico',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table nextlevel.servicios: ~5 rows (approximately)
INSERT INTO `servicios` (`id`, `nombre`, `precio`, `descripcion`, `imagen_url`, `activo`, `tipo`) VALUES
	(1, 'Mantenimiento Preventivo PC', 45000.00, 'Limpieza profunda y optimización básica. Servicio completo de limpieza física interna y externa, cambio de pasta térmica, organización de cables y optimización básica del sistema operativo para mejorar el rendimiento y prevenir sobrecalentamiento.', 'https://hardzone.es/app/uploads-hardzone.es/2020/05/Mantenimiento-PC.jpg', 1, 'basico'),
	(2, 'Upgrade de Hardware (RAM/SSD)', 35000.00, 'Instalación profesional de componentes. Instalación segura de memoria RAM o discos de estado sólido (SSD). Incluye verificación de compatibilidad, instalación física, configuración en BIOS y formateo/clonación de disco si es necesario.', 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80', 1, 'basico'),
	(3, 'Ensamble de PC Gamer / Workstation', 120000.00, 'Armado profesional con gestión de cables premium. Servicio premium de ensamble de computadoras pieza por pieza. Incluye gestión de cables profesional (cable management), configuración de flujo de aire, actualización de BIOS, instalación de drivers y pruebas de estrés (benchmarks) para asegurar estabilidad.', 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80', 1, 'avanzado'),
	(4, 'Diagnóstico y Reparación de Hardware', 60000.00, 'Detección de fallas complejas y reparación. Diagnóstico exhaustivo para equipos que no encienden, dan pantallazos azules o se reinician. Incluye pruebas de voltaje, testeo de componentes individuales y reparación electrónica básica o reemplazo de partes dañadas.', 'https://thumbs.dreamstime.com/b/computadora-de-diagn%C3%B3stico-hardware-mantenimiento-inform%C3%A1tico-ingeniero-masculino-desmontando-port%C3%A1til-166007367.jpg', 1, 'avanzado'),
	(5, 'Mantenimiento Preventivo', 50000.00, 'Limpieza y cambio de pasta térmica', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNPhf9othT2IUIcZ0vashSI8NVrx0n9uv3Rw&s', 1, 'basico');

-- Dumping structure for table nextlevel.servicio_imagenes
CREATE TABLE IF NOT EXISTS `servicio_imagenes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `servicio_id` int NOT NULL,
  `url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Image URL or path',
  `alt_text` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Alt text for SEO and accessibility',
  `orden` int DEFAULT '0' COMMENT 'Display order (0 = first)',
  `es_principal` tinyint(1) DEFAULT '0' COMMENT 'Is this the main/featured image?',
  `activo` tinyint(1) DEFAULT '1' COMMENT 'Soft delete flag',
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `servicio_id` (`servicio_id`),
  KEY `idx_servicio_activo` (`servicio_id`,`activo`),
  KEY `idx_servicio_orden` (`servicio_id`,`orden`),
  KEY `idx_principal` (`servicio_id`,`es_principal`),
  CONSTRAINT `servicio_imagenes_ibfk_1` FOREIGN KEY (`servicio_id`) REFERENCES `servicios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Gallery images for services';

-- Dumping data for table nextlevel.servicio_imagenes: ~10 rows (approximately)
INSERT INTO `servicio_imagenes` (`id`, `servicio_id`, `url`, `alt_text`, `orden`, `es_principal`, `activo`, `fecha_creacion`, `fecha_actualizacion`) VALUES
	(1, 1, 'https://hardzone.es/app/uploads-hardzone.es/2020/05/Mantenimiento-PC.jpg', 'Limpieza de ventiladores', 1, 1, 1, '2025-11-27 20:27:49', '2025-12-16 00:36:14'),
	(2, 1, 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80', 'Aplicación de pasta térmica', 2, 0, 1, '2025-11-27 20:27:49', '2025-11-27 20:27:49'),
	(3, 1, 'https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?w=800&q=80', 'PC limpio finalizado', 3, 0, 1, '2025-11-27 20:27:49', '2025-11-27 20:27:49'),
	(4, 2, 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80', 'Instalación de RAM', 1, 1, 1, '2025-11-27 20:27:56', '2025-11-27 20:27:56'),
	(5, 2, 'https://images.unsplash.com/photo-1555618554-4166b33ce684?w=800&q=80', 'Disco SSD NVMe', 2, 0, 1, '2025-11-27 20:27:56', '2025-11-27 20:27:56'),
	(6, 3, 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80', 'PC Gamer RGB', 1, 1, 1, '2025-11-27 20:28:03', '2025-11-27 20:28:03'),
	(7, 3, 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&q=80', 'Gestión de cables', 2, 0, 1, '2025-11-27 20:28:03', '2025-11-27 20:28:03'),
	(8, 3, 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&q=80', 'Setup finalizado', 3, 0, 1, '2025-11-27 20:28:03', '2025-11-27 20:28:03'),
	(9, 4, 'https://thumbs.dreamstime.com/b/computadora-de-diagn%C3%B3stico-hardware-mantenimiento-inform%C3%A1tico-ingeniero-masculino-desmontando-port%C3%A1til-166007367.jpg', 'Técnico reparando placa', 1, 1, 1, '2025-11-27 20:28:09', '2025-12-16 00:38:44'),
	(10, 4, 'https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?w=800&q=80', 'Multímetro y herramientas', 2, 0, 1, '2025-11-27 20:28:09', '2025-11-27 20:28:09');

-- Dumping structure for table nextlevel.usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `apellido` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `correo` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `hash_password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `rol_id` int DEFAULT NULL,
  `estado` enum('activo','inactivo') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'activo',
  `bibliografia` text COLLATE utf8mb4_general_ci,
  `foto_perfil` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `username` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `correo` (`correo`),
  UNIQUE KEY `username` (`username`),
  KEY `rol_id` (`rol_id`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table nextlevel.usuarios: ~16 rows (approximately)
INSERT INTO `usuarios` (`id`, `nombre`, `apellido`, `correo`, `hash_password`, `rol_id`, `estado`, `bibliografia`, `foto_perfil`, `username`, `created_at`) VALUES
	(1, 'Admin', 'Sistema', 'admin@nextlevel.com', '$2b$10$6XSEjTXTVECb/bk62kBOcum7m4/ATUwGx0.SS6uCptlxHeDphChny', 1, 'activo', NULL, NULL, NULL, '2026-02-28 01:22:30'),
	(2, 'sebastian', 'Pémmmm', 'juan.perez@email.com', '$2b$10$6XSEjTXTVECb/bk62kBOcum7m4/ATUwGx0.SS6uCptlxHeDphChny', 2, 'activo', NULL, NULL, NULL, '2026-02-28 01:22:30'),
	(3, 'María', 'González', 'maria.gonzalez@email.com', '$2b$10$6XSEjTXTVECb/bk62kBOcum7m4/ATUwGx0.SS6uCptlxHeDphChny', 2, 'activo', NULL, NULL, NULL, '2026-02-28 01:22:30'),
	(6, 'Luis', 'Hernández', 'luis.hernandez@email.com', '$2b$10$6XSEjTXTVECb/bk62kBOcum7m4/ATUwGx0.SS6uCptlxHeDphChny', 3, 'activo', NULL, NULL, NULL, '2026-02-28 01:22:30'),
	(7, 'nia', 'Pereira', 'nia@stripe.com', '$2b$10$/9j29A4BahwOrqtQMS9S2.nzZ1dVCC22qGWiEQnJbGqYHVW6IvWd6', 2, 'activo', NULL, NULL, NULL, '2026-02-28 01:22:30'),
	(8, 'andres', 'pro xd', 'machoandres12@gmail.com', '$2b$10$ykm0C3AN47M8OQFToOR3y.INonN7OSNa/UsnN1peOTQS.cWwJyrAi', 2, 'activo', 'Entusiasta de la tecnología y el hardware. xddd', '/uploads/avatares/avatar-8-1765062378731-18635285.png', NULL, '2026-02-28 01:22:30'),
	(9, 'keiner', 'tez', 'tesito@gmail.com', '$2b$10$KTiUc/g7fPTLTwSOZskVje32hJH6KARi2NJnvspCnuaQY.5DZ/Aoi', 2, 'activo', NULL, NULL, NULL, '2026-02-28 01:22:30'),
	(11, 'Juan', 'Perez', 'juan@example.com', '$2b$10$jpMnfsr5UdBvAdhCLNQPkOtPlhGCDdUQiKy8kPvStC9CfYbrdDqoe', 2, 'activo', NULL, NULL, NULL, '2026-02-28 01:22:30'),
	(12, 'Leonardo', 'APCE', 'caracolescolores@gmail.com', '$2b$10$vG/bQBqInI03Da082MOaCO15KBCNbOOqZKGb3kVVdS1jAa5K3ZBgW', 2, 'activo', NULL, NULL, NULL, '2026-02-28 01:22:30'),
	(13, 'Andres', 'XD', 'and@gmail.com', '$2b$10$qGbmEM4CUDom0AUZMCnyI.LOeKfad0.P3ZqKniTjW2pIieoqsc3Ue', 2, 'activo', NULL, NULL, NULL, '2026-02-28 01:22:30'),
	(14, 'Michael', 'Apraez', 'maikleo2019@gmail.com', '$2b$10$pKzV9NJ68fvCrOLFAxe5.u5rMQgfYoknUevv0ugC0H.uPlEcPMoWS', 1, 'activo', NULL, NULL, NULL, '2026-02-28 01:22:30'),
	(15, 'Dastan', '27', 'viejocachondo@gmail.com', '$2b$10$R0j.MORtuMAjMOyCnxTV3u68k656h6FUI8s154m0tHww48MJkmFM2', 2, 'activo', NULL, NULL, NULL, '2026-02-28 01:22:30'),
	(16, 'kein', 'perez', 'perez20@gmail.com', '$2b$10$HnqQA9hcFnyBD44X3SP6Helm0cmRKtygzjWun/0WBl4bpsOAgUMh.', 2, 'activo', NULL, NULL, NULL, '2026-02-28 01:22:30'),
	(17, 'prueba', '1', 'prueba@gmail.com', '$2b$10$jUWdYOXCG7S4W754uBrqTefflnf7WN/C5XT/keqHOy.Cb6NQXwJQ2', 2, 'activo', NULL, NULL, NULL, '2026-02-28 01:22:30'),
	(18, 'prueba', '2', 'pr@gmail.com', '$2b$10$0yM9wyOB75ZVxwyiV.WXku8.JlRIh4sr9f3zQfD3MJWsDvZphdRha', 2, 'activo', NULL, NULL, NULL, '2026-02-28 01:30:45'),
	(19, '12', '22', '12@gmail.com', '$2b$10$n2HHN3w4JE6XU4cb23UPu.HjPkfjZNr7R5aQQweOIJ7sFQ5I.3ksu', 2, 'activo', NULL, NULL, NULL, '2026-02-28 01:44:52');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
