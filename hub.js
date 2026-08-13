(() => {
    if (window.__scriptHubLoaded) {
        const panel = document.getElementById('sh-panel');
        if (panel) {
            if (panel.classList.contains('sh-open')) {
                panel.classList.remove('sh-open');
                const advContainer = document.getElementById('sh-adv-container');
                if (advContainer) advContainer.style.display = 'none';
            } else {
                panel.classList.add('sh-open');
            }
        }
        return;
    }
    window.__scriptHubLoaded = true;
    
    const currentBranch = window.__SH_BRANCH || 'main';
    const REPO_BASE_URL = `https://raw.githubusercontent.com/alisohub/fc_amazon/refs/heads/${currentBranch}/scripts`;
    
    const DEPARTMENT_CONFIG = {
        "CRET": { targetRate: 47 },
        "FAST": { targetRate: 100 },
        "UG":   { targetRate: 47 },
        "REFURB": { targetRate: 30 }
    };

    const urlParams = new URLSearchParams(window.location.search);
    const gradingMode = urlParams.get('gradingMode');
    
    let DEPARTAMENT_OPTIONS = [];
    if (gradingMode === 'CRETURN_PRIMARY_GRADING') {
        DEPARTAMENT_OPTIONS = ["UG"];
    } else if (gradingMode === 'CRETURN') {
        DEPARTAMENT_OPTIONS = ["CRET", "FAST"];
    } else if (gradingMode === 'CRETURN_REFURB') {
        DEPARTAMENT_OPTIONS = ["REFURB"];
    } else {
        DEPARTAMENT_OPTIONS = ["CRET", "FAST", "UG", "REFURB"]; 
    }
    
    let currentDep = localStorage.getItem('sh_hub_dep');
    if (!currentDep || !DEPARTAMENT_OPTIONS.includes(currentDep)) {
        currentDep = DEPARTAMENT_OPTIONS[0]; 
        try { localStorage.setItem('sh_hub_dep', currentDep); } catch (e) {}
    }
    
    const SCRIPTS = [
        {
            id: 'auto-lpn',
            name: 'Авто-LPN',
            file: 'auto_lpn.js',
            description: 'Автоматично відкриває "перепризначити LPN" при скануванні LPN або будь-чого іншого, окрім тота',
            getHandler: () => window.__autoLpn
        },
        {
            id: 'item-counter',
            name: 'Рахувальник',
            file: 'counter.js',
            description: 'Рахує пачки, можете сховати з екрану за допомогою F10. Виставте перерву.',
            getHandler: () => window.__itemCounter,
            renderSettings: (container) => {
                const handler = window.__itemCounter;
                if (!handler) return;
                
                const settings = handler.getSettings();
                const currentCount = handler.getCount();
                
                const configRate = DEPARTMENT_CONFIG[currentDep] ? DEPARTMENT_CONFIG[currentDep].targetRate : 47;
                const targetRate = settings.targetRate || configRate; 
                
                handler.updateSettings({ targetRate: targetRate });
                
                container.innerHTML = `
                    <div class="sh-settings-divider"></div>
                    <div class="sh-setting-row" title="Options & Manual Edit">
                        <span class="sh-emoji">🍴</span>
                        <div class="sh-opt-group">
                            <div class="sh-opt-btn ${settings.counterOption === 1 ? 'active' : ''}" data-val="1">1</div>
                            <div class="sh-opt-btn ${settings.counterOption === 2 ? 'active' : ''}" data-val="2">2</div>
                            <div class="sh-opt-btn ${settings.counterOption === 3 ? 'active' : ''}" data-val="3">3</div>
                            <div class="sh-opt-btn ${settings.counterOption === 4 ? 'active' : ''}" data-val="4">4</div>
                        </div>
                        <span class="sh-emoji">✏️</span>
                        <input type="number" id="sh-cfg-count" class="sh-input sh-input-small" min="0" value="${currentCount === 0 ? '' : currentCount}" placeholder="666" />
                    </div>
                    <div class="sh-setting-row" title="Overlay Opacity">
                        <span class="sh-emoji">👻</span>
                        <input type="range" id="sh-cfg-opacity" class="sh-range" min="0" max="1" step="0.05" value="${settings.overlayOpacity}" />
                    </div>
                    
                    <div id="sh-adv-container" style="display: none; padding-top: 8px; margin-top: 8px; border-top: 1px dashed #e0e0e0;">
                        <div class="sh-setting-row" title="Target Rate">
                            <span class="sh-emoji">🎯</span>
                            <input type="number" id="sh-cfg-target" class="sh-input" min="0" value="${targetRate}" placeholder="Необхідна норма" style="flex: 1;" />
                        </div>
                        
                        ${currentBranch === 'development' ? `
                        <div class="sh-setting-row" title="Власний час початку зміни" style="margin-top: 8px; justify-content: space-between;">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <span class="sh-emoji">⏱️</span>
                                <input type="text" id="sh-cfg-start-time" class="sh-input" value="${settings.customStartTime || ''}" placeholder="14:30" maxlength="5" style="width: 55px; text-align: center; padding: 6px 4px;" />
                            </div>
                            <div style="display: flex; gap: 6px;">
                                <button id="sh-btn-start-now" class="sh-time-btn">Зараз</button>
                                <button id="sh-btn-start-reset" class="sh-time-btn">Скинути</button>
                            </div>
                        </div>
                        ` : ''}
                    </div>
                    
                    <div style="display: flex; justify-content: flex-end; margin-top: 6px;">
                        <span id="sh-adv-btn" class="sh-adv-text">Розширені</span>
                    </div>
                `;
                
                container.querySelectorAll('.sh-opt-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        container.querySelectorAll('.sh-opt-btn').forEach(b => b.classList.remove('active'));
                        e.target.classList.add('active');
                        const val = parseInt(e.target.getAttribute('data-val'), 10);
                        handler.updateSettings({ counterOption: val });
                    });
                });
                
                container.querySelector('#sh-cfg-count').addEventListener('input', (e) => {
                    let val = parseInt(e.target.value, 10);
                    if (isNaN(val)) val = 0;
                    if (val < 0) {
                        val = 0;
                        e.target.value = 0;
                    }
                    handler.setCount(val);
                });
                
                container.querySelector('#sh-cfg-opacity').addEventListener('input', (e) => {
                    const val = parseFloat(e.target.value);
                    handler.updateSettings({ overlayOpacity: val });
                });

                container.querySelector('#sh-cfg-target').addEventListener('input', (e) => {
                    let val = parseFloat(e.target.value);
                    if (isNaN(val) || val < 0) val = 0;
                    handler.updateSettings({ targetRate: val });
                });

                if (currentBranch === 'development') {
                    const timeInput = container.querySelector('#sh-cfg-start-time');
                    const btnNow = container.querySelector('#sh-btn-start-now');
                    const btnReset = container.querySelector('#sh-btn-start-reset');

                    if (timeInput && btnNow && btnReset) {
                        timeInput.addEventListener('input', (e) => {
                            // 1. Strip everything except raw numbers and turn it into an array (queue)
                            let digits = e.target.value.replace(/\D/g, '').split('');
                            let out = '';

                            // 2. Process Hour 1
                            if (digits.length > 0) {
                                let d = digits.shift();
                                if (d >= '3') {
                                    out += '0' + d; // e.g., typing '3' becomes '03'
                                } else {
                                    out += d;
                                }
                            }

                            // 3. Process Hour 2
                            if (digits.length > 0 && out.length === 1) {
                                let d = digits.shift();
                                // If hour starts with 2, max second digit is 3 (23:59). 
                                // If they type '2' then '5', it shifts to '02:5...'
                                if (out[0] === '2' && d >= '4') {
                                    out = '0' + out[0];
                                    digits.unshift(d); // Put the '5' back in the queue for the minutes
                                } else {
                                    out += d;
                                }
                            }

                            // 4. Add Colon smartly (preserve it during normal backspacing)
                            if (out.length === 2) {
                                if (digits.length > 0 || e.inputType !== 'deleteContentBackward' || e.target.value.endsWith(':')) {
                                    out += ':';
                                }
                            }

                            // 5. Process Minute 1
                            if (digits.length > 0) {
                                let d = digits.shift();
                                if (d >= '6') {
                                    out += '0' + d; // e.g., typing '6' becomes '06'
                                } else {
                                    out += d;
                                }
                            }

                            // 6. Process Minute 2
                            if (digits.length > 0 && out.length === 4) {
                                let d = digits.shift();
                                out += d;
                            }

                            // Apply the beautifully formatted string back to the input
                            e.target.value = out;

                            // Save to settings only if it's a complete, valid time
                            if (out.length === 5 && out.match(/^\d{2}:\d{2}$/)) {
                                handler.updateSettings({ customStartTime: out });
                            } else if (out === '') {
                                handler.updateSettings({ customStartTime: null }); // Clear it out if empty
                            }
                        });

                        btnNow.addEventListener('click', () => {
                            const now = new Date();
                            const hh = String(now.getHours()).padStart(2, '0');
                            const mm = String(now.getMinutes()).padStart(2, '0');
                            const timeStr = `${hh}:${mm}`;
                            timeInput.value = timeStr;
                            handler.updateSettings({ customStartTime: timeStr });
                        });

                        btnReset.addEventListener('click', () => {
                            timeInput.value = '';
                            handler.updateSettings({ customStartTime: null });
                        });
                    }
                }

                const advBtn = container.querySelector('#sh-adv-btn');
                const advContainer = container.querySelector('#sh-adv-container');
                advBtn.addEventListener('click', () => {
                    if (advContainer.style.display === 'none') {
                        advContainer.style.display = 'block';
                    } else {
                        advContainer.style.display = 'none';
                    }
                });
            }
        },
        {
            id: 'auto-questionnaire',
            name: 'Бінди',
            file: 'auto_questionnaire.js',
            description: 'Автоматично проклікує при натисненні<br>F1 - думка, без пошкоджень, полібаг',
            getHandler: () => window.__autoQuestionnaire,
            experimental: true
        },
        {
            id: 'dev-inspector',
            name: 'Dev Inspector',
            file: 'dev_inspector.js',
            description: 'Клікніть на будь-який елемент, щоб побачити його HTML (Тільки для розробки).',
            getHandler: () => window.__devInspector,
            experimental: true 
        }
    ];

    async function handleToggle(scriptObj, checkbox, settingsContainer) {
        const isChecked = checkbox.checked;
        let handler = scriptObj.getHandler();
        
        if (isChecked && !handler) {
            checkbox.disabled = true;
            const fullUrl = `${REPO_BASE_URL}/${scriptObj.file}?cb=${Date.now()}`;
            try {
                const response = await fetch(fullUrl);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const jsCode = await response.text();
                
                const scriptEl = document.createElement('script');
                scriptEl.textContent = jsCode;
                document.head.appendChild(scriptEl);
                
                handler = scriptObj.getHandler();
                checkbox.disabled = false;
            } catch (err) {
                alert(`⚠️ Failed to load ${scriptObj.name}:\n${err.message}`);
                checkbox.checked = false;
                checkbox.disabled = false;
                return;
            }
        }
        
        if (handler) {
            if (isChecked) {
                handler.enable();
                if (scriptObj.renderSettings && settingsContainer) {
                    settingsContainer.style.display = 'block';
                    scriptObj.renderSettings(settingsContainer);
                }
            } else {
                handler.disable();
                if (settingsContainer) {
                    settingsContainer.style.display = 'none';
                    settingsContainer.innerHTML = '';
                }
            }
        }
    }

    function injectUI() {
        const hub = document.createElement('div');
        hub.id = 'sh-root';
        hub.innerHTML = `
            <style>
                #sh-root { font-family: 'Roboto', -apple-system, sans-serif; z-index: 999999; }
                #sh-panel { position: fixed; top: 0; right: -340px; width: 320px; height: 100vh; z-index: 999998; background: #fafafa; box-shadow: -4px 0 24px rgba(0,0,0,0.12); transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1); display: flex; flex-direction: column; }
                #sh-panel.sh-open { right: 0; }
                .sh-header { background: #ffffff; padding: 14px 16px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e0e0e0; }
                .sh-header-group { display: flex; gap: 8px; align-items: center; }
                .sh-dep-dropdown, .sh-url-btn { background: #f1f3f4; border: 1px solid transparent; border-radius: 6px; padding: 4px 8px; font-size: 12px; color: #444746; font-weight: 600; cursor: pointer; outline: none; transition: background 0.2s, border 0.2s, color 0.2s; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; height: 24px; box-sizing: border-box; }
                .sh-dep-dropdown:hover, .sh-url-btn:hover { background: #e8eaed; color: #202124; text-decoration: none; }
                .sh-dep-dropdown:focus, .sh-url-btn:focus { border-color: #1a73e8; background: #ffffff; }
                .sh-close { background: none; border: none; color: #5f6368; font-size: 20px; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 50%; padding: 0; line-height: 1; }
                .sh-close:hover { background: rgba(0,0,0,0.05); color: #202124; }
                .sh-body { padding: 16px; overflow-y: auto; flex: 1; }
                .sh-card { background: #ffffff; border: 1px solid #dadce0; border-radius: 10px; padding: 14px; margin-bottom: 12px; box-shadow: 0 1px 2px rgba(0,0,0,0.03); }
                .sh-card-top { display: flex; justify-content: space-between; align-items: flex-start; }
                .sh-card-info { flex: 1; padding-right: 12px; }
                .sh-card-title { font-weight: 500; font-size: 14px; color: #202124; margin-bottom: 4px; }
                .sh-card-desc { font-size: 12px; color: #5f6368; line-height: 1.3; }
                .sh-card-settings { display: none; margin-top: 10px; }
                .sh-settings-divider { height: 1px; background: #f1f3f4; margin: 10px 0; }
                .sh-setting-row { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
                .sh-emoji { font-size: 16px; line-height: 1; opacity: 0.8; }
                .sh-adv-text { font-size: 11px; color: #9aa0a6; cursor: pointer; user-select: none; transition: color 0.2s; }
                .sh-adv-text:hover { color: #5f6368; }
                .sh-opt-group { display: flex; gap: 4px; flex: 1; }
                .sh-opt-btn { background: #ffffff; border: 1px solid #dadce0; border-radius: 6px; color: #5f6368; font-size: 12px; font-weight: 600; padding: 4px 0; flex: 1; text-align: center; cursor: pointer; transition: all 0.2s; }
                .sh-opt-btn:hover:not(.active) { background: #f1f3f4; }
                .sh-opt-btn.active { background: #1a73e8; border-color: #1a73e8; color: #ffffff; }
                
                /* NEW: Specific class for the time buttons so they don't break the active state */
                .sh-time-btn { background: #ffffff; border: 1px solid #dadce0; border-radius: 6px; color: #5f6368; font-size: 11px; font-weight: 600; padding: 4px 8px; cursor: pointer; transition: all 0.2s; }
                .sh-time-btn:hover { background: #f1f3f4; color: #202124; }

                .sh-input { padding: 6px 10px; font-size: 13px; border: 1px solid #dadce0; border-radius: 6px; box-sizing: border-box; outline: none; transition: border 0.2s; }
                .sh-input:focus { border-color: #1a73e8; }
                .sh-input-small { width: 35%; flex: 0 0 35%; }
                .sh-range { flex: 1; accent-color: #1a73e8; cursor: pointer; }
                .sh-switch { position: relative; width: 34px; height: 20px; flex-shrink: 0; margin-top: 2px;}
                .sh-switch input { opacity: 0; width: 0; height: 0; }
                .sh-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #dadce0; transition: .3s; border-radius: 20px; }
                .sh-slider:before { position: absolute; content: ""; height: 14px; width: 14px; left: 3px; bottom: 3px; background-color: white; transition: .3s; border-radius: 50%; box-shadow: 0 1px 2px rgba(0,0,0,0.2); }
                input:checked + .sh-slider { background-color: #1a73e8; }
                input:checked + .sh-slider:before { transform: translateX(14px); }
            </style>
            
            <div id="sh-panel">
                <div class="sh-header">
                    <div class="sh-header-group">
                        <select id="sh-subdep-select" class="sh-dep-dropdown">
                            ${DEPARTAMENT_OPTIONS.map(dep => `<option value="${dep}" ${currentDep === dep ? 'selected' : ''}>${dep}</option>`).join('\n                            ')}
                        </select>
                        <label class="sh-switch" title="Toggle all scripts" style="margin: 0;">
                            <input type="checkbox" id="sh-chk-all">
                            <span class="sh-slider"></span>
                        </label>
                        <a href="https://eu-cretfc-tools-dub.dub.proxy.amazon.com/gravis" target="_blank" rel="noopener noreferrer" class="sh-url-btn">GRAVIS</a>
                        <a href="https://w.amazon.com/bin/view/Wikipedia_LCJ4/" target="_blank" rel="noopener noreferrer" class="sh-url-btn">WIKI</a>
                    </div>
                    <button class="sh-close" id="sh-close-btn" title="Close">✖</button>
                </div>
                <div class="sh-body" id="sh-list"></div>
            </div>
        `;
        document.body.appendChild(hub);
        
        const panel = document.getElementById('sh-panel');
        
        function closePanel() {
            panel.classList.remove('sh-open');
            const advContainer = document.getElementById('sh-adv-container');
            if (advContainer) advContainer.style.display = 'none';
        }
        
        document.getElementById('sh-close-btn').onclick = closePanel;
        document.addEventListener('mousedown', (e) => { if (panel.classList.contains('sh-open') && !panel.contains(e.target)) closePanel(); });
        
        const subDepSelect = document.getElementById('sh-subdep-select');
        subDepSelect.addEventListener('change', (e) => {
            currentDep = e.target.value;
            localStorage.setItem('sh_hub_dep', currentDep);
            if (window.__itemCounter) {
                const newConfig = DEPARTMENT_CONFIG[currentDep];
                if (newConfig) {
                    window.__itemCounter.updateSettings({ targetRate: newConfig.targetRate });
                    const targetInput = document.getElementById('sh-cfg-target');
                    if (targetInput) targetInput.value = newConfig.targetRate;
                }
            }
        });

        const visibleScripts = SCRIPTS.filter(script => !script.experimental || currentBranch === 'development');
        
        const updateMasterToggleState = () => {
            const chkAll = document.getElementById('sh-chk-all');
            if (!chkAll) return;
            const standardScripts = visibleScripts.filter(s => !s.experimental);
            const checkBoxes = standardScripts.map(s => document.getElementById(`sh-chk-${s.id}`));
            chkAll.checked = checkBoxes.length > 0 && checkBoxes.every(chk => chk && chk.checked);
        };
        
        visibleScripts.forEach(script => {
            const handler = script.getHandler();
            const isCurrentlyActive = handler ? handler.isActive() : false;
            
            const card = document.createElement('div');
            card.className = 'sh-card';
            card.innerHTML = `
                <div class="sh-card-top">
                    <div class="sh-card-info">
                        <div class="sh-card-title">${script.name}</div>
                        <div class="sh-card-desc">${script.description}</div>
                    </div>
                    <label class="sh-switch">
                        <input type="checkbox" id="sh-chk-${script.id}" ${isCurrentlyActive ? 'checked' : ''}>
                        <span class="sh-slider"></span>
                    </label>
                </div>
                <div class="sh-card-settings" id="sh-settings-${script.id}"></div>
            `;
            
            document.getElementById('sh-list').appendChild(card);
            
            const chk = card.querySelector(`#sh-chk-${script.id}`);
            const settingsContainer = card.querySelector(`#sh-settings-${script.id}`);
            
            if (isCurrentlyActive && script.renderSettings) {
                settingsContainer.style.display = 'block';
                script.renderSettings(settingsContainer);
            }
            
            chk.onchange = async () => {
                await handleToggle(script, chk, settingsContainer);
                updateMasterToggleState();
            };
        });
        
        const chkAll = document.getElementById('sh-chk-all');
        if (chkAll) {
            chkAll.addEventListener('change', async (e) => {
                const turnOn = e.target.checked;
                const togglePromises = [];
                visibleScripts.forEach(script => {
                    if (script.experimental) return; 
                    const chk = document.getElementById(`sh-chk-${script.id}`);
                    const settingsContainer = document.getElementById(`sh-settings-${script.id}`);
                    if (chk && chk.checked !== turnOn && !chk.disabled) {
                        chk.checked = turnOn;
                        togglePromises.push(handleToggle(script, chk, settingsContainer));
                    }
                });
                await Promise.all(togglePromises);
                updateMasterToggleState(); 
            });
        }
        
        updateMasterToggleState();
        setTimeout(() => { if (panel) panel.classList.add('sh-open'); }, 100);
    }
    
    injectUI();
})();
