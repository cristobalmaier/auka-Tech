import { z } from 'zod';

// Esquema de validación para la tabla llamados
const llamadoSchema = z.object({
    id_soporte: z
        .nullable(),

    id_emisor: z
        .number({
            required_error: 'El ID del emisor es obligatorio',
        })
        .int()
        .positive('El ID del emisor debe ser positivo'),

    numero_nivel: z
        .number({ 
            required_error: 'El número de nivel es obligatorio',
            invalid_type_error: 'El número de nivel debe ser un número' 
        })
        .int()
        .min(1, 'El número de nivel debe ser mayor a 0'),

    mensaje: z
        .string({
            required_error: 'El mensaje es obligatorio',
        })
        .min(1, 'El mensaje no puede estar vacío')
        .max(300, 'El mensaje no puede tener más de 300 caracteres'),
});

const actualizarLlamadoSchema = z.object({
    id_soporte: z
        .number()
        .int('Debe ser un número entero')
        .positive('Debe ser un número positivo')
        .optional(),

    id_emisor: z
        .number()
        .int('Debe ser un número entero')
        .positive('Debe ser un número positivo')
        .optional(),

    numero_nivel: z
        .number()
        .int('Debe ser un número entero')
        .min(1, 'El nivel debe ser al menos 1')
        .optional(),

    mensaje: z
        .string()
        .max(500, 'Máximo 500 caracteres')
        .optional(),

    fecha_envio: z
        .string()
        .datetime({ message: 'Fecha de envío no válida' })
        .optional(),

    finalizado: z
        .boolean()
        .optional(),

}).refine((data) => Object.keys(data).length > 0, {
    message: 'Debe incluir al menos un campo para actualizar',
});

export function validarActualizacionLlamado(data) {
    const resultado = actualizarLlamadoSchema.safeParse(data);
    if (!resultado.success) {
        return {
            valido: false,
            errores: resultado.error.flatten().fieldErrors,
        };
    }

    return {
        valido: true,
        datos: resultado.data,
    };
}

// Función para validar un nuevo llamado
export function validarLlamado(data) {
    const resultado = llamadoSchema.safeParse(data);
    if (!resultado.success) {
        return {
            valido: false,
            errores: resultado.error.flatten().fieldErrors,
        };
    }

    return {
        valido: true,
        datos: resultado.data,
    };
}
