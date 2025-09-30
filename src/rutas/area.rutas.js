import { Router } from 'express'
const areaRutas = new Router()

// Modelo para obtener datos
import AreaServicio from "../servicios/area.servicios.js"

// Controlador
import AreaControlador from "../controladores/area.controlador.js"
const areaControlador = new AreaControlador({ areaServicio: AreaServicio })

areaRutas.get("/", areaControlador.obtenerTodos)
areaRutas.get("/:id", areaControlador.obtenerAreaPorId)
areaRutas.get("/nombre/:nombre", areaControlador.obtenerAreaPorNombre)
areaRutas.post("/crear", areaControlador.crearArea)
areaRutas.put("/actualizar/:id", areaControlador.actualizarArea)
areaRutas.delete("/eliminar/:id", areaControlador.eliminarArea)

export default areaRutas