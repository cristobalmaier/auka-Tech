import { Router } from 'express'
const estadisticasRutas = new Router()

import EstadisticasControlador from '../controladores/estadisticas.controlador.js'

estadisticasRutas.get('/solicitudes-por-dia', EstadisticasControlador.solicitudesPorDia)
estadisticasRutas.get('/tiempo-promedio-respuesta', EstadisticasControlador.tiempoPromedioRespuesta)
estadisticasRutas.get('/solicitudes-por-area', EstadisticasControlador.solicitudesPorArea)
estadisticasRutas.get('/solicitudes-por-nivel', EstadisticasControlador.solicitudesPorNivel)
estadisticasRutas.get('/rendimiento-soporte', EstadisticasControlador.rendimientoPorSoporte)

export default estadisticasRutas
