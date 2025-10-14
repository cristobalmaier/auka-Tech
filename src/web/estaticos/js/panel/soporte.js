import { peticion } from '../peticion.js'
import { formatearHora } from '../formatearHora.js'
import { formato } from '../renderizarTiempo.js'
import { alerta } from '../alerta.js'
import '../indicador-estado.js'


const socket = io();
// Datos del soporte logeado
const idSoporte = document.documentElement.dataset.id_usuario
const nombreSoporte = document.documentElement.dataset.nombre
const apellidoSoporte = document.documentElement.dataset.apellido
const tipoUsuario = document.documentElement.dataset.tipo_usuario

const niveles = [
    'leve', 'moderado', 'urgente'
]
const respuestas = [
    "Yendo", "En camino", "Enseguida", "Voy para allá"
]

// Elementos HTML
const solicitudesContenedor = document.querySelector('.llamados')
const historialContenedor = document.querySelector('.historial-contenedor')
const noHaySolicitudes = document.querySelector('.no-hay-llamados')
const notificacion = document.getElementById('notificacion')

// timeago.js (para los minutos pasados en tiempo real)
renderizarTiempos();

/* ////////////////////////////////////////////////////////////////// */

const botonesRespuesta = document.querySelectorAll('.respuesta')

for (const botonRespuesta of botonesRespuesta) {
    const solicitud = botonRespuesta.parentElement.parentElement

    const solicitudId = solicitud.dataset.solicitud_id
    const solicitudMensaje = solicitud.dataset.mensaje
    const empleadoId = botonRespuesta.dataset.usuario_id
    const textoRespuesta = botonRespuesta.innerText
    const empleadoNombre = solicitud.dataset.usuario_nombre
    const empleadoApellido = solicitud.dataset.usuario_apellido

    await responderLlamado({
        empleadoId,
        textoRespuesta,
        botonRespuesta,
        empleadoNombre,
        solicitudMensaje,
        empleadoApellido,
        solicitudId
    })
}

/* ////////////////////////////////////////////////////////////////// */

const botonesRespuestaPersonalizada = document.querySelectorAll('.respuesta-personalizada')

for (const botonRespuestaPersonalizada of botonesRespuestaPersonalizada) {
    botonRespuestaPersonalizada.addEventListener('click', async () => {
        const solicitud = botonRespuestaPersonalizada.parentElement.parentElement

        solicitud.querySelector('.respuesta-personalizada').classList.add('esconder')
        solicitud.querySelector('.respuesta-personalizada-contenedor').classList.remove('esconder')
        solicitud.querySelector('.llamado-respuestas').classList.add('esconder')
        solicitud.querySelector('.respuesta-personalizada-contenedor input').focus()
    })
}

// Usar delegación de eventos para los botones de cancelar
document.addEventListener('click', async (event) => {
    // Manejar clic en botón de cancelar
    if (event.target.classList.contains('boton-cancelar-respuesta-personalizada')) {
        const boton = event.target;
        const solicitud = boton.closest('.llamado');
        
        if (solicitud) {
            const respuestaPersonalizada = solicitud.querySelector('.respuesta-personalizada');
            const contenedorPersonalizado = solicitud.querySelector('.respuesta-personalizada-contenedor');
            const respuestas = solicitud.querySelector('.llamado-respuestas');
            const inputRespuesta = solicitud.querySelector('.respuesta-personalizada-input');
            
            if (respuestaPersonalizada) respuestaPersonalizada.classList.remove('esconder');
            if (contenedorPersonalizado) contenedorPersonalizado.classList.add('esconder');
            if (respuestas) respuestas.classList.remove('esconder');
            // Limpiar el campo de texto al cancelar
            if (inputRespuesta) inputRespuesta.value = '';
        }
    }
    
    // Manejar clic en botón de enviar
    if (event.target.classList.contains('boton-respuesta-personalizada')) {
        const boton = event.target;
        const solicitud = boton.closest('.llamado');
        
        if (solicitud) {
            await enviarRespuestaPersonalizada({ boton, solicitud });
        }
    }
});

/* ////////////////////////////////////////////////////////////////// */

async function enviarRespuestaPersonalizada({ boton }) {
    const solicitud = boton.parentElement.parentElement.parentElement
    const inputRespuesta = solicitud.querySelector('.respuesta-personalizada-input')
    const textoRespuesta = inputRespuesta.value.trim()

    // Validar que la respuesta no esté vacía
    if (textoRespuesta.length === 0) {
        alerta({ mensaje: 'Por favor, ingresa un mensaje antes de enviar.', tipo: 'error' });
        inputRespuesta.focus();
        return; // Detener la ejecución si el campo está vacío
    }

    const solicitudId = solicitud.dataset.solicitud_id
    const mensaje = solicitud.dataset.mensaje
    const empleadoId = solicitud.dataset.usuario_id
    const empleadoNombre = solicitud.dataset.usuario_nombre
    const empleadoApellido = solicitud.dataset.usuario_apellido
    const nombreSoporte = document.documentElement.dataset.nombre
    const apellidoSoporte = document.documentElement.dataset.apellido

    await procesarLlamado({
        empleadoId,
        solicitudId,
        solicitudMensaje: mensaje,
        textoRespuesta,
        nombreSoporte,
        apellidoSoporte,
        empleadoNombre,
        empleadoApellido
    })

    // Limpiar el campo de entrada después de enviar
    inputRespuesta.value = '';
    
    solicitud.querySelector('.respuesta-personalizada').classList.add('esconder')
    solicitud.querySelector('.respuesta-personalizada-contenedor').classList.add('esconder')
    solicitud.querySelector('.llamado-respuestas').classList.remove('esconder')
}

/* ////////////////////////////////////////////////////////////////// */

const botonesTerminado = document.querySelectorAll('.respuesta-terminado')

for (const botonTerminado of botonesTerminado) {
    botonTerminado.addEventListener('click', async () => {
        const solicitud = botonTerminado.parentElement.parentElement

        const solicitudId = solicitud.dataset.solicitud_id
        const mensaje = solicitud.dataset.mensaje
        const empleadoId = solicitud.dataset.usuario_id
        const empleadoNombre = solicitud.dataset.usuario_nombre
        const empleadoApellido = solicitud.dataset.usuario_apellido

        await terminarLlamado({
            empleado: {
                id: empleadoId,
                nombre: empleadoNombre,
                apellido: empleadoApellido
            },
            solicitud: {
                id: solicitudId,
                mensaje
            }
        })
    })
}

/* ////////////////////////////////////////////////////////////////// */

// ! NUEVO LLAMADO
socket.on('nuevo-llamado', async (data) => {
    const { usuario: empleado, solicitud } = data

    console.log("recibi el evento: nuevo-llamado");

    const nivelImportancia = niveles[solicitud.numero_nivel - 1]
    const nuevoSolicitud = document.createElement('div');

    // Animacion
    nuevoSolicitud.classList.add('animate__animated', 'animate__fadeInDown')

    // Agregar clases al div
    nuevoSolicitud.classList.add('llamado', nivelImportancia);
    nuevoSolicitud.dataset.usuario_id = empleado.id
    nuevoSolicitud.dataset.solicitud_id = solicitud.id
    nuevoSolicitud.dataset.usuario_nombre = empleado.nombre
    nuevoSolicitud.dataset.usuario_apellido = empleado.apellido
    nuevoSolicitud.dataset.mensaje = solicitud.mensaje
    nuevoSolicitud.innerHTML = `
                <div class="llamado-cabecera">
                    <p class="llamado-titulo">${empleado.nombre} ${empleado.apellido}</p>
                    <p class="llamado-mensaje">${solicitud.mensaje}</p>
                </div>
                <hr>
                <div class="llamado-cuerpo">
                    <p><span class="llamado-cuerpo-texto">Solicitud - <span class="fecha-envio" datetime="${solicitud.fecha_envio}"></span></span></p>   
                </div>
                `

    const solicitudRespuestas = document.createElement('div')
    solicitudRespuestas.classList.add('llamado-respuestas')

    for (const textoRespuesta of respuestas) {
        const respuesta = document.createElement('p')
        respuesta.classList.add('respuesta')
        respuesta.innerText = textoRespuesta
        respuesta.dataset.usuario_id = empleado.id

        await responderLlamado({
            botonRespuesta: respuesta,
            solicitudId: solicitud.id,
            solicitudMensaje: solicitud.mensaje,
            empleadoId: empleado.id,
            empleadoNombre: empleado.nombre,
            empleadoApellido: empleado.apellido,
            textoRespuesta
        })

        solicitudRespuestas.appendChild(respuesta)
    }

    // respuesta personalizada
    const botonRespuestaPersonalizada = document.createElement('p')
    botonRespuestaPersonalizada.classList.add('respuesta-personalizada')
    botonRespuestaPersonalizada.innerText = 'Respuesta personalizada'
    botonRespuestaPersonalizada.dataset.usuario_id = empleado.id

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
        await enviarRespuestaPersonalizada({ boton: botonEnviarRespuesta, solicitud: solicitud })
    })


    solicitudRespuestas.appendChild(botonRespuestaPersonalizada)
    nuevoSolicitud.appendChild(respuestaPersonalizadaContenedor)

    botonRespuestaPersonalizada.addEventListener('click', async () => {
        const solicitud = botonRespuestaPersonalizada.parentElement.parentElement

        solicitud.querySelector('.respuesta-personalizada').classList.add('esconder')
        solicitud.querySelector('.respuesta-personalizada-contenedor').classList.remove('esconder')
        solicitud.querySelector('.llamado-respuestas').classList.add('esconder')
    })

    nuevoSolicitud.appendChild(solicitudRespuestas)
    solicitudesContenedor.prepend(nuevoSolicitud)

    // Eliminar texto de que no hay solicitudes
    if (!noHaySolicitudes.classList.contains('esconder')) {
        noHaySolicitudes.classList.add('esconder')
    }

    // Renderizar tiempo de envio en la vista del panel
    timeago.render(nuevoSolicitud.querySelector('.fecha-envio'), 'es')

    // Reproducir sonido de notificacion
    notificacion.play().catch(err => console.warn('Error al reproducir sonido:', err));
})

/* ////////////////////////////////////////////////////////////////// */

// ! CANCELAR LLAMADO
socket.on('cancelar-llamado', async (data) => {
    const {
        usuario_id: idEmpleadoSolicitud,
        nombre: nombreEmpleado,
        apellido: apellidoEmpleado,
        fecha_envio: fechaSolicitud,
        mensaje
    } = data

    const solicitud = document.querySelector('.llamado[data-usuario_id="' + idEmpleadoSolicitud + '"]')

    // Marcar como finalizado y cancelado en la base de datos
    const solicitudId = solicitud.dataset.solicitud_id

    const resultado = await peticion({
        url: '/api/solicitudes/actualizar/' + solicitudId,
        metodo: 'PUT',
        cuerpo: {
            id_solicitud: solicitudId,
            finalizado: true,
            cancelado: true
        }
    })

    // Si ocurrio un error en la api se muestra una alerta
    if(!resultado.ok) {
        return alerta({ mensaje: 'No se pudo cancelar tu solicitud.', tipo: 'error' })
    }

    // Mostrar notificación al soporte
    alerta({ 
        mensaje: `${nombreEmpleado} ${apellidoEmpleado} canceló su solicitud`, 
        tipo: 'info' 
    })

    // Eliminar de la vista
    if (solicitud) solicitud.remove()

    // Agregar al historial
    agregarHistorial({
        nombre: nombreEmpleado,
        apellido: apellidoEmpleado,
        mensaje: mensaje,
        estado: 'cancelado',
        fecha: new Date()
    })

    // Mostrar texto si no hay solicitudes pendientes
    siNoHaySolicitudes({ noHaySolicitudes })
})

/* ////////////////////////////////////////////////////////////////// */

// ! ELIMINAR LAS RESPUESTAS DE LOS DEMAS SOPORTES
// ? Esta funcion elimina las respuestas del llamado
// ? de los demas soportes cuando responde un llamado
// ? para que no puedan responder el mismo llamado
// ? dos soportes a la vez
socket.on('eliminar-respuesta-llamado', (data) => {
    const { soporte_id, solicitud_id } = data

    // Solo elimina respuestas de los otros soportes
    if (soporte_id == idSoporte) return

    const solicitud = document.querySelector(`.llamado[data-solicitud_id="${solicitud_id}"]`)

    if (solicitud) {
        const respuestas = solicitud.querySelector(`.llamado-respuestas`)
        respuestas.classList.add('esconder')
    }
})

/* ////////////////////////////////////////////////////////////////// */

// ! AGREGAR AL HISTORIAL DE SOLICITUDES
socket.on('agregar-historial', (data) => {
    const { solicitud_id, nombre, apellido, mensaje, fecha } = data

    let solicitud = document.querySelector(`.solicitud[data-solicitud_id="${solicitud_id}"]`)
    if (!solicitud) {
        solicitud = document.querySelector(`.solicitud[data-solicitud_id="${solicitud_id}"]`)
    }
    if (solicitud) solicitud.remove()

    // Agregar al historial
    agregarHistorial({
        nombre,
        apellido,
        mensaje,
        fecha
    })

    // Mostrar texto si no hay solicitudes pendientes
    siNoHaySolicitudes({ noHaySolicitudes })
})

/* ////////////////////////////////////////////////////////////////// */

/**
 * @param {Object} usuario
 * @param {Socket} socket
 * @returns {void}
 */
function mostrarBotonesFinales({ empleado, socket, solicitud }) {
    const llamado = document.querySelector(`.llamado[data-usuario_id="${empleado.id}"][data-solicitud_id="${solicitud.id}"]`)
    
    if (!llamado) {
        console.error('No se encontró el llamado en el DOM')
        return
    }

    const respuestas = llamado.querySelectorAll('.respuesta')
    const respuestaPersonalizada = llamado.querySelector('.respuesta-personalizada')
    const respuestaPersonalizadaContenedor = llamado.querySelector('.respuesta-personalizada-contenedor')
    const llamadoRespuestas = llamado.querySelector('.llamado-respuestas')

    // Ocultar respuesta personalizada si existe
    if(respuestaPersonalizada)
        respuestaPersonalizada.classList.add('esconder')
    
    // Ocultar contenedor de respuesta personalizada si existe
    if(respuestaPersonalizadaContenedor)
        respuestaPersonalizadaContenedor.classList.add('esconder')

    // Eliminar todas las respuestas existentes
    for (const respuesta of respuestas) {
        respuesta.remove()
    }

    // Crear botón de terminado
    const terminado = document.createElement('p')
    terminado.classList.add('respuesta', 'respuesta-terminado')
    terminado.innerText = 'Terminado'
    terminado.dataset.usuario_id = empleado.id

    terminado.addEventListener('click', async () => {
        await terminarLlamado({ empleado, solicitud })
    })

    // Agregar botón de terminado
    if (llamadoRespuestas) {
        llamadoRespuestas.appendChild(terminado)
    }
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
 * @param {Number} empleadoId
 * @param {String} empleadoNombre
 * @param {String} empleadoApellido
 * @param {Number} solicitudId
 * @param {String} solicitudMensaje
 * @param {String} textoRespuesta
 * @returns {void}
 */
async function responderLlamado({ botonRespuesta, empleadoId, empleadoNombre, empleadoApellido, solicitudId, solicitudMensaje, textoRespuesta }) {
    botonRespuesta.addEventListener('click', async () => {
        // Guardar respuesta en la base de datos
        const resultado = await peticion({
            url: '/api/respuestas/crear',
            metodo: 'POST',
            cuerpo: {
                solicitudId: solicitudId,
                soporteId: idSoporte,
                mensaje: textoRespuesta,
            }
        })

        // Si ocurrio un error en la api se muestra una alerta
        if(!resultado.ok) {
            return alerta({ mensaje: 'No se pudo responder la solicitud.', tipo: 'error' })
        }

        // Enviar respuesta al empleado
        socket.emit('respuesta-llamado', {
            usuario_id: empleadoId,
            respuesta: textoRespuesta,
            nombre: nombreSoporte,
            apellido: apellidoSoporte
        })

        // Eliminar botones de respuesta a los demas soportes
        socket.emit('eliminar-respuesta-llamado', {
            soporte_id: idSoporte,
            solicitud_id: solicitudId
        })

        // Mostrar alerta de enviado al soporte
        alerta({ mensaje: `Respuesta enviada a ${empleadoNombre} ${empleadoApellido}`, tipo: 'exito' })

        // Mostrar botones de finalización
        mostrarBotonesFinales({
            empleado: {
                id: empleadoId,
                nombre: empleadoNombre,
                apellido: empleadoApellido
            },
            solicitud: {
                id: solicitudId,
                mensaje: solicitudMensaje
            }
        })
    })
}

async function procesarLlamado({ empleadoId, empleadoNombre, empleadoApellido, solicitudId, solicitudMensaje, textoRespuesta, nombreSoporte, apellidoSoporte }) {
    // Guardar respuesta en la base de datos
    const resultado = await peticion({
        url: '/api/respuestas/crear',
        metodo: 'POST',
        cuerpo: {
            solicitudId: solicitudId,
            soporteId: idSoporte,
            mensaje: textoRespuesta,
        }
    })

    // Si ocurrio un error en la api se muestra una alerta
    if(!resultado.ok) {
        return alerta({ mensaje: 'No se pudo responder la solicitud.', tipo: 'error' })
    }

    // Enviar respuesta al empleado
    socket.emit('respuesta-llamado', {
        usuario_id: empleadoId,
        respuesta: textoRespuesta,
        nombre: nombreSoporte,
        apellido: apellidoSoporte
    })

    // Eliminar botones de respuesta a los demas soportes
    socket.emit('eliminar-respuesta-llamado', {
        soporte_id: idSoporte,
        solicitud_id: solicitudId
    })

    // Mostrar alerta de enviado al soporte
    alerta({ mensaje: `Respuesta enviada a ${empleadoNombre} ${empleadoApellido}`, tipo: 'exito' })

    // Mostrar botones de finalización
    mostrarBotonesFinales({
        empleado: {
            id: empleadoId,
            nombre: empleadoNombre,
            apellido: empleadoApellido
        },
        solicitud: {
            id: solicitudId,
            mensaje: solicitudMensaje
        }
    })
}

/**
 * Finaliza un llamado actualizando la base de datos y enviando datos al cliente
 * 
 * @param {Object} empleado
 * @param {Object} solicitud
 * @returns {void}
 */
async function terminarLlamado({ empleado, solicitud }) {
    
    ///probando
    let htmlSolicitud = document.querySelector(`.llamado[data-solicitud_id="${solicitud.id}"]`)
   

    const resultado = await peticion({
        url: '/api/solicitudes/actualizar/' + solicitud.id,
        metodo: 'PUT',
        cuerpo: {
            id_solicitud: solicitud.id,
            finalizado: true
        }
    })

    if (!resultado.ok) {
        return alerta({ mensaje: 'No se pudo finalizar el llamado.', tipo: 'error' })
    }

    // ! TERMINAR LLAMADO
    socket.emit('terminar-llamado', {
        usuario_id: empleado.id,
        respuesta: "Terminado",
        nombre: empleado.nombre,
        apellido: empleado.apellido,
    })

    socket.emit('agregar-historial', {
        usuario_id: empleado.id,
        solicitud_id: solicitud.id,
        nombre: empleado.nombre,
        apellido: empleado.apellido,
        mensaje: solicitud.mensaje,
        fecha: new Date()
    })

    // Eliminar de la vista
    htmlSolicitud.remove()

    // Mostrar texto si no hay solicitudes pendientes
    siNoHaySolicitudes({ noHaySolicitudes })
}

/**
 * Si no hay solicitudes pendientes muestra el texto "No hay solicitudes pendientes"
 * 
/**
 * Si no hay solicitudes pendientes muestra el texto "No hay solicitudes pendientes"
 * * @param {HTMLElement} noHaySolicitudes
 * @returns {void}
 */
function siNoHaySolicitudes({ noHaySolicitudes }) {
    // 💡 SOLUCIÓN: Buscar elementos con la clase '.llamado' que son las solicitudes pendientes.
    const solicitudes = document.querySelectorAll('.llamado') 

    if (solicitudes.length === 0) {
        noHaySolicitudes.classList.remove('esconder')
    } else {
        // Asegurarse de que se oculte si aún queda al menos un llamado
        noHaySolicitudes.classList.add('esconder')
    }
}

/**
 * Renderiza el tiempo pasado en tiempo real de cada solicitud
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