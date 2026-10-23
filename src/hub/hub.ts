import { STORAGE_KEY_DEP, STORAGE_KEY_LPN, STORAGE_KEY_COUNTER, STORAGE_KEY_STATION, PKG_INPT_TSTID, WD_ITM_SCN_INPT_TSTID, LPN_INPT_TSTID, WS_INPT_TSTID, DEPARTMENT_CONFIG } from '@shared/constants';
import { debugLog, getDebugConfig, setDebugFlag, isDevEnv, DebugScope } from '@shared/utils';
import { HUB_STYLES } from './styles';
import { getScriptsConfig } from './scripts';

// Bundle all scripts directly into hub.js
import '../scripts/auto_lpn';
import '../scripts/auto_lpn_refurb';
import '../scripts/binds';
import '../scripts/counter';
import '../scripts/off_task';
import '../scripts/gravis';
import '../scripts/clear_session';

if (window.location.href.includes('gravis')) {
    (async () => {
        const currentBranch = window.__SH_BRANCH || 'main';
        const url = currentBranch === 'local' 
            ? 'http://localhost:3000/dist/hub_gravis.js'
            : `https://raw.githubusercontent.com/alisohub/fc_amazon/refs/heads/${currentBranch}/dist/hub_gravis.js`;
        
        try {
            debugLog('gravis', 'Fetching Gravis Hub from:', url);
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
                debugLog('hub', 'Hub panel closed via re-invocation');
            } else {
                panel.classList.add('sh-open');
                debugLog('hub', 'Hub panel opened via re-invocation');
            }
        }
    } 
    else {
        window.__scriptHubLoaded = true;
        type Branch = "main" | "development" | "local";
        
        const currentBranch: Branch = (window.__SH_BRANCH as Branch) || 'main';
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

        debugLog('hub', 'Initialized Hub', { currentBranch, gradingMode, currentDep });

        const SCRIPTS = getScriptsConfig(() => currentDep);

        async function handleToggle(scriptObj: ScriptDefinition, checkbox: HTMLInputElement, settingsContainer: HTMLElement | null): Promise<void> {
            const isChecked = checkbox.checked;
            const handler = scriptObj.getHandler();

            if (!handler) {
                debugLog('hub', `Handler missing for script: ${scriptObj.id}`);
                alert(`⚠️ Не вдалося завантажити ${scriptObj.name}`);
                checkbox.checked = false;
                return;
            }

            if (isChecked) {
                debugLog('hub', `Enabling script: ${scriptObj.id}`);
                handler.enable();
                if (scriptObj.renderSettings && settingsContainer) {
                    settingsContainer.style.display = 'block';
                    scriptObj.renderSettings(settingsContainer);
                }
            } else {
                debugLog('hub', `Disabling script: ${scriptObj.id}`);
                handler.disable();
                if (settingsContainer) {
                    settingsContainer.style.display = 'none';
                    settingsContainer.innerHTML = '';
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

            const debugCfg = getDebugConfig();
            const debugScopes: { key: DebugScope; label: string }[] = [
                { key: 'hub', label: 'Hub Core' },
                { key: 'item-counter', label: 'Counter' },
                { key: 'off-task', label: 'Off-Task' },
                { key: 'binds', label: 'Binds' },
                { key: 'auto-lpn', label: 'Auto-LPN' },
                { key: 'refurb-lpn', label: 'Refurb-LPN' },
                { key: 'clear-session', label: 'Clear Session' },
                { key: 'gravis', label: 'Gravis' }
            ];

            const debugSectionHtml = isDevEnv() ? `
                <div class="sh-debug-section">
                    <div class="sh-global-settings-title">🐞 Debug Logs (Dev)</div>
                    <div class="sh-debug-grid">
                        ${debugScopes.map(s => `
                            <label class="sh-debug-item">
                                <input type="checkbox" class="sh-debug-chk" data-scope="${s.key}" ${debugCfg[s.key] ? 'checked' : ''} />
                                <span>${s.label}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>
            ` : '';

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
                        ${debugSectionHtml}
                    </div>
                    <div class="sh-body" id="sh-list"></div>
                </div>
            `;
            document.body.appendChild(hub);

            const panelEl = document.getElementById('sh-panel') as HTMLElement;
            const settingsToggleBtn = document.getElementById('sh-settings-toggle-btn');
            const globalSettings = document.getElementById('sh-global-settings');
            const panelOpacityInput = document.getElementById('sh-panel-opacity') as HTMLInputElement;

            if (settingsToggleBtn && globalSettings) {
                settingsToggleBtn.addEventListener('click', () => {
                    settingsToggleBtn.classList.toggle('active');
                    globalSettings.classList.toggle('sh-expanded');
                });
            }

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

            // Debug Checkboxes Listeners
            hub.querySelectorAll('.sh-debug-chk').forEach(chk => {
                chk.addEventListener('change', (e: Event) => {
                    const target = e.target as HTMLInputElement;
                    const scope = target.getAttribute('data-scope') as DebugScope | null;
                    if (scope) {
                        setDebugFlag(scope, target.checked);
                        console.log(`%c[SH:${scope}]`, 'color: #1a73e8; font-weight: bold;', `Debug logging ${target.checked ? 'ENABLED' : 'DISABLED'}`);
                    }
                });
            });

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
                        debugLog('hub', `Department changed to: ${currentDep}`);
                        
                        const newConfig = DEPARTMENT_CONFIG[currentDep];
                        if (newConfig) {
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
                        }

                        visibleScripts.forEach(script => {
                            const card = document.getElementById(`sh-card-${script.id}`);
                            if (card) {
                                if (script.excludeDeps?.includes(currentDep)) {
                                    card.style.display = 'none';
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

            document.addEventListener('keydown', (e: KeyboardEvent) => {
                if (e.key !== 'Enter') return;
                if (!window.__refurbLpnLoaded && !window.__gravisLoaded && !window.__clearSession) return;
                    
                const input = e.target as HTMLInputElement;
                if (!input || !input.matches('input')) return;

                const val = input.value?.trim();
                if (!val) return;

                const currentTestId = (input.getAttribute('data-testid') || '').toLowerCase();
                const LABELS = {
                    lpnTestId: [
                        PKG_INPT_TSTID,
                        WD_ITM_SCN_INPT_TSTID,
                        LPN_INPT_TSTID
                    ], 
                    wsTestId: WS_INPT_TSTID
                };

                try {
                    const isLpnInput = LABELS.lpnTestId.some(tstid => currentTestId.includes(tstid.toLowerCase()));
                    
                    if (isLpnInput && /^lpn[a-z0-9]+/i.test(val)) {
                        debugLog('hub', `LPN scan detected on [${currentTestId}]: ${val}`);
                        if (localStorage.getItem(STORAGE_KEY_LPN) !== val) {
                            localStorage.setItem(STORAGE_KEY_LPN, val);
                            debugLog('hub', `Saved new LPN to localStorage & syncing to Gravis: ${val}`);
                            window.__gravis?.sendLpn(val);
                        }
                        return;
                    }

                    const isWsInput = currentTestId.includes(LABELS.wsTestId);
                    
                    if (isWsInput && /^ws[_-]+/i.test(val)) {
                        debugLog('hub', `Workstation scan detected on [${currentTestId}]: ${val}`);
                        localStorage.setItem(STORAGE_KEY_STATION, val);
                        return;
                    }
                } catch (err) {
                    debugLog('hub', 'Error handling LPN/WS keydown:', err);
                }
            }, true);

            const visibleScripts = SCRIPTS.filter(script => {
                if (script.experimental && !['development', 'local'].includes(currentBranch)) return false;
                return true;
            });
            
            const updateMasterToggleState = (): void => {
                const chkAll = document.getElementById('sh-chk-all') as HTMLInputElement;
                if (!chkAll) return;
                
                const standardScripts = visibleScripts.filter(s => {
                    if (s.experimental) return false;
                    if (s.excludeDeps && s.excludeDeps.includes(currentDep)) return false;
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
                    debugLog('hub', `Master toggle clicked: ${turnOn}`);
                    const togglePromises: Promise<void>[] = [];
                    
                    visibleScripts.forEach(script => {
                        if (script.experimental) return; 
                        if (script.excludeDeps && script.excludeDeps.includes(currentDep)) return;
                        
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
    }
}
