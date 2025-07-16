import { peticion } from '../peticion.js'
import { formatearHora } from '../formatearHora.js'
import { formato } from '../renderizarTiempo.js'
import { alerta } from '../alerta.js'

const socket = io();

// Datos del preceptor logeado
const idPreceptor = document.documentElement.dataset.id_usuario
const nombrePreceptor = document.documentElement.dataset.nombre
const apellidoPreceptor = document.documentElement.dataset.apellido
const tipoUsuario = document.documentElement.dataset.tipo_usuario

const niveles = [
    'leve', 'moderado', 'urgente'
]
const respuestas = [
    "Yendo", "En camino", "Enseguida", "Voy para allá"
]

// Elementos HTML
const llamadosContenedor = document.querySelector('.llamados')
const historialContenedor = document.querySelector('.historial-contenedor')
const noHayLlamados = document.querySelector('.no-hay-llamados')
const notificacion = document.getElementById('notificacion')

// timeago.js (para los minutos pasados en tiempo real)
renderizarTiempos();

/* ////////////////////////////////////////////////////////////////// */

const botonesRespuesta = document.querySelectorAll('.respuesta')

for (const botonRespuesta of botonesRespuesta) {
    const llamado = botonRespuesta.parentElement.parentElement

    const llamadoId = llamado.dataset.llamado_id
    const llamadoMensaje = llamado.dataset.mensaje
    const profesorId = botonRespuesta.dataset.usuario_id
    const textoRespuesta = botonRespuesta.innerText
    const profesorNombre = llamado.dataset.usuario_nombre
    const profesorApellido = llamado.dataset.usuario_apellido

    await responderLlamado({
        profesorId,
        textoRespuesta,
        botonRespuesta,
        profesorNombre,
        llamadoMensaje,
        profesorApellido,
        llamadoId
    })
}

/* ////////////////////////////////////////////////////////////////// */

const botonesRespuestaPersonalizada = document.querySelectorAll('.respuesta-personalizada')

for (const botonRespuestaPersonalizada of botonesRespuestaPersonalizada) {
    botonRespuestaPersonalizada.addEventListener('click', async () => {
        const llamado = botonRespuestaPersonalizada.parentElement.parentElement

        llamado.querySelector('.respuesta-personalizada').classList.add('esconder')
        llamado.querySelector('.respuesta-personalizada-contenedor').classList.remove('esconder')
        llamado.querySelector('.llamado-respuestas').classList.add('esconder')

        llamado.querySelector('.respuesta-personalizada-contenedor input').focus()
    })
}

const botonesCancelarRespuestaPersonalizada = document.querySelectorAll('.boton-cancelar-respuesta-personalizada')

for (const boton of botonesCancelarRespuestaPersonalizada) {
    boton.addEventListener('click', async () => {
        const llamado = boton.parentElement.parentElement.parentElement

        llamado.querySelector('.respuesta-personalizada').classList.remove('esconder')
        llamado.querySelector('.respuesta-personalizada-contenedor').classList.add('esconder')
        llamado.querySelector('.llamado-respuestas').classList.remove('esconder')
    })
}

const botonesEnviar = document.querySelectorAll('.boton-respuesta-personalizada')

for (const boton of botonesEnviar) {
    boton.addEventListener('click', async () => {
        const llamado = boton.parentElement.parentElement.parentElement

        await enviarRespuestaPersonalizada({ boton, llamado })
    })
}

/* ////////////////////////////////////////////////////////////////// */

async function enviarRespuestaPersonalizada({ boton }) {
    const llamado = boton.parentElement.parentElement.parentElement

    const llamadoId = llamado.dataset.llamado_id
    const mensaje = llamado.dataset.mensaje
    const profesorId = llamado.dataset.usuario_id
    const profesorNombre = llamado.dataset.usuario_nombre
    const profesorApellido = llamado.dataset.usuario_apellido
    const nombrePreceptor = document.documentElement.dataset.nombre
    const apellidoPreceptor = document.documentElement.dataset.apellido
    const textoRespuesta = llamado.querySelector('.respuesta-personalizada-input').value

    await procesarLlamado({
        profesorId,
        llamadoId,
        llamadoMensaje: mensaje,
        textoRespuesta,
        nombrePreceptor,
        apellidoPreceptor,
        profesorNombre,
        profesorApellido
    })

    llamado.querySelector('.respuesta-personalizada').classList.add('esconder')
    llamado.querySelector('.respuesta-personalizada-contenedor').classList.add('esconder')
    llamado.querySelector('.llamado-respuestas').classList.remove('esconder')
}

/* ////////////////////////////////////////////////////////////////// */

const botonesTerminado = document.querySelectorAll('.respuesta-terminado')

for (const botonTerminado of botonesTerminado) {
    botonTerminado.addEventListener('click', async () => {
        const llamado = botonTerminado.parentElement.parentElement

        const llamadoId = llamado.dataset.llamado_id
        const mensaje = llamado.dataset.mensaje
        const profesorId = llamado.dataset.usuario_id
        const profesorNombre = llamado.dataset.usuario_nombre
        const profesorApellido = llamado.dataset.usuario_apellido

        await terminarLlamado({
            profesor: {
                id: profesorId,
                nombre: profesorNombre,
                apellido: profesorApellido
            },
            llamado: {
                id: llamadoId,
                mensaje
            }
        })
    })
}

/* ////////////////////////////////////////////////////////////////// */

// ! NUEVO LLAMADO
socket.on('nuevo-llamado', async (data) => {
    const { usuario: profesor, llamado } = data

    const nivelImportancia = niveles[llamado.numero_nivel - 1]
    const nuevoLlamado = document.createElement('div');

    // Animacion
    nuevoLlamado.classList.add('animate__animated', 'animate__fadeInDown')

    // Agregar clases al div
    nuevoLlamado.classList.add('llamado', nivelImportancia);
    nuevoLlamado.dataset.usuario_id = profesor.id
    nuevoLlamado.dataset.llamado_id = llamado.id
    nuevoLlamado.dataset.usuario_nombre = profesor.nombre
    nuevoLlamado.dataset.usuario_apellido = profesor.apellido
    nuevoLlamado.dataset.mensaje = llamado.mensaje
    nuevoLlamado.innerHTML = `
                <div class="llamado-cabecera">
                    <p class="llamado-titulo">${profesor.nombre} ${profesor.apellido}</p>
                    <p class="llamado-mensaje">${llamado.mensaje}</p>
                </div>
                <hr>
                <div class="llamado-cuerpo">
                    <p><span class="llamado-cuerpo-texto">Llamado - <span class="fecha-envio" datetime="${llamado.fecha_envio}"></span></span></p>   
                </div>
                `

    const llamadoRespuestas = document.createElement('div')
    llamadoRespuestas.classList.add('llamado-respuestas')

    for (const textoRespuesta of respuestas) {
        const respuesta = document.createElement('p')
        respuesta.classList.add('respuesta')
        respuesta.innerText = textoRespuesta
        respuesta.dataset.usuario_id = profesor.id

        await responderLlamado({
            botonRespuesta: respuesta,
            llamadoId: llamado.id,
            llamadoMensaje: llamado.mensaje,
            profesorId: profesor.id,
            profesorNombre: profesor.nombre,
            profesorApellido: profesor.apellido,
            textoRespuesta
        })

        llamadoRespuestas.appendChild(respuesta)
    }

    // respuesta personalizada
    const botonRespuestaPersonalizada = document.createElement('p')
    botonRespuestaPersonalizada.classList.add('respuesta-personalizada')
    botonRespuestaPersonalizada.innerText = 'Respuesta personalizada'
    botonRespuestaPersonalizada.dataset.usuario_id = profesor.id

    const respuestaPersonalizadaContenedor = document.createElement('div')
    respuestaPersonalizadaContenedor.classList.add('respuesta-personalizada-contenedor', 'esconder')

    respuestaPersonalizadaContenedor.innerHTML = `
        <input type="text" name="respuesta-personalizada" class="respuesta-personalizada-input" placeholder="Escribe aquí tu respuesta personalizada...">
        <div class="botones">
            <button type="button" class="boton-respuesta-personalizada">Enviar</button>
            <button type="button" class="boton-cancelar-respuesta-personalizada">Cancelar</button>
        </div>
    `

    const botonEnviarRespuesta = respuestaPersonalizadaContenedor.querySelector('.boton-respuesta-personalizada')
    botonEnviarRespuesta.addEventListener('click', async () => {
        await enviarRespuestaPersonalizada({ boton: botonEnviarRespuesta, llamado: llamado })
    })


    llamadoRespuestas.appendChild(botonRespuestaPersonalizada)
    nuevoLlamado.appendChild(respuestaPersonalizadaContenedor)

    botonRespuestaPersonalizada.addEventListener('click', async () => {
        const llamado = botonRespuestaPersonalizada.parentElement.parentElement

        llamado.querySelector('.respuesta-personalizada').classList.add('esconder')
        llamado.querySelector('.respuesta-personalizada-contenedor').classList.remove('esconder')
        llamado.querySelector('.llamado-respuestas').classList.add('esconder')
    })

    nuevoLlamado.appendChild(llamadoRespuestas)
    llamadosContenedor.prepend(nuevoLlamado)

    // Eliminar texto de que no hay llamados
    if (!noHayLlamados.classList.contains('esconder')) {
        noHayLlamados.classList.add('esconder')
    }

    // Renderizar tiempo de envio en la vista del panel
    timeago.render(nuevoLlamado.querySelector('.fecha-envio'), 'es')

    // Reproducir sonido de notificacion
    notificacion.play().catch(err => console.warn('Error al reproducir sonido:', err));
})

/* ////////////////////////////////////////////////////////////////// */

// ! CANCELAR LLAMADO
socket.on('cancelar-llamado', async (data) => {
    const {
        usuario_id: idProfesorLlamado,
        nombre: nombreProfesor,
        apellido: apellidoProfesor,
        fecha_envio: fechaLlamado,
        mensaje
    } = data

    const llamado = document.querySelector('.llamado[data-usuario_id="' + idProfesorLlamado + '"]')

    // Marcar como finalizado y cancelado en la base de datos
    const llamadoId = llamado.dataset.llamado_id

    const resultado = await peticion({
        url: '/api/llamados/actualizar/' + llamadoId,
        metodo: 'PUT',
        cuerpo: {
            id_llamado: llamadoId,
            finalizado: true,
            cancelado: true
        }
    })

    // Si ocurrio un error en la api se muestra una alerta
    if(!resultado.ok) {
        return alerta({ mensaje: 'No se pudo cancelar tu llamado.', tipo: 'error' })
    }

    // Eliminar de la vista
    if (llamado) llamado.remove()

    // Agregar al historial
    agregarHistorial({
        nombre: nombreProfesor,
        apellido: apellidoProfesor,
        mensaje: mensaje,
        estado: 'cancelado',
        fecha: new Date()
    })

    // Mostrar texto si no hay llamados pendientes
    siNoHayLlamados({ noHayLlamados })
})

/* ////////////////////////////////////////////////////////////////// */

// ! ELIMINAR LAS RESPUESTAS DE LOS DEMAS PRECEPTORES
// ? Esta funcion elimina las respuestas del llamado
// ? de los demas preceptores cuando responde un llamado 
// ? para que no puedan responder el mismo llamado 
// ? dos preceptores a la vez
socket.on('eliminar-respuesta-llamado', (data) => {
    const { preceptor_id, llamado_id } = data

    // Solo elimina respuestas de los otros preceptores
    if (preceptor_id == idPreceptor) return

    const llamado = document.querySelector(`.llamado[data-llamado_id="${llamado_id}"`)

    if (llamado) {
        const respuestas = llamado.querySelector(`.llamado-respuestas`)
        respuestas.classList.add('esconder')
    }
})

/* ////////////////////////////////////////////////////////////////// */

// ! AGREGAR AL HISTORIAL DE LLAMADOS
socket.on('agregar-historial', (data) => {
    const { llamado_id, nombre, apellido, mensaje, fecha } = data

    const llamado = document.querySelector(`.llamado[data-llamado_id="${llamado_id}"`)
    if (llamado) llamado.remove()

    // Agregar al historial
    agregarHistorial({
        nombre,
        apellido,
        mensaje,
        fecha
    })

    // Mostrar texto si no hay llamados pendientes
    siNoHayLlamados({ noHayLlamados })
})

/* ////////////////////////////////////////////////////////////////// */

/**
 * @param {Object} usuario
 * @param {Socket} socket
 * @returns {void}
 */
function mostrarBotonesFinales({ profesor, socket, llamado }) {
    const respuestas = document.querySelectorAll(`.llamado[data-usuario_id="${profesor.id}"][data-llamado_id="${llamado.id}"] .respuesta`)
    const respuestaPersonalizada = document.querySelector(`.llamado[data-usuario_id="${profesor.id}"][data-llamado_id="${llamado.id}"] .respuesta-personalizada`)

    if(respuestaPersonalizada)
        respuestaPersonalizada.classList.add('esconder')

    for (const respuesta of respuestas) {
        respuesta.remove()
    }

    const terminado = document.createElement('p')
    terminado.classList.add('respuesta', 'respuesta-terminado')
    terminado.innerText = 'Terminado'
    terminado.dataset.usuario_id = profesor.id

    terminado.addEventListener('click', async () => {
        await terminarLlamado({ profesor, llamado })
    })

    const llamadoRespuestas = document.querySelector(`.llamado[data-usuario_id="${profesor.id}"][data-llamado_id="${llamado.id}"] .llamado-respuestas`)
    llamadoRespuestas.appendChild(terminado)
}

/* ////////////////////////////////////////////////////////////////// */

function agregarHistorial({ nombre, apellido, mensaje, estado, fecha }) {
    estado = estado ? estado : 'finalizado'

    const historialItem = document.createElement('div')
    historialItem.classList.add('historial-item')
    historialItem.classList.add('animate__animated', 'animate__fadeInDown') // Animacion

    historialItem.innerHTML = `
        <div>
            <div class="historial-item-cabecera">
                <p class="historial-item-titulo">
                    ${nombre} ${apellido}
                </p>
                <p class="historial-item-hora">
                    ${formatearHora(fecha)}
                </p>
            </div> 
            <div class="historial-item-mensaje">
                <p class="historial-item-texto">
                    ${mensaje}
                </p>
            </div>
        </div>
        <div class="historial-item-pie">
            <p class="historial-item-estado historial-estado-${estado}">
                <span class="historial-item-estado-texto">
                    ${estado[0].toUpperCase() + estado.slice(1)}
                </span>
            </p>
        </div>
    `

    historialContenedor.prepend(historialItem)
}

/* ////////////////////////////////////////////////////////////////// */

/**
 * Responde a un llamado actualizando la base de datos y enviando datos al cliente
 * 
 * @param {Object} botonRespuesta
 * @param {Number} profesorId
 * @param {String} profesorNombre
 * @param {String} profesorApellido
 * @param {Number} llamadoId
 * @param {String} llamadoMensaje
 * @param {String} textoRespuesta
 * @returns {void}
 */
async function responderLlamado({ botonRespuesta, profesorId, profesorNombre, profesorApellido, llamadoId, llamadoMensaje, textoRespuesta }) {
    botonRespuesta.addEventListener('click', async () => {
        // Guardar respuesta en la base de datos
        const resultado = await peticion({
            url: '/api/respuestas/crear',
            metodo: 'POST',
            cuerpo: {
                llamadoId: llamadoId,
                preceptorId: idPreceptor,
                mensaje: textoRespuesta,
            }
        })

        // Si ocurrio un error en la api se muestra una alerta
        if(!resultado.ok) {
            return alerta({ mensaje: 'No se pudo responder al llamado.', tipo: 'error' })
        }

        const contentType = resultado.headers.get('content-type');
        if (!(contentType && contentType.includes('application/json'))) {
            const text = await resultado.text();
            return alerta({ mensaje: 'Error inesperado: ' + text, tipo: 'error' });
        }

        // Enviar respuesta al profesor
        socket.emit('respuesta-llamado', {
            usuario_id: profesorId,
            respuesta: textoRespuesta,
            nombre: nombrePreceptor,
            apellido: apellidoPreceptor
        })

        // Eliminar botones de respuesta a los demas preceptores
        socket.emit('eliminar-respuesta-llamado', {
            preceptor_id: idPreceptor,
            llamado_id: llamadoId
        })

        // Mostrar alerta de enviado al preceptor
        alerta({ mensaje: `Respuesta enviada a ${profesorNombre} ${profesorApellido}`, tipo: 'exito' })

        // Mostrar botones de finalización
        mostrarBotonesFinales({
            profesor: {
                id: profesorId,
                nombre: profesorNombre,
                apellido: profesorApellido
            },
            llamado: {
                id: llamadoId,
                mensaje: llamadoMensaje
            }
        })
    })
}

async function procesarLlamado({ profesorId, profesorNombre, profesorApellido, llamadoId, llamadoMensaje, textoRespuesta, nombrePreceptor, apellidoPreceptor }) {
    // Guardar respuesta en la base de datos
    const resultado = await peticion({
        url: '/api/respuestas/crear',
        metodo: 'POST',
        cuerpo: {
            llamadoId: llamadoId,
            preceptorId: idPreceptor,
            mensaje: textoRespuesta,
        }
    })

    // Si ocurrio un error en la api se muestra una alerta
    if(!resultado.ok) {
        return alerta({ mensaje: 'No se pudo responder al llamado.', tipo: 'error' })
    }

    const contentType = resultado.headers.get('content-type');
    if (!(contentType && contentType.includes('application/json'))) {
        const text = await resultado.text();
        return alerta({ mensaje: 'Error inesperado: ' + text, tipo: 'error' });
    }

    // Enviar respuesta al profesor
    socket.emit('respuesta-llamado', {
        usuario_id: profesorId,
        respuesta: textoRespuesta,
        nombre: nombrePreceptor,
        apellido: apellidoPreceptor
    })

    // Eliminar botones de respuesta a los demas preceptores
    socket.emit('eliminar-respuesta-llamado', {
        preceptor_id: idPreceptor,
        llamado_id: llamadoId
    })

    // Mostrar alerta de enviado al preceptor
    alerta({ mensaje: `Respuesta enviada a ${profesorNombre} ${profesorApellido}`, tipo: 'exito' })

    // Mostrar botones de finalización
    mostrarBotonesFinales({
        profesor: {
            id: profesorId,
            nombre: profesorNombre,
            apellido: profesorApellido
        },
        llamado: {
            id: llamadoId,
            mensaje: llamadoMensaje
        }
    })
}

/**
 * Finaliza un llamado actualizando la base de datos y enviando datos al cliente
 * 
 * @param {Object} profesor
 * @param {Object} llamado
 * @returns {void}
 */
async function terminarLlamado({ profesor, llamado }) {
    const htmlLlamado = document.querySelector(`.llamado[data-llamado_id="${llamado.id}"`)

    const resultado = await peticion({
        url: '/api/llamados/actualizar/' + llamado.id,
        metodo: 'PUT',
        cuerpo: {
            id_llamado: llamado.id,
            finalizado: true
        }
    })

    if (!resultado.ok) {
        return alerta({ mensaje: 'No se pudo finalizar el llamado.', tipo: 'error' })
    }

    // ! TERMINAR LLAMADO
    socket.emit('terminar-llamado', {
        usuario_id: profesor.id,
        respuesta: "Terminado",
        nombre: nombrePreceptor,
        apellido: apellidoPreceptor,
    })

    socket.emit('agregar-historial', {
        usuario_id: profesor.id,
        llamado_id: llamado.id,
        nombre: profesor.nombre,
        apellido: profesor.apellido,
        mensaje: llamado.mensaje,
        fecha: new Date()
    })

    // Eliminar de la vista
    htmlLlamado.remove()

    // Mostrar texto si no hay llamados pendientes
    siNoHayLlamados({ noHayLlamados })
}

/**
 * Si no hay llamados pendientes muestra el texto "No hay llamados pendientes"
 * 
 * @param {HTMLElement} noHayLlamados
 * @returns {void}
 */
function siNoHayLlamados({ noHayLlamados }) {
    const llamados = document.querySelectorAll('.llamado')

    if (llamados.length == 0) {
        noHayLlamados.classList.remove('esconder')
    }
}

/**
 * Renderiza el tiempo pasado en tiempo real de cada llamado
 * 
 * @returns {void}
 */
function renderizarTiempos() {
    const local = (numero, index) => {
        return [
            ['justo ahora', 'en un rato'],
            ['hace %s segundos', 'en %s segundos'],
            ['hace 1 minuto', 'en 1 minuto'],
            ['hace %s minutos', 'en %s minutos'],
            ['hace 1 hora', 'en 1 hora'],
            ['hace %s horas', 'en %s horas'],
            ['hace 1 día', 'en 1 día'],
            ['hace %s días', 'en %s días'],
            ['hace 1 semana', 'en 1 semana'],
            ['hace %s semanas', 'en %s semanas'],
            ['hace 1 mes', 'en 1 mes'],
            ['hace %s meses', 'en %s meses'],
            ['hace 1 año', 'en 1 año'],
            ['hace %s años', 'en %s años'],
        ][index];
    }

    timeago.register('es', local);

    const nodos = document.querySelectorAll('.fecha-envio')
    if (nodos.length > 0) timeago.render(nodos, 'es')
}