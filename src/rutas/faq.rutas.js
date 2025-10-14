import { Router } from 'express';
import FaqControlador from '../controladores/faq.controlador.js';
import FaqServicio from '../servicios/faq.servicios.js';

const router = Router();
const faqServicio = new FaqServicio();
const faqControlador = new FaqControlador({ faqServicio });

router.get('/', faqControlador.obtenerTodos);

export default router;