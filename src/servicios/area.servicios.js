import { query } from "../bd.js";

class AreaServicio {
    static async obtenerTodos() {
        const resultado = await query("SELECT * FROM areas")
        return resultado
    }

    static async obtenerAreaPorId({ id }) {
        const resultado = await query(`SELECT * FROM areas WHERE id_area = ?`, id)
        return resultado
    }

    static async obtenerAreaPorNombre({ nombre }) {
        const resultado = await query(`SELECT * FROM areas WHERE area = ?`, nombre)
        return resultado
    }

    static async crearArea({ nombre }) {
        const resultado = await query(`INSERT INTO areas (nombre) VALUES (?)`, nombre)
        return resultado
    }

    static async actualizarArea({ id, nombre }) {
        const resultado = await query(`UPDATE areas SET nombre = ? WHERE id_area = ?`, [nombre, id])
        return resultado
    }

    static async eliminarArea({ id }) {
        const resultado = await query(`DELETE FROM areas WHERE id_area = ?`, id)
        return resultado
    }
}

export default AreaServicio