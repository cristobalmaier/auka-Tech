import { Router } from 'express'
const solicitudRutas = new Router()

// Modelo para obtener datos
import SolicitudServicio from "../servicios/llamado.servicios.js" // Renombrar archivo luego

// Controlador
import SolicitudControlador from "../controladores/llamado.controlador.js" // Renombrar archivo luego
const solicitudControlador = new SolicitudControlador({ solicitudServicio: SolicitudServicio })

solicitudRutas.get("/", solicitudControlador.obtenerTodas)
solicitudRutas.get("/:id", solicitudControlador.obtenerSolicitudPorId)
solicitudRutas.post("/crear", solicitudControlador.crearSolicitud)
solicitudRutas.delete("/eliminar/:id", solicitudControlador.eliminarSolicitud)
solicitudRutas.put("/actualizar/:id", solicitudControlador.actualizarSolicitud)

export default solicitudRutas