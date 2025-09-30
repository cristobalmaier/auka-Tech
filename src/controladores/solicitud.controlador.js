import ErrorCliente from "../utiles/error.js"
import { validarSolicitud } from "../validadores/solicitud.js"

class SolicitudControlador {
    constructor({ solicitudServicio }) {
        this.solicitudServicio = solicitudServicio
    }

    obtenerTodos = async (req, res, next) => {
        const { usuarioId } = req.query

        try {
            const resultado = await this.solicitudServicio.obtenerTodos({ usuarioId })
            res.status(200).json(resultado)
        } catch(err) {
            next(err)
        }
    }

    obtenerSolicitudPorId = async (req, res, next) => {
        const { id } = req.params

        try {
            const resultado = await this.solicitudServicio.obtenerSolicitudPorId({ id })
            res.status(200).json(resultado)
        } catch(err) {
            next(err)
        }
    }

    crearSolicitud = async (req, res, next) => {
        const { id_soporte, id_emisor, id_area, numero_nivel, mensaje } = req.body || {}

        try {
            const resultado = await this.solicitudServicio.crearSolicitud({ id_soporte, id_emisor, id_area, numero_nivel, mensaje })
            res.status(200).json({ mensaje: 'solicitud creada', data: { id: resultado.insertId } }) 
        } catch(err) {
            next(err)
        }
    }

    eliminarSolicitud = async (req, res, next) => {
        const { id } = req.params

        try {
            const resultado = await this.solicitudServicio.eliminarSolicitud({ id })
            res.status(200).json(resultado)
        } catch(err) {
            next(err)
        }
    }

    actualizarSolicitud = async (req, res, next) => {
        const { id } = req.params

        try {
            const resultado = await this.solicitudServicio.actualizarSolicitud({ id_solicitud: id, ...req.body })
            res.status(200).json(resultado)
        } catch(err) {
            next(err)
        }
    }
}

export default SolicitudControlador