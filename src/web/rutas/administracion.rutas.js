import { Router } from 'express'
const administracionRutas = new Router()
import { io } from '../../index.js'

// ! Agregar funcion esDirectivo mas tarde
// import { esDirectivo } from '../utiles/auth.js'
import { obtenerDatosToken } from '../utiles/obtenerDatosToken.js'
import { peticion } from "../utiles/peticion.js"

// Ruta para el panel de administracion
administracionRutas.get('/panel/administracion', async (req, res) => {
    try {
        const usuario = obtenerDatosToken(req)

        // Obtener solicitudes
        const solicitudes = await peticion({ url: `${process.env.API_URL}/solicitudes`, metodo: `GET` })
        const solicitudesResultado = await solicitudes.json()

        // Obtener datos de la base de datos
        const datos = await peticion({ url: `${process.env.API_URL}/data/database`, metodo: `GET` })
        const datosResultado = await datos.json()

        // Obtener lista de usuarios
        const usuariosResponse = await peticion({ 
            url: `${process.env.API_URL}/usuarios`, 
            metodo: 'GET',
            cabeceras: {
                'Authorization': req.headers.authorization
            }
        })
        const usuarios = await usuariosResponse.json()

        res.render('paneles/administracion', {
            titulo: 'AukaTech - Panel',
            usuario,
            solicitudesResultado: solicitudesResultado || [],
            rutaActual: '/panel/administracion',
            datos: datosResultado,
            usuarios: usuarios || []
        })
    } catch (error) {
        console.error('Error al cargar el panel de administración:', error)
        res.status(500).send('Error al cargar el panel de administración')
    }
})

    // Panel avanzado para administradores: visualización de estadísticas
    administracionRutas.get('/panel/administracion-avanzada', async (req, res) => {
        try {
            const usuario = obtenerDatosToken(req)

            // Renderizar vista que consumirá los endpoints de estadisticas
            res.render('paneles/administracion_avanzada', {
                titulo: 'AukaTech - Panel Avanzado',
                usuario
            })
        } catch (error) {
            console.error('Error al cargar el panel avanzado:', error)
            res.status(500).send('Error al cargar el panel avanzado')
        }
    })

// Ruta para actualizar el estado de verificación de un usuario
administracionRutas.put('/api/usuarios/:id/verificar', async (req, res) => {
    try {
        const { id } = req.params;
        const { autorizado } = req.body;

        // Verificar que el ID sea un número válido
        if (isNaN(parseInt(id))) {
            return res.status(400).json({ mensaje: 'ID de usuario no válido' });
        }

        // Verificar que autorizado sea un valor booleano
        if (typeof autorizado !== 'boolean') {
            return res.status(400).json({ mensaje: 'El campo autorizado debe ser un valor booleano' });
        }

        const response = await peticion({
            url: `${process.env.API_URL}/usuarios/actualizar/${id}`,
            metodo: 'PUT',
            cuerpo: { autorizado },
            cabeceras: {
                'Content-Type': 'application/json',
                'Authorization': req.headers.authorization || ''
            }
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.mensaje || 'Error al actualizar el estado de verificación del usuario');
        }

        const data = await response.json().catch(() => ({}));
        
        if (response.ok) {
            // Obtener el email del usuario verificado para la notificación
            const userResponse = await peticion({
                url: `${process.env.API_URL}/usuarios/${id}`,
                metodo: 'GET',
                cabeceras: {
                    'Authorization': req.headers.authorization || ''
                }
            });

            if (userResponse.ok) {
                const userData = await userResponse.json();
                console.log('Datos del usuario obtenidos:', userData); // Debug log
                
                if (userData && userData.length > 0) {
                    // Emitir evento de verificación a través de WebSocket
                    io.emit('account_verified', { 
                        email: userData[0].email,
                        userId: id,
                        timestamp: new Date().toISOString()
                    });
                } else {
                    console.error('No se encontraron datos del usuario');
                }
            } else {
                console.error('Error al obtener datos del usuario:', userResponse.statusText);
            }

            return res.json({ mensaje: 'Estado de verificación actualizado correctamente' });
        }
    } catch (error) {
        console.error('Error al actualizar el estado de verificación:', error);
        res.status(500).json({ 
            mensaje: error.message || 'Error al actualizar el estado de verificación',
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

export default administracionRutas