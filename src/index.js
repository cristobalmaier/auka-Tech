import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import server from 'node:http'
import chalk from 'chalk'
import { Server } from 'socket.io'
import { formato, formatoHora } from './web/utiles/formato.js'
import { pruebaConexion } from './bd.js'

const app = express()
const serverApp = server.createServer(app)
export const io = new Server(serverApp)

// Configuracion
const PUERTO = process.env.PUERTO_API
app.set('json spaces', 2)
app.set('view engine', 'ejs')
app.set('views', process.cwd() + '/src/web/vistas')

// Middlewares
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors())

// Rutas de la API
import usuarioRutas from './rutas/usuario.rutas.js'
import areaRutas from './rutas/area.rutas.js'
import solicitudRutas from './rutas/solicitud.rutas.js' 
import respuestaRutas from './rutas/respuesta.rutas.js'
import turnosRutas from './rutas/turno.rutas.js'
import datosRutas from './rutas/datos.rutas.js'

app.use('/api/usuarios', usuarioRutas)
app.use('/api/areas', areaRutas)
app.use('/api/solicitudes', solicitudRutas)
app.use('/api/respuestas', respuestaRutas)
app.use('/api/turnos', turnosRutas)
app.use('/api/data', datosRutas)

app.use((req, res, next) => {
    res.locals.formato = formato
    res.locals.formatoHora = formatoHora
    next()
})

app.use((err, req, res, next) => {
    console.error(err)
    const { message, statusCode } = err
    res.status(statusCode).json({ codigo: statusCode, mensaje: message })
})

// Rutas de la WEB
import indexRutas from './web/rutas/index.rutas.js'
import loginRutas from './web/rutas/login.rutas.js'
import panelRutas from './web/rutas/panel.rutas.js'
import directivosRutas from './web/rutas/directivos.rutas.js'
import administracionRutas from './web/rutas/administracion.rutas.js'


app.use(indexRutas)
app.use(loginRutas)
app.use(directivosRutas)
app.use(panelRutas)
app.use(administracionRutas)

// Estaticos
app.use('/', express.static(process.cwd() + '/src/web/estaticos'))
app.use('/panel', express.static(process.cwd() + '/src/web/estaticos'))

// Socket.io
io.on('connection', (socket) => {
    socket.on('nuevo-llamado', (data) => {
        io.emit('nuevo-llamado', data)
    })

    socket.on('respuesta-llamado', (data) => {
        io.emit('respuesta-llamado', data)
    })

    socket.on('terminar-llamado', (data) => {
        io.emit('terminar-llamado', data)
    })

    socket.on('cancelar-llamado', (data) => {
        io.emit('cancelar-llamado', data)
    })

    socket.on('eliminar-respuesta-llamado', (data) => {
        io.emit('eliminar-respuesta-llamado', data)
    })

    socket.on('agregar-historial', (data) => {
        io.emit('agregar-historial', data)
    })
})

// Iniciar servidor
serverApp.listen(PUERTO, async () => {
    try {
        await pruebaConexion()
    } catch(err) {
        console.error(chalk.redBright('ADVERTENCIA:') + ' NO HAY CONEXION A LA BASE DE DATOS, '+ chalk.underline('REVISAR CREDENCIALES') +' (.env) Y SI LA BASE DE DATOS ESTA EN FUNCIONAMIENTO') 
        console.error(chalk.blue('MENSAJE DE ERROR:'), err.message ? err.message : '...')
        console.error('\n')
    }

    console.log(chalk.bold('Aplicación en funcionamiento.'))
    console.log('Web: http://localhost:' + PUERTO)
    console.log('API: http://localhost:' + PUERTO + '/api')
})

export default app