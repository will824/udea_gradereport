# UdeA Grade Reporter - Instrucciones de Uso

## 🎯 Sistema Automatizado de Ingreso de Notas
**Universidad de Antioquia - Formato CSV Simplificado**
- **Solo 2 columnas necesarias**: ID y Nota
- **Formato mínimo**: `id,nota`
- **Compatible con**: Formulario `form[name="Forma"]` y acción `?app=prof_notas`

## ⚠️ CONFIGURACIÓN CRÍTICA REQUERIDA

> **🚨 IMPORTANTE**: El script requiere configuración especial del navegador y Tampermonkey para funcionar correctamente.
>
> **📋 Checklist rápido antes de usar:**
> - ✅ Modo desarrollador habilitado en el navegador
> - ✅ "Allow User Scripts" habilitado en Tampermonkey
> - ✅ Config mode en "Advanced" en Tampermonkey
>
> **Sin estas configuraciones el script NO funcionará. Ver instrucciones detalladas abajo.**

## ✅ ¡EL SCRIPT FUNCIONARÁ PERFECTAMENTE!

Tu página tiene exactamente la estructura necesaria:

### Estructura Detectada:
```html
<form name='Forma' action='?app=prof_notas' method='post'>
  <tr align='center'>
    <td>1</td>
    <td><input type='hidden' name='Listado[0]' value='1028028853'>1028028853</td>
    <td align='left'>ALBORNOZ VILLADIEGO JOSÉ FERNANDO</td>
    <td>
      <select name='Nota[0]' size='1' onChange='Sumar(0);'>
        <option value='5.0'>5.0</option>
        <option value='4.9'>4.9</option>
        <!-- ... más opciones ... -->
      </select>
    </td>
  </tr>
</form>
```

## 🚀 Instalación y Uso

### 1. Instalar Tampermonkey
- Chrome: https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo
- Firefox: https://addons.mozilla.org/firefox/addon/tampermonkey/

### 2. ⚠️ Configuración Requerida del Navegador

#### A. Habilitar Modo Desarrollador (Developer Mode)
**Chrome:**
1. Ve a `chrome://extensions/`
2. Activa **"Modo de desarrollador"** en la esquina superior derecha
3. Esto es necesario para que los userscripts funcionen correctamente

**Firefox:**
1. Ve a `about:config`
2. Acepta el riesgo si aparece la advertencia
3. Busca `extensions.webextensions.userScripts.enabled`
4. Cambia el valor a `true`

#### B. Configurar Tampermonkey
1. **Abre el Dashboard de Tampermonkey**
2. **Ve a la pestaña "Settings" (Configuración)**
3. **En la sección "Security":**
   - Cambia **"Config mode"** a **"Advanced"**
   - Habilita **"Allow User Scripts"** ✅
   - Habilita **"Allow access to file URLs"** ✅ (opcional, pero recomendado)

**⚠️ Sin estas configuraciones, el script NO funcionará correctamente.**

### 3. Instalar el Script

#### 🎯 Opción A: Instalación Directa desde GitHub (Recomendado)

> **⚡ INSTALACIÓN EN UN CLICK:**
>
> **📥 [CLICK AQUÍ PARA INSTALAR EL SCRIPT](https://github.com/will824/udea_gradereport/raw/main/udea_grade_reporter_optimized.user.js)**
>
> *(El enlace abrirá Tampermonkey automáticamente para la instalación)*

**Pasos detallados:**

1. **Click en el enlace de arriba** o copia esta URL en tu navegador:
   ```
   https://github.com/will824/udea_gradereport/raw/main/udea_grade_reporter_optimized.user.js
   ```

2. **Tampermonkey detectará automáticamente** el script y mostrará una ventana de instalación

3. **Click "Install"** para confirmar la instalación

4. **¡Listo!** El script se instalará automáticamente y estará activo

**📝 Método alternativo:**
- Ve a: https://github.com/will824/udea_gradereport/blob/main/udea_grade_reporter_optimized.user.js
- Click en el botón **"Raw"** en la esquina superior derecha del código

**✅ Ventajas de este método:**
- 🚀 **Instalación en un solo click**
- 📦 **Siempre obtienes la versión más reciente**
- 🔄 **Actualizaciones automáticas disponibles**
- ✋ **No necesitas copiar y pegar código manualmente**
- 🔒 **Instalación segura directamente desde el repositorio oficial**

**🔄 Actualizaciones automáticas:**
Tampermonkey puede verificar automáticamente si hay nuevas versiones del script. Para habilitarlo:
1. Ve al Dashboard de Tampermonkey
2. En la configuración del script, habilita "Check for updates"

#### 🔧 Opción B: Instalación Manual
Si prefieres instalar manualmente:

1. Abre Tampermonkey Dashboard
2. Click "Create a new script"
3. Reemplaza todo el contenido con el código de `udea_grade_reporter_optimized.user.js`
4. Presiona Ctrl+S para guardar

### 4. Usar el Sistema

#### A. Preparar CSV
Tu archivo CSV debe tener este formato simple:
```csv
id,nota
1028028853,4.0
1003433503,3.9
1036957018,4.7
1118550877,3.8
1028028765,4.5
```

**Solo necesitas 2 columnas:**
- **id**: Cédula del estudiante
- **nota**: Calificación (0.0 a 5.0)

**✅ Ventajas del formato simplificado:**
- Fácil de crear desde Excel o cualquier hoja de cálculo
- Menor tamaño de archivo
- Menor posibilidad de errores
- Procesamiento más rápido

**📄 Archivo de ejemplo**: Ver `udea_minimal_format.csv` en este repositorio

#### B. Pasos en la página de notas:
1. **Navega a la página de ingreso de notas** en UdeA
2. **Aparecerá un panel verde** en la esquina superior derecha
3. **Cargar datos**:
   - Subir archivo CSV, O
   - Pegar datos CSV directamente
4. **Click "Cargar Datos"** - verifica cuántos registros se cargaron
5. **Click "Vista Previa"** - opcional, para revisar qué se llenará
6. **Click "LLENAR TODAS LAS NOTAS"** 🚀
7. **Click "Guardar Formulario"** para enviar al sistema UdeA

## 🎯 Características Especiales para UdeA

### ✅ Adaptado específicamente para:
- **Formulario UdeA**: Detecta `form[name="Forma"]`
- **IDs de estudiantes**: Lee desde `input[name^="Listado["]`
- **Dropdowns de notas**: Selecciona en `select[name^="Nota["]`
- **Valores de notas**: 5.0, 4.9, 4.8... hasta 0.0 (increments de 0.1)
- **Aproximación inteligente**: Si tu CSV tiene 4.35, seleccionará 4.4

### 🔧 Funciones Incluidas:
- ✅ **Carga de archivos CSV**
- ✅ **Pegado directo de datos**
- ✅ **Vista previa antes de llenar**
- ✅ **Llenado automático de todas las notas**
- ✅ **Feedback visual** (campos se ponen verdes temporalmente)
- ✅ **Limpieza masiva** (volver todo a vacío)
- ✅ **Guardar en el sistema** (submit del formulario)
- ✅ **Minimizar panel**

## 📊 Ejemplo de Funcionamiento

Con tu página actual que tiene:
- ALBORNOZ VILLADIEGO JOSÉ FERNANDO (1028028853) → actualmente 4.0
- ALVAREZ PADILLA LUIS FERNANDO (1003433503) → actualmente 3.9
- etc...

El script:
1. ✅ Detectará cada estudiante por su cédula
2. ✅ Buscará la nota en tu CSV
3. ✅ Seleccionará el valor más cercano en el dropdown
4. ✅ Activará el evento `onChange='Sumar(x)'` automáticamente

## ⚠️ Notas Importantes

### CSV Format:
- **Columna 1**: ID/Cédula (ej: 1028028853)
- **Columna 2**: Nota (ej: 4.5)
- **Formato mínimo**: Solo requiere `id,nota` (sin columnas adicionales)

### Valores de Notas:
- Rango: 0.0 a 5.0
- Incrementos: 0.1 (como en el sistema UdeA)
- Valor especial: 6.6 = "PEN" (pendiente)

### Seguridad:
- ✅ Solo funciona en dominios *.udea.edu.co
- ✅ No envía datos a servidores externos
- ✅ Todo el procesamiento es local
- ✅ Puedes revisar antes de guardar

## 🎉 ¡Resultado Final!

En lugar de hacer clic en 49 dropdowns × ~50 opciones cada uno = **2,450 clics manuales**

Ahora solo necesitas:
1. Cargar CSV (1 clic)
2. Llenar todas las notas (1 clic)
3. Guardar (1 clic)

**Total: 3 clics** para procesar 49 estudiantes! 🚀

## 🆘 Solución de Problemas

### 🚨 El script no funciona / El panel no aparece:

**1. Verificar configuración del navegador:**
- ✅ **Chrome**: Modo desarrollador habilitado en `chrome://extensions/`
- ✅ **Firefox**: `extensions.webextensions.userScripts.enabled = true` en `about:config`

**2. Verificar configuración de Tampermonkey:**
- ✅ Config mode en **"Advanced"**
- ✅ **"Allow User Scripts"** habilitado
- ✅ Script activo (interruptor verde en Dashboard)

**3. Otras verificaciones:**
- Verifica que estés en la página correcta (debe decir "INGRESO DE NOTAS")
- Revisa la consola del navegador (F12) para errores
- Recarga la página después de cambiar configuraciones

### El panel aparece pero no funciona:
- Usa el botón **"🔍 Diagnóstico del Formulario"** en el panel
- Revisa la consola (F12) para mensajes de error
- Verifica que el formulario de UdeA esté completamente cargado

### No encuentra estudiantes:
- Asegúrate que los IDs en tu CSV coinciden exactamente
- Los IDs deben estar en la primera columna del CSV

### Las notas no se llenan:
- Verifica que las notas estén en la segunda columna del CSV
- Las notas deben ser números entre 0.0 y 5.0
- Asegúrate que el CSV tiene el formato: `id,nota` (sin espacios extra)

¡Listo para automatizar el ingreso de notas en UdeA! 🎓