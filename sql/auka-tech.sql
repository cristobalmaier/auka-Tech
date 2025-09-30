-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 01-10-2025 a las 01:10:36
-- Versión del servidor: 10.4.24-MariaDB
-- Versión de PHP: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Base de datos: `auka-tech`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `areas`
--

CREATE TABLE `areas` (
  `id_area` int(11) NOT NULL,
  `area` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `areas`
--

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

--
-- Estructura de tabla para la tabla `niveles`
--

CREATE TABLE `niveles` (
  `numero_nivel` int(11) NOT NULL,
  `nombre_nivel` varchar(32) NOT NULL,
  `descripcion` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `niveles`
--

INSERT INTO `niveles` (`numero_nivel`, `nombre_nivel`, `descripcion`) VALUES
(1, 'Llamado', 'Situaciones menores donde se requiere atención, pero no hay urgencia. Ejemplo: empleado que necesita hacer una consulta general.'),
(2, 'Moderado', 'Situaciones que requieren intervención rápida, pero no son críticas. Ejemplo: empleado con malestar leve, falta disciplinaria.'),
(3, 'Urgente', 'Situaciones que pueden escalar y requieren atención inmediata. Ejemplo: discusión fuerte entre empleados, crisis emocional.'),
(4, 'Grave', 'Situaciones de alto riesgo que requieren asistencia de profesionales o servicios de emergencia. Ejemplo: convulsiones, heridas con sangrado considerable.'),
(5, 'Crítico', 'Situaciones extremas con riesgo de vida. Ejemplo: paro cardíaco, traumatismo severo, pérdida prolongada de conocimiento.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `respuestas_solicitudes`
--

CREATE TABLE `respuestas_solicitudes` (
  `id_respuesta` int(11) NOT NULL,
  `id_solicitud` int(11) NOT NULL,
  `mensaje` varchar(500) NOT NULL,
  `id_soporte` int(11) NOT NULL,
  `fecha_respuesta` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `respuestas_solicitudes`
--

INSERT INTO `respuestas_solicitudes` (`id_respuesta`, `id_solicitud`, `mensaje`, `id_soporte`, `fecha_respuesta`) VALUES
(1, 1, 'Yendo', 14, '2025-09-30 17:50:22'),
(2, 2, 'En camino', 14, '2025-09-30 17:54:06'),
(3, 6, 'Yendo', 14, '2025-09-30 17:55:21'),
(4, 7, 'Yendo', 14, '2025-09-30 18:03:05'),
(5, 11, 'Voy para allá', 14, '2025-09-30 18:50:08'),
(6, 12, 'Enseguida', 14, '2025-09-30 18:52:30'),
(7, 13, 'Enseguida', 14, '2025-09-30 18:59:39'),
(8, 14, 'Voy para allá', 14, '2025-09-30 19:04:50'),
(9, 15, 'asdasd', 14, '2025-09-30 19:05:22'),
(10, 16, 'En camino', 14, '2025-09-30 19:08:30'),
(11, 17, 'Enseguida', 14, '2025-09-30 19:09:56'),
(12, 18, 'En camino', 14, '2025-09-30 19:14:49'),
(13, 19, 'En camino', 14, '2025-09-30 19:16:53'),
(14, 20, 'Enseguida', 14, '2025-09-30 19:18:34'),
(15, 21, 'Yendo', 14, '2025-09-30 20:05:14');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitudes`
--

CREATE TABLE `solicitudes` (
  `id_solicitud` int(11) NOT NULL,
  `id_soporte` int(11) DEFAULT NULL,
  `id_emisor` int(11) NOT NULL,
  `id_area` int(11) NOT NULL,
  `numero_nivel` int(11) NOT NULL DEFAULT 1,
  `mensaje` varchar(300) NOT NULL,
  `fecha_envio` timestamp NOT NULL DEFAULT current_timestamp(),
  `finalizado` tinyint(1) NOT NULL DEFAULT 0,
  `cancelado` tinyint(1) NOT NULL DEFAULT 0,
  `calificacion` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `solicitudes`
--

INSERT INTO `solicitudes` (`id_solicitud`, `id_soporte`, `id_emisor`, `id_area`, `numero_nivel`, `mensaje`, `fecha_envio`, `finalizado`, `cancelado`, `calificacion`) VALUES
(1, 14, 16, 3, 2, '1234', '2025-09-30 20:50:19', 1, 1, NULL),
(2, 14, 16, 2, 1, '123', '2025-09-30 20:54:01', 1, 0, NULL),
(3, NULL, 16, 2, 3, '123', '2025-09-30 20:55:02', 1, 1, NULL),
(4, NULL, 16, 2, 2, '123', '2025-09-30 20:55:04', 1, 1, NULL),
(5, NULL, 16, 2, 1, '123', '2025-09-30 20:55:07', 1, 1, NULL),
(6, 14, 16, 2, 2, '123', '2025-09-30 20:55:15', 1, 0, NULL),
(7, 14, 16, 6, 3, '123123', '2025-09-30 21:03:03', 1, 1, NULL),
(8, NULL, 16, 10, 3, 's', '2025-09-30 21:41:17', 1, 1, NULL),
(9, NULL, 16, 10, 3, 's', '2025-09-30 21:41:55', 1, 1, NULL),
(10, NULL, 16, 1, 2, 'dasd', '2025-09-30 21:44:43', 1, 1, NULL),
(11, 14, 16, 1, 2, 'asdasd', '2025-09-30 21:50:05', 1, 0, 5),
(12, 14, 16, 1, 3, '1', '2025-09-30 21:52:27', 1, 0, NULL),
(13, 14, 16, 1, 1, 's', '2025-09-30 21:59:11', 1, 0, NULL),
(14, 14, 16, 6, 3, 'sdasd', '2025-09-30 22:02:45', 1, 0, 3),
(15, 14, 16, 1, 3, 's', '2025-09-30 22:05:11', 1, 0, NULL),
(16, 14, 16, 1, 2, 's', '2025-09-30 22:08:20', 1, 0, NULL),
(17, 14, 16, 1, 2, '32', '2025-09-30 22:09:54', 1, 0, NULL),
(18, 14, 16, 1, 2, 's', '2025-09-30 22:14:47', 1, 0, 3),
(19, 14, 16, 6, 1, 'sasd', '2025-09-30 22:16:52', 1, 0, 3),
(20, 14, 16, 1, 2, 's', '2025-09-30 22:18:33', 1, 0, 3),
(21, 14, 16, 1, 2, 's', '2025-09-30 23:05:10', 1, 0, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `turnos`
--

CREATE TABLE `turnos` (
  `id_turno` int(11) NOT NULL,
  `nombre_turno` enum('mañana','tarde','vespertino') NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_final` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `turnos`
--

INSERT INTO `turnos` (`id_turno`, `nombre_turno`, `hora_inicio`, `hora_final`) VALUES
(1, 'mañana', '07:35:00', '11:55:00'),
(2, 'tarde', '12:55:00', '17:15:00'),
(3, 'vespertino', '17:35:00', '21:45:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `turnos_asignaciones`
--

CREATE TABLE `turnos_asignaciones` (
  `id_asignacion` int(11) NOT NULL,
  `id_turno` int(11) NOT NULL,
  `id_soporte` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `turnos_asignaciones`
--

INSERT INTO `turnos_asignaciones` (`id_asignacion`, `id_turno`, `id_soporte`) VALUES
(3, 2, 9),
(4, 3, 9),
(8, 1, 14),
(9, 2, 14),
(10, 3, 14),
(11, 1, 9);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(64) NOT NULL,
  `apellido` varchar(64) NOT NULL,
  `email` varchar(64) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `tipo_usuario` enum('empleado','soporte','administracion') NOT NULL DEFAULT 'empleado',
  `autorizado` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre`, `apellido`, `email`, `contrasena`, `tipo_usuario`, `autorizado`) VALUES
(8, 'Alejandro Ariel', 'Manrique', 'alejandro@gmail.com', '$2b$05$j007.4grrUBOvurQc4tpBu86J6XjG09flrwfTA1xlwNUjewZx/Fjq', 'empleado', 1),
(9, 'Carlos Alberto', 'Robello', 'robello@gmail.com', '$2b$05$FHPuGgstOyFL6LLtP/829e./zEEx4agJNoRsh1YMIj6zxDh3GFaT.', 'soporte', 1),
(14, 'Cristobal', 'Maier', 'cristobalmaier1@gmail.com', '$2b$05$ggMTF3jCdBFBtPXUvhEvL.8bqAdA5gQtseg0RC/PDHxqNRmRt9hou', 'soporte', 1),
(15, 'Alejandra', 'Fernandez', 'alejandrafernandez@gmail.com', '$2b$05$sBA1337.YQVeSDOO87RKSea9b4Hrw3yaTnC17JS6HMP.yokGrIw8y', 'empleado', 1),
(16, 'Tito', 'Calderon', 'titocalderon@gmail.com', '$2b$05$JqHtLpaIgDyL3rioLwXvzuEk5UWK1xv536IEICpcTFIPUbuKkPVvW', 'empleado', 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `areas`
--
ALTER TABLE `areas`
  ADD PRIMARY KEY (`id_area`);

--
-- Indices de la tabla `niveles`
--
ALTER TABLE `niveles`
  ADD PRIMARY KEY (`numero_nivel`);

--
-- Indices de la tabla `respuestas_solicitudes`
--
ALTER TABLE `respuestas_solicitudes`
  ADD PRIMARY KEY (`id_respuesta`),
  ADD KEY `id_solicitud` (`id_solicitud`),
  ADD KEY `id_soporte` (`id_soporte`);

--
-- Indices de la tabla `solicitudes`
--
ALTER TABLE `solicitudes`
  ADD PRIMARY KEY (`id_solicitud`),
  ADD KEY `id_emisor` (`id_emisor`),
  ADD KEY `id_area` (`id_area`),
  ADD KEY `numero_nivel` (`numero_nivel`),
  ADD KEY `id_soporte` (`id_soporte`);

--
-- Indices de la tabla `turnos`
--
ALTER TABLE `turnos`
  ADD PRIMARY KEY (`id_turno`);

--
-- Indices de la tabla `turnos_asignaciones`
--
ALTER TABLE `turnos_asignaciones`
  ADD PRIMARY KEY (`id_asignacion`),
  ADD KEY `id_turno` (`id_turno`),
  ADD KEY `id_soporte` (`id_soporte`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `areas`
--
ALTER TABLE `areas`
  MODIFY `id_area` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `respuestas_solicitudes`
--
ALTER TABLE `respuestas_solicitudes`
  MODIFY `id_respuesta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `solicitudes`
--
ALTER TABLE `solicitudes`
  MODIFY `id_solicitud` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT de la tabla `turnos`
--
ALTER TABLE `turnos`
  MODIFY `id_turno` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `turnos_asignaciones`
--
ALTER TABLE `turnos_asignaciones`
  MODIFY `id_asignacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `respuestas_solicitudes`
--
ALTER TABLE `respuestas_solicitudes`
  ADD CONSTRAINT `respuestas_solicitudes_fk_solicitud` FOREIGN KEY (`id_solicitud`) REFERENCES `solicitudes` (`id_solicitud`),
  ADD CONSTRAINT `respuestas_solicitudes_fk_soporte` FOREIGN KEY (`id_soporte`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `solicitudes`
--
ALTER TABLE `solicitudes`
  ADD CONSTRAINT `solicitudes_fk_area` FOREIGN KEY (`id_area`) REFERENCES `areas` (`id_area`),
  ADD CONSTRAINT `solicitudes_fk_emisor` FOREIGN KEY (`id_emisor`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `solicitudes_fk_nivel` FOREIGN KEY (`numero_nivel`) REFERENCES `niveles` (`numero_nivel`),
  ADD CONSTRAINT `solicitudes_fk_soporte` FOREIGN KEY (`id_soporte`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `turnos_asignaciones`
--
ALTER TABLE `turnos_asignaciones`
  ADD CONSTRAINT `turnos_asignaciones_fk_soporte` FOREIGN KEY (`id_soporte`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `turnos_asignaciones_fk_turno` FOREIGN KEY (`id_turno`) REFERENCES `turnos` (`id_turno`);
COMMIT;
