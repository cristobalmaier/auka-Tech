# Confirmación de Cancelar Solicitud - Documentación

## 📋 Descripción

Sistema de **confirmación modal** antes de cancelar una solicitud de soporte, evitando cancelaciones accidentales.

## ✅ Implementación Completada

### Archivos Creados:
1. **`src/web/estaticos/css/modal-confirmacion.css`** - Estilos del modal
2. **`src/web/estaticos/js/modal-confirmacion.js`** - Lógica del modal reutilizable

### Archivos Modificados:
1. **`src/web/estaticos/js/panel/empleado.js`** - Agregada confirmación antes de cancelar
2. **`src/web/vistas/paneles/empleado.ejs`** - Agregado CSS del modal

## 🎯 Características

### Modal de Confirmación:
- ✅ **Diseño moderno** con animaciones suaves
- ✅ **Icono de advertencia** (⚠️) para llamar la atención
- ✅ **Mensaje claro** explicando la acción
- ✅ **Dos botones**: "No, volver" y "Sí, cancelar"
- ✅ **Cierre con ESC** o clic fuera del modal
- ✅ **Responsive** y adaptable a móviles

### Flujo de Usuario:
1. Usuario hace clic en "Cancelar solicitud"
2. Aparece modal de confirmación
3. Si confirma → Cancela la solicitud
4. Si no confirma → Vuelve al estado anterior

## 🎨 Personalización

### Cambiar Colores del Botón

Edita `src/web/estaticos/css/modal-confirmacion.css`:

```css
.modal-boton-confirmar {
    background-color: #dc3545; /* Rojo - Cambiar aquí */
}

.modal-boton-confirmar:hover {
    background-color: #c82333; /* Rojo oscuro - Cambiar aquí */
}
```

### Cambiar Textos del Modal

Edita `src/web/estaticos/js/panel/empleado.js`:

```javascript
const confirmado = await mostrarConfirmacion({
    titulo: '¿Cancelar solicitud?',           // Cambiar aquí
    mensaje: 'Esta acción cancelará...',      // Cambiar aquí
    textoConfirmar: 'Sí, cancelar',          // Cambiar aquí
    textoCancelar: 'No, volver',             // Cambiar aquí
    icono: '⚠️'                               // Cambiar aquí
})
```

### Iconos Disponibles:
- `⚠️` - Advertencia (actual)
- `❌` - Error/Cancelar
- `❓` - Pregunta
- `🗑️` - Eliminar
- `⛔` - Prohibido

## 💻 Uso en Otros Lugares

El modal es **reutilizable**. Para usarlo en otros archivos:

```javascript
import { mostrarConfirmacion } from '../modal-confirmacion.js'

// Ejemplo: Confirmar eliminación
const confirmar = await mostrarConfirmacion({
    titulo: '¿Eliminar usuario?',
    mensaje: 'Esta acción no se puede deshacer',
    textoConfirmar: 'Eliminar',
    textoCancelar: 'Cancelar',
    icono: '🗑️'
})

if (confirmar) {
    // Ejecutar acción
}
```

## 🚀 Cómo Funciona

### 1. Usuario hace clic en "Cancelar"
```javascript
botonCancelarLlamado.addEventListener('click', async () => {
    const confirmado = await mostrarConfirmacion({...})
    if (!confirmado) return // Sale si no confirma
    // Continúa con la cancelación...
})
```

### 2. Modal se muestra
- Overlay oscuro de fondo
- Modal centrado con animación
- Botones interactivos

### 3. Usuario decide
- **Confirma** → Retorna `true` → Cancela la solicitud
- **Cancela** → Retorna `false` → No hace nada

## 🎯 Ventajas

1. **Previene errores**: Evita cancelaciones accidentales
2. **Mejor UX**: Usuario tiene control total
3. **Profesional**: Diseño moderno y limpio
4. **Reutilizable**: Puede usarse en cualquier parte del proyecto
5. **Accesible**: Cierre con ESC, clic fuera, o botones

## 🐛 Solución de Problemas

### El modal no aparece:
- Verifica que el CSS esté cargado
- Revisa la consola del navegador (F12) para errores
- Asegúrate de importar correctamente el módulo

### El modal no se cierra:
- Verifica que los event listeners estén funcionando
- Comprueba que no haya errores de JavaScript

### Estilos no se aplican:
- Limpia caché del navegador (Ctrl + F5)
- Verifica que la ruta del CSS sea correcta
- Abre en modo incógnito para probar

## 📊 Testing

Para probar:

1. Inicia sesión como empleado
2. Crea una solicitud de soporte
3. Haz clic en "Cancelar solicitud"
4. Verifica que aparezca el modal
5. Prueba ambos botones
6. Prueba cerrar con ESC
7. Prueba cerrar haciendo clic fuera

---

**Implementado:** 2025-09-30  
**Tiempo de implementación:** ~30 minutos  
**Versión:** 1.0.0
