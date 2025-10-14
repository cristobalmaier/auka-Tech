import { query } from "../bd.js";

class EstadisticasServicio {
    // Solicitudes por día en un rango (por defecto últimos 30 días)
    static async solicitudesPorDia({ dias = 30 } = {}) {
        const sql = `
            SELECT DATE(fecha_envio) AS fecha, COUNT(*) AS total
            FROM solicitudes
            WHERE fecha_envio >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
            GROUP BY DATE(fecha_envio)
            ORDER BY DATE(fecha_envio)
        `;
        return await query(sql, [dias]);
    }

    // Tiempo promedio de respuesta (en minutos) para solicitudes que tienen respuestas
    static async tiempoPromedioRespuesta() {
        const sql = `
            SELECT AVG(TIMESTAMPDIFF(MINUTE, s.fecha_envio, r.fecha_respuesta)) AS minutos_promedio
            FROM solicitudes s
            JOIN respuestas_solicitudes r ON r.id_solicitud = s.id_solicitud
            WHERE r.fecha_respuesta IS NOT NULL
        `;
        return await query(sql);
    }

    // Solicitudes por área
    static async solicitudesPorArea() {
        const sql = `
            SELECT a.area AS nombre_area, COUNT(*) AS total
            FROM solicitudes s
            JOIN areas a ON s.id_area = a.id_area
            GROUP BY a.area
            ORDER BY total DESC
        `;
        return await query(sql);
    }

    // Solicitudes por nivel
    static async solicitudesPorNivel() {
        const sql = `
            SELECT numero_nivel AS nivel, COUNT(*) AS total
            FROM solicitudes
            GROUP BY numero_nivel
            ORDER BY numero_nivel
        `;
        return await query(sql);
    }

    // Rendimiento por agente: número de respuestas y tiempo promedio de respuesta
    static async rendimientoPorSoporte() {
        const sql = `
            SELECT u.id_usuario, u.nombre, u.apellido,
                   COUNT(r.id_respuesta) AS respuestas_count,
                   AVG(TIMESTAMPDIFF(MINUTE, s.fecha_envio, r.fecha_respuesta)) AS minutos_promedio
            FROM respuestas_solicitudes r
            JOIN usuarios u ON r.id_soporte = u.id_usuario
            JOIN solicitudes s ON r.id_solicitud = s.id_solicitud
            GROUP BY u.id_usuario
            ORDER BY respuestas_count DESC
        `;
        return await query(sql);
    }
}

export default EstadisticasServicio;
