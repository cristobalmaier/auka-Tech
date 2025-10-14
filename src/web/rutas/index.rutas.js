import { Router } from 'express'
const router = new Router()

import { estaLogeado } from '../utiles/auth.js'
import FaqServicio from '../../servicios/faq.servicios.js'

router.get('/', (req, res) => {
    res.redirect('/login')
})

router.get('/logout', (req, res) => {
    res
    .clearCookie('access_token')
    .redirect('/')
})

router.get('/error', (req, res) => {
    res.render('error')
})

const faqServicio = FaqServicio;

router.get('/faq', estaLogeado, async (req, res, next) => {
    try {
        const preguntas = await faqServicio.obtenerTodos();
        // query() returns null when no rows
        res.render('faq', { preguntas: preguntas || [] });
    } catch(err) {
        next(err);
    }
});

export default router