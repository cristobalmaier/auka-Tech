import FaqServicio from '../servicios/faq.servicios.js';

class FaqControlador {
    constructor() {
    }

    obtenerTodos = async (req, res, next) => {
        try {
            const resultado = await FaqServicio.obtenerTodos();
            res.status(200).json(resultado);
        } catch(err) {
            next(err);
        }
    }
}

export default FaqControlador;