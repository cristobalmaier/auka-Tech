import areaServicio from "../servicios/area.servicios.js"

class AreaControlador {
    constructor({ areaServicio }) {
        this.areaServicio = areaServicio
    }

    obtenerTodos = async (req, res, next) => {
        try {
            const resultado = await this.areaServicio.obtenerTodos()
            res.status(200).json(resultado)
        } catch(err) {
            next(err)
        }
    }

    obtenerAreaPorId = async (req, res, next) => {
        const { id } = req.params

        try {
            const resultado = await this.areaServicio.obtenerAreaPorId({ id })
            res.status(200).json(resultado)
        } catch(err) {
            next(err)
        }
    }

    obtenerAreaPorNombre = async (req, res, next) => {
        const { nombre } = req.params

        try {
            const resultado = await this.areaServicio.obtenerAreaPorNombre({ nombre })
            res.status(200).json(resultado)
        } catch(err) {
            next(err)
        }
    }

    crearArea = async (req, res, next) => {
        const { nombre } = req.body

        try {
            const resultado = await this.areaServicio.crearArea({ nombre })
            res.status(200).json(resultado)
        } catch(err) {
            next(err)
        }
    }

    actualizarArea = async (req, res, next) => {
        const { id, nombre } = req.body

        try {
            const resultado = await this.areaServicio.actualizarArea({ id, nombre })
            res.status(200).json(resultado)
        } catch(err) {
            next(err)
        }
    }

    eliminarArea = async (req, res, next) => {
        const { id } = req.params

        try {
            const resultado = await this.areaServicio.eliminarArea({ id })
            res.status(200).json(resultado)
        } catch(err) {
            next(err)
        }
    }
}

export default AreaControlador