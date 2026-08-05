(() => {
    // If the hub is already loaded, toggle its visibility and reset advanced settings
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
    
    // Read the branch from the bookmarklet, but default to 'main' if it doesn't exist
    const currentBranch = window.__SH_BRANCH || 'main';
    
    // Dynamically build the base URL
    const REPO_BASE_URL = `https://raw.githubusercontent.com/alisohub/fc_amazon/refs/heads/${currentBranch}/scripts`;
    
    // ==========================================
    //   MASTER DEPARTMENT CONFIG
    // ==========================================
    // This is the single source of truth. Add new departments or rules here.
    const DEPARTMENT_CONFIG = {
        "CRET": { targetRate: 47 },
        "FAST": { targetRate: 100 },
        "UG":   { targetRate: 47 },
        "REFURB": { targetRate: 30 }
    };

    // ==========================================
    //   ENVIRONMENT DETECTION (ROUTING)
    // ==========================================
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
        // Fallback just in case the hub is opened on an unknown page
        DEPARTAMENT_OPTIONS = ["CRET", "FAST", "UG", "REFURB"]; 
    }
    
    // Load saved department, but verify it belongs to the current page
    let currentDep = localStorage.getItem('sh_hub_dep');
    if (!currentDep || !DEPARTAMENT_OPTIONS.includes(currentDep)) {
        currentDep = DEPARTAMENT_OPTIONS[0]; // Reset to the first valid option for this page
        try { localStorage.setItem('sh_hub_dep', currentDep); } catch (e) {}
    }
    
    // ==========================================
    //   SCRIPT REGISTRY
    // ==========================================
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
                
                // Smart default: use saved setting, OR the config default, OR 47 as a last resort
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
                    
                    <!-- Advanced Settings Container -->
                    <div id="sh-adv-container" style="display: none; padding-top: 8px; margin-top: 8px; border-top: 1px dashed #e0e0e0;">
                        <div class="sh-setting-row" title="Target Rate">
                            <span class="sh-emoji">🎯</span>
                            <input type="number" id="sh-cfg-target" class="sh-input" min="0" value="${targetRate}" placeholder="Необхідна норма" style="flex: 1;" />
                        </div>
                    </div>
                    
                    <!-- Advanced Settings Toggle Button -->
                    <div style="display: flex; justify-content: flex-end; margin-top: 6px;">
                        <span id="sh-adv-btn" class="sh-adv-text">Розширені</span>
                    </div>
                `;
                
                // Handle Options Selection
                container.querySelectorAll('.sh-opt-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        container.querySelectorAll('.sh-opt-btn').forEach(b => b.classList.remove('active'));
                        e.target.classList.add('active');
                        const val = parseInt(e.target.getAttribute('data-val'), 10);
                        handler.updateSettings({ counterOption: val });
                    });
                });
                
                // Handle Manual Count Update
                container.querySelector('#sh-cfg-count').addEventListener('input', (e) => {
                    let val = parseInt(e.target.value, 10);
                    if (isNaN(val)) val = 0;
                    if (val < 0) {
                        val = 0;
                        e.target.value = 0;
                    }
                    handler.setCount(val);
                });
                
                // Handle Opacity Slider
                container.querySelector('#sh-cfg-opacity').addEventListener('input', (e) => {
                    const val = parseFloat(e.target.value);
                    handler.updateSettings({ overlayOpacity: val });
                });

                // Handle Target Rate Input
                container.querySelector('#sh-cfg-target').addEventListener('input', (e) => {
                    let val = parseFloat(e.target.value);
                    if (isNaN(val) || val < 0) val = 0;
                    handler.updateSettings({ targetRate: val });
                });

                // Handle Advanced Settings Toggle
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
           description: 'Натисніть F1, щоб автоматично проклікати brak всього, polybag',
           getHandler: () => window.__autoQuestionnaire
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
                
                /* Right-Side Panel */
                #sh-panel {
                    position: fixed; top: 0; right: -340px; width: 320px; height: 100vh;
                    z-index: 999998; background: #fafafa; box-shadow: -4px 0 24px rgba(0,0,0,0.12);
                    transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex; flex-direction: column;
                }
                #sh-panel.sh-open { right: 0; }
                
                /* Header */
                .sh-header {
                    background: #ffffff; padding: 14px 16px; display: flex;
                    justify-content: space-between; align-items: center;
                    border-bottom: 1px solid #e0e0e0;
                }
                .sh-header-group {
                    display: flex; gap: 8px; align-items: center;
                }
                
                /* Depchoosing Dropdown & URL Buttons */
                .sh-dep-dropdown, .sh-url-btn {
                    background: #f1f3f4; border: 1px solid transparent; border-radius: 6px;
                    padding: 4px 8px; font-size: 12px; color: #444746; font-weight: 600;
                    cursor: pointer; outline: none; transition: background 0.2s, border 0.2s, color 0.2s;
                    text-decoration: none; display: inline-flex; align-items: center; justify-content: center;
                    height: 24px; box-sizing: border-box;
                }
                .sh-dep-dropdown:hover, .sh-url-btn:hover { background: #e8eaed; color: #202124; text-decoration: none; }
                .sh-dep-dropdown:focus, .sh-url-btn:focus { border-color: #1a73e8; background: #ffffff; }
                
                .sh-close {
                    background: none; border: none; color: #5f6368; font-size: 20px;
                    cursor: pointer; display: flex; align-items: center; justify-content: center;
                    width: 28px; height: 28px; border-radius: 50%; padding: 0; line-height: 1;
                }
                .sh-close:hover { background: rgba(0,0,0,0.05); color: #202124; }
                
                /* Cards */
                .sh-body { padding: 16px; overflow-y: auto; flex: 1; }
                .sh-card {
                    background: #ffffff; border: 1px solid #dadce0; border-radius: 10px;
                    padding: 14px; margin-bottom: 12px; box-shadow: 0 1px 2px rgba(0,0,0,0.03);
                }
                .sh-card-top { display: flex; justify-content: space-between; align-items: flex-start; }
                .sh-card-info { flex: 1; padding-right: 12px; }
                .sh-card-title { font-weight: 500; font-size: 14px; color: #202124; margin-bottom: 4px; }
                .sh-card-desc { font-size: 12px; color: #5f6368; line-height: 1.3; }
                
                /* Settings UI */
                .sh-card-settings { display: none; margin-top: 10px; }
                .sh-settings-divider { height: 1px; background: #f1f3f4; margin: 10px 0; }
                .sh-setting-row { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
                .sh-emoji { font-size: 16px; line-height: 1; opacity: 0.8; }
                
                /* Advanced Button styling */
                .sh-adv-text { 
                    font-size: 11px; color: #9aa0a6; cursor: pointer; user-select: none; transition: color 0.2s; 
                }
                .sh-adv-text:hover { color: #5f6368; }

                /* Option Buttons */
                .sh-opt-group { display: flex; gap: 4px; flex: 1; }
                .sh-opt-btn {
                    background: #ffffff; border: 1px solid #dadce0; border-radius: 6px;
                    color: #5f6368; font-size: 12px; font-weight: 600; padding: 4px 0;
                    flex: 1; text-align: center; cursor: pointer; transition: all 0.2s;
                }
                .sh-opt-btn:hover:not(.active) { background: #f1f3f4; }
                .sh-opt-btn.active { background: #1a73e8; border-color: #1a73e8; color: #ffffff; }
                
                /* Inputs */
                .sh-input {
                    padding: 6px 10px; font-size: 13px; border: 1px solid #dadce0;
                    border-radius: 6px; box-sizing: border-box; outline: none; transition: border 0.2s;
                }
                .sh-input:focus { border-color: #1a73e8; }
                .sh-input-small { width: 35%; flex: 0 0 35%; }
                .sh-range { flex: 1; accent-color: #1a73e8; cursor: pointer; }
                
                /* Switch */
                .sh-switch { position: relative; width: 34px; height: 20px; flex-shrink: 0; margin-top: 2px;}
                .sh-switch input { opacity: 0; width: 0; height: 0; }
                .sh-slider {
                    position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
                    background-color: #dadce0; transition: .3s; border-radius: 20px;
                }
                .sh-slider:before {
                    position: absolute; content: ""; height: 14px; width: 14px; left: 3px; bottom: 3px;
                    background-color: white; transition: .3s; border-radius: 50%; box-shadow: 0 1px 2px rgba(0,0,0,0.2);
                }
                input:checked + .sh-slider { background-color: #1a73e8; }
                input:checked + .sh-slider:before { transform: translateX(14px); }
            </style>
            
            <div id="sh-panel">
                <div class="sh-header">
                    <div class="sh-header-group">
                        <select id="sh-subdep-select" class="sh-dep-dropdown">
                            ${DEPARTAMENT_OPTIONS.map(dep => 
                                `<option value="${dep}" ${currentDep === dep ? 'selected' : ''}>${dep}</option>`)
                                .join('\n                            ')}
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
        
        document.addEventListener('mousedown', (e) => {
            if (panel.classList.contains('sh-open') && !panel.contains(e.target)) {
                closePanel();
            }
        });
        
        // --- NEW: Handle Department Change & Broadcast Config ---
        const subDepSelect = document.getElementById('sh-subdep-select');
        subDepSelect.addEventListener('change', (e) => {
            currentDep = e.target.value;
            localStorage.setItem('sh_hub_dep', currentDep);
            
            // Push the new config rules to the Counter
            if (window.__itemCounter) {
                const newConfig = DEPARTMENT_CONFIG[currentDep];
                if (newConfig) {
                    window.__itemCounter.updateSettings({ targetRate: newConfig.targetRate });
                    
                    // Update the UI Input if it's currently rendered
                    const targetInput = document.getElementById('sh-cfg-target');
                    if (targetInput) targetInput.value = newConfig.targetRate;
                }
            }
        });
        
        const updateMasterToggleState = () => {
            const chkAll = document.getElementById('sh-chk-all');
            if (!chkAll) return;
            const checkBoxes = SCRIPTS.map(s => document.getElementById(`sh-chk-${s.id}`));
            chkAll.checked = checkBoxes.length > 0 && checkBoxes.every(chk => chk && chk.checked);
        };
        
        SCRIPTS.forEach(script => {
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
                
                SCRIPTS.forEach(script => {
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
        
        setTimeout(() => {
            if (panel) panel.classList.add('sh-open');
        }, 100);
    }
    
    injectUI();
})();