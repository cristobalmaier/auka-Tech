import { Router } from 'express'
const panelRutas = new Router()

const API_URL = process.env.API_URL

import { config } from '../../web/config.js'
import { peticion } from '../utiles/peticion.js'
import { tiempo } from '../utiles/tiempo.js'
import { obtenerDatosToken } from '../utiles/obtenerDatosToken.js'
import { esEmpleado, esSoporte, estaLogeado } from '../utiles/auth.js'

panelRutas.get('/panel/soporte', [estaLogeado, esSoporte], async (req, res) => {
    const hora_actual = tiempo({ fecha: new Date() })

    const usuario = obtenerDatosToken(req)

    const solicitudesResultado = await peticion({ url: `${API_URL}/solicitudes`, metodo: 'GET' })
    const solicitudes = await solicitudesResultado.json()

    const turnosResultado = await peticion({ url: `${API_URL}/turnos/hora/${hora_actual}`, metodo: 'GET' })
    const turnos = await turnosResultado.json()

    res.render('paneles/soporte', { titulo: 'AukaTech - Panel', usuario, solicitudes, turnos })
})

panelRutas.get('/panel/empleado', [estaLogeado, esEmpleado], async (req, res) => {
    const hora_actual = tiempo({ fecha: new Date() })
    const usuario = obtenerDatosToken(req)

    const turnosResultado = await peticion({ url: `${API_URL}/turnos/hora/${hora_actual}`, metodo: 'GET' })
    const turnos = await turnosResultado.json()
    
    const areasResultado = await peticion({ url: `${API_URL}/areas`, metodo: 'GET' })
    const areas = await areasResultado.json()

    const resultadoSolicitud = await peticion({ url: `${API_URL}/solicitudes?usuarioId=${usuario.id_usuario}`, metodo: 'GET' })
    let solicitud = await resultadoSolicitud.json()

    // 💡 CORRECCIÓN INICIO: Validar si existe una solicitud activa 
    const tieneSolicitudActiva = Array.isArray(solicitud) && solicitud.length > 0
    let respuesta = []

    if (tieneSolicitudActiva) {
        // Solo buscar la respuesta si existe una solicitud activa
        const resultadoRespuesta = await peticion({ url: `${API_URL}/respuestas?solicitudId=${solicitud[0].id_solicitud}`, metodo: 'GET' })
        respuesta = await resultadoRespuesta.json()
        
        // 🚨 CORRECCIÓN DE SINTAXIS: Se cambió 'respuesta = [])' por 'respuesta = []'
        if(!Array.isArray(respuesta)) respuesta = [] 
    }
    
    const objetoSolicitud = {
        data: {
            // Asignar los datos solo si 'tieneSolicitudActiva' es true, de lo contrario, son null
            id: tieneSolicitudActiva ? solicitud[0].id_solicitud : null,
            mensaje: tieneSolicitudActiva ? solicitud[0].mensaje : null,
            nivel: tieneSolicitudActiva ? solicitud[0].numero_nivel : null,
            fecha: tieneSolicitudActiva ? solicitud[0].fecha_envio : null,
            finalizado: tieneSolicitudActiva ? solicitud[0].finalizado : true, // Es finalizada si no hay una activa
        },
        respuesta: {
            // Usar 'optional chaining' y el operador OR (||) para asegurar null si no hay respuesta
            id: respuesta[0]?.id_respuesta || null,
            mensaje: respuesta[0]?.mensaje || null,
            fecha: respuesta[0]?.fecha_respuesta || null,
            usuario: {
                id: respuesta[0]?.id_soporte || null,
                nombre: respuesta[0]?.nombre_usuario || null,
                apellido: respuesta[0]?.apellido_usuario || null
            }
        },
        areas
    }
    // 💡 CORRECCIÓN FIN

    res.render('paneles/empleado', { titulo: 'AukaTech - Panel', usuario, solicitud: objetoSolicitud, turnos })
})

export default panelRutas