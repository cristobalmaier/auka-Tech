// Sistema de calificación con estrellas

import { peticion } from './peticion.js'
import { alerta } from './alerta.js'

/**
 * Muestra un modal de calificación con estrellas
 * @param {Object} opciones - Opciones del modal
 * @param {string} opciones.nombreSoporte - Nombre del soporte
 * @param {string} opciones.apellidoSoporte - Apellido del soporte
 * @param {number} opciones.solicitudId - ID de la solicitud
 * @returns {Promise<number|null>} - Calificación (1-5) o null si omite
 */
export function mostrarModalCalificacion({
    nombreSoporte = '',
    apellidoSoporte = '',
    solicitudId = null
} = {}) {
    return new Promise((resolve) => {
        // Crear overlay
        const overlay = document.createElement('div');
        overlay.className = 'modal-calificacion-contenedor';
        
        // Crear modal
        const modal = document.createElement('div');
        modal.className = 'modal-calificacion-box';
        
        modal.innerHTML = `
            <div class="modal-calificacion-formulario">
                <div class="modal-calificacion-icono">⭐</div>
                <h2 class="modal-calificacion-titulo">¿Cómo fue tu experiencia?</h2>
                <p class="modal-calificacion-subtitulo">Tu opinión nos ayuda a mejorar</p>
                <p class="modal-calificacion-soporte">${nombreSoporte} ${apellidoSoporte}</p>
                
                <div class="estrellas-contenedor">
                    <span class="estrella" data-valor="1">★</span>
                    <span class="estrella" data-valor="2">★</span>
                    <span class="estrella" data-valor="3">★</span>
                    <span class="estrella" data-valor="4">★</span>
                    <span class="estrella" data-valor="5">★</span>
                </div>
                
                <div class="modal-calificacion-comentario">
                    <label>Comentario (opcional)</label>
                    <textarea 
                        id="comentario-calificacion" 
                        placeholder="Cuéntanos más sobre tu experiencia..."
                        maxlength="300"
                    ></textarea>
                </div>
                
                <div class="modal-calificacion-botones">
                    <button class="modal-calificacion-boton modal-calificacion-boton-omitir" data-accion="omitir">
                        Omitir
                    </button>
                    <button class="modal-calificacion-boton modal-calificacion-boton-enviar" data-accion="enviar" disabled>
                        Enviar
                    </button>
                </div>
            </div>
            
            <div class="modal-calificacion-gracias">
                <div class="modal-calificacion-gracias-icono">🎉</div>
                <h2 class="modal-calificacion-gracias-titulo">¡Gracias por tu opinión!</h2>
                <p class="modal-calificacion-gracias-mensaje">Tu calificación nos ayuda a mejorar nuestro servicio</p>
            </div>
        `;
        
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        
        // Mostrar modal con animación
        setTimeout(() => overlay.classList.add('mostrar'), 10);
        
        // Variables
        let calificacionSeleccionada = 0;
        const estrellas = modal.querySelectorAll('.estrella');
        const botonEnviar = modal.querySelector('[data-accion="enviar"]');
        const botonOmitir = modal.querySelector('[data-accion="omitir"]');
        const formulario = modal.querySelector('.modal-calificacion-formulario');
        const gracias = modal.querySelector('.modal-calificacion-gracias');
        
        // Función para actualizar estrellas
        const actualizarEstrellas = (valor) => {
            estrellas.forEach((estrella, index) => {
                if (index < valor) {
                    estrella.classList.add('activa');
                } else {
                    estrella.classList.remove('activa');
                }
            });
        };
        
        // Event listeners para estrellas
        estrellas.forEach((estrella) => {
            // Click
            estrella.addEventListener('click', () => {
                calificacionSeleccionada = parseInt(estrella.dataset.valor);
                actualizarEstrellas(calificacionSeleccionada);
                botonEnviar.disabled = false;
            });
            
            // Hover
            estrella.addEventListener('mouseenter', () => {
                const valor = parseInt(estrella.dataset.valor);
                estrellas.forEach((e, i) => {
                    if (i < valor) {
                        e.classList.add('hover');
                    } else {
                        e.classList.remove('hover');
                    }
                });
            });
        });
        
        // Quitar hover al salir
        modal.querySelector('.estrellas-contenedor').addEventListener('mouseleave', () => {
            estrellas.forEach(e => e.classList.remove('hover'));
        });
        
        // Función para cerrar modal
        const cerrarModal = (calificacion = null) => {
            overlay.classList.remove('mostrar');
            setTimeout(() => {
                document.body.removeChild(overlay);
                resolve(calificacion);
            }, 200);
        };
        
        // Botón enviar
        botonEnviar.addEventListener('click', async () => {
            if (calificacionSeleccionada === 0) return;
            
            // Guardar en base de datos
            try {
                const resultado = await peticion({
                    url: `/api/solicitudes/actualizar/${solicitudId}`,
                    metodo: 'PUT',
                    cuerpo: {
                        calificacion: calificacionSeleccionada
                    }
                });
                
                if (resultado.ok) {
                    // Mostrar mensaje de agradecimiento
                    formulario.style.display = 'none';
                    gracias.classList.add('mostrar');
                    
                    // Cerrar después de 2 segundos
                    setTimeout(() => {
                        cerrarModal(calificacionSeleccionada);
                        alerta({ mensaje: '¡Gracias por tu calificación!', tipo: 'exito' });
                    }, 2000);
                } else {
                    alerta({ mensaje: 'No se pudo guardar la calificación', tipo: 'error' });
                    cerrarModal(null);
                }
            } catch (error) {
                console.error('Error al guardar calificación:', error);
                alerta({ mensaje: 'Error al guardar la calificación', tipo: 'error' });
                cerrarModal(null);
            }
        });
        
        // Botón omitir
        botonOmitir.addEventListener('click', () => {
            cerrarModal(null);
        });
        
        // Cerrar con ESC
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                cerrarModal(null);
                document.removeEventListener('keydown', handleEsc);
            }
        };
        document.addEventListener('keydown', handleEsc);
    });
}
