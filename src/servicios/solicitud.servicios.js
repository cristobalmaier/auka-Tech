import { query } from "../bd.js";
import { validarSolicitud } from "../validadores/solicitud.js";
import ErrorCliente from "../utiles/error.js";

class SolicitudServicio {
    static async obtenerTodos({ usuarioId }) {
        if(usuarioId) {
            const resultado = await query("SELECT s.*,emp.nombre,emp.apellido, n.nombre_nivel, n.numero_nivel,sop.nombre AS nombre_soporte,sop.apellido AS apellido_soporte,a.area FROM solicitudes s JOIN usuarios emp ON s.id_emisor = emp.id_usuario LEFT JOIN usuarios sop ON s.id_soporte = sop.id_usuario JOIN areas a ON s.id_area = a.id_area JOIN niveles n ON s.numero_nivel = n.numero_nivel WHERE s.id_emisor = ? ORDER BY s.fecha_envio DESC", [usuarioId])
            return resultado
        }

        const resultado = await query("SELECT s.*,emp.nombre,emp.apellido, n.nombre_nivel, n.numero_nivel,sop.nombre AS nombre_soporte,sop.apellido AS apellido_soporte,a.area FROM solicitudes s JOIN usuarios emp ON s.id_emisor = emp.id_usuario LEFT JOIN usuarios sop ON s.id_soporte = sop.id_usuario JOIN areas a ON s.id_area = a.id_area JOIN niveles n ON s.numero_nivel = n.numero_nivel ORDER BY s.fecha_envio DESC") 
        return resultado
    }

    static async obtenerSolicitudPorId({ id }) {
        const resultado = await query(`SELECT * FROM solicitudes WHERE id_solicitud = ?`, id)
        return resultado
    }

    static async crearSolicitud({ id_soporte, id_emisor, id_area, numero_nivel, mensaje }) {
        const { valido, errores } = validarSolicitud({ id_soporte, id_emisor, id_area, numero_nivel, mensaje })
        if (!valido) {
            const mensaje = Object.values(errores)[0]
            throw new ErrorCliente(mensaje, 400)
        }

        if(id_soporte !== null) {
            const soporteExiste = await query('SELECT * FROM usuarios WHERE id_usuario = ?', id_soporte)
            if (!soporteExiste) throw new ErrorCliente('El soporte no existe', 400)
        }

        const emisorExiste = await query('SELECT * FROM usuarios WHERE id_usuario = ?', id_emisor)
        if (!emisorExiste) throw new ErrorCliente('El emisor no existe', 400)

        const areaExiste = await query('SELECT * FROM areas WHERE id_area = ?', id_area)
        if (!areaExiste) throw new ErrorCliente('El área no existe', 400)

        const resultado = await query(`INSERT INTO solicitudes (id_soporte, id_emisor, id_area, numero_nivel, mensaje) VALUES (?, ?, ?, ?, ?)`, [id_soporte, id_emisor, id_area, numero_nivel, mensaje])
        return resultado
    }
    static async eliminarSolicitud({ id }) {
        const resultado = await query(`DELETE FROM solicitudes WHERE id_solicitud = ?`, id)
        return resultado
    }

    static async actualizarSolicitud({ id_solicitud, id_soporte, id_emisor, id_area, numero_nivel, mensaje, finalizado, cancelado, calificacion }) {
        let solicitud = {
            id_soporte,
            id_emisor,
            id_area,
            numero_nivel,
            mensaje,
            finalizado,
            cancelado,
            calificacion
        };
    
        // Elimina campos vacíos
        solicitud = Object.fromEntries(
            Object.entries(solicitud).filter(([_, valor]) => valor !== undefined)
        );
    
        const campos = Object.keys(solicitud);
        const valores = Object.values(solicitud);
    
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