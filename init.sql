-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.4.32-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
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
CREATE DATABASE IF NOT EXISTS `nextlevel` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `nextlevel`;

-- Dumping structure for table nextlevel.categorias
CREATE TABLE IF NOT EXISTS `categorias` (
                                            `id` int(11) NOT NULL AUTO_INCREMENT,
    `nombre` varchar(100) NOT NULL,
    `tipo` enum('producto','servicio') NOT NULL,
    PRIMARY KEY (`id`)
    ) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table nextlevel.estado
CREATE TABLE IF NOT EXISTS `estado` (
                                        `id` tinyint(10) NOT NULL DEFAULT 1,
    `nombre` varchar(20) NOT NULL,
    PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table nextlevel.imagenes_productos
CREATE TABLE IF NOT EXISTS `imagenes_productos` (
                                                    `id` int(11) NOT NULL AUTO_INCREMENT,
    `producto_id` int(11) NOT NULL,
    `url` varchar(255) NOT NULL,
    `es_principal` tinyint(1) DEFAULT 0,
    PRIMARY KEY (`id`),
    KEY `producto_id` (`producto_id`),
    CONSTRAINT `imagenes_productos_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table nextlevel.ordenes
CREATE TABLE IF NOT EXISTS `ordenes` (
                                         `id` int(11) NOT NULL AUTO_INCREMENT,
    `cliente_id` int(11) DEFAULT NULL,
    `tipo` enum('producto','servicio') NOT NULL,
    `numero_orden` varchar(50) NOT NULL,
    `total` decimal(12,2) DEFAULT 0.00,
    `estado_orden` enum('pendiente','procesando','completada','cancelada') DEFAULT 'pendiente',
    `estado_pago` enum('pendiente','pagado','reembolsado') DEFAULT 'pendiente',
    `created_at` timestamp NULL DEFAULT current_timestamp(),
    PRIMARY KEY (`id`),
    UNIQUE KEY `numero_orden` (`numero_orden`),
    KEY `cliente_id` (`cliente_id`),
    CONSTRAINT `ordenes_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
    ) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table nextlevel.orden_items
CREATE TABLE IF NOT EXISTS `orden_items` (
                                             `id` int(11) NOT NULL AUTO_INCREMENT,
    `orden_id` int(11) DEFAULT NULL,
    `producto_id` int(11) DEFAULT NULL,
    `tipo` enum('producto','servicio') NOT NULL,
    `descripcion` varchar(255) DEFAULT NULL,
    `cantidad` int(11) DEFAULT 1,
    `precio_unitario` decimal(12,2) DEFAULT NULL,
    `subtotal` decimal(12,2) DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `orden_id` (`orden_id`),
    KEY `producto_id` (`producto_id`),
    CONSTRAINT `orden_items_ibfk_1` FOREIGN KEY (`orden_id`) REFERENCES `ordenes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `orden_items_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
    ) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table nextlevel.productos
CREATE TABLE IF NOT EXISTS `productos` (
                                           `id` int(11) NOT NULL AUTO_INCREMENT,
    `nombre` varchar(200) NOT NULL,
    `categoria_id` int(11) NOT NULL,
    `precio_actual` decimal(12,2) NOT NULL,
    `stock` int(11) DEFAULT 0,
    `estado` tinyint(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (`id`),
    KEY `categoria_id` (`categoria_id`),
    KEY `estado` (`estado`),
    CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`),
    CONSTRAINT `productos_ibfk_2` FOREIGN KEY (`estado`) REFERENCES `estado` (`id`)
    ) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table nextlevel.roles
CREATE TABLE IF NOT EXISTS `roles` (
                                       `id` int(11) NOT NULL AUTO_INCREMENT,
    `nombre` varchar(50) NOT NULL,
    PRIMARY KEY (`id`)
    ) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table nextlevel.servicios
CREATE TABLE IF NOT EXISTS `servicios` (
                                           `id` int(11) NOT NULL AUTO_INCREMENT,
    `nombre` varchar(200) NOT NULL,
    `precio` decimal(12,2) NOT NULL,
    `descripcion` text DEFAULT NULL,
    `activo` tinyint(1) DEFAULT 1,
    `ordenes_id` int(11) DEFAULT NULL,
    `tipo` enum('basico','avanzado') DEFAULT 'basico',
    PRIMARY KEY (`id`),
    KEY `ordenes_id` (`ordenes_id`),
    CONSTRAINT `servicios_ibfk_1` FOREIGN KEY (`ordenes_id`) REFERENCES `ordenes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
    ) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table nextlevel.usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
                                          `id` int(11) NOT NULL AUTO_INCREMENT,
    `nombre` varchar(100) NOT NULL,
    `apellido` varchar(100) DEFAULT NULL,
    `correo` varchar(150) NOT NULL,
    `hash_password` varchar(255) NOT NULL,
    `rol_id` int(11) DEFAULT NULL,
    `estado` enum('activo','inactivo') DEFAULT 'activo',
    PRIMARY KEY (`id`),
    UNIQUE KEY `correo` (`correo`),
    KEY `rol_id` (`rol_id`),
    CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id`)
    ) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
