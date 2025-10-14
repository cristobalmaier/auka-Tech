import EstadisticasServicio from "../servicios/estadisticas.servicios.js";

class EstadisticasControlador {
    static async solicitudesPorDia(req, res, next) {
        try {
            const dias = parseInt(req.query.dias) || 30;
            const resultado = await EstadisticasServicio.solicitudesPorDia({ dias });

            // Construir serie completa de los últimos `dias` días
            const seriesMap = new Map();
            if (Array.isArray(resultado)) {
                for (const row of resultado) {
                    // row.fecha puede ser Date|string
                    const fecha = row.fecha instanceof Date ? row.fecha.toISOString().split('T')[0] : String(row.fecha)
                    seriesMap.set(fecha, Number(row.total) || 0)
                }
            }

            const labels = []
            const data = []
            for (let i = dias - 1; i >= 0; i--) {
                const d = new Date()
                d.setDate(d.getDate() - i)
                const key = d.toISOString().split('T')[0]
                labels.push(key)
                data.push(seriesMap.get(key) || 0)
            }

            res.status(200).json({ labels, data });
        } catch (err) {
            next(err);
        }
    }

    static async tiempoPromedioRespuesta(req, res, next) {
        try {
            const resultado = await EstadisticasServicio.tiempoPromedioRespuesta();
            res.status(200).json(resultado && resultado[0] ? resultado[0] : { minutos_promedio: null });
        } catch (err) {
            next(err);
        }
    }

    static async solicitudesPorArea(req, res, next) {
        try {
            const resultado = await EstadisticasServicio.solicitudesPorArea();
            res.status(200).json(resultado || []);
        } catch (err) {
            next(err);
        }
    }

    static async solicitudesPorNivel(req, res, next) {
        try {
            const resultado = await EstadisticasServicio.solicitudesPorNivel();
            res.status(200).json(resultado || []);
        } catch (err) {
            next(err);
        }
    }

    static async rendimientoPorSoporte(req, res, next) {
        try {
            const resultado = await EstadisticasServicio.rendimientoPorSoporte();
            res.status(200).json(resultado || []);
        } catch (err) {
            next(err);
        }
    }
}

export default EstadisticasControlador;
