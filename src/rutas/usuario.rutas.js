import { Router } from "express";
const usuarioRutas = new Router()

// Modelo para obtener datos
import UsuarioServicio from "../servicios/usuario.servicios.js"

// Controlador
import UsuarioControlador from "../controladores/usuario.controlador.js"
const usuarioControlador = new UsuarioControlador({ usuarioServicio: UsuarioServicio })

usuarioRutas.get("/", usuarioControlador.obtenerTodos)
usuarioRutas.get("/:id", usuarioControlador.obtenerUsuarioPorId)
usuarioRutas.post("/crear", usuarioControlador.crearUsuario)
usuarioRutas.put("/actualizar/:id", usuarioControlador.actualizarUsuario)
usuarioRutas.delete("/eliminar/:id", usuarioControlador.eliminarUsuario)
usuarioRutas.post("/validar/contrasena", usuarioControlador.validarContrasena)

export default usuarioRutas

