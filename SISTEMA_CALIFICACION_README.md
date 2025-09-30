## Sistema de Calificación Básico - Documentación

## 📋 Descripción

Sistema de **calificación con estrellas** (1-5) que permite a los empleados evaluar la atención recibida del soporte después de finalizar una solicitud.

## ✅ Implementación Completada

### Archivos Creados:
1. **`sql/agregar_calificacion.sql`** - Script SQL para agregar campo de calificación
2. **`src/web/estaticos/css/modal-calificacion.css`** - Estilos del modal
3. **`src/web/estaticos/js/modal-calificacion.js`** - Lógica del modal con estrellas

### Archivos Modificados:
1. **`src/web/estaticos/js/panel/empleado.js`** - Agregado modal al finalizar solicitud
2. **`src/web/vistas/paneles/empleado.ejs`** - Agregado CSS del modal

## 🚀 Pasos para Activar

### 1. Ejecutar el Script SQL

**Desde phpMyAdmin:**
1. Abre phpMyAdmin
2. Selecciona la base de datos `auka-tech`
3. Ve a la pestaña SQL
4. Copia y pega el contenido de `sql/agregar_calificacion.sql`
5. Ejecuta

**Desde MySQL CLI:**
```bash
mysql -u root -p auka-tech < sql/agregar_calificacion.sql
```

### 2. Reiniciar el Servidor

```bash
# Detener (Ctrl + C)
npm start
```

## 🎯 Características

### Modal de Calificación:
- ⭐ **5 estrellas interactivas** con hover y animaciones
- 💬 **Comentario opcional** (máx. 300 caracteres)
- 🎨 **Diseño moderno** con gradientes y sombras
- ✅ **Validación**: No se puede enviar sin seleccionar estrellas
- 🎉 **Mensaje de agradecimiento** después de enviar
- ⏭️ **Opción de omitir** si no quiere calificar

### Flujo de Usuario:
1. Soporte finaliza la solicitud
2. Empleado ve progreso completado
3. **1 segundo después** aparece modal de calificación
4. Empleado selecciona estrellas (1-5)
5. Opcionalmente agrega comentario
6. Hace clic en "Enviar" u "Omitir"
7. Se guarda en la base de datos
8. Mensaje de agradecimiento por 2 segundos

## 🎨 Personalización

### Cambiar Colores del Modal

Edita `src/web/estaticos/css/modal-calificacion.css`:

```css
.modal-calificacion-icono {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    /* Cambiar gradiente aquí */
}

.estrella.activa {
    color: #FFD700; /* Color de estrella activa */
}
```

### Cambiar Tiempo de Espera

Edita `src/web/estaticos/js/panel/empleado.js`:

```javascript
setTimeout(async () => {
    await mostrarModalCalificacion({...})
}, 1000) // Cambiar 1000 (1 segundo) aquí
```

### Cambiar Longitud del Comentario

Edita `src/web/estaticos/js/modal-calificacion.js`:

```html
<textarea 
    maxlength="300"  <!-- Cambiar aquí -->
    ...
></textarea>
```

## 💻 Uso

### Para el Empleado:
1. Crea una solicitud de soporte
2. Espera a que el soporte la atienda
3. Cuando el soporte finaliza, aparece el modal
4. Selecciona las estrellas (obligatorio)
5. Agrega comentario (opcional)
6. Haz clic en "Enviar" o "Omitir"

### Para el Soporte:
- Las calificaciones se guardan en la base de datos
- Pueden consultarse para ver el promedio de cada soporte
- Útil para métricas de desempeño

## 📊 Consultar Calificaciones

### Ver todas las calificaciones:
```sql
SELECT 
    s.id_solicitud,
    s.calificacion,
    u_empleado.nombre as empleado_nombre,
    u_soporte.nombre as soporte_nombre
FROM solicitudes s
JOIN usuarios u_empleado ON s.id_emisor = u_empleado.id_usuario
JOIN usuarios u_soporte ON s.id_soporte = u_soporte.id_usuario
WHERE s.calificacion IS NOT NULL
ORDER BY s.fecha_envio DESC;
```

### Ver promedio por soporte:
```sql
SELECT 
    u.nombre,
    u.apellido,
    COUNT(s.calificacion) as total_calificaciones,
    AVG(s.calificacion) as promedio,
    ROUND(AVG(s.calificacion), 2) as promedio_redondeado
FROM usuarios u
LEFT JOIN solicitudes s ON u.id_usuario = s.id_soporte AND s.calificacion IS NOT NULL
WHERE u.tipo_usuario = 'soporte'
GROUP BY u.id_usuario
ORDER BY promedio DESC;
```

## 🔧 Estructura de la Base de Datos

```sql
ALTER TABLE solicitudes 
ADD COLUMN calificacion TINYINT(1) NULL DEFAULT NULL;

-- Valores posibles:
-- NULL = No calificado
-- 1 = 1 estrella (Muy malo)
-- 2 = 2 estrellas (Malo)
-- 3 = 3 estrellas (Regular)
-- 4 = 4 estrellas (Bueno)
-- 5 = 5 estrellas (Excelente)
```

## 🐛 Solución de Problemas

### El modal no aparece:
- Verifica que ejecutaste el script SQL
- Revisa la consola del navegador (F12) para errores
- Asegúrate de que el CSS esté cargado

### No se guarda la calificación:
- Verifica que el campo `calificacion` existe en la tabla
- Revisa la consola del servidor para errores
- Comprueba que el endpoint PUT funciona

### Las estrellas no se ven:
- Limpia caché del navegador (Ctrl + F5)
- Verifica que el CSS de modal-calificacion esté cargado
- Abre en modo incógnito para probar

## 📈 Mejoras Futuras Sugeridas

- [ ] Mostrar promedio de calificación en perfil del soporte
- [ ] Dashboard con estadísticas de calificaciones
- [ ] Filtrar soportes por mejor calificación
- [ ] Notificar al soporte cuando recibe una calificación
- [ ] Exportar reportes de calificaciones
- [ ] Agregar gráficos de tendencias

## ✅ Testing

Para probar:

1. Ejecuta el script SQL
2. Reinicia el servidor
3. Inicia sesión como empleado
4. Crea una solicitud
5. En otra ventana, inicia sesión como soporte
6. Responde y finaliza la solicitud
7. Vuelve a la ventana del empleado
8. **Deberías ver el modal de calificación**
9. Selecciona estrellas y envía
10. Verifica en la base de datos:
    ```sql
    SELECT * FROM solicitudes WHERE calificacion IS NOT NULL;
    ```

---

**Implementado:** 2025-09-30  
**Tiempo de implementación:** ~3 horas  
**Versión:** 1.0.0
