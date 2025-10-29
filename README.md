# UdeA Grade Reporter - Instrucciones de Uso

## 🎯 Sistema Detectado
**Universidad de Antioquia - Sistema de Ingreso de Notas**
- Formulario: `form[name="Forma"]`
- Acción: `?app=prof_notas`
- Estudiantes detectados: 49 (según tu ejemplo)

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

### 2. Instalar el Script
1. Abre Tampermonkey Dashboard
2. Click "Create a new script"
3. Reemplaza todo el contenido con el código de `udea_grade_reporter_optimized.user.js`
4. Presiona Ctrl+S para guardar

### 3. Usar el Sistema

#### A. Preparar CSV
Tu archivo CSV debe tener este formato:
```csv
id,apellidos,nombres,email,nota
1028028853,ALBORNOZ VILLADIEGO,JOSÉ FERNANDO,jose@email.com,4.0
1003433503,ALVAREZ PADILLA,LUIS FERNANDO,luis@email.com,3.9
1036957018,ALZATE CASTAÑO,JONATHAN ARLEY,jonathan@email.com,4.7
```

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
- **Columna 5**: Nota (ej: 4.5)
- **Otras columnas**: Se ignoran, pueden ser apellidos, nombres, email

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

### El panel no aparece:
- Verifica que estés en la página correcta (debe decir "INGRESO DE NOTAS")
- Revisa la consola del navegador (F12) para errores

### No encuentra estudiantes:
- Asegúrate que los IDs en tu CSV coinciden exactamente
- Los IDs deben estar en la primera columna del CSV

### Las notas no se llenan:
- Verifica que las notas estén en la columna 5 del CSV
- Las notas deben ser números entre 0.0 y 5.0

¡Listo para automatizar el ingreso de notas en UdeA! 🎓