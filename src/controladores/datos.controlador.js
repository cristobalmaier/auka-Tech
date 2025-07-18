class DatosControlador {
    constructor({ datosServicio }) {
        this.datosServicio = datosServicio
    }
    
    todosLosDatos = async (req, res, next) => {
        try {
            const resultado = await this.datosServicio.todosLosDatos()
            res.status(200).json(resultado)
        } catch(err) {
            next(err)
        }
    }

    tablasTamano = async (req, res, next) => {
        try {
            const resultado = await this.datosServicio.tablasTamano()
            res.status(200).json(resultado)
        } catch(err) {
            next(err)
        }
    }

    llamadosDelMes = async (req, res, next) => {
        try {
            const resultado = await this.datosServicio.llamadosDelMes()
            res.status(200).json(resultado)
        } catch(err) {
            next(err)
        }
    }
}

export default DatosControlador