import ErrorCliente from "../utiles/error.js"

class UsuarioControlador {
    constructor({ usuarioServicio }) {
        this.usuarioServicio = usuarioServicio
    }

    obtenerTodos = async (req, res, next) => {
        const { email } = req.query

        try {
            const resultado = await this.usuarioServicio.obtenerTodos({ email })

            if(!resultado) 
                return res.status(404).json({ mensaje: 'No se encontro ningún usuario' })

            res.status(200).json(resultado)
        } catch(err) {
            next(err)
        }
    }

    obtenerUsuarioPorId = async (req, res, next) => {
        const { id } = req.params

        try {
            const resultado = await this.usuarioServicio.obtenerUsuarioPorId({ id })
            res.status(200).json(resultado)
        } catch(err) {
            next(err)
        }
    }

    crearUsuario = async (req, res, next) => {
        const  { nombre, apellido, email, contrasena, tipo_usuario = 'empleado' } = req.body || {}
        
        try {
            await this.usuarioServicio.crearUsuario({ nombre, apellido, email, contrasena, tipo_usuario })
            res.status(200).json({ mensaje: "Usuario creado con éxito." })
        } catch(err) {
            next(err)
        }
    }

    actualizarUsuario = async (req, res, next) => {
        const { id } = req.params
        const { nombre, apellido, email, contrasena, tipo_usuario } = req.body || {}

        try {
            await this.usuarioServicio.actualizarUsuario({ id, nombre, apellido, email, contrasena, tipo_usuario })
            res.status(200).json({ mensaje: "Datos actualizados con exito." })
        } catch(err) {
            next(err)
        }
    }

    eliminarUsuario = async (req, res, next) => {
        const { id } = req.params

        try {
            const resultado = await this.usuarioServicio.eliminarUsuario({ id })

            if(!resultado.affectedRows >= 1) throw new ErrorCliente('No se pudo eliminar el usuario', 400)

            res.status(200).json(resultado)   
        } catch(err) {
            next(err)
        }
    }

    validarContrasena = async (req, res, next) => {
        const { email, contrasena } = req.body

        try {
            const resultado = await this.usuarioServicio.validarContrasena({ email, contrasena })

            if(!resultado)
                return res.status(400).json({ mensaje: 'Contraseña incorrecta' })

            res.status(200).json({ mensaje: 'Contraseña correcta' })
        } catch(err) {
            next(err)
        }
    }
}

export default UsuarioControlador