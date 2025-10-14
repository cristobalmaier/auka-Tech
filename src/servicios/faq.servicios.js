import { query } from "../bd.js";

class FaqServicio {
    static async obtenerTodos() {
        const resultado = await query("SELECT * FROM faqs");
        return resultado;
    }
}

export default FaqServicio;