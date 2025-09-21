-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 09-09-2025
-- Versión del servidor: 10.4.24-MariaDB
-- Versión de PHP: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- Base de datos: `auka-tech`

-- --------------------------------------------------------
-- Tabla: areas (partes de la empresa)
-- --------------------------------------------------------

CREATE TABLE `areas` (
  `id_area` int(11) NOT NULL,
  `area` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `areas` (`id_area`, `area`) VALUES
(1, 'Compras'),
(2, 'Marketing'),
(3, 'Ventas'),
(4, 'Recursos Humanos'),
(5, 'Finanzas'),
(6, 'Sistemas'),
(7, 'Soporte Técnico'),
(8, 'Producción'),
(9, 'Logística'),
(10, 'Dirección');

-- --------------------------------------------------------
-- Tabla: solicitudes
-- --------------------------------------------------------

CREATE TABLE `solicitudes` (
  `id_solicitud` int(11) NOT NULL,
  `id_soporte` int(11) DEFAULT NULL,
  `id_emisor` int(11) NOT NULL,
  `id_area` int(11) NOT NULL,
  `numero_nivel` int(11) NOT NULL DEFAULT 1,
  `mensaje` varchar(300) NOT NULL,
  `fecha_envio` timestamp NOT NULL DEFAULT current_timestamp(),
  `finalizado` tinyint(1) NOT NULL DEFAULT 0,
  `cancelado` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Tabla: niveles
-- --------------------------------------------------------

CREATE TABLE `niveles` (
  `numero_nivel` int(11) NOT NULL,
  `nombre_nivel` varchar(32) NOT NULL,
  `descripcion` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `niveles` (`numero_nivel`, `nombre_nivel`, `descripcion`) VALUES
(1, 'Llamado', 'Situaciones menores donde se requiere atención, pero no hay urgencia. Ejemplo: empleado que necesita hacer una consulta general.'),
(2, 'Moderado', 'Situaciones que requieren intervención rápida, pero no son críticas. Ejemplo: empleado con malestar leve, falta disciplinaria.'),
(3, 'Urgente', 'Situaciones que pueden escalar y requieren atención inmediata. Ejemplo: discusión fuerte entre empleados, crisis emocional.'),
(4, 'Grave', 'Situaciones de alto riesgo que requieren asistencia de profesionales o servicios de emergencia. Ejemplo: convulsiones, heridas con sangrado considerable.'),
(5, 'Crítico', 'Situaciones extremas con riesgo de vida. Ejemplo: paro cardíaco, traumatismo severo, pérdida prolongada de conocimiento.');

-- --------------------------------------------------------
-- Tabla: respuestas_solicitudes
-- --------------------------------------------------------

CREATE TABLE `respuestas_solicitudes` (
  `id_respuesta` int(11) NOT NULL,
  `id_solicitud` int(11) NOT NULL,
  `mensaje` varchar(500) NOT NULL,
  `id_soporte` int(11) NOT NULL,
  `fecha_respuesta` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Tabla: turnos
-- --------------------------------------------------------

CREATE TABLE `turnos` (
  `id_turno` int(11) NOT NULL,
  `nombre_turno` enum('mañana','tarde','vespertino') NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_final` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `turnos` (`id_turno`, `nombre_turno`, `hora_inicio`, `hora_final`) VALUES
(1, 'mañana', '07:35:00', '11:55:00'),
(2, 'tarde', '12:55:00', '17:15:00'),
(3, 'vespertino', '17:35:00', '21:45:00');

-- --------------------------------------------------------
-- Tabla: turnos_asignaciones
-- --------------------------------------------------------

CREATE TABLE `turnos_asignaciones` (
  `id_asignacion` int(11) NOT NULL,
  `id_turno` int(11) NOT NULL,
  `id_soporte` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `turnos_asignaciones` (`id_asignacion`, `id_turno`, `id_soporte`) VALUES
(3, 2, 9),
(4, 3, 9);

-- --------------------------------------------------------
-- Tabla: usuarios
-- --------------------------------------------------------

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(64) NOT NULL,
  `apellido` varchar(64) NOT NULL,
  `email` varchar(64) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `tipo_usuario` enum('empleado','soporte','administracion') NOT NULL DEFAULT 'empleado',
  `autorizado` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `usuarios` (`id_usuario`, `nombre`, `apellido`, `email`, `contrasena`, `tipo_usuario`, `autorizado`) VALUES
(8, 'Alejandro Ariel', 'Manrique', 'alejandro@gmail.com', '$2b$05$j007.4grrUBOvurQc4tpBu86J6XjG09flrwfTA1xlwNUjewZx/Fjq', 'empleado', 1),
(9, 'Carlos Alberto', 'Robello', 'robello@gmail.com', '$2b$05$FHPuGgstOyFL6LLtP/829e./zEEx4agJNoRsh1YMIj6zxDh3GFaT.', 'soporte', 1),
(14, 'Cristobal', 'Maier', 'cristobalmaier1@gmail.com', '$2b$05$ggMTF3jCdBFBtPXUvhEvL.8bqAdA5gQtseg0RC/PDHxqNRmRt9hou', 'soporte', 1),
(15, 'Alejandra', 'Fernandez', 'alejandrafernandez@gmail.com', '$2b$05$sBA1337.YQVeSDOO87RKSea9b4Hrw3yaTnC17JS6HMP.yokGrIw8y', 'empleado', 1),
(16, 'Tito', 'Calderon', 'titocalderon@gmail.com', '$2b$05$JqHtLpaIgDyL3rioLwXvzuEk5UWK1xv536IEICpcTFIPUbuKkPVvW', 'empleado', 1);

-- --------------------------------------------------------
-- ÍNDICES
-- --------------------------------------------------------

ALTER TABLE `areas`
  ADD PRIMARY KEY (`id_area`);

ALTER TABLE `solicitudes`
  ADD PRIMARY KEY (`id_solicitud`),
  ADD KEY `id_emisor` (`id_emisor`),
  ADD KEY `id_area` (`id_area`),
  ADD KEY `numero_nivel` (`numero_nivel`),
  ADD KEY `id_soporte` (`id_soporte`);

ALTER TABLE `niveles`
  ADD PRIMARY KEY (`numero_nivel`);

ALTER TABLE `respuestas_solicitudes`
  ADD PRIMARY KEY (`id_respuesta`),
  ADD KEY `id_solicitud` (`id_solicitud`),
  ADD KEY `id_soporte` (`id_soporte`);

ALTER TABLE `turnos`
  ADD PRIMARY KEY (`id_turno`);

ALTER TABLE `turnos_asignaciones`
  ADD PRIMARY KEY (`id_asignacion`),
  ADD KEY `id_turno` (`id_turno`),
  ADD KEY `id_soporte` (`id_soporte`);

ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`);

-- --------------------------------------------------------
-- AUTO_INCREMENT
-- --------------------------------------------------------

ALTER TABLE `areas`
  MODIFY `id_area` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

ALTER TABLE `solicitudes`
  MODIFY `id_solicitud` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

ALTER TABLE `respuestas_solicitudes`
  MODIFY `id_respuesta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

ALTER TABLE `turnos`
  MODIFY `id_turno` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

ALTER TABLE `turnos_asignaciones`
  MODIFY `id_asignacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

-- --------------------------------------------------------
-- RESTRICCIONES (FOREIGN KEYS)
-- --------------------------------------------------------

ALTER TABLE `solicitudes`
  ADD CONSTRAINT `solicitudes_fk_emisor` FOREIGN KEY (`id_emisor`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `solicitudes_fk_area` FOREIGN KEY (`id_area`) REFERENCES `areas` (`id_area`),
  ADD CONSTRAINT `solicitudes_fk_nivel` FOREIGN KEY (`numero_nivel`) REFERENCES `niveles` (`numero_nivel`),
  ADD CONSTRAINT `solicitudes_fk_soporte` FOREIGN KEY (`id_soporte`) REFERENCES `usuarios` (`id_usuario`);

ALTER TABLE `respuestas_solicitudes`
  ADD CONSTRAINT `respuestas_solicitudes_fk_solicitud` FOREIGN KEY (`id_solicitud`) REFERENCES `solicitudes` (`id_solicitud`),
  ADD CONSTRAINT `respuestas_solicitudes_fk_soporte` FOREIGN KEY (`id_soporte`) REFERENCES `usuarios` (`id_usuario`);

ALTER TABLE `turnos_asignaciones`
  ADD CONSTRAINT `turnos_asignaciones_fk_turno` FOREIGN KEY (`id_turno`) REFERENCES `turnos` (`id_turno`),
  ADD CONSTRAINT `turnos_asignaciones_fk_soporte` FOREIGN KEY (`id_soporte`) REFERENCES `usuarios` (`id_usuario`);

COMMIT;