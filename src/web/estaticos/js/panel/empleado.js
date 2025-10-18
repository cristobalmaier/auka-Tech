import { alerta } from '../alerta.js';
import { peticion } from '../peticion.js'
import '../indicador-estado.js'
import { mostrarConfirmacion } from '/js/modal-confirmacion.js'
import { mostrarModalCalificacion } from '/js/modal-calificacion.js'

const socket = io();

// Datos del empleado logeado
const idEmpleado = parseInt(document.documentElement.dataset.id_usuario)
const nombreEmpleado = document.documentElement.dataset.nombre
const apellidoEmpleado = document.documentElement.dataset.apellido
const tipoUsuario = document.documentElement.dataset.tipo_usuario

// Elementos HTML
const formulario = document.getElementById('formulario')
const botonLlamado = document.getElementById('boton-llamado')
const botonCancelarLlamado = document.querySelector('.boton-cancelar')
const botonCerrar = document.querySelector('.boton-cerrar')

const botonesNiveles = document.querySelectorAll('.boton-select')
const inputNivel = document.getElementById('nivel-input')
const inputMensaje = document.getElementById('mensaje')
const limiteCaracteres = document.querySelector('.limite-caracteres')
const textoCaracteresRestantes = document.getElementById('caracteres-restantes')
const textoCaracteresMaximos = document.getElementById('caracteres-maximos')

const primerTitulo = document.querySelector('.estado-llamado-titulo h3')
const estadoLlamado = document.querySelector('.estado-llamado')
const estadoPreceptor = document.querySelector('.estado-llamado-preceptor')
const estadoLlamadoTitulo = document.querySelector('.estado-preceptor-nombre')
const estadoLlamadoTexto = document.querySelector('.preceptor-mensaje-texto')
const estadoProgresoTodos = document.querySelectorAll('.estado-progreso-item')

const hora_recibido = document.querySelector('.hora_recibido')
const hora_respuesta = document.querySelector('.hora_respuesta')

const notificacion = document.getElementById('notificacion')

/* ////////////////////////////////////////////////////////////////// */

// ! RESPUESTA DE LLAMADO (BOTONES DE RESPUESTA DE LOS sOportes)

socket.on('respuesta-llamado', (data) => {
    const {
        nombre: nombreSoporte,
        apellido: apellidoSoporte,
        usuario_id: idEmpleadoSolicitud,
        solicitud_id,
        respuesta
    } = data

    // Si la solicitud no es del mismo empleado, no se muestra la respuesta
    if (idEmpleadoSolicitud != idEmpleado) return

    // Mostrar notificacion
    primerTitulo.innerText = 'Respuesta del soporte'
    estadoPreceptor.classList.remove('esconder')
    estadoLlamadoTitulo.innerText = nombreSoporte + " " + apellidoSoporte
    estadoLlamadoTexto.innerText = respuesta
    estadoProgresoTodos[1].classList.replace('estado-progreso-idle', 'estado-progreso-encamino')
    estadoProgresoTodos[1].querySelector('.fa-circle').classList.replace('fa-circle', 'fa-arrow-right')
    botonCancelarLlamado.classList.add('esconder')

    const hora = new Date()
    hora_respuesta.innerText = `${hora.getHours()}:${hora.getMinutes()}`
    
    notificacion.play() // Sonido de notificacion
})

/* ////////////////////////////////////////////////////////////////// */

// ! TERMINAR LLAMADO (BOTON DE TERMINAR DE LOS soportes)

socket.on('terminar-llamado', async (data) => {
    const {
        nombre: nombreSoporte,
        apellido: apellidoSoporte,
        usuario_id: idEmpleadoSolicitud,
        respuesta
    } = data

    // Si la solicitud es del mismo empleado, no se muestra la respuesta
    if (idEmpleadoSolicitud != idEmpleado) return

    botonCerrar.classList.remove('esconder')
    estadoProgresoTodos[2].querySelector('.fa-circle').classList.replace('fa-circle', 'fa-face-smile')
    estadoProgresoTodos[2].classList.replace('estado-progreso-idle', 'estado-progreso-finalizado')
    
    // Mostrar modal de calificación
    const solicitudId = formulario.dataset.id_solicitud
    if (solicitudId) {
        // Esperar 1 segundo antes de mostrar el modal para mejor UX
        setTimeout(async () => {
            await mostrarModalCalificacion({
                nombreSoporte,
                apellidoSoporte,
                solicitudId
            })
        }, 1000)
    }
})

/* ////////////////////////////////////////////////////////////////// */

botonCerrar.addEventListener('click', () => {
    desbloquearFormulario()
})

/* ////////////////////////////////////////////////////////////////// */

// ! CANCELAR SOLICITUD (BOTON DE CANCELAR)

botonCancelarLlamado.addEventListener('click', async () => {
    // Mostrar confirmación antes de cancelar
    const confirmado = await mostrarConfirmacion({
        titulo: '¿Cancelar solicitud?',
        mensaje: 'Esta acción cancelará tu solicitud de soporte. ¿Estás seguro de que deseas continuar?',
        textoConfirmar: 'Sí, cancelar',
        textoCancelar: 'No, volver',
        icono: '⚠️'
    })

    // Si el usuario no confirma, salir
    if (!confirmado) return

    const mensaje = formulario.dataset.mensaje
    const id_solicitud = formulario.dataset.id_solicitud

    const resultado = await peticion({
        url: '/api/solicitudes/actualizar/' + id_solicitud,
        metodo: 'PUT',
        cuerpo: {
            finalizado: true,
            cancelado: true
        }
    })

    socket.emit('cancelar-llamado', {
        usuario_id: idEmpleado,
        nombre: nombreEmpleado,
        apellido: apellidoEmpleado,
        fecha_envio: new Date(),
        mensaje
    })

    desbloquearFormulario()
    
    // Mostrar alerta de confirmación
    alerta({ mensaje: 'Solicitud cancelada correctamente', tipo: 'exito' })
})

/* ////////////////////////////////////////////////////////////////// */

// ! LLAMADO (BOTON DE LLAMAR)

botonLlamado.addEventListener('click', async () => {
    const mensaje = formulario.mensaje.value
    const nivel = parseInt(formulario.nivel.value)
    const area = parseInt(formulario.area.value)

    // Validaciones
    if(!mensaje || mensaje.length === 0) {
        formulario.mensaje.focus()
        formulario.mensaje.style.borderColor = '#FF0000'
        return alerta({ mensaje: 'Por favor, escribe tu mensaje', tipo: 'error' })
    }

    if(mensaje.length > 300) {
        formulario.mensaje.focus()
        formulario.mensaje.style.borderColor = '#FF0000'
        return alerta({ mensaje: 'Estas sobrepasando el limite de caracteres', tipo: 'error' })
    }

    // Desactivar botones
    bloquearFormulario({ mensaje })

    const resultado = await peticion({
        url: '/api/solicitudes/crear',
        metodo: 'POST',
        cuerpo: {
            id_soporte: null,
            id_emisor: idEmpleado,
            id_area: area,
            numero_nivel: nivel,
            mensaje
        }
    })

    // Si ocurrio un error en la api se muestra una alerta
    if (!resultado.ok) {
        return alerta({ mensaje: 'No se realizar la solicitud, intente de nuevo mas tarde.', tipo: 'error' }) 
    }

    const llamadoInfo = await resultado.json()

    const areaSelect = formulario.area;
    const areaNombre = areaSelect.options[areaSelect.selectedIndex].text;

    socket.emit('nuevo-llamado', {
        usuario: {
            id: idEmpleado,
            nombre: nombreEmpleado,
            apellido: apellidoEmpleado,
            tipo_usuario: tipoUsuario
        },
        solicitud: {
            id: llamadoInfo.data.id,
            fecha_envio: new Date(),
            numero_nivel: nivel,
            mensaje,
            area: areaNombre
        }
    })

    formulario.dataset.mensaje = mensaje
    estadoLlamado.classList.remove('esconder')
    botonLlamado.disabled = true
    botonesNiveles.forEach(boton => boton.disabled = true)

    primerTitulo.innerText = 'Esperando respuesta...'
    estadoPreceptor.classList.add('esconder')
    estadoLlamadoTitulo.innerText = ''

    const faSelector = estadoProgresoTodos[1].querySelector('.fa-arrow-right')
    if(faSelector) faSelector.classList.replace('fa-arrow-right', 'fa-circle')

    const faSelector2 = estadoProgresoTodos[2].querySelector('.fa-face-smile')
    if(faSelector2) faSelector2.classList.replace('fa-face-smile', 'fa-circle')

    botonCerrar.classList.add('esconder')
    botonCancelarLlamado.classList.remove('esconder')

    const hora = new Date()
    hora_recibido.innerText = `${hora.getHours()}:${hora.getMinutes()}`
    hora_respuesta.innerText = ``

    for(const estado of estadoProgresoTodos) {
        estado.classList.replace('estado-progreso-encamino', 'estado-progreso-idle') 
        estado.classList.replace('estado-progreso-finalizado', 'estado-progreso-idle')
    }
})

/* ////////////////////////////////////////////////////////////////// */

// ! SELECCION DE NIVEL DE IMPPORTANCIA DEL LLAMADO

botonesNiveles.forEach(boton => {
    boton.addEventListener('click', () => {
        botonesNiveles.forEach(btn => btn.classList.remove('selected'));
        boton.classList.add('selected');
        inputNivel.value = boton.dataset.nivel;
    });
});

/* ////////////////////////////////////////////////////////////////// */

// ! CARACTERES RESTANTES

inputMensaje.addEventListener('input', () => {
    calcularCaracteres()
})

function calcularCaracteres() {
    const caracteres = inputMensaje.value.length
    const maximo = textoCaracteresMaximos.innerText

    textoCaracteresRestantes.innerText = caracteres

    if(caracteres > maximo) {
        inputMensaje.style.borderColor = '#FF0000'
        limiteCaracteres.style.color = '#FF0000'
        return
    }

    inputMensaje.style.borderColor = 'var(--color-borde)'
    limiteCaracteres.style.color = 'var(--color-texto-secundario)'
}

/* ////////////////////////////////////////////////////////////////// */

function bloquearFormulario({ mensaje }) {
    formulario.dataset.mensaje = mensaje
    estadoLlamado.classList.remove('esconder')
    botonLlamado.disabled = true
    botonesNiveles.forEach(boton => boton.disabled = true)
}

function desbloquearFormulario() {
    formulario.dataset.mensaje = ''

    primerTitulo.innerText = 'Esperando respuesta...'
    estadoPreceptor.classList.add('esconder')
    estadoLlamadoTitulo.innerText = ''
    estadoLlamadoTexto.innerText = 'Pendiente...'
    botonLlamado.disabled = false
    botonesNiveles.forEach(boton => boton.disabled = false)

    const faSelector = estadoProgresoTodos[1].querySelector('.fa-arrow-right')
    if(faSelector) faSelector.classList.replace('fa-arrow-right', 'fa-circle')

    const faSelector2 = estadoProgresoTodos[2].querySelector('.fa-face-smile')
    if(faSelector2) faSelector2.classList.replace('fa-face-smile', 'fa-circle')

    botonCerrar.classList.add('esconder')
    estadoLlamado.classList.add('esconder')

    for(const estado of estadoProgresoTodos) {
        estado.classList.replace('estado-progreso-encamino', 'estado-progreso-idle') 
        estado.classList.replace('estado-progreso-finalizado', 'estado-progreso-idle')
    }
}