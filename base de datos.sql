-- --------------------------------------------------------
-- Host:                         be2wna.h.filess.io
-- Versión del servidor:         11.6.2-MariaDB-ubu2404 - mariadb.org binary distribution
-- SO del servidor:              debian-linux-gnu
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


-- Volcando estructura de base de datos para Gestion_de_Cambios_catshelook
CREATE DATABASE IF NOT EXISTS `Gestion_de_Cambios_catshelook` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `Gestion_de_Cambios_catshelook`;

-- Volcando estructura para tabla Gestion_de_Cambios_catshelook.control_calidad
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla Gestion_de_Cambios_catshelook.control_calidad: ~4 rows (aproximadamente)
INSERT INTO `control_calidad` (`id_calidad`, `id_sc`, `qa_estado`, `qa_evidencia_url`, `qa_observaciones`, `uat_estado`, `uat_observaciones`) VALUES
	(1, 16, 'Aprobado', '', 'waaa', 'Aprobado', 'waaa'),
	(2, 20, 'Aprobado', '', '21', 'Aprobado', '21'),
	(3, 24, 'Aprobado', '', 'AWA', 'Aprobado', 'AWA'),
	(4, 28, 'Aprobado', '', '.', 'Aprobado', '.');

-- Volcando estructura para tabla Gestion_de_Cambios_catshelook.cronograma_actividades
CREATE TABLE IF NOT EXISTS `cronograma_actividades` (
  `id_actividad` int(11) NOT NULL AUTO_INCREMENT,
  `id_proyecto` int(11) NOT NULL,
  `id_fase` int(11) DEFAULT NULL,
  `nombre` varchar(200) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `es_reportable` tinyint(1) DEFAULT 1,
  `id_entregable` int(11) DEFAULT NULL,
  `porcentaje_avance` decimal(5,2) DEFAULT 0.00,
  `estado` enum('Pendiente','En Progreso','Completado','Bloqueado') DEFAULT 'Pendiente',
  PRIMARY KEY (`id_actividad`),
  KEY `id_proyecto` (`id_proyecto`),
  KEY `id_fase` (`id_fase`),
  KEY `id_entregable` (`id_entregable`),
  CONSTRAINT `cronograma_actividades_ibfk_1` FOREIGN KEY (`id_proyecto`) REFERENCES `proyectos` (`id_proyecto`) ON DELETE CASCADE,
  CONSTRAINT `cronograma_actividades_ibfk_2` FOREIGN KEY (`id_fase`) REFERENCES `fases` (`id_fase`) ON DELETE SET NULL,
  CONSTRAINT `cronograma_actividades_ibfk_3` FOREIGN KEY (`id_entregable`) REFERENCES `solicitudes_cambio` (`id_sc`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla Gestion_de_Cambios_catshelook.cronograma_actividades: ~0 rows (aproximadamente)

-- Volcando estructura para tabla Gestion_de_Cambios_catshelook.ecs_afectados
CREATE TABLE IF NOT EXISTS `ecs_afectados` (
  `id_ecs` int(11) NOT NULL AUTO_INCREMENT,
  `id_sc` int(11) NOT NULL,
  `ruta_archivo` varchar(255) NOT NULL,
  PRIMARY KEY (`id_ecs`),
  KEY `id_sc` (`id_sc`),
  CONSTRAINT `ecs_afectados_ibfk_1` FOREIGN KEY (`id_sc`) REFERENCES `solicitudes_cambio` (`id_sc`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla Gestion_de_Cambios_catshelook.ecs_afectados: ~2 rows (aproximadamente)
INSERT INTO `ecs_afectados` (`id_ecs`, `id_sc`, `ruta_archivo`) VALUES
	(1, 1, '/src/controllers/biometricController.js'),
	(2, 1, '/src/routes/auth.js');

-- Volcando estructura para tabla Gestion_de_Cambios_catshelook.elementos_config_metodologia
CREATE TABLE IF NOT EXISTS `elementos_config_metodologia` (
  `id_ecm` int(11) NOT NULL AUTO_INCREMENT,
  `id_fase` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `tipo` enum('Documento','Diagrama','Codigo','Prueba','Otro') DEFAULT 'Documento',
  `descripcion` text DEFAULT NULL,
  PRIMARY KEY (`id_ecm`),
  KEY `id_fase` (`id_fase`),
  CONSTRAINT `elementos_config_metodologia_ibfk_1` FOREIGN KEY (`id_fase`) REFERENCES `fases` (`id_fase`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla Gestion_de_Cambios_catshelook.elementos_config_metodologia: ~0 rows (aproximadamente)

-- Volcando estructura para tabla Gestion_de_Cambios_catshelook.etapas
CREATE TABLE IF NOT EXISTS `etapas` (
  `id_etapa` int(11) NOT NULL AUTO_INCREMENT,
  `id_metodologia` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `orden` int(11) DEFAULT 0,
  `descripcion` text DEFAULT NULL,
  PRIMARY KEY (`id_etapa`),
  KEY `id_metodologia` (`id_metodologia`),
  CONSTRAINT `etapas_ibfk_1` FOREIGN KEY (`id_metodologia`) REFERENCES `metodologias` (`id_metodologia`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla Gestion_de_Cambios_catshelook.etapas: ~0 rows (aproximadamente)

-- Volcando estructura para tabla Gestion_de_Cambios_catshelook.evidencias_git
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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla Gestion_de_Cambios_catshelook.evidencias_git: ~3 rows (aproximadamente)
INSERT INTO `evidencias_git` (`id_evidencia`, `id_sc`, `nombre_rama`, `url_pull_request`, `comentario_tecnico`, `fecha_envio`) VALUES
	(1, 16, '', 'awaa', 'awaa', '2026-05-28 21:00:59'),
	(3, 20, 'alitamovil', '', '', '2026-05-28 21:52:35'),
	(4, 24, '', 'AWA', '', '2026-05-28 23:35:55'),
	(6, 28, '', 'prueba.com', '', '2026-05-29 00:07:13');

-- Volcando estructura para tabla Gestion_de_Cambios_catshelook.fases
CREATE TABLE IF NOT EXISTS `fases` (
  `id_fase` int(11) NOT NULL AUTO_INCREMENT,
  `id_etapa` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `orden` int(11) DEFAULT 0,
  `descripcion` text DEFAULT NULL,
  PRIMARY KEY (`id_fase`),
  KEY `id_etapa` (`id_etapa`),
  CONSTRAINT `fases_ibfk_1` FOREIGN KEY (`id_etapa`) REFERENCES `etapas` (`id_etapa`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla Gestion_de_Cambios_catshelook.fases: ~0 rows (aproximadamente)

-- Volcando estructura para tabla Gestion_de_Cambios_catshelook.historial_estados
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
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla Gestion_de_Cambios_catshelook.historial_estados: ~38 rows (aproximadamente)
INSERT INTO `historial_estados` (`id_historial`, `id_sc`, `estado_anterior`, `estado_nuevo`, `usuario_nombre`, `usuario_rol`, `comentario`, `fecha_cambio`) VALUES
	(3, 6, NULL, 'Solicitado', 'Docente Evaluador UPT', 'Solicitante', 'Ticket creado.', '2026-05-23 04:59:29'),
	(4, 6, 'Solicitado', 'En Análisis', 'Director Ejemplo', 'Director', NULL, '2026-05-23 05:12:52'),
	(5, 7, NULL, 'Solicitado', 'Docente Evaluador UPT', 'Solicitante', 'Ticket creado.', '2026-05-23 15:39:40'),
	(6, 8, NULL, 'Solicitado', 'Docente Evaluador UPT', 'Solicitante', 'Ticket creado.', '2026-05-23 15:39:41'),
	(7, 16, NULL, 'Solicitado', 'Docente Evaluador UPT', 'Solicitante', 'Ticket creado.', '2026-05-28 20:45:25'),
	(8, 16, 'Solicitado', 'En Análisis', 'Director Ejemplo', 'Director', 'lo aceptamos', '2026-05-28 20:50:31'),
	(9, 11, 'Solicitado', 'Rechazado', 'Director Ejemplo', 'Director', 'requerido', '2026-05-28 20:50:53'),
	(10, 16, 'En Análisis', 'Pendiente de Aprobación', 'Diego Fernando Castillo Mamani', 'Líder Técnico', NULL, '2026-05-28 20:57:32'),
	(11, 16, 'Pendiente de Aprobación', 'Aprobado', 'Director Ejemplo', 'Director', NULL, '2026-05-28 20:58:28'),
	(12, 16, 'Aprobado', 'En Desarrollo', 'Sergio Alberto Colque Ponce', 'Gestor de Configuración', NULL, '2026-05-28 21:00:59'),
	(13, 16, 'En Desarrollo', 'En Pruebas QA', 'Gregory Brandon Huanca Merma', 'Desarrollador Asignado', 'awaa', '2026-05-28 21:09:07'),
	(14, 16, 'En Pruebas QA', 'Listo para Integración', 'César Nikolas Camac Meléndez', 'Equipo QA / Tester', NULL, '2026-05-28 21:09:53'),
	(15, 16, 'Listo para Integración', 'Liberado', 'Sergio Alberto Colque Ponce', 'Gestor de Configuración', 'waa', '2026-05-28 21:11:08'),
	(16, 20, NULL, 'Solicitado', 'Docente Evaluador UPT', 'Solicitante', 'Ticket creado.', '2026-05-28 21:42:51'),
	(17, 20, 'Solicitado', 'En Análisis', 'Director Ejemplo', 'Director', NULL, '2026-05-28 21:43:18'),
	(18, 20, 'En Análisis', 'Pendiente de Aprobación', 'Diego Fernando Castillo Mamani', 'Líder Técnico', NULL, '2026-05-28 21:43:55'),
	(19, 20, 'Pendiente de Aprobación', 'Aprobado', 'Director Ejemplo', 'Director', NULL, '2026-05-28 21:44:27'),
	(20, 20, 'Aprobado', 'En Desarrollo', 'Sergio Alberto Colque Ponce', 'Gestor de Configuración', NULL, '2026-05-28 21:52:35'),
	(21, 20, 'En Desarrollo', 'En Pruebas QA', 'Gregory Brandon Huanca Merma', 'Desarrollador Asignado', NULL, '2026-05-28 21:52:56'),
	(22, 20, 'En Pruebas QA', 'En Pruebas UAT', 'César Nikolas Camac Meléndez', 'Equipo QA / Tester', NULL, '2026-05-28 21:53:31'),
	(23, 20, 'En Pruebas UAT', 'Listo para Integración', 'César Nikolas Camac Meléndez', 'Equipo QA / Tester', NULL, '2026-05-28 21:54:11'),
	(24, 20, 'Listo para Integración', 'Liberado', 'Sergio Alberto Colque Ponce', 'Gestor de Configuración', '1', '2026-05-28 21:55:46'),
	(25, 24, NULL, 'Solicitado', 'Docente Evaluador UPT', 'Solicitante', 'Ticket creado.', '2026-05-28 23:33:38'),
	(26, 24, 'Solicitado', 'En Análisis', 'Director Ejemplo', 'Director', NULL, '2026-05-28 23:34:04'),
	(27, 24, 'En Análisis', 'Pendiente de Aprobación', 'Diego Fernando Castillo Mamani', 'Líder Técnico', NULL, '2026-05-28 23:34:28'),
	(28, 24, 'Pendiente de Aprobación', 'Aprobado', 'Director Ejemplo', 'Director', NULL, '2026-05-28 23:35:02'),
	(29, 24, 'Aprobado', 'En Desarrollo', 'Sergio Alberto Colque Ponce', 'Gestor de Configuración', NULL, '2026-05-28 23:35:55'),
	(30, 24, 'En Desarrollo', 'En Pruebas QA', 'Gregory Brandon Huanca Merma', 'Desarrollador Asignado', NULL, '2026-05-28 23:36:30'),
	(31, 24, 'En Pruebas QA', 'Listo para Integración', 'César Nikolas Camac Meléndez', 'Equipo QA / Tester', NULL, '2026-05-28 23:36:59'),
	(32, 24, 'Listo para Integración', 'Liberado', 'Sergio Alberto Colque Ponce', 'Gestor de Configuración', NULL, '2026-05-28 23:37:42'),
	(33, 28, NULL, 'Solicitado', 'Docente Evaluador UPT', 'Solicitante', 'Ticket creado.', '2026-05-29 00:02:08'),
	(34, 28, 'Solicitado', 'En Análisis', 'Director Ejemplo', 'Director', NULL, '2026-05-29 00:02:32'),
	(35, 28, 'En Análisis', 'Pendiente de Aprobación', 'Diego Fernando Castillo Mamani', 'Líder Técnico', NULL, '2026-05-29 00:04:21'),
	(36, 28, 'Pendiente de Aprobación', 'Aprobado', 'Director Ejemplo', 'Director', NULL, '2026-05-29 00:06:18'),
	(37, 28, 'Aprobado', 'En Desarrollo', 'Sergio Alberto Colque Ponce', 'Gestor de Configuración', NULL, '2026-05-29 00:07:12'),
	(38, 28, 'En Desarrollo', 'En Pruebas QA', 'Gregory Brandon Huanca Merma', 'Desarrollador Asignado', NULL, '2026-05-29 00:07:57'),
	(39, 28, 'En Pruebas QA', 'Listo para Integración', 'César Nikolas Camac Meléndez', 'Equipo QA / Tester', NULL, '2026-05-29 00:08:26'),
	(40, 28, 'Listo para Integración', 'Liberado', 'Sergio Alberto Colque Ponce', 'Gestor de Configuración', NULL, '2026-05-29 00:09:10');

-- Volcando estructura para tabla Gestion_de_Cambios_catshelook.metodologias
CREATE TABLE IF NOT EXISTS `metodologias` (
  `id_metodologia` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  PRIMARY KEY (`id_metodologia`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla Gestion_de_Cambios_catshelook.metodologias: ~0 rows (aproximadamente)

-- Volcando estructura para tabla Gestion_de_Cambios_catshelook.proyecto_clientes
CREATE TABLE IF NOT EXISTS `proyecto_clientes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_proyecto` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `fecha_asignacion` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_proyecto` (`id_proyecto`,`id_usuario`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `proyecto_clientes_ibfk_1` FOREIGN KEY (`id_proyecto`) REFERENCES `proyectos` (`id_proyecto`) ON DELETE CASCADE,
  CONSTRAINT `proyecto_clientes_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla Gestion_de_Cambios_catshelook.proyecto_clientes: ~0 rows (aproximadamente)

-- Volcando estructura para tabla Gestion_de_Cambios_catshelook.proyecto_equipo
CREATE TABLE IF NOT EXISTS `proyecto_equipo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_proyecto` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `rol_en_proyecto` varchar(60) NOT NULL,
  `fecha_asignacion` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_proyecto` (`id_proyecto`,`id_usuario`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `proyecto_equipo_ibfk_1` FOREIGN KEY (`id_proyecto`) REFERENCES `proyectos` (`id_proyecto`) ON DELETE CASCADE,
  CONSTRAINT `proyecto_equipo_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla Gestion_de_Cambios_catshelook.proyecto_equipo: ~0 rows (aproximadamente)

-- Volcando estructura para tabla Gestion_de_Cambios_catshelook.proyectos
CREATE TABLE IF NOT EXISTS `proyectos` (
  `id_proyecto` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `estado` enum('Activo','Pausado','Cerrado','Archivado') DEFAULT 'Activo',
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `id_admin` int(11) NOT NULL,
  `id_metodologia` int(11) DEFAULT NULL,
  `fecha_creacion` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_proyecto`),
  KEY `id_admin` (`id_admin`),
  KEY `id_metodologia` (`id_metodologia`),
  CONSTRAINT `proyectos_ibfk_1` FOREIGN KEY (`id_admin`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `proyectos_ibfk_2` FOREIGN KEY (`id_metodologia`) REFERENCES `metodologias` (`id_metodologia`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla Gestion_de_Cambios_catshelook.proyectos: ~0 rows (aproximadamente)

-- Volcando estructura para tabla Gestion_de_Cambios_catshelook.reportes_avance
CREATE TABLE IF NOT EXISTS `reportes_avance` (
  `id_reporte` int(11) NOT NULL AUTO_INCREMENT,
  `id_actividad` int(11) NOT NULL,
  `id_proyecto` int(11) NOT NULL,
  `id_usuario_reporta` int(11) NOT NULL,
  `porcentaje` decimal(5,2) NOT NULL,
  `comentario` text DEFAULT NULL,
  `fecha_reporte` timestamp NULL DEFAULT current_timestamp(),
  `visto_por_cliente` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id_reporte`),
  KEY `id_actividad` (`id_actividad`),
  KEY `id_proyecto` (`id_proyecto`),
  KEY `id_usuario_reporta` (`id_usuario_reporta`),
  CONSTRAINT `reportes_avance_ibfk_1` FOREIGN KEY (`id_actividad`) REFERENCES `cronograma_actividades` (`id_actividad`) ON DELETE CASCADE,
  CONSTRAINT `reportes_avance_ibfk_2` FOREIGN KEY (`id_proyecto`) REFERENCES `proyectos` (`id_proyecto`),
  CONSTRAINT `reportes_avance_ibfk_3` FOREIGN KEY (`id_usuario_reporta`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla Gestion_de_Cambios_catshelook.reportes_avance: ~0 rows (aproximadamente)

-- Volcando estructura para tabla Gestion_de_Cambios_catshelook.roles
CREATE TABLE IF NOT EXISTS `roles` (
  `id_rol` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_rol` varchar(50) NOT NULL,
  PRIMARY KEY (`id_rol`),
  UNIQUE KEY `nombre_rol` (`nombre_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla Gestion_de_Cambios_catshelook.roles: ~9 rows (aproximadamente)
INSERT INTO `roles` (`id_rol`, `nombre_rol`) VALUES
	(1, 'Solicitante'),
	(2, 'Director'),
	(3, 'Gestor de Configuración'),
	(4, 'Líder Técnico'),
	(5, 'Comité de Control (CCB)'),
	(6, 'Desarrollador Asignado'),
	(7, 'Equipo QA / Tester'),
	(8, 'Administrador');

-- Volcando estructura para tabla Gestion_de_Cambios_catshelook.solicitudes_cambio
CREATE TABLE IF NOT EXISTS `solicitudes_cambio` (
  `id_sc` int(11) NOT NULL AUTO_INCREMENT,
  `id_proyecto` int(11) DEFAULT NULL,
  `ticket_id` varchar(15) NOT NULL,
  `titulo` varchar(150) NOT NULL,
  `descripcion` text NOT NULL,
  `justificacion_tecnica` text NOT NULL,
  `tipo_cambio` enum('Correctivo','Evolutivo','Adaptativo','Perfectivo') DEFAULT 'Correctivo',
  `impacto` enum('Pendiente','Menor','Mayor') DEFAULT 'Pendiente',
  `modulos_afectados` text DEFAULT NULL,
  `riesgo_tecnico` enum('Bajo','Medio','Alto') DEFAULT NULL,
  `informe_impacto` text DEFAULT NULL,
  `costo_estimado` decimal(10,2) DEFAULT NULL,
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
  KEY `id_proyecto` (`id_proyecto`),
  CONSTRAINT `solicitudes_cambio_ibfk_1` FOREIGN KEY (`id_solicitante`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `solicitudes_cambio_ibfk_2` FOREIGN KEY (`id_desarrollador`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `solicitudes_cambio_ibfk_3` FOREIGN KEY (`id_tester`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `solicitudes_cambio_ibfk_4` FOREIGN KEY (`id_proyecto`) REFERENCES `proyectos` (`id_proyecto`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla Gestion_de_Cambios_catshelook.solicitudes_cambio: ~10 rows (aproximadamente)
INSERT INTO `solicitudes_cambio` (`id_sc`, `id_proyecto`, `ticket_id`, `titulo`, `descripcion`, `justificacion_tecnica`, `tipo_cambio`, `impacto`, `modulos_afectados`, `riesgo_tecnico`, `informe_impacto`, `costo_estimado`, `estado_actual`, `horas_hombre_estimadas`, `version_tag`, `id_solicitante`, `id_desarrollador`, `id_tester`, `fecha_registro`, `fecha_ultima_modificacion`) VALUES
	(1, NULL, 'TK-SC001', 'Fallo en API de autenticación biométrica - Puerta Norte', 'Los lectores de rostro fallan en la mañana debido a la luz solar directa.', 'Se requiere ajustar el umbral de confianza del algoritmo en el controlador de reconocimiento.', 'Correctivo', 'Mayor', NULL, NULL, NULL, NULL, 'En Desarrollo', 12, NULL, 1, 4, 5, '2026-05-23 03:52:51', '2026-05-23 03:52:51'),
	(2, NULL, 'TK-SC002', 'Automatización de alertas de inasistencias vía n8n', 'Implementar un nodo webhook en n8n para notificar de inmediato al estudiante cuando sume 3 faltas.', 'Optimizar la retención estudiantil mediante alertas tempranas automatizadas.', 'Evolutivo', 'Menor', NULL, NULL, NULL, NULL, 'Solicitado', 0, NULL, 1, NULL, NULL, '2026-05-23 03:52:51', '2026-05-23 03:52:51'),
	(6, NULL, 'TK-SC006', 'Mejora de interfaz del panel de control', 'Rediseño del dashboard para mostrar métricas en tiempo real con gráficos interactivos.', 'Mejorar la experiencia de usuario y facilitar la toma de decisiones del Director.', 'Evolutivo', 'Mayor', NULL, NULL, NULL, NULL, 'En Análisis', 6, NULL, 1, NULL, NULL, '2026-05-23 04:59:29', '2026-05-23 05:12:52'),
	(7, NULL, 'TK-SC007', 'Sergio Ta off', 'Sergio Ta offSergio Ta offSergio Ta offSergio Ta offSergio Ta offSergio Ta offSergio Ta offSergio Ta offSergio Ta offSergio Ta offSergio Ta offSergio Ta off', '', 'Adaptativo', 'Mayor', NULL, NULL, NULL, NULL, 'Solicitado', 6, NULL, 1, NULL, NULL, '2026-05-23 15:39:40', '2026-05-23 15:39:40'),
	(8, NULL, 'TK-SC008', 'Sergio Ta off', 'Sergio Ta offSergio Ta offSergio Ta offSergio Ta offSergio Ta offSergio Ta offSergio Ta offSergio Ta offSergio Ta offSergio Ta offSergio Ta offSergio Ta off', '', 'Adaptativo', 'Mayor', NULL, NULL, NULL, NULL, 'Solicitado', 6, NULL, 1, NULL, NULL, '2026-05-23 15:39:41', '2026-05-23 15:39:41'),
	(11, NULL, 'TK-SC009', 'waaaaaaaaaaaaaaaaaaaa', 'waaaaaaaaaaaaaaaaaaaa', 'waaaaaaaaaaaaaaaaaaaa', 'Correctivo', 'Pendiente', NULL, NULL, NULL, NULL, 'Rechazado', 2, NULL, 1, NULL, NULL, '2026-05-28 04:34:30', '2026-05-28 20:50:53'),
	(16, NULL, 'TK-SC010', 'gaaaa', 'gaaaa', '', 'Evolutivo', 'Pendiente', NULL, NULL, NULL, NULL, 'Liberado', 4, NULL, 1, 4, NULL, '2026-05-28 20:45:25', '2026-05-28 21:11:08'),
	(20, NULL, 'TK-SC011', 'EL LEDER', 'EL LEDER', '', 'Evolutivo', 'Menor', NULL, NULL, NULL, NULL, 'Liberado', 4, NULL, 1, 4, NULL, '2026-05-28 21:42:51', '2026-05-28 21:55:46'),
	(24, NULL, 'TK-SC012', 'ANDY CALIZAYA', 'ANDY CALIZAYA', '', 'Evolutivo', 'Menor', NULL, NULL, NULL, NULL, 'Liberado', 3, NULL, 1, 4, NULL, '2026-05-28 23:33:38', '2026-05-28 23:37:42'),
	(28, NULL, 'TK-SC013', 'cambio en interfaz registro', 'cambiar la ui boton', '', 'Correctivo', 'Pendiente', NULL, NULL, NULL, NULL, 'Liberado', 3, NULL, 1, 4, NULL, '2026-05-29 00:02:08', '2026-05-29 00:09:10');

-- Volcando estructura para tabla Gestion_de_Cambios_catshelook.usuarios
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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla Gestion_de_Cambios_catshelook.usuarios: ~9 rows (aproximadamente)
INSERT INTO `usuarios` (`id_usuario`, `nombre_completo`, `correo`, `password_hash`, `id_rol`) VALUES
	(1, 'Docente Evaluador UPT', 'docente@upt.pe', '$2b$10$KdBPZ5wsv285Oxd1Wuj.zuyjH4HNE9.iPt0MoTqjfjrK/sOIZEsBS', 1),
	(2, 'Sergio Alberto Colque Ponce', 'sergio@upt.pe', '$2b$10$EPy5BIuMrd32meBD/dDwFOMhmWA.YI74knRj82TTXPwaD5VM4/gaa', 3),
	(3, 'Diego Fernando Castillo Mamani', 'diego@upt.pe', '$2b$10$AGIJB6EzHlwqJ6yzA8fIDOU3Sx.ZfE8wof1y1syAREQoPXAQbYG2m', 4),
	(4, 'Gregory Brandon Huanca Merma', 'gregory@upt.pe', '$2b$10$zDLhVuWMnO1OFfvRY5IFgu44X5Ixm0lkgT049ztOLcnd6Oie1/Sxa', 6),
	(5, 'César Nikolas Camac Meléndez', 'cesar@upt.pe', '$2b$10$WUTIfBjRyKMDorlpCskM/uZHcH5kyotmdt/VM5od0aaVaBcsgM3p.', 7),
	(6, 'Director Ejemplo', 'director@upt.pe', '$2b$10$1Fexm9JkZ.Qs.xLu30rjTumpelHvFG88wUSVIvH9AWD6kNNqTFaxG', 2),
	(7, 'CCB Ejemplo', 'ccb@upt.pe', '$2b$10$hDQupgnakCDdDdHwUsXR4uEVMWn9Yhu.r7RiuVeLC6RCpEv2ytVSy', 5),
	(8, 'Admin Sistema', 'admin@upt.pe', '123', 8);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
