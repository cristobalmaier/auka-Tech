import { query } from "../bd.js";
import { validarLlamado } from "../validadores/llamado.js";
import ErrorCliente from "../utiles/error.js";

class LlamadoServicio {
    static async obtenerTodos({ usuarioId }) {
        if(usuarioId) {
            const resultado = await query("SELECT l.*,prof.nombre,prof.apellido, n.nombre_nivel, n.numero_nivel,prec.nombre AS nombre_soporte,prec.apellido AS apellido_soporte,c.curso FROM solicitudes l JOIN usuarios prof ON l.id_emisor = prof.id_usuario LEFT JOIN usuarios sop ON l.id_soporte = sop.id_usuario JOIN cursos c ON l.id_curso = c.id_curso JOIN niveles n ON l.numero_nivel = n.numero_nivel WHERE l.id_emisor = ? ORDER BY l.fecha_envio DESC", [usuarioId])
            return resultado
        }

        const resultado = await query("SELECT l.*,prof.nombre,prof.apellido, n.nombre_nivel, n.numero_nivel,prec.nombre AS nombre_soporte,prec.apellido AS apellido_soporte,c.curso FROM solicitudes l JOIN usuarios prof ON l.id_emisor = prof.id_usuario LEFT JOIN usuarios sop ON l.id_soporte = sop.id_usuario JOIN cursos c ON l.id_curso = c.id_curso JOIN niveles n ON l.numero_nivel = n.numero_nivel ORDER BY l.fecha_envio DESC") 
        return resultado
    }

    static async obtenerLlamadoPorId({ id }) {
        const resultado = await query(`SELECT * FROM solicitudes WHERE id_llamado = ?`, id)
        return resultado
    }

    static async crearLlamado({ id_soporte, id_emisor, id_curso, numero_nivel, mensaje }) {
        const { valido, errores } = validarLlamado({ id_soporte, id_emisor, id_curso, numero_nivel, mensaje })
        if (!valido) {
            const mensaje = Object.values(errores)[0]
            throw new ErrorCliente(mensaje, 400)
        }

        if(id_soporte !== null) {
            const preceptorExiste = await query('SELECT * FROM usuarios WHERE id_usuario = ?', id_soporte)
            if (!preceptorExiste) throw new ErrorCliente('El preceptor no existe', 400)
        }

        const emisorExiste = await query('SELECT * FROM usuarios WHERE id_usuario = ?', id_emisor)
        if (!emisorExiste) throw new ErrorCliente('El emisor no existe', 400)


        const resultado = await query(`INSERT INTO solicitudes (id_soporte, id_emisor, id_curso, numero_nivel, mensaje) VALUES (?, ?, ?, ?, ?)`, [id_preceptor, id_emisor, id_curso, numero_nivel, mensaje])
        return resultado
    }

    static async eliminarLlamado({ id }) {
        const resultado = await query(`DELETE FROM solicitudes WHERE id_llamado = ?`, id)
        return resultado
    }

    static async actualizarLlamado({ id_solicitud, id_soporte, id_emisor,  numero_nivel, mensaje, finalizado, cancelado }) {
        let solicitud = {
            id_soporte,
            id_emisor,
            numero_nivel,
            mensaje,
            finalizado,
            cancelado 
        };
    
        // Elimina campos vacíos
        solicitud = Object.fromEntries(
            Object.entries(llamado).filter(([_, valor]) => valor !== undefined)
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

export default LlamadoServicio