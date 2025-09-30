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

    res.render('paneles/soporte', { titulo: 'AUKA - Panel', usuario, solicitudes, turnos })
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

    if(solicitud == null) solicitud = []

    const resultadoRespuesta = await peticion({ url: `${API_URL}/respuestas?solicitudId=${solicitud[0]?.id_solicitud}`, metodo: 'GET' })
    let respuesta = await resultadoRespuesta.json()

    if(respuesta == null) respuesta = []

    const objetoSolicitud = {
        data: {
            id: solicitud[0]?.id_solicitud,
            mensaje: solicitud[0]?.mensaje,
            nivel: solicitud[0]?.numero_nivel,
            fecha: solicitud[0]?.fecha_envio,
            finalizado: solicitud[0]?.finalizado,
        },
        respuesta: {
            id: respuesta[0]?.id_respuesta,
            mensaje: respuesta[0]?.mensaje,
            fecha: respuesta[0]?.fecha_respuesta,
            usuario: {
                id: respuesta[0]?.id_soporte,
                nombre: respuesta[0]?.nombre_usuario,
                apellido: respuesta[0]?.apellido_usuario
            }
        },
        areas
    }

    res.render('paneles/empleado', { titulo: 'AUKA - Panel', usuario, solicitud: objetoSolicitud, turnos })
})

export default panelRutas
