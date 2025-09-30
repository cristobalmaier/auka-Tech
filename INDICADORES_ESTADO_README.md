# Indicadores de Estado en Tiempo Real - Documentación

## 📋 Descripción

Sistema de **indicadores visuales** que muestra el estado de conexión de los soportes en tiempo real mediante Socket.IO.

## 🎨 Estados Visuales

- 🟢 **Verde (Online)**: El soporte está conectado y disponible
  - Incluye animación de pulso para mayor visibilidad
- 🔴 **Rojo (Offline)**: El soporte está desconectado

## ✅ Implementación Completada

### Archivos Creados:
1. **`src/web/estaticos/css/indicador-estado.css`** - Estilos para los indicadores
2. **`src/web/estaticos/js/indicador-estado.js`** - Lógica de actualización en tiempo real

### Archivos Modificados:
1. **`src/web/vistas/paneles/soporte.ejs`** - Agregado indicador en lista de soportes
2. **`src/web/vistas/paneles/empleado.ejs`** - Agregado indicador en lista de soportes
3. **`src/web/estaticos/js/panel/soporte.js`** - Importado módulo de indicadores
4. **`src/web/estaticos/js/panel/empleado.js`** - Importado módulo de indicadores
5. **`src/index.js`** - Agregados eventos Socket.IO para rastrear conexiones

## 🚀 Cómo Funciona

### 1. Conexión del Soporte
Cuando un soporte inicia sesión y abre su panel:
- Se emite evento `soporte-conectado` con su ID
- El servidor agrega el ID al Set de soportes conectados
- Todos los clientes reciben la notificación y actualizan el indicador a verde

### 2. Desconexión del Soporte
Cuando un soporte cierra la pestaña o se desconecta:
- Se emite evento `soporte-desconectado`
- El servidor elimina el ID del Set
- Todos los clientes actualizan el indicador a rojo

### 3. Sincronización Inicial
Cuando un usuario carga la página:
- Solicita la lista de soportes conectados
- Actualiza todos los indicadores según el estado actual

## 🎯 Ubicación de los Indicadores

Los indicadores aparecen en:
- **Panel de Soporte**: Columna derecha, sección "Soportes disponibles"
- **Panel de Empleado**: Columna derecha, sección "Soportes disponibles"

## 💻 Uso

**No requiere configuración adicional.** El sistema funciona automáticamente:

1. Inicia el servidor: `npm start`
2. Los soportes que inicien sesión aparecerán con indicador verde
3. Los soportes desconectados aparecerán con indicador rojo
4. Los cambios se reflejan en tiempo real para todos los usuarios

## 🎨 Personalización

### Cambiar Colores

Edita `src/web/estaticos/css/indicador-estado.css`:

```css
/* Verde para online */
.indicador-estado.online {
    background-color: #4CAF50; /* Cambiar aquí */
}

/* Rojo para offline */
.indicador-estado.offline {
    background-color: #f44336; /* Cambiar aquí */
}
```

### Cambiar Tamaño del Indicador

```css
.indicador-estado {
    width: 10px;  /* Cambiar aquí */
    height: 10px; /* Cambiar aquí */
}
```

### Desactivar Animación de Pulso

Elimina o comenta esta sección en el CSS:

```css
.indicador-estado.online::before {
    /* Comentar todo este bloque */
}
```

## 🔧 Eventos Socket.IO

### Cliente → Servidor:
- `soporte-conectado` - Notifica que un soporte se conectó
- `soporte-desconectado` - Notifica que un soporte se desconectó
- `solicitar-soportes-conectados` - Solicita lista actual

### Servidor → Cliente:
- `soporte-conectado` - Broadcast cuando un soporte se conecta
- `soporte-desconectado` - Broadcast cuando un soporte se desconecta
- `lista-soportes-conectados` - Responde con array de IDs conectados

## 🐛 Solución de Problemas

### Los indicadores no aparecen:
- Verifica que el CSS esté cargado correctamente
- Revisa la consola del navegador (F12) para errores
- Asegúrate de que los elementos tengan `data-soporte-id`

### Los indicadores no se actualizan:
- Verifica que Socket.IO esté funcionando
- Revisa la consola del servidor para errores
- Comprueba que los eventos se estén emitiendo correctamente

### Todos aparecen offline:
- Verifica que el evento `soporte-conectado` se emita al cargar la página
- Revisa que el `data-tipo_usuario` sea correcto en el HTML
- Comprueba la consola del navegador

## 📊 Mejoras Futuras Sugeridas

- [ ] Agregar estado "Ocupado" (amarillo/naranja) cuando atiende una solicitud
- [ ] Mostrar tooltip con tiempo de conexión al hacer hover
- [ ] Agregar sonido cuando un soporte se conecta
- [ ] Contador de soportes online/offline
- [ ] Historial de conexiones/desconexiones

## ✅ Testing

Para probar:

1. Abre dos navegadores
2. Inicia sesión como soporte en uno
3. Abre el panel de empleado en el otro
4. Verifica que el indicador del soporte esté en verde
5. Cierra la pestaña del soporte
6. Verifica que el indicador cambie a rojo en tiempo real

---

**Implementado:** 2025-09-30  
**Versión:** 1.0.0
