-- Agregar campo de calificación a la tabla solicitudes
-- Calificación de 1 a 5 estrellas

ALTER TABLE `solicitudes` 
ADD COLUMN `calificacion` TINYINT(1) NULL DEFAULT NULL 
AFTER `cancelado`;

-- Verificar que se agregó correctamente
-- SELECT * FROM solicitudes LIMIT 5;
