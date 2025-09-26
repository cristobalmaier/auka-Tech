import { query } from '../bd.js'

class TurnoServicios {
    static async obtenerTurnos() {
        const resultado = await query(`SELECT t.id_turno, t.nombre_turno, t.hora_inicio, t.hora_final, u.id_usuario, u.nombre, u.apellido, u.tipo_usuario FROM turnos t JOIN turnos_asignaciones ta ON t.id_turno = ta.id_turno JOIN usuarios u ON ta.id_soporte = u.id_usuario`)

        return resultado
    }

    static async obtenerTurnoPorId({ id }) {
        const resultado = await query(`SELECT * FROM turnos WHERE id_turno = ?`, [id])

        return resultado
    } 

    // ! PUEDE SER ELIMINADO
    static async obtenerTurnoPorNombre({ nombre }) {
        const resultado = await query(`SELECT * FROM turnos WHERE nombre_turno = ?`, [nombre])

        return resultado
    }

    static async obtenerTurnoPorUsuario({ id }) {
        const resultado = await query(`SELECT t.id_turno, t.nombre_turno, t.hora_inicio, t.hora_final FROM turnos_asignaciones ta JOIN turnos t ON ta.id_turno = t.id_turno WHERE id_soporte = ?`, [id])

        return resultado
    }

    static async obtenerTurnoPorHora({ hora }) {
        const resultado = await query(`SELECT t.id_turno, t.nombre_turno, t.hora_inicio, t.hora_final, u.id_usuario, u.nombre as nombre_usuario, u.apellido apellido_usuario, u.tipo_usuario FROM turnos t JOIN turnos_asignaciones ta ON t.id_turno = ta.id_turno JOIN usuarios u ON u.id_usuario = ta.id_soporte WHERE ? BETWEEN hora_inicio AND hora_final`, [hora]) 

        return resultado
    }

    static async crearTurno({ nombre, hora_inicio, hora_final }) {
        const resultado = await query(`INSERT INTO turnos (nombre_turno, hora_inicio, hora_final) VALUES (?, ?, ?)`, [nombre, hora_inicio, hora_final])

        return resultado
    }

    static async eliminarTurno({ id }) {
        const resultado = await query(`DELETE FROM turnos WHERE id_turno = ?`, [id])

        return resultado
    }

    static async asignarTurno({ id_usuario, id_turno }) {
        const yaFueAsignado = await query(`SELECT * FROM turnos_asignaciones WHERE id_soporte = ? AND id_turno = ?`, [id_usuario, id_turno])
        if(yaFueAsignado) throw new ErrorCliente('Este usuario ya fue asignado a este turno', 400)

        const esSoporte = await query(`SELECT * FROM usuarios WHERE id_usuario = ? AND tipo_usuario = 'soporte'`, [id_usuario])
        if(!esSoporte) throw new ErrorCliente('Este usuario no es Soporte Tecnico', 400) 

        const resultado = await query(`INSERT INTO turnos_asignaciones (id_soporte, id_turno) VALUES (?, ?)`, [id_usuario, id_turno])
        return resultado
    }

    static async desasignarTurno({ id_usuario, id_turno }) {
        const noFueAsignado = await query(`SELECT * FROM turnos_asignaciones WHERE id_preceptor = ? AND id_turno = ?`, [id_usuario, id_turno])
        if(!noFueAsignado) throw new ErrorCliente('Este usuario no fue asignado a este turno', 400)

        const resultado = await query(`DELETE FROM turnos_asignaciones WHERE id_preceptor = ? AND id_turno = ?`, [id_usuario, id_turno])

        return resultado
    }
}

export default TurnoServicios