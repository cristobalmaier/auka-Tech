class RespuestaControlador {
    constructor({ respuestaServicio }) {
        this.respuestaServicio = respuestaServicio
    }

    obtenerRespuestas = async (req, res, next) => {
        const { solicitudId } = req.query

        try {
            const resultado = await this.respuestaServicio.obtenerRespuestas({ solicitudId })
            res.status(200).json(resultado)
        } catch(err) {
            next(err)
        }
    }

    crearRespuesta = async (req, res, next) => {
        const { solicitudId, soporteId, mensaje } = req.body || {}

        try {
            const resultado = await this.respuestaServicio.crearRespuesta({ solicitudId, soporteId, mensaje })
            res.status(200).json({ mensaje: 'respuesta creada', data: { id: resultado.insertId } })
        } catch(err) {
            next(err)
        }
    }

    eliminarRespuesta = async (req, res, next) => {
        const { respuestaId } = req.params

        try {
            const resultado = await this.respuestaServicio.eliminarRespuesta({ respuestaId })
            res.status(200).json(resultado)
        } catch(err) {
            next(err)
        }
    }

    actualizarRespuesta = async (req, res, next) => {
        const { respuestaId, mensaje } = req.body || {}
        
        try {
            const resultado = await this.respuestaServicio.actualizarRespuesta({ respuestaId, mensaje })
            res.status(200).json(resultado)
        } catch(err) {
            next(err)
        }
    }
}

export default RespuestaControlador