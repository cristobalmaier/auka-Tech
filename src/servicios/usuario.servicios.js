import { query } from "../bd.js";
import { encriptar, compararContrasena } from "../utiles/encriptar.js";
import ErrorCliente from "../utiles/error.js";
import { validarUsuario, validarActualizacionUsuario } from "../validadores/usuario.js"

class UsuarioServicio {
    static async obtenerTodos({ email }) {
        if(email) {
            const resultado = await query(`SELECT * FROM usuarios WHERE email = ?`, [email])
            return resultado
        }

        const resultado = await query("SELECT * FROM usuarios")
        return resultado
    }

    static async obtenerUsuarioPorId({ id }) {
        const resultado = await query(`SELECT * FROM usuarios WHERE id_usuario = ?`, id)
        return resultado
    }

    static async crearUsuario({ nombre, apellido, email, contrasena, tipo_usuario }) {
        // Validacion de datos
        const { valido, errores } = validarUsuario({ nombre, apellido, email, contrasena, tipo_usuario })
        if (!valido) {
            const mensaje = Object.values(errores)[0]
            throw new ErrorCliente(mensaje, 400)
        }

    // Confirmar que el usuario no existe
    const usuarioExiste = await query(`SELECT * FROM usuarios WHERE email = ?`, [email])
    if (usuarioExiste) throw new ErrorCliente('El usuario ya existe', 400)

    // Crear usuario
    const contrasena_encriptada = await encriptar({ contrasena })
    const resultado = await query(`INSERT INTO usuarios (nombre, apellido, email, contrasena, tipo_usuario) VALUES (?, ?, ?, ?, ?)`, [nombre, apellido, email, contrasena_encriptada, tipo_usuario])
    return resultado
    }

    static async actualizarUsuario({ id, nombre, apellido, email, contrasena, tipo_usuario, autorizado }) {
        const { valido, errores } = validarActualizacionUsuario({ 
            nombre, 
            apellido, 
            email, 
            contrasena, 
            tipo_usuario,
            autorizado
        });
        
        if (!valido) {
            const mensaje = Object.values(errores)[0];
            throw new ErrorCliente(mensaje, 400);
        }
        
        let usuario = {
            nombre,
            apellido,
            email,
            tipo_usuario,
            autorizado
        };
    
        if (contrasena) {
            const contrasena_encriptada = await encriptar({ contrasena });
            usuario.contrasena = contrasena_encriptada;
        }
    
        // Filtrar propiedades indefinidas
        usuario = Object.fromEntries(
            Object.entries(usuario).filter(([_, valor]) => valor !== undefined)
        );
    
        const campos = Object.keys(usuario);
        const valores = Object.values(usuario);
    
        if (campos.length === 0) {
            throw new ErrorCliente('No se proporcionaron datos para actualizar', 400);
        }
    
        const setClause = campos.map((campo) => `${campo} = ?`).join(', ');
        const consulta = `UPDATE usuarios SET ${setClause} WHERE id_usuario = ?`;
    
        try {
            const resultado = await query(consulta, [...valores, id]);
            return resultado;
        } catch(err) {
            console.error('Error al actualizar usuario:', err);
            throw new ErrorCliente('Error al actualizar el usuario en la base de datos', 500);
        }
    }

    static async eliminarUsuario({ id }) {
        const resultado = await query(`DELETE FROM usuarios WHERE id_usuario = ?`, id)
        return resultado
    }

    static async validarContrasena({ email, contrasena }) {
        const resultado = await query('SELECT contrasena FROM usuarios WHERE email = ?', email)
    if(!resultado) throw new ErrorCliente('No se encontró ningún usuario con ese email', 404)
        
    return await compararContrasena({ contrasena, contrasena_encriptada: resultado[0].contrasena })
    }
}

export default UsuarioServicio