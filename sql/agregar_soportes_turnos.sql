-- Script para agregar más soportes a los turnos
-- Basado en los usuarios existentes en la base de datos

-- Verificar soportes disponibles
-- SELECT id_usuario, nombre, apellido, tipo_usuario FROM usuarios WHERE tipo_usuario = 'soporte';

-- Actualmente tienes:
-- ID 9: Carlos Alberto Robello (ya asignado a turnos 2 y 3)
-- ID 14: Cristobal Maier (no asignado a ningún turno)

-- ============================================
-- AGREGAR CRISTOBAL MAIER A LOS TURNOS
-- ============================================

-- Asignar Cristobal Maier al turno de MAÑANA (id_turno = 1)
INSERT INTO `turnos_asignaciones` (`id_turno`, `id_soporte`) VALUES (1, 14);

-- Asignar Cristobal Maier al turno de TARDE (id_turno = 2)
INSERT INTO `turnos_asignaciones` (`id_turno`, `id_soporte`) VALUES (2, 14);

-- Asignar Cristobal Maier al turno VESPERTINO (id_turno = 3)
INSERT INTO `turnos_asignaciones` (`id_turno`, `id_soporte`) VALUES (3, 14);

-- ============================================
-- AGREGAR CARLOS ROBELLO AL TURNO DE MAÑANA
-- ============================================

-- Carlos ya está en turnos 2 y 3, agregar al turno 1 (mañana)
INSERT INTO `turnos_asignaciones` (`id_turno`, `id_soporte`) VALUES (1, 9);

-- ============================================
-- VERIFICAR RESULTADOS
-- ============================================

-- Ver todas las asignaciones de turnos
-- SELECT 
--     ta.id_asignacion,
--     t.nombre_turno,
--     t.hora_inicio,
--     t.hora_final,
--     u.nombre,
--     u.apellido
-- FROM turnos_asignaciones ta
-- JOIN turnos t ON ta.id_turno = t.id_turno
-- JOIN usuarios u ON ta.id_soporte = u.id_usuario
-- ORDER BY t.id_turno, u.nombre;

-- ============================================
-- OPCIONAL: CREAR NUEVO SOPORTE
-- ============================================

-- Si quieres crear un nuevo soporte desde cero:
-- INSERT INTO `usuarios` (`nombre`, `apellido`, `email`, `contrasena`, `tipo_usuario`, `autorizado`) 
-- VALUES ('Nuevo', 'Soporte', 'nuevosoporte@gmail.com', '$2b$05$FHPuGgstOyFL6LLtP/829e./zEEx4agJNoRsh1YMIj6zxDh3GFaT.', 'soporte', 1);

-- Luego asignarlo a turnos (reemplaza 17 con el ID generado):
-- INSERT INTO `turnos_asignaciones` (`id_turno`, `id_soporte`) VALUES (1, 17);
-- INSERT INTO `turnos_asignaciones` (`id_turno`, `id_soporte`) VALUES (2, 17);
-- INSERT INTO `turnos_asignaciones` (`id_turno`, `id_soporte`) VALUES (3, 17);
