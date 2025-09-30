// Sistema de indicadores de estado en tiempo real para soportes

const socket = io();
const idUsuario = document.documentElement.dataset.id_usuario;
const tipoUsuario = document.documentElement.dataset.tipo_usuario;

// Objeto para rastrear soportes conectados
const soportesConectados = new Set();

// Cuando el usuario se conecta, notificar al servidor
if (tipoUsuario === 'soporte') {
    socket.emit('soporte-conectado', {
        soporte_id: idUsuario
    });
}

// Escuchar cuando un soporte se conecta
socket.on('soporte-conectado', (data) => {
    const { soporte_id } = data;
    soportesConectados.add(soporte_id);
    actualizarIndicador(soporte_id, 'online');
});

// Escuchar cuando un soporte se desconecta
socket.on('soporte-desconectado', (data) => {
    const { soporte_id } = data;
    soportesConectados.delete(soporte_id);
    actualizarIndicador(soporte_id, 'offline');
});

// Solicitar lista de soportes conectados al cargar la página
socket.emit('solicitar-soportes-conectados');

// Recibir lista de soportes conectados
socket.on('lista-soportes-conectados', (data) => {
    const { soportes } = data;
    
    // Limpiar set y agregar todos los soportes conectados
    soportesConectados.clear();
    soportes.forEach(soporteId => {
        soportesConectados.add(soporteId);
        actualizarIndicador(soporteId, 'online');
    });
    
    // Marcar como offline los que no están en la lista
    const todosLosSoportes = document.querySelectorAll('.preceptores-item[data-soporte-id]');
    todosLosSoportes.forEach(item => {
        const soporteId = item.dataset.soporteId;
        if (!soportesConectados.has(soporteId)) {
            actualizarIndicador(soporteId, 'offline');
        }
    });
});

// Función para actualizar el indicador visual
function actualizarIndicador(soporteId, estado) {
    const soporteItem = document.querySelector(`.preceptores-item[data-soporte-id="${soporteId}"]`);
    
    if (soporteItem) {
        const indicador = soporteItem.querySelector('.indicador-estado');
        
        if (indicador) {
            // Remover todas las clases de estado
            indicador.classList.remove('online', 'offline', 'ocupado', 'ausente');
            
            // Agregar la nueva clase de estado
            indicador.classList.add(estado);
        }
    }
}

// Cuando el usuario cierra la pestaña o se desconecta
window.addEventListener('beforeunload', () => {
    if (tipoUsuario === 'soporte') {
        socket.emit('soporte-desconectado', {
            soporte_id: idUsuario
        });
    }
});

// Manejar desconexión del socket
socket.on('disconnect', () => {
    if (tipoUsuario === 'soporte') {
        socket.emit('soporte-desconectado', {
            soporte_id: idUsuario
        });
    }
});
