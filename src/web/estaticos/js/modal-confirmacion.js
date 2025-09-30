// Sistema de modal de confirmación

/**
 * Muestra un modal de confirmación
 * @param {Object} opciones - Opciones del modal
 * @param {string} opciones.titulo - Título del modal
 * @param {string} opciones.mensaje - Mensaje del modal
 * @param {string} opciones.textoConfirmar - Texto del botón confirmar (default: "Confirmar")
 * @param {string} opciones.textoCancelar - Texto del botón cancelar (default: "Cancelar")
 * @param {string} opciones.icono - Icono a mostrar (default: "⚠️")
 * @returns {Promise<boolean>} - true si confirma, false si cancela
 */
export function mostrarConfirmacion({
    titulo = '¿Estás seguro?',
    mensaje = '¿Deseas continuar con esta acción?',
    textoConfirmar = 'Confirmar',
    textoCancelar = 'Cancelar',
    icono = '⚠️'
} = {}) {
    return new Promise((resolve) => {
        // Crear overlay
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        
        // Crear modal
        const modal = document.createElement('div');
        modal.className = 'modal-confirmacion';
        
        modal.innerHTML = `
            <div class="modal-confirmacion-icono">${icono}</div>
            <h3 class="modal-confirmacion-titulo">${titulo}</h3>
            <p class="modal-confirmacion-mensaje">${mensaje}</p>
            <div class="modal-confirmacion-botones">
                <button class="modal-boton modal-boton-cancelar" data-accion="cancelar">
                    ${textoCancelar}
                </button>
                <button class="modal-boton modal-boton-confirmar" data-accion="confirmar">
                    ${textoConfirmar}
                </button>
            </div>
        `;
        
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        
        // Mostrar modal con animación
        setTimeout(() => overlay.classList.add('mostrar'), 10);
        
        // Función para cerrar modal
        const cerrarModal = (confirmado) => {
            overlay.classList.remove('mostrar');
            setTimeout(() => {
                document.body.removeChild(overlay);
                resolve(confirmado);
            }, 200);
        };
        
        // Event listeners
        const botonCancelar = modal.querySelector('[data-accion="cancelar"]');
        const botonConfirmar = modal.querySelector('[data-accion="confirmar"]');
        
        botonCancelar.addEventListener('click', () => cerrarModal(false));
        botonConfirmar.addEventListener('click', () => cerrarModal(true));
        
        // Cerrar al hacer clic fuera del modal
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                cerrarModal(false);
            }
        });
        
        // Cerrar con tecla ESC
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                cerrarModal(false);
                document.removeEventListener('keydown', handleEsc);
            }
        };
        document.addEventListener('keydown', handleEsc);
    });
}
