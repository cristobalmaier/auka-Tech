import { Router } from "express";
const datosRutas = new Router()

import DatosServicios from "../servicios/datos.servicios.js";

import DatosControlador from "../controladores/datos.controlador.js";
const datosControlador = new DatosControlador({ datosServicio: DatosServicios })

datosRutas.get('/database', datosControlador.todosLosDatos)
datosRutas.get('/size/database', datosControlador.tablasTamano)
datosRutas.get('/solicitudes/database', datosControlador.solicitudesDelMes)

export default datosRutas