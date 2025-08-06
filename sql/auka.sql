-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 07-08-2025 a las 01:57:49
-- Versión del servidor: 10.4.24-MariaDB
-- Versión de PHP: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Base de datos: `auka`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cursos`
--

CREATE TABLE `cursos` (
  `id_curso` int(11) NOT NULL,
  `curso` varchar(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `cursos`
--

INSERT INTO `cursos` (`id_curso`, `curso`) VALUES
(1, '1°1'),
(2, '1°2'),
(3, '1°3'),
(4, '1°4'),
(5, '1°5'),
(6, '2°1'),
(7, '2°2'),
(8, '2°3'),
(9, '2°4'),
(10, '2°5'),
(11, '3°1'),
(12, '3°2'),
(13, '3°3'),
(14, '3°4'),
(15, '4°1'),
(16, '4°2'),
(17, '4°3'),
(18, '4°4'),
(19, '5°1'),
(20, '5°2'),
(21, '5°3'),
(22, '6°1'),
(23, '6°2'),
(24, '6°3'),
(25, '7°1'),
(26, '7°2');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `llamados`
--

CREATE TABLE `llamados` (
  `id_llamado` int(11) NOT NULL,
  `id_preceptor` int(11) DEFAULT NULL,
  `id_emisor` int(11) NOT NULL,
  `id_curso` int(11) NOT NULL,
  `numero_nivel` int(11) NOT NULL DEFAULT 1,
  `mensaje` varchar(300) NOT NULL,
  `fecha_envio` timestamp NOT NULL DEFAULT current_timestamp(),
  `finalizado` tinyint(1) NOT NULL DEFAULT 0,
  `cancelado` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
(1, 'Llamado', 'Situaciones menores donde se requiere la presencia de un preceptor, pero no hay urgencia. Ejemplo: estudiante que necesita hablar con un preceptor, aviso por comportamiento leve, consulta general.'),
(2, 'Moderado', 'Situaciones que requieren intervención rápida, pero no son críticas. Ejemplo: alumno con mareo persistente, falta grave de disciplina, lesión leve como un raspón profundo.'),
(3, 'Urgente', 'Situaciones que pueden escalar y requieren atención inmediata. Ejemplo: pelea física sin lesiones graves, estudiante con crisis emocional fuerte, descompensación de un estudiante con una condición médica conocida.'),
(4, 'Grave', 'Situaciones de alto riesgo que requieren asistencia de profesionales o servicios de emergencia. Ejemplo: desmayo prolongado, convulsiones, heridas serias con sangrado considerable, agresión física con daño evidente.'),
(5, 'Critico', 'Situaciones extremas con riesgo de vida. Ejemplo: paro cardíaco, traumatismo severo, pérdida del conocimiento prolongada, fallecimiento.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `respuestas_llamados`
--

CREATE TABLE `respuestas_llamados` (
  `id_respuesta` int(11) NOT NULL,
  `id_llamado` int(11) NOT NULL,
  `mensaje` varchar(500) NOT NULL,
  `id_preceptor` int(11) NOT NULL,
  `fecha_respuesta` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
  `id_preceptor` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `turnos_asignaciones`
--

INSERT INTO `turnos_asignaciones` (`id_asignacion`, `id_turno`, `id_preceptor`) VALUES
(3, 2, 8),
(4, 3, 8);

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
  `tipo_usuario` enum('preceptor','profesor','directivo','') NOT NULL DEFAULT 'profesor',
  `autorizado` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre`, `apellido`, `email`, `contrasena`, `tipo_usuario`, `autorizado`) VALUES
(8, 'Alejandro Ariel', 'Manrique', 'alejandro@gmail.com', '$2b$05$j007.4grrUBOvurQc4tpBu86J6XjG09flrwfTA1xlwNUjewZx/Fjq', 'preceptor', 1),
(9, 'Carlos Alberto', 'Robello', 'robello@gmail.com', '$2b$05$FHPuGgstOyFL6LLtP/829e./zEEx4agJNoRsh1YMIj6zxDh3GFaT.', 'profesor', 1),
(14, 'cristobal', 'maier', 'cristobalmaier1@gmail.com', '$2b$05$ggMTF3jCdBFBtPXUvhEvL.8bqAdA5gQtseg0RC/PDHxqNRmRt9hou', 'profesor', 1),
(15, 'alejandra', 'fernandez', 'alejandrafernandez@gmail.com', '$2b$05$sBA1337.YQVeSDOO87RKSea9b4Hrw3yaTnC17JS6HMP.yokGrIw8y', 'preceptor', 1),
(16, 'tito', 'calderon', 'titocalderon@gmail.com', '$2b$05$JqHtLpaIgDyL3rioLwXvzuEk5UWK1xv536IEICpcTFIPUbuKkPVvW', 'preceptor', 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `cursos`
--
ALTER TABLE `cursos`
  ADD PRIMARY KEY (`id_curso`);

--
-- Indices de la tabla `llamados`
--
ALTER TABLE `llamados`
  ADD PRIMARY KEY (`id_llamado`),
  ADD KEY `id_profesor` (`id_emisor`,`id_curso`),
  ADD KEY `id_emisor` (`id_emisor`),
  ADD KEY `id_curso` (`id_curso`),
  ADD KEY `numero_nivel` (`numero_nivel`),
  ADD KEY `id_preceptor` (`id_preceptor`);

--
-- Indices de la tabla `niveles`
--
ALTER TABLE `niveles`
  ADD PRIMARY KEY (`numero_nivel`);

--
-- Indices de la tabla `respuestas_llamados`
--
ALTER TABLE `respuestas_llamados`
  ADD PRIMARY KEY (`id_respuesta`),
  ADD KEY `id_llamado` (`id_preceptor`),
  ADD KEY `id_llamado_2` (`id_llamado`);

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
  ADD KEY `id_preceptor` (`id_preceptor`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `cursos`
--
ALTER TABLE `cursos`
  MODIFY `id_curso` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT de la tabla `llamados`
--
ALTER TABLE `llamados`
  MODIFY `id_llamado` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=213;

--
-- AUTO_INCREMENT de la tabla `respuestas_llamados`
--
ALTER TABLE `respuestas_llamados`
  MODIFY `id_respuesta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=156;

--
-- AUTO_INCREMENT de la tabla `turnos`
--
ALTER TABLE `turnos`
  MODIFY `id_turno` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `turnos_asignaciones`
--
ALTER TABLE `turnos_asignaciones`
  MODIFY `id_asignacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `llamados`
--
ALTER TABLE `llamados`
  ADD CONSTRAINT `llamados_ibfk_2` FOREIGN KEY (`id_emisor`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `llamados_ibfk_3` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id_curso`),
  ADD CONSTRAINT `llamados_ibfk_4` FOREIGN KEY (`numero_nivel`) REFERENCES `niveles` (`numero_nivel`),
  ADD CONSTRAINT `llamados_ibfk_5` FOREIGN KEY (`id_preceptor`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `respuestas_llamados`
--
ALTER TABLE `respuestas_llamados`
  ADD CONSTRAINT `respuestas_llamados_ibfk_1` FOREIGN KEY (`id_preceptor`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `respuestas_llamados_ibfk_2` FOREIGN KEY (`id_llamado`) REFERENCES `llamados` (`id_llamado`);

--
-- Filtros para la tabla `turnos_asignaciones`
--
ALTER TABLE `turnos_asignaciones`
  ADD CONSTRAINT `turnos_asignaciones_ibfk_1` FOREIGN KEY (`id_turno`) REFERENCES `turnos` (`id_turno`),
  ADD CONSTRAINT `turnos_asignaciones_ibfk_2` FOREIGN KEY (`id_preceptor`) REFERENCES `usuarios` (`id_usuario`);
COMMIT;
