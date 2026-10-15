import { STORAGE_KEY_DEP, STORAGE_KEY_LPN, STORAGE_KEY_COUNTER, STORAGE_KEY_STATION, STORAGE_KEY_TASK, PKG_INPT_TSTID, WD_ITM_SCN_INPT_TSTID, LPN_INPT_TSTID, WS_INPT_TSTID, DEPARTMENT_CONFIG } from '@shared/constants';
import { HUB_STYLES } from './styles';
import { getScriptsConfig } from './scripts';

if (window.location.href.includes('gravis')) {
    (async () => {
        const currentBranch = window.__SH_BRANCH || 'main';
        const url = currentBranch === 'local' 
            ? 'http://localhost:3000/dist/hub_gravis.js'
            : `https://raw.githubusercontent.com/alisohub/fc_amazon/refs/heads/${currentBranch}/dist/hub_gravis.js`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const code = await response.text();
            
            const script = document.createElement('script');
            script.textContent = code;
            document.head.appendChild(script);
        } catch (err) {
            alert(`⚠️ Failed to load Gravis Hub: ${err}`);
        }
    })();

} else {
    if (window.__scriptHubLoaded) {
        const panel = document.getElementById('sh-panel');
        if (panel) {
            if (panel.classList.contains('sh-open')) {
                panel.classList.remove('sh-open');
                document.querySelectorAll('.sh-adv-container').forEach(el => el.classList.remove('sh-expanded'));
                window.dispatchEvent(new CustomEvent('sh-panel-closed'));
            } else {
                panel.classList.add('sh-open');
            }
        }
    } 
    else {
        window.__scriptHubLoaded = true;

        async function hashString(str: string): Promise<string> {
            const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
            return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
        }

        async function getHashedUsername(): Promise<string | null> {
            return new Promise((resolve) => {
                const start = Date.now();
                
                const check = async () => {
                    const el = document.querySelector('p.user__username');
                    
                    if (el && el.textContent) {
                        resolve(await hashString(el.textContent.trim()));
                    } else if (Date.now() - start > 10000) {
                        resolve(null);
                    } else {
                        setTimeout(check, 500);
                    }
                };
                
                check();
            });
        }

        const ALLOWED_HASHES = [
            "24deb6961c3cef1d2e3795aaf4b7e3fe8d83d20adff06215426c05827c8351ca",
            "710a0c6095723bc0a46d78897497b5af0417cee56708fdc10cca6860b686ea6e",
            "bc95a4675c77e3ee07d42d825c05e403c3861d29b24ddd57c6e30ebb7a8c2336",
            "49480808159cde937909eaad603911749197829c0cea7a8b68c29e63c98538c0",
            "61678f96fc810a611097d9b0bc98bc8ecb0abee7cd55f2faa19b455604dc2332",
            "2f5ae5e87d1a659e1a01e2bc2c38441bba81bb12eb39d59695b4960576012c55",
            "004381f7f5b3ace58d7dc03a047674325acd266ddc576c273942fdb7237f7130",
            "f355a6794c9a044989a7d2e5bc1e3aa5bff909a38adfbdc68cc0433042ea84b9"
        ];

        (async () => {
            type Branch = "main" | "development" | "local";
            
            const currentBranch: Branch = (window.__SH_BRANCH as Branch) || 'main';
            let isTrustedEnv = false;

            if (currentBranch === 'local') {
                isTrustedEnv = true;
            } else {
                const userHash = await getHashedUsername();

                if (!userHash) {
                    return;
                }

                isTrustedEnv = ALLOWED_HASHES.includes(userHash);
                
                if (currentBranch === 'development' && !isTrustedEnv) return;
            }

            const REPO_BASE_URL: string = currentBranch === 'local'
                ? 'http://localhost:3000/dist'
                : `https://raw.githubusercontent.com/alisohub/fc_amazon/refs/heads/${currentBranch}/dist`;
        

            const urlParams = new URLSearchParams(window.location.search);
            const gradingMode = urlParams.get('gradingMode');
            
            let DEPARTAMENT_OPTIONS: Department[] = [];
            if (gradingMode === 'CRETURN_PRIMARY_GRADING') {
                DEPARTAMENT_OPTIONS = ["UG"];
            } else if (gradingMode === 'CRETURN') {
                DEPARTAMENT_OPTIONS = ["FAST", "CRET"];
            } else if (gradingMode === 'CRETURN_REFURB') {
                DEPARTAMENT_OPTIONS = ["REFURB"];
            } else if (gradingMode === 'WAREHOUSE_DEALS') {
                DEPARTAMENT_OPTIONS = ["WHD"];
            } else {
                DEPARTAMENT_OPTIONS = ["FAST", "CRET", "UG", "REFURB", "WHD"]; 
            }
            
            function isDepartment(value: string | null): value is Department {
                return value === "FAST" || value === "CRET" || value === "UG" || value === "REFURB" || value === "WHD";
            }

            const storedDep = localStorage.getItem(STORAGE_KEY_DEP);
            let currentDep: Department = (isDepartment(storedDep) && DEPARTAMENT_OPTIONS.includes(storedDep))
                ? storedDep 
                : DEPARTAMENT_OPTIONS[0];

            if (storedDep !== currentDep) {
                try { localStorage.setItem(STORAGE_KEY_DEP, currentDep); } catch (e) {}
            }

            const SCRIPTS = getScriptsConfig(() => currentDep);

            async function handleToggle(scriptObj: ScriptDefinition, checkbox: HTMLInputElement, settingsContainer: HTMLElement | null): Promise<void> {
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
                    } catch (err: any) {
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

            ['keydown', 'keyup', 'keypress'].forEach(eventType => {
                window.addEventListener(eventType, (e: Event) => {
                    const target = e.target as HTMLElement | null;
                    if (target && target.closest('#sh-root')) {
                        e.stopPropagation();
                    }
                }, true);
            });

            function injectUI(): void {
                const STORAGE_KEY_PANEL_OPACITY = 'sh_panel_opacity';
                let panelOpacity = 0.4;
                try {
                    const savedOpacity = localStorage.getItem(STORAGE_KEY_PANEL_OPACITY);
                    if (savedOpacity !== null) {
                        const parsed = parseFloat(savedOpacity);
                        if (!isNaN(parsed) && parsed >= 0.1 && parsed <= 1) panelOpacity = parsed;
                    }
                } catch (e) {}

                const hub = document.createElement('div');
                hub.id = 'sh-root';
                hub.innerHTML = `
                    <style>
                        ${HUB_STYLES}
                    </style>
                    
                    <div id="sh-panel" style="opacity: ${panelOpacity};">
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
                            <button class="sh-settings-btn" id="sh-settings-toggle-btn" title="Налаштування">⚙️</button>
                        </div>
                        <div class="sh-global-settings" id="sh-global-settings">
                            <div class="sh-global-settings-title">Налаштування панелі</div>
                            <div class="sh-setting-row" title="Прозорість панелі">
                                <span class="sh-emoji">👁️</span>
                                <input type="range" id="sh-panel-opacity" class="sh-range" min="0.1" max="1" step="0.05" value="${panelOpacity}" />
                            </div>
                        </div>
                        <div class="sh-body" id="sh-list"></div>
                    </div>
                `;
                document.body.appendChild(hub);

                const panelEl = document.getElementById('sh-panel') as HTMLElement;
                const settingsToggleBtn = document.getElementById('sh-settings-toggle-btn');
                const globalSettings = document.getElementById('sh-global-settings');
                const panelOpacityInput = document.getElementById('sh-panel-opacity') as HTMLInputElement;

                // Settings Menu Toggle
                if (settingsToggleBtn && globalSettings) {
                    settingsToggleBtn.addEventListener('click', () => {
                        settingsToggleBtn.classList.toggle('active');
                        globalSettings.classList.toggle('sh-expanded');
                    });
                }

                // Panel Opacity Slider
                if (panelOpacityInput) {
                    panelOpacityInput.addEventListener('input', (e: Event) => {
                        const target = e.target as HTMLInputElement;
                        const val = parseFloat(target.value);
                        panelEl.style.opacity = val.toString();
                        try {
                            localStorage.setItem(STORAGE_KEY_PANEL_OPACITY, val.toString());
                        } catch (err) {}
                    });
                }

                function closePanel(): void {
                    panelEl.classList.remove('sh-open');
                    document.querySelectorAll('.sh-adv-container').forEach(el => el.classList.remove('sh-expanded'));
                    if (globalSettings) globalSettings.classList.remove('sh-expanded');
                    if (settingsToggleBtn) settingsToggleBtn.classList.remove('active');

                    window.dispatchEvent(new CustomEvent('sh-panel-closed'));
                }

                document.addEventListener('mousedown', (e: MouseEvent) => { 
                    const target = e.target as Node;
                    if (panelEl.classList.contains('sh-open') && !panelEl.contains(target)) closePanel(); 
                });
                
                const subDepSelect = document.getElementById('sh-subdep-select') as HTMLSelectElement;
                if (subDepSelect) {
                    subDepSelect.addEventListener('change', (e: Event) => {
                        const target = e.target as HTMLSelectElement;
                        
                        if (isDepartment(target.value)) {
                            currentDep = target.value;
                            localStorage.setItem(STORAGE_KEY_DEP, currentDep);
                            
                            const newConfig = DEPARTMENT_CONFIG[currentDep];
                            if (newConfig) {
                                
                                // 1. FORCE UPDATE COUNTER (Active or Inactive)
                                if (window.__itemCounter) {
                                    window.__itemCounter.updateSettings({ 
                                        targetRate: newConfig.targetRate,
                                        doubleCountMode: newConfig.doubleCountMode
                                    });
                                    const targetInput = document.getElementById('sh-cfg-target') as HTMLInputElement;
                                    if (targetInput) targetInput.value = newConfig.targetRate.toString();
                                } else {
                                    try {
                                        const ls = JSON.parse(localStorage.getItem(STORAGE_KEY_COUNTER) || '{}');
                                        ls.targetRate = newConfig.targetRate;
                                        ls.doubleCountMode = newConfig.doubleCountMode;
                                        localStorage.setItem(STORAGE_KEY_COUNTER, JSON.stringify(ls));
                                    } catch(err) {}
                                }

                                // 2. FORCE UPDATE OFF-TASK (Active or Inactive)
                                if (window.__offTask) {
                                    window.__offTask.updateSettings({ timeoutMins: newConfig.offTaskMins });
                                    const minsInput = document.getElementById('sh-ot-mins') as HTMLInputElement;
                                    if (minsInput) minsInput.value = newConfig.offTaskMins.toString();
                                } else {
                                    try {
                                        const ls = JSON.parse(localStorage.getItem(STORAGE_KEY_TASK) || '{}');
                                        ls.timeoutMins = newConfig.offTaskMins;
                                        localStorage.setItem(STORAGE_KEY_TASK, JSON.stringify(ls));
                                    } catch(err) {}
                                }
                            }

                            visibleScripts.forEach(script => {
                                const card = document.getElementById(`sh-card-${script.id}`);
                                if (card) {
                                    if (script.excludeDeps?.includes(currentDep)) {
                                        card.style.display = 'none';
                                        
                                        // Safely turn the script off if it is currently running
                                        const handler = script.getHandler();
                                        const chk = document.getElementById(`sh-chk-${script.id}`) as HTMLInputElement | null;
                                        if (handler && handler.isActive()) {
                                            handler.disable();
                                            if (chk) chk.checked = false;
                                        }
                                    } else {
                                        card.style.display = 'block';
                                    }
                                }
                            });
                        }
                    });
                }

                // Writes to memory each input of matched LPN and WS regex
                document.addEventListener('keydown', (e: KeyboardEvent) => {
                    // 1. Guard Clauses
                    if (e.key !== 'Enter') return;
                    if (!window.__refurbLpnLoaded && !window.__gravisLoaded && !window.__clearSession) return;
                        
                    // 2. Grab the exact element the user just pressed Enter on
                    const input = e.target as HTMLInputElement;
                    if (!input || !input.matches('input')) return;

                    const val = input.value?.trim();
                    if (!val) return;

                    // Grab the aria-label of this specific input, standardized to lowercase
                    const currentTestId = (input.getAttribute('data-testid') || '').toLowerCase();

                    // Store your labels here (make sure they are lowercase for case-insensitive matching)
                    const LABELS = {
                        lpnTestId: [
                            PKG_INPT_TSTID,
                            WD_ITM_SCN_INPT_TSTID,
                            LPN_INPT_TSTID
                        ], 
                        wsTestId: WS_INPT_TSTID
                    };


                    try {
                        // =========================================
                        // 3. LPN INPUT HANDLING
                        // =========================================
                        const isLpnInput = LABELS.lpnTestId.some(tstid => currentTestId.includes(tstid.toLowerCase())); 
                        
                        if (isLpnInput && /^lpn[a-z0-9]+/i.test(val)) {
                            if (localStorage.getItem(STORAGE_KEY_LPN) !== val) {
                                localStorage.setItem(STORAGE_KEY_LPN, val);
                                window.__gravis?.sendLpn(val);
                            }
                            return; // Stop processing once we match and save
                        }

                        // =========================================
                        // 4. WORKSPACE (WS) INPUT HANDLING
                        // =========================================
                        const isWsInput = currentTestId.includes(LABELS.wsTestId);
                        
                        if (isWsInput && /^ws[_-]+/i.test(val)) {
                            localStorage.setItem(STORAGE_KEY_STATION, val);
                            return; // Stop processing once we match and save
                        }

                    } catch (err) {
                        // Silently fail if localStorage is blocked
                    }
                }, true);

                const visibleScripts = SCRIPTS.filter(script => {
                    if (script.experimental && !['development', 'local'].includes(currentBranch)) return false;
                    if (script.isTrusted && !isTrustedEnv) return false;
                    return true;
                });
                         
                const updateMasterToggleState = (): void => {
                    const chkAll = document.getElementById('sh-chk-all') as HTMLInputElement;
                    if (!chkAll) return;
                    
                    const standardScripts = visibleScripts.filter(s => {
                        if (s.experimental) return false;
                        if (s.excludeDeps && s.excludeDeps.includes(currentDep)) return false; // MUST NOT be excluded
                        return true;
                    });

                    const checkBoxes = standardScripts.map(s => document.getElementById(`sh-chk-${s.id}`) as HTMLInputElement | null);
                    chkAll.checked = checkBoxes.length > 0 && checkBoxes.every(chk => chk && chk.checked);
                };
                
                const listContainer = document.getElementById('sh-list');
                if (listContainer) {
                    visibleScripts.forEach(script => {
                        const handler = script.getHandler();
                        const isCurrentlyActive = handler ? handler.isActive() : false;
                        
                        const card = document.createElement('div');
                        card.id = `sh-card-${script.id}`; 
                        card.className = 'sh-card';
                        
                        if (script.excludeDeps?.includes(currentDep)) {
                            card.style.display = 'none';
                        }
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
                        
                        listContainer.appendChild(card);
                        
                        const chk = card.querySelector(`#sh-chk-${script.id}`) as HTMLInputElement;
                        const settingsContainer = card.querySelector(`#sh-settings-${script.id}`) as HTMLElement;
                        
                        if (isCurrentlyActive && script.renderSettings) {
                            settingsContainer.style.display = 'block';
                            script.renderSettings(settingsContainer);
                        }
                        
                        if (chk) {
                            chk.onchange = async () => {
                                await handleToggle(script, chk, settingsContainer);
                                updateMasterToggleState();
                            };
                        }
                    });
                }
                
                const chkAll = document.getElementById('sh-chk-all') as HTMLInputElement;
                if (chkAll) {
                    chkAll.addEventListener('change', (e) => {
                        const turnOn = (e.target as HTMLInputElement).checked;
                        const togglePromises: Promise<void>[] = [];
                        
                        visibleScripts.forEach(script => {
                            if (script.experimental) return; 
                            if (script.excludeDeps && script.excludeDeps.includes(currentDep)) return; // CRITICAL: Skip if not for this department
                            
                            const chk = document.getElementById(`sh-chk-${script.id}`) as HTMLInputElement;
                            const settingsContainer = document.getElementById(`sh-settings-${script.id}`);
                            if (chk && chk.checked !== turnOn && !chk.disabled) {
                                chk.checked = turnOn;
                                togglePromises.push(handleToggle(script, chk, settingsContainer));
                            }
                        });

                        if (togglePromises.length > 0) {
                            chkAll.disabled = true;
                            Promise.all(togglePromises).finally(() => {
                                chkAll.disabled = false;
                                updateMasterToggleState();
                            });
                        }
                    });
                }
                
                updateMasterToggleState();
                setTimeout(() => { panelEl.classList.add('sh-open'); }, 100);
            }
            
            injectUI();
        })();
    }
}
