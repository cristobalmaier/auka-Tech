import ErrorCliente from "../utiles/error.js"
import { validarSolicitud } from "../validadores/llamado.js" // Asume que el validador será adaptado luego

class SolicitudControlador {
    constructor({ solicitudServicio }) {
        this.solicitudServicio = solicitudServicio
    }

    obtenerTodas = async (req, res, next) => {
        const { id_empleado, id_soporte } = req.query
        try {
            const resultado = await this.solicitudServicio.obtenerTodas({ id_empleado, id_soporte })
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
        const { id_empleado, tipo, ubicacion, id_prioridad, mensaje } = req.body || {}
        try {
            // Validar datos (asume que el validador será adaptado)
            // const { valido, errores } = validarSolicitud({ id_empleado, tipo, ubicacion, id_prioridad, mensaje })
            // if (!valido) throw new ErrorCliente(Object.values(errores)[0], 400)
            const resultado = await this.solicitudServicio.crearSolicitud({ id_empleado, tipo, ubicacion, id_prioridad, mensaje })
            res.status(200).json({ mensaje: 'Solicitud creada', data: { id: resultado.insertId } })
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