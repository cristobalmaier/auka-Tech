import { z } from 'zod';

// Esquema de validación con Zod
const usuarioSchema = z.object({
    nombre: z
        .string({
            required_error: 'El nombre es obligatorio',
        })
        .max(64, 'El nombre no puede tener más de 64 caracteres'),

    apellido: z
        .string({
            required_error: 'El apellido es obligatorio',
        })
        .max(64, 'El apellido no puede tener más de 64 caracteres'),

    email: z
        .string({
            required_error: 'El email es obligatorio',
        })
        .email('El email no es válido')
        .max(64, 'El email no puede tener más de 64 caracteres'),

    contrasena: z
        .string({
            required_error: 'La contraseña es obligatoria',
        })
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
        .max(255, 'La contraseña no puede tener más de 255 caracteres'),

    tipo_usuario: z.enum(['soporte', 'empleado', 'administracion'], {
        errorMap: () => ({ message: 'Tipo de usuario no válido' })
    }),
});

const actualizarUsuarioSchema = z.object({
    nombre: z
    .string()
    .max(64, 'Máximo 64 caracteres')
    .optional(),

    apellido: z
    .string()
    .max(64, 'Máximo 64 caracteres')
    .optional(),
    
    email: z
    .string()
    .email()
    .max(64)
    .optional(),

    contrasena: z
    .string()
    .max(255)
    .optional(),

    tipo_usuario: z
    .enum(['soporte', 'empleado', 'administracion'], {
        errorMap: () => ({ message: 'Tipo de usuario no válido' }),
    })
    .optional(),

}).refine((data) => Object.keys(data).length > 0, {
    message: 'Debe incluir al menos un campo para actualizar',
});

// Función para validar datos
export function validarUsuario(data) {
    const resultado = usuarioSchema.safeParse(data);
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

export function validarActualizacionUsuario(data) {
    const resultado = actualizarUsuarioSchema.safeParse(data);
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
