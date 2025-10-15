import { Router } from 'express'
const loginRutas = new Router()

import jwt from 'jsonwebtoken'
import { peticion } from '../utiles/peticion.js'

const API_URL = process.env.API_URL
const JWT_SECRET = process.env.JWT_SECRET

import { io } from '../../index.js'

/* ////////////////////// SOLICITUDES DE ACCESO Y LOGIN ////////////////////// */

// LOGIN
loginRutas.get('/login', (req, res) => {
    const { error } = req.query

    res.render('login/iniciar_sesion', { titulo: 'AukaTech - Inicio de sesión', error })
})

loginRutas.post('/entrar', async (req, res) => {
    const { email, contrasena } = req.body

    // Validar que el usuario existe
    const usuario = await peticion({ url: `${API_URL}/usuarios?email=${email}`, metodo: 'GET' })
    if(!usuario.ok)
        return res.redirect('/login?error=usuario_no_existe')

    // Validar contraseña
    const validarContrasena = await peticion({ url: `${API_URL}/usuarios/validar/contrasena`, metodo: 'POST', cuerpo: { email, contrasena } })
    if(!validarContrasena.ok)
        return res.redirect('/login?error=contrasena_incorrecta')

    const [infoUsuario] = await usuario.json()
    
    if(!infoUsuario.autorizado) 
        return res.redirect(`/pendiente?email=${encodeURIComponent(infoUsuario.email)}`)

    const token = await jwt.sign(infoUsuario,
        JWT_SECRET,
        { expiresIn: '1h' }
    )

    res
    .cookie('access_token', token, { httpOnly: true, sameSite: 'strict' })
    .redirect('/panel/' + infoUsuario.tipo_usuario)
})

// SOLICITUDES DE ACCESO
loginRutas.get('/solicitud', (req, res) => {
    res.render('login/solicitud_acceso', { titulo: 'AukaTech - Solicitud de acceso' })
})

loginRutas.post('/enviar_solicitud', async (req, res) => {
    const { nombre, apellido, email, contrasena } = req.body
    
    const crearUsuario = await peticion({ url: `${API_URL}/usuarios/crear`, metodo: 'POST', cuerpo: { nombre, apellido, email, contrasena } })
    if(crearUsuario.ok) 
        return res.redirect(`/pendiente?email=${encodeURIComponent(email)}`)
})

// "SALA DE ESPERA"
loginRutas.get('/pendiente', (req, res) => {
    const { email } = req.query;
    res.render('login/sala_espera', { 
        titulo: 'AukaTech - Solicitud pendiente',
        email: email || ''
    })
})

export default loginRutas