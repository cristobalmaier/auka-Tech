// Simple helper para fetch JSON
async function fetchJson(url) {
    const res = await fetch(url)
    if (!res.ok) throw new Error('Error en la petición: ' + url)
    return await res.json()
}

// Creadores de gráficos (devuelven instancias que podemos actualizar)
function crearGraficoLine(ctx, labels = [], data = [], label = '') {
    return new Chart(ctx, {
        type: 'line',
        data: { labels, datasets: [{ label, data, borderColor: '#2563eb', backgroundColor: 'rgba(37,99,235,0.08)', tension: 0.2 }] },
        // Mantener proporción para evitar gráficos estirados
        options: { responsive: true, maintainAspectRatio: true, aspectRatio: 1.8 }
    })
}

function crearGraficoBar(ctx, labels = [], data = [], label = '') {
    return new Chart(ctx, {
        type: 'bar',
        data: { labels, datasets: [{ label, data, backgroundColor: '#0b6e74' }] },
        options: { responsive: true, maintainAspectRatio: true, aspectRatio: 1.6 }
    })
}

// Instancias de charts (se asignan en init)
let chartSolicitudesDia, chartPorArea, chartPorNivel, chartRendimiento

// Actualiza los datos en los charts y en los elementos del DOM
async function refreshStats() {
    try {
        const [solicitudesDia, porArea, porNivel, rendimiento, tiempoPromedioResp] = await Promise.all([
            fetchJson('/api/estadisticas/solicitudes-por-dia'),
            fetchJson('/api/estadisticas/solicitudes-por-area'),
            fetchJson('/api/estadisticas/solicitudes-por-nivel'),
            fetchJson('/api/estadisticas/rendimiento-soporte'),
            fetchJson('/api/estadisticas/tiempo-promedio-respuesta')
        ])

        const labelsDia = (solicitudesDia.labels || []).map(l => {
            const d = new Date(l)
            return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
        })
        const dataDia = solicitudesDia.data || []

        // Actualizar chart solicitudes por día
        if (chartSolicitudesDia) {
            chartSolicitudesDia.data.labels = labelsDia
            chartSolicitudesDia.data.datasets[0].data = dataDia
            chartSolicitudesDia.update()
        }

        // Actualizar resumen
        const totalSolicitudes = dataDia.reduce((a, b) => a + (b || 0), 0)
        const tiempoTxt = tiempoPromedioResp?.minutos_promedio ? Number(tiempoPromedioResp.minutos_promedio).toFixed(1) : 'N/A'
        document.getElementById('totalSolicitudes').innerText = totalSolicitudes
        document.getElementById('tiempoPromedio').innerText = tiempoTxt

        // Por area
        const labelsArea = porArea.map(r => r.nombre_area)
        const dataArea = porArea.map(r => r.total)
        if (chartPorArea) {
            chartPorArea.data.labels = labelsArea
            chartPorArea.data.datasets[0].data = dataArea
            chartPorArea.update()
        }

        // Por nivel
        const labelsNivel = porNivel.map(r => 'Nivel ' + r.nivel)
        const dataNivel = porNivel.map(r => r.total)
        if (chartPorNivel) {
            chartPorNivel.data.labels = labelsNivel
            chartPorNivel.data.datasets[0].data = dataNivel
            chartPorNivel.update()
        }

        // Rendimiento soporte
        const labelsRend = rendimiento.map(r => r.nombre + ' ' + r.apellido)
        const dataRend = rendimiento.map(r => r.respuestas_count)
        if (chartRendimiento) {
            chartRendimiento.data.labels = labelsRend
            chartRendimiento.data.datasets[0].data = dataRend
            chartRendimiento.update()
        }

    } catch (err) {
        console.error('Error al cargar estadísticas:', err)
    }
}

// Debounce para evitar refrescos muy frecuentes
let refreshTimeout = null
function scheduleRefresh(delay = 800) {
    if (refreshTimeout) clearTimeout(refreshTimeout)
    refreshTimeout = setTimeout(() => { refreshStats(); refreshTimeout = null }, delay)
}

function showNotification(msg) {
    try {
        const el = document.getElementById('notificacion')
        const icon = document.getElementById('notificacionIcono')
        const text = document.getElementById('notificacionMensaje')
        if (!el || !text) return
        text.innerText = msg
        el.style.display = 'flex'
        el.classList.remove('animate__fadeOutRight')
        el.classList.add('animate__fadeInRight')
        setTimeout(() => {
            el.classList.remove('animate__fadeInRight')
            el.classList.add('animate__fadeOutRight')
            setTimeout(() => el.style.display = 'none', 600)
        }, 3000)
    } catch (e) {
        // no fatal
    }
}

async function init() {
    // Crear charts vacíos (se rellenarán con refreshStats)
    chartSolicitudesDia = crearGraficoLine(document.getElementById('chartSolicitudesDia'), [], [], 'Solicitudes')
    chartPorArea = crearGraficoBar(document.getElementById('chartPorArea'), [], [], 'Solicitudes')
    chartPorNivel = crearGraficoBar(document.getElementById('chartPorNivel'), [], [], 'Solicitudes')
    chartRendimiento = crearGraficoBar(document.getElementById('chartRendimiento'), [], [], 'Respuestas')

    // Primera carga
    await refreshStats()

    // Socket.IO (si está disponible)
    const socket = (typeof io !== 'undefined') ? io() : null
    if (socket) {
        const events = ['nuevo-llamado','respuesta-llamado','terminar-llamado','cancelar-llamado','eliminar-respuesta-llamado','agregar-historial','solicitud_actualizada','nuevo_usuario','usuario_actualizado']
        events.forEach(ev => socket.on(ev, (data) => {
            // Mostrar notificación ligera y programar refresh
            showNotification('Datos actualizados en tiempo real')
            scheduleRefresh()
        }))
    }
}

document.addEventListener('DOMContentLoaded', init)
