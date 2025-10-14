// Variables globales
let notificacion, notificacionIcono, notificacionMensaje;

// Función para mostrar notificaciones
function mostrarNotificacion(tipo, mensaje) {
    if (!notificacion || !notificacionIcono || !notificacionMensaje) {
        notificacion = document.getElementById('notificacion');
        notificacionIcono = document.getElementById('notificacionIcono');
        notificacionMensaje = document.getElementById('notificacionMensaje');
    }
    
    if (!notificacion || !notificacionIcono || !notificacionMensaje) {
        console.error('No se encontraron los elementos de notificación');
        return;
    }
    
    notificacion.classList.remove('alerta-exito', 'alerta-error');
    notificacionIcono.className = '';
    
    if (tipo === 'exito') {
        notificacion.classList.add('alerta-exito');
        notificacionIcono.classList.add('fas', 'fa-check-circle');
    } else if (tipo === 'error') {
        notificacion.classList.add('alerta-error');
        notificacionIcono.classList.add('fas', 'fa-times-circle');
    }
    
    notificacionMensaje.textContent = mensaje;
    notificacion.style.display = 'flex';
    
    setTimeout(() => {
        notificacion.style.display = 'none';
    }, 3000);
}

document.addEventListener("DOMContentLoaded", () => {
    // Inicializar elementos de la UI
    notificacion = document.getElementById('notificacion');
    notificacionIcono = document.getElementById('notificacionIcono');
    notificacionMensaje = document.getElementById('notificacionMensaje');
    const userActionButtons = document.querySelectorAll('.user-action-button');

    // Función para manejar la verificación de usuarios
    window.manejarVerificacionUsuario = async (usuarioId, verificado) => {
        const boton = document.querySelector(`button[data-usuario-id="${usuarioId}"]`);
        const fila = document.querySelector(`tr[data-usuario-id="${usuarioId}"]`);
        
        if (!boton || !fila) {
            console.error('No se encontró el botón o la fila del usuario');
            return;
        }
        
        const icono = boton.querySelector('i');
        const texto = boton.querySelector('span');
        const celdaEstado = fila.querySelector('.estado-verificacion');
        
        // Guardar el estado original para poder revertir en caso de error
        const estadoOriginal = {
            iconoClass: icono ? icono.className : '',
            texto: texto ? texto.textContent : '',
            btnClass: boton.className,
            estadoHtml: celdaEstado ? celdaEstado.innerHTML : ''
        };
        
        try {
            // Actualización optimista de la UI
            boton.disabled = true;
            
            if (verificado) {
                // Actualizar a estado verificado
                boton.classList.remove('btn-no-verificado');
                boton.classList.add('btn-verificado');
                boton.setAttribute('title', 'Haz clic para desverificar');
                
                if (icono) icono.className = 'fas fa-user-check';
                if (texto) texto.textContent = ' Desverificar';
                
                if (celdaEstado) {
                    celdaEstado.innerHTML = '<span class="badge bg-success">Verificado</span>';
                }
            } else {
                // Actualizar a estado no verificado
                boton.classList.remove('btn-verificado');
                boton.classList.add('btn-no-verificado');
                boton.setAttribute('title', 'Haz clic para verificar');
                
                if (icono) icono.className = 'fas fa-user-times';
                if (texto) texto.textContent = ' Verificar';
                
                if (celdaEstado) {
                    celdaEstado.innerHTML = '<span class="badge bg-warning">No verificado</span>';
                }
            }
            
            const token = localStorage.getItem('token') || '';
            const response = await fetch(`/api/usuarios/${usuarioId}/verificar`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ autorizado: verificado })
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.mensaje || 'Error al actualizar el estado de verificación');
            }

            const data = await response.json().catch(() => ({}));
            const nuevoEstado = data.autorizado;
            
            // Actualizar el estado del botón según la respuesta del servidor
            boton.onclick = () => manejarVerificacionUsuario(usuarioId, !nuevoEstado);
            
            // Mostrar notificación de éxito
            mostrarNotificacion(
                'exito', 
                data.mensaje || `Usuario ${nuevoEstado ? 'verificado' : 'desverificado'} correctamente`
            );
            
        } catch (error) {
            console.error('Error al actualizar el estado de verificación:', error);
            
            // Revertir cambios en la UI en caso de error
            if (estadoOriginal) {
                if (icono) icono.className = estadoOriginal.iconoClass;
                if (texto) texto.textContent = estadoOriginal.texto;
                boton.className = estadoOriginal.btnClass;
                if (celdaEstado) celdaEstado.innerHTML = estadoOriginal.estadoHtml;
            }
            
            mostrarNotificacion(
                'error', 
                error.message || 'Error al actualizar el estado de verificación'
            );
        } finally {
            boton.disabled = false;
        }
    };

    // Agregar manejadores de eventos a los botones de verificación
    document.addEventListener('click', async (event) => {
        const button = event.target.closest('.btn-verificar');
        if (!button) return;
        
        event.preventDefault();
        
        const usuarioId = button.getAttribute('data-usuario-id');
        const verificadoActual = button.getAttribute('data-verificado') === 'true';
        const nuevoEstado = !verificadoActual;
        
        // Actualizar el atributo data-verificado
        button.setAttribute('data-verificado', nuevoEstado.toString());
        
        // Llamar a la función de manejo de verificación
        await manejarVerificacionUsuario(usuarioId, nuevoEstado);
    });

    // La función mostrarNotificacion ya está definida al inicio

// Función para exportar la tabla de usuarios a CSV
function exportarUsuariosACSV() {
    try {
        const tabla = document.querySelector('.users-table table');
        if (!tabla) {
            throw new Error('No se encontró la tabla de usuarios');
        }

        // Obtener filas de la tabla
        const filas = tabla.querySelectorAll('tbody tr');
        if (filas.length === 0) {
            throw new Error('No hay datos de usuarios para exportar');
        }

        // Crear array para los datos CSV
        const csvData = [];
        
        // Agregar encabezados
        const headers = [];
        tabla.querySelectorAll('thead th').forEach(th => {
            // Excluir la columna de acciones
            if (th.textContent.trim() !== 'Acciones') {
                headers.push(`"${th.textContent.trim().replace(/"/g, '""')}"`);
            }
        });
        csvData.push(headers.join(','));

        // Procesar cada fila de datos
        filas.forEach(fila => {
            const celdas = fila.querySelectorAll('td');
            const filaDatos = [];
            
            // Recorrer celdas (excluyendo la última columna de acciones)
            for (let i = 0; i < celdas.length - 1; i++) {
                let contenido = '';
                
                // Manejar celdas con badges de estado
                const badge = celdas[i].querySelector('.status-badge');
                if (badge) {
                    contenido = badge.textContent.trim();
                } else {
                    contenido = celdas[i].textContent.trim();
                }
                
                // Escapar comillas y saltos de línea
                contenido = contenido.replace(/"/g, '""')
                                   .replace(/\r?\n|\r/g, ' ')
                                   .trim();
                
                filaDatos.push(`"${contenido}"`);
            }
            
            csvData.push(filaDatos.join(','));
        });

        // Crear y descargar archivo CSV
        const csvContent = csvData.join('\n');
        const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const enlace = document.createElement('a');
        
        enlace.setAttribute('href', url);
        enlace.setAttribute('download', 'usuarios.csv');
        enlace.style.display = 'none';
        
        document.body.appendChild(enlace);
        enlace.click();
        
        // Limpiar
        document.body.removeChild(enlace);
        URL.revokeObjectURL(url);
        
        return true;
    } catch (error) {
        console.error('Error al exportar a CSV:', error);
        throw error;
    }
}

// Función para exportar a Excel
function exportarAExcel(filename) {
    try {
        const tabla = document.querySelector('.users-table table');
        if (!tabla) {
            throw new Error('No se encontró la tabla de usuarios');
        }

        // Obtener filas de la tabla
        const filas = tabla.querySelectorAll('tbody tr');
        if (filas.length === 0) {
            throw new Error('No hay datos de usuarios para exportar');
        }

        // Crear array para los datos
        const datos = [];
        
        // Agregar encabezados
        const headers = [];
        tabla.querySelectorAll('thead th').forEach(th => {
            // Excluir la columna de acciones
            if (th.textContent.trim() !== 'Acciones') {
                headers.push(th.textContent.trim());
            }
        });
        datos.push(headers);

        // Procesar cada fila de datos
        filas.forEach(fila => {
            const celdas = fila.querySelectorAll('td');
            const filaDatos = [];
            
            // Recorrer celdas (excluyendo la última columna de acciones)
            for (let i = 0; i < celdas.length - 1; i++) {
                let contenido = '';
                
                // Manejar celdas con badges de estado
                const badge = celdas[i].querySelector('.status-badge');
                if (badge) {
                    contenido = badge.textContent.trim();
                } else {
                    contenido = celdas[i].textContent.trim();
                }
                
                filaDatos.push(contenido);
            }
            
            datos.push(filaDatos);
        });

        // Crear hoja de cálculo
        const ws = XLSX.utils.aoa_to_sheet(datos);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Usuarios");

        // Descargar archivo
        XLSX.writeFile(wb, filename);
        
        return true;
    } catch (error) {
        console.error('Error al exportar a Excel:', error);
        throw error;
    }
}

// Función para exportar a PDF
function exportarAPDF(filename) {
    try {
        const tabla = document.querySelector('.users-table table');
        if (!tabla) {
            throw new Error('No se encontró la tabla de usuarios');
        }

        // Obtener filas de la tabla
        const filas = tabla.querySelectorAll('tbody tr');
        if (filas.length === 0) {
            throw new Error('No hay datos de usuarios para exportar');
        }

        // Crear documento PDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Configurar encabezados
        const headers = [];
        tabla.querySelectorAll('thead th').forEach(th => {
            if (th.textContent.trim() !== 'Acciones') {
                headers.push(th.textContent.trim());
            }
        });

        // Preparar datos
        const datos = [];
        filas.forEach(fila => {
            const celdas = fila.querySelectorAll('td');
            const filaDatos = [];
            
            for (let i = 0; i < celdas.length - 1; i++) {
                let contenido = '';
                const badge = celdas[i].querySelector('.status-badge');
                if (badge) {
                    contenido = badge.textContent.trim();
                } else {
                    contenido = celdas[i].textContent.trim();
                }
                filaDatos.push(contenido);
            }
            
            datos.push(filaDatos);
        });

        // Agregar título
        doc.setFontSize(16);
        doc.text('Listado de Usuarios', 14, 15);
        
        // Agregar tabla
        doc.autoTable({
            head: [headers],
            body: datos,
            startY: 25,
            theme: 'grid',
            styles: {
                fontSize: 10,
                cellPadding: 5
            },
            headStyles: {
                fillColor: [37, 99, 235],
                textColor: 255
            }
        });

        // Guardar PDF
        doc.save(filename);
        
        return true;
    } catch (error) {
        console.error('Error al exportar a PDF:', error);
        throw error;
    }
}

    // Configurar los botones de exportación
    // Botón exportar a Excel
    const botonExcel = document.getElementById('boton-exportar-excel');
    if (botonExcel) {
        botonExcel.addEventListener('click', function() {
            try {
                exportarAExcel('usuarios.xlsx');
                mostrarNotificacion('exito', 'Los datos se han exportado correctamente a usuarios.xlsx');
            } catch (error) {
                console.error('Error al exportar:', error);
                mostrarNotificacion('error', 'Error al exportar los datos: ' + error.message);
            }
        });
    }

    // Botón exportar a PDF
    const botonPDF = document.getElementById('boton-exportar-pdf');
    if (botonPDF) {
        botonPDF.addEventListener('click', function() {
            try {
                exportarAPDF('usuarios.pdf');
                mostrarNotificacion('exito', 'Los datos se han exportado correctamente a usuarios.pdf');
            } catch (error) {
                console.error('Error al exportar:', error);
                mostrarNotificacion('error', 'Error al exportar los datos: ' + error.message);
            }
        });
    }

    // Botón exportar a CSV
    const botonCSV = document.getElementById('boton-exportar-csv');
    if (botonCSV) {
        botonCSV.addEventListener('click', function() {
            try {
                exportarUsuariosACSV();
                mostrarNotificacion('exito', 'Los datos se han exportado correctamente a usuarios.csv');
            } catch (error) {
                console.error('Error al exportar:', error);
                mostrarNotificacion('error', 'Error al exportar los datos: ' + error.message);
            }
        });
    }

    // Botón exportar reporte completo
    const botonCompleto = document.getElementById('boton-exportar-reporte-completo');
    if (botonCompleto) {
        botonCompleto.addEventListener('click', function() {
            try {
                // Exportar a todos los formatos
                exportarAExcel('usuarios.xlsx');
                exportarAPDF('usuarios.pdf');
                exportarUsuariosACSV();
                mostrarNotificacion('exito', 'Se han exportado los datos en todos los formatos disponibles');
            } catch (error) {
                console.error('Error al exportar:', error);
                mostrarNotificacion('error', 'Error al exportar los datos: ' + error.message);
            }
        });
    }

    // --- LÓGICA DE SOCKET.IO PARA GESTIÓN DE USUARIOS EN TIEMPO REAL ---
    const socket = io();
    const audioNotificacion = new Audio('/sonidos/noti.wav');

    socket.on('usuario_actualizado', (usuario) => {
        console.log('Actualización de usuario recibida:', usuario);

        const filaUsuario = document.querySelector(`tr[data-usuario-id="${usuario.id_usuario}"]`);
        if (!filaUsuario) return;

        // No actualizar si el cambio fue hecho por el usuario actual en esta misma ventana
        // (La UI ya se actualizó de forma optimista)
        const botonLocal = filaUsuario.querySelector('button.btn-verificar');
        if (botonLocal.disabled) {
            console.log('Actualización local, omitiendo evento de socket.');
            return;
        }

        // Reproducir sonido de notificación
        audioNotificacion.play().catch(err => console.error("Error al reproducir sonido:", err));

        // Mostrar notificación visual
        mostrarNotificacion('exito', `El estado de ${usuario.nombre} ${usuario.apellido} ha sido actualizado.`);

        // Actualizar la celda de estado
        const celdaEstado = filaUsuario.querySelector('.estado-verificacion');
        if (celdaEstado) {
            celdaEstado.innerHTML = `<span class="badge ${usuario.autorizado ? 'bg-success' : 'bg-warning'}">${usuario.autorizado ? 'Verificado' : 'No verificado'}</span>`;
        }

        // Actualizar el botón de acción
        const boton = filaUsuario.querySelector('.btn-verificar');
        if (boton) {
            boton.setAttribute('data-verificado', usuario.autorizado);
            boton.setAttribute('title', usuario.autorizado ? 'Haz clic para desverificar' : 'Haz clic para verificar');
            
            const icono = boton.querySelector('i');
            const texto = boton.querySelector('span');

            if (usuario.autorizado) {
                boton.className = 'btn-verificar btn-verificado';
                if (icono) icono.className = 'fas fa-user-check';
                if (texto) texto.textContent = ' Desverificar';
            } else {
                boton.className = 'btn-verificar btn-no-verificado';
                if (icono) icono.className = 'fas fa-user-times';
                if (texto) texto.textContent = ' Verificar';
            }
        }

        // Añadir una animación para destacar el cambio
        filaUsuario.classList.add('animate__animated', 'animate__flash');
        setTimeout(() => {
            filaUsuario.classList.remove('animate__animated', 'animate__flash');
        }, 1000);
    });

    // Escuchar nuevos usuarios creados en el sistema
    socket.on('nuevo_usuario', (usuario) => {
        console.log('Nuevo usuario recibido por socket:', usuario);

        // Si ya existe la fila, no duplicar
        const existente = document.querySelector(`tr[data-usuario-id="${usuario.id_usuario}"]`);
        if (existente) {
            // Opcional: actualizar datos si es necesario
            return;
        }

        // Reproducir sonido de notificación
        audioNotificacion.play().catch(err => console.error("Error al reproducir sonido:", err));

        // Mostrar notificación visual
        mostrarNotificacion('exito', `Nuevo usuario: ${usuario.nombre} ${usuario.apellido}`);

        // Crear nueva fila en la tabla
        const tbody = document.querySelector('.users-table table tbody');
        if (!tbody) return;

        const tr = document.createElement('tr');
        tr.setAttribute('data-usuario-id', usuario.id_usuario);

        const tdNombre = document.createElement('td');
        tdNombre.textContent = `${usuario.nombre} ${usuario.apellido}`;

        const tdEmail = document.createElement('td');
        tdEmail.textContent = usuario.email || '';

        const tdRol = document.createElement('td');
        tdRol.className = 'celda-rol';
        const spanRol = document.createElement('span');
        spanRol.className = 'badge bg-info';
        const rolTexto = usuario.tipo_usuario === 'empleado' ? 'Empleado' : usuario.tipo_usuario === 'soporte' ? 'Soporte' : usuario.tipo_usuario === 'administracion' ? 'Administración' : usuario.tipo_usuario;
        spanRol.textContent = rolTexto;
        tdRol.appendChild(spanRol);

        const tdEstado = document.createElement('td');
        tdEstado.className = 'estado-verificacion';
        const spanEstado = document.createElement('span');
        spanEstado.className = `badge ${usuario.autorizado ? 'bg-success' : 'bg-warning'} status-badge`;
        spanEstado.textContent = usuario.autorizado ? 'Verificado' : 'No verificado';
        tdEstado.appendChild(spanEstado);

        const tdAcciones = document.createElement('td');
        const boton = document.createElement('button');
        boton.className = `btn-verificar ${usuario.autorizado ? 'btn-verificado' : 'btn-no-verificado'}`;
        boton.setAttribute('data-usuario-id', usuario.id_usuario);
        boton.setAttribute('data-verificado', usuario.autorizado);
        boton.setAttribute('title', usuario.autorizado ? 'Haz clic para desverificar' : 'Haz clic para verificar');

        const i = document.createElement('i');
        i.className = `fas ${usuario.autorizado ? 'fa-user-check' : 'fa-user-times'}`;
        const span = document.createElement('span');
        span.textContent = usuario.autorizado ? ' Desverificar' : ' Verificar';

        boton.appendChild(i);
        boton.appendChild(span);

        // Delegamos al manejador global de clicks que ya está registrado
        tdAcciones.appendChild(boton);

        tr.appendChild(tdNombre);
        tr.appendChild(tdEmail);
        tr.appendChild(tdRol);
        tr.appendChild(tdEstado);
        tr.appendChild(tdAcciones);

        // Insertar al inicio de la tabla para visibilidad
        if (tbody.firstChild) tbody.insertBefore(tr, tbody.firstChild);
        else tbody.appendChild(tr);

        // Animación para destacar nueva fila
        tr.classList.add('animate__animated', 'animate__fadeInDown');
        setTimeout(() => tr.classList.remove('animate__animated', 'animate__fadeInDown'), 1200);
    });
    
}); // Cierre del DOMContentLoaded