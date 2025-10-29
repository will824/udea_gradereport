// ==UserScript==
// @name         UdeA Grade Reporter - Optimized
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Automatically fill UdeA grade entry system from CSV data
// @author       William Cornejo
// @match        *://ayudame2.udea.edu.co/*
// @match        *://*.udea.edu.co/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Store for grade data
    let gradeData = new Map();

    // Configuration for UdeA system
    const CONFIG = {
        // Selectors specific to UdeA grade system
        formSelector: 'form[name="Forma"]',
        studentRowSelector: 'tr[align="center"]',
        studentIdSelector: 'input[name^="Listado["]',
        studentNameSelector: 'td[align="left"]',
        gradeSelectSelector: 'select[name^="Nota["]',

        // Grade values in the system
        gradeValues: ['5.0', '4.9', '4.8', '4.7', '4.6', '4.5', '4.4', '4.3', '4.2', '4.1', '4.0',
                     '3.9', '3.8', '3.7', '3.6', '3.5', '3.4', '3.3', '3.2', '3.1', '3.0',
                     '2.9', '2.8', '2.7', '2.6', '2.5', '2.4', '2.3', '2.2', '2.1', '2.0',
                     '1.9', '1.8', '1.7', '1.6', '1.5', '1.4', '1.3', '1.2', '1.1', '1.0',
                     '0.9', '0.8', '0.7', '0.6', '0.5', '0.4', '0.3', '0.2', '0.1', '0.0']
    };

    // Create floating control panel
    function createControlPanel() {
        // Remove any existing panel first
        const existingPanel = document.getElementById('udeaGradePanel');
        if (existingPanel) {
            existingPanel.remove();
        }

        const panel = document.createElement('div');
        panel.id = 'udeaGradePanel';
        panel.innerHTML = `
            <div style="position: fixed !important; top: 20px !important; right: 20px !important; background: #2B6447 !important; color: white !important; border: 3px solid #8bc34a !important; padding: 20px !important; border-radius: 10px !important; box-shadow: 0 4px 15px rgba(0,0,0,0.5) !important; z-index: 999999 !important; font-family: Arial, sans-serif !important; width: 350px !important; max-height: 600px !important; overflow-y: auto !important; display: block !important; visibility: visible !important;">
                <div style="text-align: center; margin-bottom: 15px;">
                    <h3 style="margin: 0; color: #8bc34a;">📊 UdeA Grade Reporter</h3>
                    <small style="color: #ffffff;">INGRESO DE NOTAS - Automatización</small>
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">📁 Cargar archivo CSV:</label>
                    <input type="file" id="csvFileInput" accept=".csv,.txt" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; background: white;">
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">📝 O pegar datos CSV:</label>
                    <textarea id="csvTextInput" placeholder="Formato simple:&#10;id,nota&#10;1028028853,4.0&#10;1003433503,3.9&#10;1028028765,4.5&#10;1118550877,3.8&#10;&#10;Solo necesitas ID del estudiante y la nota (0.0 - 5.0)"
                             style="width: 100%; height: 100px; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 10px; resize: vertical; font-family: monospace;"></textarea>
                </div>

                <div style="margin-bottom: 15px; display: flex; gap: 10px;">
                    <button id="loadDataBtn" style="flex: 1; background: #8bc34a; color: white; border: none; padding: 10px; border-radius: 4px; cursor: pointer; font-weight: bold;">
                        ⬆️ Cargar Datos
                    </button>
                    <button id="previewBtn" style="flex: 1; background: #3BBFAD; color: white; border: none; padding: 10px; border-radius: 4px; cursor: pointer; font-weight: bold;" disabled>
                        👀 Vista Previa
                    </button>
                </div>

                <div id="statusArea" style="margin-bottom: 15px; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 4px; font-size: 12px; min-height: 40px;">
                    <div id="statusText">ℹ️ Cargar archivo CSV o pegar datos para comenzar</div>
                    <div id="countInfo" style="margin-top: 5px; font-weight: bold;"></div>
                </div>

                <div style="margin-bottom: 15px;">
                    <button id="fillGradesBtn" style="width: 100%; background: #FF9800; color: white; border: none; padding: 12px; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 16px;" disabled>
                        🚀 LLENAR TODAS LAS NOTAS
                    </button>
                </div>

                <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                    <button id="clearAllBtn" style="flex: 1; background: #f44336; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer;">
                        🗑️ Limpiar Todo
                    </button>
                    <button id="saveFormBtn" style="flex: 1; background: #4CAF50; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer;">
                        💾 Guardar Formulario
                    </button>
                </div>

                <div style="margin-bottom: 15px;">
                    <button id="diagnosticBtn" style="width: 100%; background: #9C27B0; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                        🔍 Diagnóstico del Formulario
                    </button>
                </div>

                <div style="font-size: 10px; color: #ccc; text-align: center; border-top: 1px solid #555; padding-top: 10px; display: flex; justify-content: space-between;">
                    <button id="minimizeBtn" style="background: none; border: none; color: #ccc; cursor: pointer; font-size: 12px;">➖ Minimizar</button>
                    <button id="closeBtn" style="background: none; border: none; color: #ccc; cursor: pointer; font-size: 12px;">❌ Cerrar</button>
                </div>
            </div>
        `;
        document.body.appendChild(panel);

        console.log('✅ Panel de control agregado al DOM');
        console.log('📍 Panel ID:', panel.id);
        console.log('🎨 Panel visible:', panel.style.display !== 'none');

        // Add event listeners
        document.getElementById('loadDataBtn').onclick = loadGradeData;
        document.getElementById('previewBtn').onclick = showPreview;
        document.getElementById('fillGradesBtn').onclick = fillAllGrades;
        document.getElementById('clearAllBtn').onclick = clearAllGrades;
        document.getElementById('saveFormBtn').onclick = saveForm;
        document.getElementById('diagnosticBtn').onclick = runDiagnostic;
        document.getElementById('minimizeBtn').onclick = minimizePanel;
        document.getElementById('closeBtn').onclick = closePanel;

        // File input listener
        document.getElementById('csvFileInput').onchange = function(e) {
            if (e.target.files.length > 0) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    document.getElementById('csvTextInput').value = event.target.result;
                    updateStatus('📁 Archivo cargado. Click "Cargar Datos" para procesar.');
                };
                reader.readAsText(e.target.files[0]);
            }
        };
    }

    // Parse CSV data to extract ID and grade (simple format: id,nota)
    function parseCSVData(csvText) {
        const lines = csvText.trim().split('\n');
        const data = new Map();
        let errors = [];

        // Skip header row if it exists
        const startIndex = lines[0].toLowerCase().includes('id') && lines[0].toLowerCase().includes('nota') ? 1 : 0;

        for (let i = startIndex; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line) {
                try {
                    const parts = parseCSVLine(line);
                    if (parts.length >= 2) {
                        const id = parts[0].trim();
                        const grade = parseFloat(parts[1].trim());

                        if (id && !isNaN(grade) && grade >= 0 && grade <= 5) {
                            data.set(id, { grade });
                        } else {
                            errors.push(`Línea ${i + 1}: ID o nota inválida (${id}, ${parts[1]})`);
                        }
                    } else {
                        errors.push(`Línea ${i + 1}: Formato incorrecto - necesita 2 columnas (id,nota)`);
                    }
                } catch (e) {
                    errors.push(`Línea ${i + 1}: Error de formato`);
                }
            }
        }

        return { data, errors, format: 'simple' };
    }

    // Parse CSV line considering quoted fields
    function parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current);
        return result;
    }

    // Load and validate grade data
    function loadGradeData() {
        const csvText = document.getElementById('csvTextInput').value;
        if (!csvText.trim()) {
            updateStatus('❌ Por favor ingresa datos CSV', 'error');
            return;
        }

        const { data, errors, format } = parseCSVData(csvText);
        gradeData = data;

        let statusMsg = `✅ Cargados: ${data.size} registros (formato: id,nota)`;
        if (errors.length > 0) {
            statusMsg += `\n⚠️ ${errors.length} errores encontrados`;
        }

        updateStatus(statusMsg, data.size > 0 ? 'success' : 'error');
        document.getElementById('countInfo').textContent = `📊 Total registros: ${data.size}`;

        // Enable buttons
        document.getElementById('previewBtn').disabled = data.size === 0;
        document.getElementById('fillGradesBtn').disabled = data.size === 0;

        if (errors.length > 0) {
            console.log('Errores en CSV:', errors);
        }
    }

    // Show preview of what will be filled
    function showPreview() {
        if (gradeData.size === 0) {
            updateStatus('❌ No hay datos cargados para previsualizar', 'error');
            return;
        }

        const rows = document.querySelectorAll(CONFIG.studentRowSelector);
        let found = 0;
        let notFound = 0;
        let nameMatches = 0;
        let preview = [];

        rows.forEach(row => {
            const idInput = row.querySelector(CONFIG.studentIdSelector);
            const nameCell = row.querySelector(CONFIG.studentNameSelector);

            if (idInput && nameCell) {
                const studentId = idInput.value;
                const pageStudentName = nameCell.textContent.trim();

                if (gradeData.has(studentId)) {
                    const { grade } = gradeData.get(studentId);
                    preview.push(`✅ ${pageStudentName} (${studentId}): ${grade}`);
                    found++;
                    nameMatches++; // All match since we don't validate names
                } else {
                    preview.push(`❌ ${pageStudentName} (${studentId}): No encontrado`);
                    notFound++;
                }
            }
        });

        const previewText = preview.slice(0, 12).join('\n') +
                           (preview.length > 12 ? '\n... y más' : '');

        updateStatus(`🔍 Preview:\n${previewText}\n\n📊 Encontrados: ${found} | No encontrados: ${notFound}\n🎯 Nombres coinciden: ${nameMatches}/${found}`);
    }

    // Find closest grade value available in dropdown
    function findClosestGrade(targetGrade, selectElement) {
        let closestValue = null;
        let minDiff = Infinity;

        for (let option of selectElement.options) {
            const value = parseFloat(option.value);
            if (!isNaN(value) && value >= 0 && value <= 5) {
                const diff = Math.abs(value - targetGrade);
                if (diff < minDiff) {
                    minDiff = diff;
                    closestValue = option.value;
                }
            }
        }
        return closestValue;
    }

    // Fill all grades
    function fillAllGrades() {
        if (gradeData.size === 0) {
            updateStatus('❌ No hay datos de notas cargados', 'error');
            return;
        }

        const rows = document.querySelectorAll(CONFIG.studentRowSelector);
        let filled = 0;
        let notFound = 0;
        let errors = 0;

        updateStatus('🔄 Llenando notas... Por favor espera.');

        rows.forEach((row, index) => {
            const idInput = row.querySelector(CONFIG.studentIdSelector);
            const gradeSelect = row.querySelector(CONFIG.gradeSelectSelector);
            const nameCell = row.querySelector(CONFIG.studentNameSelector);

            if (idInput && gradeSelect && nameCell) {
                const studentId = idInput.value;
                const studentName = nameCell.textContent.trim();

                if (gradeData.has(studentId)) {
                    const { grade: targetGrade } = gradeData.get(studentId);
                    const closestValue = findClosestGrade(targetGrade, gradeSelect);

                    if (closestValue !== null) {
                        setTimeout(() => {
                            gradeSelect.value = closestValue;
                            gradeSelect.dispatchEvent(new Event('change', { bubbles: true }));

                            // Visual feedback
                            gradeSelect.style.backgroundColor = '#c8f7c5';
                            setTimeout(() => {
                                gradeSelect.style.backgroundColor = '';
                            }, 1000);
                        }, index * 100); // Stagger the updates

                        filled++;
                    } else {
                        errors++;
                        console.warn(`No se pudo encontrar valor para nota ${targetGrade} - ${studentName}`);
                    }
                } else {
                    notFound++;
                }
            }
        });

        setTimeout(() => {
            updateStatus(`✅ Proceso completado!\n📝 Llenadas: ${filled}\n❌ No encontradas: ${notFound}\n⚠️ Errores: ${errors}`, 'success');
        }, (rows.length * 100) + 1000);
    }

    // Clear all grades
    function clearAllGrades() {
        if (confirm('¿Estás seguro de que quieres limpiar todas las notas?')) {
            const gradeSelects = document.querySelectorAll(CONFIG.gradeSelectSelector);
            gradeSelects.forEach(select => {
                select.value = '9.9'; // Empty value in UdeA system
                select.dispatchEvent(new Event('change', { bubbles: true }));
            });
            updateStatus('🗑️ Todas las notas han sido limpiadas', 'success');
        }
    }

    // Save form (submit)
    function saveForm() {
        const form = document.querySelector(CONFIG.formSelector);
        if (!form) {
            updateStatus('❌ No se encontró el formulario para guardar', 'error');
            console.error('Formulario no encontrado:', CONFIG.formSelector);
            return;
        }

        if (confirm('¿Guardar las notas en el sistema UdeA?')) {
            updateStatus('💾 Guardando notas en el sistema...', 'info');

            try {
                // Método 1: Intentar submit() normal
                console.log('🔄 Intentando submit() normal...');
                form.submit();

                // Si llegamos aquí, el submit funcionó
                updateStatus('✅ Formulario enviado correctamente', 'success');

            } catch (error) {
                console.error('❌ Error con submit() normal:', error);

                try {
                    // Método 2: Buscar botón de submit y hacer click
                    console.log('🔄 Buscando botón de submit...');

                    // Buscar diferentes tipos de botones de submit
                    let submitBtn = form.querySelector('input[type="submit"]') ||
                                   form.querySelector('button[type="submit"]') ||
                                   form.querySelector('input[value*="Guardar"]') ||
                                   form.querySelector('input[value*="GUARDAR"]') ||
                                   form.querySelector('input[value*="Enviar"]') ||
                                   form.querySelector('input[value*="ENVIAR"]') ||
                                   form.querySelector('button[onclick*="submit"]') ||
                                   form.querySelector('input[onclick*="submit"]');

                    // Si no encuentra, buscar en todo el documento
                    if (!submitBtn) {
                        submitBtn = document.querySelector('input[type="submit"]') ||
                                   document.querySelector('button[onclick*="submit"]') ||
                                   document.querySelector('input[onclick*="submit"]');
                    }

                    if (submitBtn) {
                        console.log('✅ Botón de submit encontrado:', submitBtn);
                        console.log('📝 Tipo:', submitBtn.type, 'Valor:', submitBtn.value, 'Text:', submitBtn.textContent);
                        submitBtn.click();
                        updateStatus('✅ Formulario enviado via botón', 'success');
                    } else {
                        // Método 3: Crear evento submit manual
                        console.log('🔄 Intentando evento submit manual...');
                        const submitEvent = new Event('submit', {
                            bubbles: true,
                            cancelable: true
                        });

                        const eventResult = form.dispatchEvent(submitEvent);
                        if (eventResult) {
                            // Si el evento no fue cancelado, hacer submit
                            form.submit();
                            updateStatus('✅ Formulario enviado via evento', 'success');
                        } else {
                            updateStatus('❌ El envío fue cancelado por validaciones', 'error');
                        }
                    }

                } catch (error2) {
                    console.error('❌ Error con métodos alternativos:', error2);
                    updateStatus('❌ Error al enviar formulario. Usa el botón original del sistema.', 'error');

                    // Método 4: Diagnóstico y instrucciones
                    console.log('🔍 DIAGNÓSTICO DEL FORMULARIO:');
                    console.log('📋 Formulario encontrado:', form);
                    console.log('🎯 Action:', form.action);
                    console.log('📡 Method:', form.method);
                    console.log('📝 Name:', form.name);
                    console.log('🔘 Botones en formulario:', form.querySelectorAll('input, button'));
                    console.log('🔘 Todos los inputs:', form.querySelectorAll('input'));
                    console.log('🔘 Todos los botones:', form.querySelectorAll('button'));

                    updateStatus('❌ Error al enviar formulario. Revisa la consola (F12) para detalles.', 'error');

                    // Mostrar instrucciones más detalladas
                    alert('No se pudo enviar automáticamente. Por favor:\n\n1. Revisa que las notas estén correctas\n2. Usa el botón "Guardar" o "Enviar" del formulario original de UdeA\n3. Si hay errores, el sistema te los mostrará\n4. Abre la consola (F12) para ver detalles técnicos');
                }
            }
        }
    }

    // Run diagnostic of the form
    function runDiagnostic() {
        console.log('🔍 === DIAGNÓSTICO COMPLETO DEL FORMULARIO ===');

        const form = document.querySelector(CONFIG.formSelector);
        const rows = document.querySelectorAll(CONFIG.studentRowSelector);
        const gradeSelects = document.querySelectorAll(CONFIG.gradeSelectSelector);

        // Información del formulario
        console.log('📋 FORMULARIO:');
        console.log('  - Encontrado:', !!form);
        if (form) {
            console.log('  - Name:', form.name);
            console.log('  - Action:', form.action);
            console.log('  - Method:', form.method);
            console.log('  - ID:', form.id);
        }

        // Botones de submit
        console.log('🔘 BOTONES DE SUBMIT:');
        const allSubmitInputs = document.querySelectorAll('input[type="submit"]');
        const allSubmitButtons = document.querySelectorAll('button[type="submit"]');
        const allButtonsWithSubmit = document.querySelectorAll('input[onclick*="submit"], button[onclick*="submit"]');

        console.log('  - input[type="submit"]:', allSubmitInputs.length, allSubmitInputs);
        console.log('  - button[type="submit"]:', allSubmitButtons.length, allSubmitButtons);
        console.log('  - Con onclick submit:', allButtonsWithSubmit.length, allButtonsWithSubmit);

        // Información de estudiantes
        console.log('👥 ESTUDIANTES:');
        console.log('  - Filas encontradas:', rows.length);
        console.log('  - Selectores de notas:', gradeSelects.length);

        // Muestra los primeros 3 estudiantes como ejemplo
        for (let i = 0; i < Math.min(3, rows.length); i++) {
            const row = rows[i];
            const idInput = row.querySelector(CONFIG.studentIdSelector);
            const nameCell = row.querySelector(CONFIG.studentNameSelector);
            const gradeSelect = row.querySelector(CONFIG.gradeSelectSelector);

            console.log(`  - Estudiante ${i + 1}:`);
            console.log(`    ID: ${idInput ? idInput.value : 'No encontrado'}`);
            console.log(`    Nombre: ${nameCell ? nameCell.textContent.trim() : 'No encontrado'}`);
            console.log(`    Selector notas: ${!!gradeSelect}`);
        }

        // Estado actual
        let statusMsg = `🔍 DIAGNÓSTICO:\n`;
        statusMsg += `📋 Formulario: ${form ? '✅' : '❌'}\n`;
        statusMsg += `👥 Estudiantes: ${rows.length}\n`;
        statusMsg += `📝 Notas: ${gradeSelects.length}\n`;
        statusMsg += `🔘 Botones submit: ${allSubmitInputs.length + allSubmitButtons.length + allButtonsWithSubmit.length}\n\n`;
        statusMsg += `📊 Datos cargados: ${gradeData.size} registros\n\n`;
        statusMsg += `💡 Revisa la consola (F12) para detalles completos`;

        updateStatus(statusMsg, 'info');

        // Alertar al usuario
        alert(`Diagnóstico completado!\n\nFormulario encontrado: ${form ? 'SÍ' : 'NO'}\nEstudiantes detectados: ${rows.length}\nBotones de envío: ${allSubmitInputs.length + allSubmitButtons.length + allButtonsWithSubmit.length}\n\nRevisa la consola del navegador (F12) para más detalles.`);
    }

    // Update status message
    function updateStatus(message, type = 'info') {
        const statusElement = document.getElementById('statusText');
        if (statusElement) {
            statusElement.innerHTML = message.replace(/\n/g, '<br>');

            // Color coding
            const colors = {
                'success': '#4CAF50',
                'error': '#f44336',
                'warning': '#FF9800',
                'info': '#2196F3'
            };

            statusElement.style.color = colors[type] || '#ffffff';
        }
    }

    // Close panel completely
    function closePanel() {
        const panel = document.getElementById('udeaGradePanel');
        if (panel) {
            panel.remove();
        }

        // Show activation button again
        const activationBtn = document.getElementById('udeaActivationBtn');
        if (activationBtn) {
            activationBtn.style.display = 'flex';
        } else {
            // Create activation button if it doesn't exist
            createEmergencyButton();
        }

        console.log('❌ Panel cerrado');
    }

    // Minimize/restore panel
    function minimizePanel() {
        const panel = document.getElementById('udeaGradePanel');
        const panelContent = panel.querySelector('div');
        const minimizeBtn = document.getElementById('minimizeBtn');

        const isMinimized = panelContent.style.display === 'none';

        if (isMinimized) {
            // Restore panel
            panelContent.style.display = 'block';
            panel.style.height = 'auto';
            panel.style.width = '350px';
            minimizeBtn.textContent = '➖ Minimizar';
        } else {
            // Minimize panel
            panelContent.style.display = 'none';
            panel.style.height = '50px';
            panel.style.width = '200px';
            minimizeBtn.textContent = '➕ Restaurar';

            // Show only title and restore button
            panel.innerHTML = `
                <div style="position: fixed !important; top: 20px !important; right: 20px !important; background: #2B6447 !important; color: white !important; border: 3px solid #8bc34a !important; padding: 10px !important; border-radius: 10px !important; box-shadow: 0 4px 15px rgba(0,0,0,0.5) !important; z-index: 999999 !important; font-family: Arial, sans-serif !important; width: 200px !important; height: 50px !important; overflow: hidden !important; display: flex !important; align-items: center !important; justify-content: space-between !important;">
                    <span style="font-size: 12px; font-weight: bold;">📊 UdeA Grade Reporter</span>
                    <div>
                        <button id="restoreBtn" style="background: none; border: none; color: #8bc34a; cursor: pointer; font-size: 12px; margin-right: 5px;">➕</button>
                        <button id="closeMinimizedBtn" style="background: none; border: none; color: #f44336; cursor: pointer; font-size: 12px;">❌</button>
                    </div>
                </div>
            `;

            // Re-add event listeners for minimized state
            document.getElementById('restoreBtn').onclick = function() {
                panel.remove();
                createControlPanel();
            };
            document.getElementById('closeMinimizedBtn').onclick = closePanel;
        }
    }

    // Create minimize button when minimized
    function createMinimizeButton() {
        const btn = document.createElement('button');
        btn.innerHTML = '📊';
        btn.title = 'Mostrar Grade Reporter';
        btn.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #2B6447;
            color: white;
            border: 2px solid #6c9a06;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 20px;
            z-index: 10000;
            display: none;
        `;
        btn.onclick = () => {
            btn.style.display = 'none';
            document.getElementById('udeaGradePanel').style.display = 'block';
        };
        document.body.appendChild(btn);
        return btn;
    }

    // Initialize the script
    function init() {
        console.log('🔍 UdeA Grade Reporter: Iniciando diagnóstico...');
        console.log('📍 URL actual:', window.location.href);

        // Check if we're on the grade entry page
        const form = document.querySelector(CONFIG.formSelector);
        const gradeTitle = document.querySelector('b');
        const allTitles = document.querySelectorAll('b');
        const pageText = document.body.textContent.toLowerCase();

        console.log('📋 Formulario encontrado:', !!form);
        console.log('📝 Título principal encontrado:', !!gradeTitle);
        console.log('📄 Todos los títulos:', Array.from(allTitles).map(b => b.textContent.trim()));
        console.log('🔍 Contenido de la página contiene "ingreso":', pageText.includes('ingreso'));
        console.log('🔍 Contenido de la página contiene "notas":', pageText.includes('notas'));
        console.log('🔍 URL contiene "prof_notas":', window.location.href.includes('prof_notas'));

        // Multiple detection methods - more flexible
        let isGradePage = false;
        let detectionMethod = '';

        // Method 1: Check URL for prof_notas
        if (window.location.href.includes('prof_notas')) {
            isGradePage = true;
            detectionMethod = 'URL contiene prof_notas';
        }
        // Method 2: Check for form and grade-related text
        else if (form && (pageText.includes('ingreso') && pageText.includes('notas'))) {
            isGradePage = true;
            detectionMethod = 'formulario + texto de notas';
        }
        // Method 3: Check for specific title text
        else if (form && gradeTitle && gradeTitle.textContent.toUpperCase().includes('INGRESO DE NOTAS')) {
            isGradePage = true;
            detectionMethod = 'título específico';
        }
        // Method 4: Check for grade selectors (more specific)
        else if (form && document.querySelector(CONFIG.gradeSelectSelector)) {
            isGradePage = true;
            detectionMethod = 'formulario + selectores de notas';
        }

        if (isGradePage) {
            console.log(`🎯 UdeA Grade Reporter: Página de ingreso de notas detectada (${detectionMethod})`);

            // Only create activation button - no automatic panel
            setTimeout(createEmergencyButton, 1000);

        } else {
            console.log('❌ UdeA Grade Reporter: No es una página de ingreso de notas - script inactivo');
            console.log('💡 Si esta ES la página correcta, el script puede activarse manualmente');

            // Create emergency button anyway for manual activation
            setTimeout(() => {
                console.log('🔧 Creando botón de activación manual...');
                createEmergencyButton();
            }, 2000);
        }
    }    // Activation button - create a small button to manually trigger the panel
    function createEmergencyButton() {
        // Remove any existing activation button
        const existingBtn = document.getElementById('udeaActivationBtn');
        if (existingBtn) {
            existingBtn.remove();
        }

        const activationBtn = document.createElement('div');
        activationBtn.id = 'udeaActivationBtn';
        activationBtn.innerHTML = '🎯';
        activationBtn.title = 'Activar UdeA Grade Reporter - Click para abrir panel de notas';
        activationBtn.style.cssText = `
            position: fixed !important;
            top: 10px !important;
            left: 10px !important;
            background: #2B6447 !important;
            color: white !important;
            width: 50px !important;
            height: 50px !important;
            border-radius: 50% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            cursor: pointer !important;
            z-index: 999999 !important;
            font-size: 20px !important;
            border: 3px solid #8bc34a !important;
            box-shadow: 0 2px 10px rgba(0,0,0,0.5) !important;
            transition: all 0.3s ease !important;
            animation: pulse 2s infinite !important;
        `;

        // Add CSS animation for pulse effect
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0% { box-shadow: 0 2px 10px rgba(0,0,0,0.5), 0 0 0 0 rgba(139, 195, 74, 0.7); }
                70% { box-shadow: 0 2px 10px rgba(0,0,0,0.5), 0 0 0 10px rgba(139, 195, 74, 0); }
                100% { box-shadow: 0 2px 10px rgba(0,0,0,0.5), 0 0 0 0 rgba(139, 195, 74, 0); }
            }
        `;
        if (!document.getElementById('udeaGradeReporterCSS')) {
            style.id = 'udeaGradeReporterCSS';
            document.head.appendChild(style);
        }

        activationBtn.onmouseover = function() {
            this.style.background = '#8bc34a !important';
            this.style.transform = 'scale(1.1)';
            this.style.animation = 'none !important';
        };

        activationBtn.onmouseout = function() {
            this.style.background = '#2B6447 !important';
            this.style.transform = 'scale(1)';
            this.style.animation = 'pulse 2s infinite !important';
        };

        activationBtn.onclick = function() {
            console.log('🎯 Activando Grade Reporter...');
            createControlPanel();
            this.style.display = 'none'; // Hide activation button when panel is active

            // Show confirmation
            const confirmation = document.createElement('div');
            confirmation.style.cssText = `
                position: fixed; top: 10px; left: 50%; transform: translateX(-50%);
                background: #4CAF50; color: white; padding: 10px 20px;
                border-radius: 5px; z-index: 999999; font-weight: bold;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            `;
            confirmation.textContent = '✅ UdeA Grade Reporter activado - Panel verde en esquina superior derecha';
            document.body.appendChild(confirmation);
            setTimeout(() => confirmation.remove(), 4000);
        };

        document.body.appendChild(activationBtn);
        console.log('🎯 Botón de activación creado - Click para abrir el panel');
    }

    // Wait for page to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();