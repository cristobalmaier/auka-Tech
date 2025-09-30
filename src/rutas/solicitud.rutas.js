import { Router } from 'express'
const solicitudRutas = new Router()

// Modelo para obtener datos
import SolicitudServicio from "../servicios/solicitud.servicios.js"

// Controlador
import SolicitudControlador from "../controladores/solicitud.controlador.js"
const solicitudControlador = new SolicitudControlador({ solicitudServicio: SolicitudServicio })

solicitudRutas.get("/", solicitudControlador.obtenerTodos)
solicitudRutas.get("/:id", solicitudControlador.obtenerSolicitudPorId)
solicitudRutas.post("/crear", solicitudControlador.crearSolicitud)
solicitudRutas.delete("/eliminar/:id", solicitudControlador.eliminarSolicitud)
solicitudRutas.put("/actualizar/:id", solicitudControlador.actualizarSolicitud)

export default solicitudRutas