-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         10.4.32-MariaDB - mariadb.org binary distribution
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.16.0.7229
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para gestiocambios_db
CREATE DATABASE IF NOT EXISTS `gestiocambios_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `gestiocambios_db`;

-- Volcando estructura para tabla gestiocambios_db.control_calidad
CREATE TABLE IF NOT EXISTS `control_calidad` (
  `id_calidad` int(11) NOT NULL AUTO_INCREMENT,
  `id_sc` int(11) NOT NULL,
  `qa_estado` enum('Pendiente','Aprobado','Rechazado') DEFAULT 'Pendiente',
  `qa_evidencia_url` varchar(255) DEFAULT NULL,
  `qa_observaciones` text DEFAULT NULL,
  `uat_estado` enum('Pendiente','Aprobado','Rechazado') DEFAULT 'Pendiente',
  `uat_observaciones` text DEFAULT NULL,
  PRIMARY KEY (`id_calidad`),
  UNIQUE KEY `id_sc` (`id_sc`),
  CONSTRAINT `control_calidad_ibfk_1` FOREIGN KEY (`id_sc`) REFERENCES `solicitudes_cambio` (`id_sc`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla gestiocambios_db.control_calidad: ~0 rows (aproximadamente)

-- Volcando estructura para tabla gestiocambios_db.ecs_afectados
CREATE TABLE IF NOT EXISTS `ecs_afectados` (
  `id_ecs` int(11) NOT NULL AUTO_INCREMENT,
  `id_sc` int(11) NOT NULL,
  `ruta_archivo` varchar(255) NOT NULL,
  PRIMARY KEY (`id_ecs`),
  KEY `id_sc` (`id_sc`),
  CONSTRAINT `ecs_afectados_ibfk_1` FOREIGN KEY (`id_sc`) REFERENCES `solicitudes_cambio` (`id_sc`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla gestiocambios_db.ecs_afectados: ~2 rows (aproximadamente)
INSERT INTO `ecs_afectados` (`id_ecs`, `id_sc`, `ruta_archivo`) VALUES
	(1, 1, '/src/controllers/biometricController.js'),
	(2, 1, '/src/routes/auth.js');

-- Volcando estructura para tabla gestiocambios_db.evidencias_git
CREATE TABLE IF NOT EXISTS `evidencias_git` (
  `id_evidencia` int(11) NOT NULL AUTO_INCREMENT,
  `id_sc` int(11) NOT NULL,
  `nombre_rama` varchar(100) NOT NULL,
  `url_pull_request` varchar(255) NOT NULL,
  `comentario_tecnico` text DEFAULT NULL,
  `fecha_envio` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_evidencia`),
  UNIQUE KEY `id_sc` (`id_sc`),
  CONSTRAINT `evidencias_git_ibfk_1` FOREIGN KEY (`id_sc`) REFERENCES `solicitudes_cambio` (`id_sc`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla gestiocambios_db.evidencias_git: ~0 rows (aproximadamente)

-- Volcando estructura para tabla gestiocambios_db.historial_estados
CREATE TABLE IF NOT EXISTS `historial_estados` (
  `id_historial` int(11) NOT NULL AUTO_INCREMENT,
  `id_sc` int(11) NOT NULL,
  `estado_anterior` varchar(50) DEFAULT NULL,
  `estado_nuevo` varchar(50) NOT NULL,
  `usuario_nombre` varchar(100) NOT NULL,
  `usuario_rol` varchar(50) NOT NULL,
  `comentario` text DEFAULT NULL,
  `fecha_cambio` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_historial`),
  KEY `id_sc` (`id_sc`),
  CONSTRAINT `historial_estados_ibfk_1` FOREIGN KEY (`id_sc`) REFERENCES `solicitudes_cambio` (`id_sc`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla gestiocambios_db.historial_estados: ~3 rows (aproximadamente)
INSERT INTO `historial_estados` (`id_historial`, `id_sc`, `estado_anterior`, `estado_nuevo`, `usuario_nombre`, `usuario_rol`, `comentario`, `fecha_cambio`) VALUES
	(1, 4, NULL, 'Solicitado', 'Docente Evaluador UPT', 'Solicitante', 'Ticket creado.', '2026-05-23 04:55:44'),
	(2, 5, NULL, 'Solicitado', 'Docente Evaluador UPT', 'Solicitante', 'Ticket creado.', '2026-05-23 04:58:04'),
	(3, 6, NULL, 'Solicitado', 'Docente Evaluador UPT', 'Solicitante', 'Ticket creado.', '2026-05-23 04:59:29'),
	(4, 6, 'Solicitado', 'En Análisis', 'Director Ejemplo', 'Director', NULL, '2026-05-23 05:12:52');

-- Volcando estructura para tabla gestiocambios_db.roles
CREATE TABLE IF NOT EXISTS `roles` (
  `id_rol` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_rol` varchar(50) NOT NULL,
  PRIMARY KEY (`id_rol`),
  UNIQUE KEY `nombre_rol` (`nombre_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla gestiocambios_db.roles: ~7 rows (aproximadamente)
INSERT INTO `roles` (`id_rol`, `nombre_rol`) VALUES
	(1, 'Solicitante'),
	(2, 'Director'),
	(3, 'Gestor de Configuración'),
	(4, 'Líder Técnico'),
	(5, 'Comité de Control (CCB)'),
	(6, 'Desarrollador Asignado'),
	(7, 'Equipo QA / Tester');

-- Volcando estructura para tabla gestiocambios_db.solicitudes_cambio
CREATE TABLE IF NOT EXISTS `solicitudes_cambio` (
  `id_sc` int(11) NOT NULL AUTO_INCREMENT,
  `ticket_id` varchar(15) NOT NULL,
  `titulo` varchar(150) NOT NULL,
  `descripcion` text NOT NULL,
  `justificacion_tecnica` text NOT NULL,
  `tipo_cambio` enum('Correctivo','Evolutivo','Adaptativo','Perfectivo') DEFAULT 'Correctivo',
  `impacto` enum('Pendiente','Menor','Mayor') DEFAULT 'Pendiente',
  `estado_actual` enum('Solicitado','En Análisis','Pendiente de Aprobación','Aprobado','En Desarrollo','En Pruebas QA','En Pruebas UAT','Listo para Integración','Liberado','Rechazado','Descartado') DEFAULT 'Solicitado',
  `horas_hombre_estimadas` int(11) DEFAULT 0,
  `version_tag` varchar(15) DEFAULT NULL,
  `id_solicitante` int(11) NOT NULL,
  `id_desarrollador` int(11) DEFAULT NULL,
  `id_tester` int(11) DEFAULT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_ultima_modificacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_sc`),
  UNIQUE KEY `ticket_id` (`ticket_id`),
  KEY `id_solicitante` (`id_solicitante`),
  KEY `id_desarrollador` (`id_desarrollador`),
  KEY `id_tester` (`id_tester`),
  CONSTRAINT `solicitudes_cambio_ibfk_1` FOREIGN KEY (`id_solicitante`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `solicitudes_cambio_ibfk_2` FOREIGN KEY (`id_desarrollador`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `solicitudes_cambio_ibfk_3` FOREIGN KEY (`id_tester`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla gestiocambios_db.solicitudes_cambio: ~6 rows (aproximadamente)
INSERT INTO `solicitudes_cambio` (`id_sc`, `ticket_id`, `titulo`, `descripcion`, `justificacion_tecnica`, `tipo_cambio`, `impacto`, `estado_actual`, `horas_hombre_estimadas`, `version_tag`, `id_solicitante`, `id_desarrollador`, `id_tester`, `fecha_registro`, `fecha_ultima_modificacion`) VALUES
	(1, 'TK-SC001', 'Fallo en API de autenticación biométrica - Puerta Norte', 'Los lectores de rostro fallan en la mañana debido a la luz solar directa.', 'Se requiere ajustar el umbral de confianza del algoritmo en el controlador de reconocimiento.', 'Correctivo', 'Mayor', 'En Desarrollo', 12, NULL, 1, 4, 5, '2026-05-23 03:52:51', '2026-05-23 03:52:51'),
	(2, 'TK-SC002', 'Automatización de alertas de inasistencias vía n8n', 'Implementar un nodo webhook en n8n para notificar de inmediato al estudiante cuando sume 3 faltas.', 'Optimizar la retención estudiantil mediante alertas tempranas automatizadas.', 'Evolutivo', 'Menor', 'Solicitado', 0, NULL, 1, NULL, NULL, '2026-05-23 03:52:51', '2026-05-23 03:52:51'),
	(3, 'TK-SC003', 'fgaa', 'http://localhost:3000/api/tickets', '', 'Evolutivo', 'Menor', 'Solicitado', 4, NULL, 1, NULL, NULL, '2026-05-23 04:52:11', '2026-05-23 04:52:11'),
	(4, 'TK-SC004', 'gaww', 'gaww', '', 'Adaptativo', 'Menor', 'Solicitado', 6, NULL, 1, NULL, NULL, '2026-05-23 04:55:44', '2026-05-23 04:55:44'),
	(5, 'TK-SC005', 'http://localhost:3000', 'http://localhost:3000', '', 'Evolutivo', 'Menor', 'Solicitado', 2, NULL, 1, NULL, NULL, '2026-05-23 04:58:04', '2026-05-23 04:58:04'),
	(6, 'TK-SC006', 'Solicitar Cambio', 'Solicitar Cambio', '', 'Evolutivo', 'Mayor', 'En Análisis', 6, NULL, 1, NULL, NULL, '2026-05-23 04:59:29', '2026-05-23 05:12:52');

-- Volcando estructura para tabla gestiocambios_db.usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id_usuario` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_completo` varchar(100) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `id_rol` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `correo` (`correo`),
  KEY `id_rol` (`id_rol`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla gestiocambios_db.usuarios: ~7 rows (aproximadamente)
INSERT INTO `usuarios` (`id_usuario`, `nombre_completo`, `correo`, `password_hash`, `id_rol`) VALUES
	(1, 'Docente Evaluador UPT', 'docente@upt.pe', '123', 1),
	(2, 'Sergio Alberto Colque Ponce', 'sergio@upt.pe', '123', 3),
	(3, 'Diego Fernando Castillo Mamani', 'diego@upt.pe', '123', 4),
	(4, 'Gregory Brandon Huanca Merma', 'gregory@upt.pe', '123', 6),
	(5, 'César Nikolas Camac Meléndez', 'cesar@upt.pe', '123', 7),
	(6, 'Director Ejemplo', 'director@upt.pe', '123', 2),
	(7, 'CCB Ejemplo', 'ccb@upt.pe', '123', 5);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
