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

    const llamadosResultado = await peticion({ url: `${API_URL}/llamados`, metodo: 'GET' })
    const llamados = await llamadosResultado.json()

    const turnosResultado = await peticion({ url: `${API_URL}/turnos/hora/${hora_actual}`, metodo: 'GET' })
    const turnos = await turnosResultado.json()

    console.log(usuario)
    console.log(llamados)
    console.log(turnos)

    res.render('paneles/preceptor', { titulo: 'AUKA - Panel', usuario, llamados, turnos })
})

panelRutas.get('/panel/empleado', [estaLogeado, esEmpleado], async (req, res) => {
    const hora_actual = tiempo({ fecha: new Date() })
    const usuario = obtenerDatosToken(req)

    const turnosResultado = await peticion({ url: `${API_URL}/turnos/hora/${hora_actual}`, metodo: 'GET' })
    const turnos = await turnosResultado.json()
    
    const cursosResultado = await peticion({ url: `${API_URL}/cursos`, metodo: 'GET' })
    const cursos = await cursosResultado.json()

    const resultadoLlamado = await peticion({ url: `${API_URL}/llamados?usuarioId=${usuario.id_usuario}`, metodo: 'GET' })
    let llamado = await resultadoLlamado.json()

    if(llamado == null) llamado = []

    const resultadoRespuesta = await peticion({ url: `${API_URL}/respuestas?llamadoId=${llamado[0]?.id_llamado}`, metodo: 'GET' })
    let respuesta = await resultadoRespuesta.json()

    if(respuesta == null) respuesta = []

    const objetoLlamado = {
        data: {
            id: llamado[0]?.id_llamado,
            mensaje: llamado[0]?.mensaje,
            nivel: llamado[0]?.numero_nivel,
            fecha: llamado[0]?.fecha_envio,
            finalizado: llamado[0]?.finalizado,
        },
        respuesta: {
            id: respuesta[0]?.id_respuesta,
            mensaje: respuesta[0]?.mensaje,
            fecha: respuesta[0]?.fecha_respuesta,
            usuario: {
                id: respuesta[0]?.id_preceptor,
                nombre: respuesta[0]?.nombre_usuario,
                apellido: respuesta[0]?.apellido_usuario
            }
        },
        cursos
    }

    res.render('paneles/profesor', { titulo: 'AUKA - Panel', usuario, llamado: objetoLlamado, turnos })
})

export default panelRutas
