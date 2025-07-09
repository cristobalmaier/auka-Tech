import { query } from "../bd.js";
import { validarSolicitud } from "../validadores/llamado.js"; // Asume que el validador será adaptado luego
import ErrorCliente from "../utiles/error.js";

class SolicitudServicio {
    static async obtenerTodas({ id_empleado, id_soporte }) {
        let sql = `SELECT s.*, emp.nombre AS nombre_empleado, emp.apellido AS apellido_empleado, so.nombre AS nombre_soporte, so.apellido AS apellido_soporte, p.nombre_prioridad, p.id_prioridad
                   FROM solicitudes s
                   JOIN usuarios emp ON s.id_empleado = emp.id_usuario
                   LEFT JOIN usuarios so ON s.id_soporte = so.id_usuario
                   JOIN prioridades p ON s.id_prioridad = p.id_prioridad`;
        let valores = [];
        if (id_empleado) {
            sql += ' WHERE s.id_empleado = ?';
            valores.push(id_empleado);
        } else if (id_soporte) {
            sql += ' WHERE s.id_soporte = ?';
            valores.push(id_soporte);
        }
        sql += ' ORDER BY s.fecha_envio DESC';
        const resultado = await query(sql, valores);
        return resultado;
    }

    static async obtenerSolicitudPorId({ id }) {
        const resultado = await query(`SELECT * FROM solicitudes WHERE id_solicitud = ?`, id)
        return resultado
    }

    static async crearSolicitud({ id_empleado, tipo, ubicacion, id_prioridad, mensaje }) {
        // Validación (asume que el validador será adaptado)
        // const { valido, errores } = validarSolicitud({ id_empleado, tipo, ubicacion, id_prioridad, mensaje })
        // if (!valido) throw new ErrorCliente(Object.values(errores)[0], 400)

        // Verifica existencia de empleado
        const empleadoExiste = await query('SELECT * FROM usuarios WHERE id_usuario = ? AND tipo_usuario = "empleado"', id_empleado)
        if (!empleadoExiste) throw new ErrorCliente('El empleado no existe', 400)

        // Verifica existencia de prioridad
        const prioridadExiste = await query('SELECT * FROM prioridades WHERE id_prioridad = ?', id_prioridad)
        if (!prioridadExiste) throw new ErrorCliente('La prioridad no existe', 400)

        const resultado = await query(`INSERT INTO solicitudes (id_empleado, tipo, ubicacion, id_prioridad, mensaje) VALUES (?, ?, ?, ?, ?)`, [id_empleado, tipo, ubicacion, id_prioridad, mensaje])
        return resultado
    }

    static async eliminarSolicitud({ id }) {
        const resultado = await query(`DELETE FROM solicitudes WHERE id_solicitud = ?`, id)
        return resultado
    }

    static async actualizarSolicitud({ id_solicitud, id_soporte, tipo, ubicacion, id_prioridad, mensaje, estado }) {
        let solicitud = {
            id_soporte,
            tipo,
            ubicacion,
            id_prioridad,
            mensaje,
            estado
        };
        // Elimina campos vacíos
        solicitud = Object.fromEntries(
            Object.entries(solicitud).filter(([_, valor]) => valor !== undefined)
        );
        const campos = Object.keys(solicitud);
        const valores = Object.values(solicitud);
        if (campos.length === 0) return;
        const setClause = campos.map((campo) => `${campo} = ?`).join(', ');
        const consulta = `UPDATE solicitudes SET ${setClause} WHERE id_solicitud = ?;`;
        try {
            await query(consulta, [...valores, id_solicitud]);
        } catch (err) {
            throw new ErrorCliente(err.message, 400);
        }
    }
}

export default SolicitudServicio