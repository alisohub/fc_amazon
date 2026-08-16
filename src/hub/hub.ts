import { HUB_STYLES } from './styles';

if (window.__scriptHubLoaded) {
    const panel = document.getElementById('sh-panel');
    if (panel) {
        if (panel.classList.contains('sh-open')) {
            panel.classList.remove('sh-open');
            document.querySelectorAll('.sh-adv-container').forEach(el => el.classList.remove('sh-expanded'));
        } else {
            panel.classList.add('sh-open');
        }
    }
} 
else {
    window.__scriptHubLoaded = true;

    type Branch = "main" | "development" | "ts-all-the-way";
    type Department = "CRET" | "FAST" | "UG" | "REFURB";

    const currentBranch: Branch = (window.__SH_BRANCH as Branch) || 'main';
    const REPO_BASE_URL: string = `https://raw.githubusercontent.com/alisohub/fc_amazon/refs/heads/${currentBranch}/dist`;
    
    const DEPARTMENT_CONFIG: Record<Department, { targetRate: number }> = {
        "CRET": { targetRate: 47 },
        "FAST": { targetRate: 100 },
        "UG":   { targetRate: 47 },
        "REFURB": { targetRate: 30 }
    };

    const urlParams = new URLSearchParams(window.location.search);
    const gradingMode = urlParams.get('gradingMode');
    
    let DEPARTAMENT_OPTIONS: Department[] = [];
    if (gradingMode === 'CRETURN_PRIMARY_GRADING') {
        DEPARTAMENT_OPTIONS = ["UG"];
    } else if (gradingMode === 'CRETURN') {
        DEPARTAMENT_OPTIONS = ["CRET", "FAST"];
    } else if (gradingMode === 'CRETURN_REFURB') {
        DEPARTAMENT_OPTIONS = ["REFURB"];
    } else {
        DEPARTAMENT_OPTIONS = ["CRET", "FAST", "UG", "REFURB"]; 
    }
    
    function isDepartment(value: string | null): value is Department {
        return value === "CRET" || value === "FAST" || value === "UG" || value === "REFURB";
    }

    const storedDep = localStorage.getItem('sh_hub_dep');
    let currentDep: Department = (isDepartment(storedDep) && DEPARTAMENT_OPTIONS.includes(storedDep))
        ? storedDep 
        : DEPARTAMENT_OPTIONS[0];

    if (storedDep !== currentDep) {
        try { localStorage.setItem('sh_hub_dep', currentDep); } catch (e) {}
    }

    interface ScriptDefinition {
        id: string;
        name: string;
        file: string;
        description: string;
        getHandler: () => ScriptHandler | undefined | any;
        renderSettings?: (container: HTMLElement) => void;
        experimental?: boolean;
        excludeDeps?: Department[]; 
    }
    
    const SCRIPTS: ScriptDefinition[] = [
        {
            id: 'auto-lpn',
            name: 'Авто-LPN',
            file: 'auto_lpn.js',
            description: 'Автоматично відкриває "перепризначити LPN" при скануванні LPN або будь-чого іншого, окрім тота',
            excludeDeps: ['REFURB'],
            getHandler: () => window.__autoLpn
        },
        {
            id: 'item-counter',
            name: 'Рахувальник',
            file: 'counter.js',
            description: 'Рахує пачки, можете сховати з екрану за допомогою F10. Виставте перерву.',
            getHandler: () => window.__itemCounter,
            renderSettings: (container: HTMLElement) => {
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
                            <div class="sh-opt-btn ${settings.lunchBreak === 1 ? 'active' : ''}" data-val="1">1</div>
                            <div class="sh-opt-btn ${settings.lunchBreak === 2 ? 'active' : ''}" data-val="2">2</div>
                            <div class="sh-opt-btn ${settings.lunchBreak === 3 ? 'active' : ''}" data-val="3">3</div>
                            <div class="sh-opt-btn ${settings.lunchBreak === 4 ? 'active' : ''}" data-val="4">4</div>
                        </div>
                        <span class="sh-emoji">✏️</span>
                        <input type="number" id="sh-cfg-count" class="sh-input sh-input-small" min="0" value="${currentCount === 0 ? '' : currentCount}" placeholder="666" />
                    </div>
                    <div class="sh-setting-row" title="Overlay Opacity">
                        <span class="sh-emoji">👻</span>
                        <input type="range" id="sh-cfg-opacity" class="sh-range" min="0" max="1" step="0.05" value="${settings.overlayOpacity}" />
                    </div>
                    
                    <div id="sh-adv-container-item-counter" class="sh-adv-container">
                        <div class="sh-setting-row" title="Target Rate">
                            <span class="sh-emoji">🎯</span>
                            <input type="number" id="sh-cfg-target" class="sh-input sh-flex-1" min="0" value="${targetRate}" placeholder="Необхідна норма" />
                        </div>
                        
                        <div class="sh-setting-row sh-mt-8 sh-space-between" title="Власний час початку зміни">
                            <div class="sh-flex-center-gap">
                                <span class="sh-emoji">⏱️</span>
                                <input type="text" id="sh-cfg-start-time" class="sh-input sh-time-input-small" value="${settings.customStartTime || ''}" placeholder="14:30" maxlength="5" />
                            </div>
                            <div class="sh-flex-gap">
                                <button id="sh-btn-start-now" class="sh-time-btn">Зараз</button>
                                <button id="sh-btn-start-reset" class="sh-time-btn">Скинути</button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="sh-adv-toggle-wrap">
                        <span id="sh-adv-btn-item-counter" class="sh-adv-text">Розширені</span>
                    </div>
                `;
                
                container.querySelectorAll('.sh-opt-btn').forEach(btn => {
                    btn.addEventListener('click', (e: Event) => {
                        const target = e.target as HTMLElement;
                        container.querySelectorAll('.sh-opt-btn').forEach(b => b.classList.remove('active'));
                        target.classList.add('active');
                        const val = parseInt(target.getAttribute('data-val') || '1', 10);
                        handler.updateSettings({ lunchBreak: val });
                    });
                });
                
                const countInput = container.querySelector('#sh-cfg-count') as HTMLInputElement;
                if (countInput) {
                    countInput.addEventListener('input', (e: Event) => {
                        const target = e.target as HTMLInputElement;
                        let val = parseInt(target.value, 10);
                        if (isNaN(val)) val = 0;
                        if (val < 0) {
                            val = 0;
                            target.value = '0';
                        }
                        handler.setCount(val);
                    });
                }
                
                const opacityInput = container.querySelector('#sh-cfg-opacity') as HTMLInputElement;
                if (opacityInput) {
                    opacityInput.addEventListener('input', (e: Event) => {
                        const target = e.target as HTMLInputElement;
                        const val = parseFloat(target.value);
                        handler.updateSettings({ overlayOpacity: val });
                    });
                }

                const targetInput = container.querySelector('#sh-cfg-target') as HTMLInputElement;
                if (targetInput) {
                    targetInput.addEventListener('input', (e: Event) => {
                        const target = e.target as HTMLInputElement;
                        let val = parseFloat(target.value);
                        if (isNaN(val) || val < 0) val = 0;
                        handler.updateSettings({ targetRate: val });
                    });
                }

                const timeInput = container.querySelector('#sh-cfg-start-time') as HTMLInputElement;
                const btnNow = container.querySelector('#sh-btn-start-now') as HTMLButtonElement;
                const btnReset = container.querySelector('#sh-btn-start-reset') as HTMLButtonElement;

                if (timeInput && btnNow && btnReset) {
                    timeInput.addEventListener('input', (e: Event) => {
                        const target = e.target as HTMLInputElement;
                        const inputEvent = e as InputEvent;
                        let digits = target.value.replace(/\D/g, '').split('');
                        let out = '';

                        if (digits.length > 0) {
                            let d = digits.shift()!;
                            if (d >= '3') out += '0' + d; 
                            else out += d;
                        }

                        if (digits.length > 0 && out.length === 1) {
                            let d = digits.shift()!;
                            if (out[0] === '2' && d >= '4') {
                                out = '0' + out[0];
                                digits.unshift(d);
                            } else {
                                out += d;
                            }
                        }

                        if (out.length === 2) {
                            if (digits.length > 0 || inputEvent.inputType !== 'deleteContentBackward' || target.value.endsWith(':')) {
                                out += ':';
                            }
                        }

                        if (digits.length > 0) {
                            let d = digits.shift()!;
                            if (d >= '6') out += '0' + d; 
                            else out += d;
                        }

                        if (digits.length > 0 && out.length === 4) {
                            let d = digits.shift()!;
                            out += d;
                        }

                        target.value = out;

                        if (out.length === 5 && out.match(/^\d{2}:\d{2}$/)) {
                            handler.updateSettings({ customStartTime: out });
                        } else if (out === '') {
                            handler.updateSettings({ customStartTime: null }); 
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

                const advBtn = container.querySelector('#sh-adv-btn-item-counter') as HTMLElement;
                const advContainer = container.querySelector('#sh-adv-container-item-counter') as HTMLElement;
                if (advBtn && advContainer) {
                    advBtn.addEventListener('click', () => {
                        advContainer.classList.toggle('sh-expanded');
                    });
                }
            }
        },
        {
            id: 'auto-questionnaire',
            name: 'Бінди',
            file: 'auto_questionnaire.js',
            description: 'Автоматично проклікує при натисненні.<br>Детальніше, щоб побачити всі команди',
            excludeDeps: ['REFURB'],
            getHandler: () => window.__autoQuestionnaire,
            renderSettings: (container: HTMLElement) => {
                const handler = window.__autoQuestionnaire;
                if (!handler) return;
                
                const shortcutsData = handler.getShortcuts ? handler.getShortcuts() : {};
                const keys = Object.keys(shortcutsData);
                
                let listItems = '';
                if (keys.length > 0) {
                    listItems = keys.map(key => {
                        const sequenceLabels = shortcutsData[key].sequence ? shortcutsData[key].sequence.map(arr => arr[0]) : [];
                        return `
                            <div class="sh-bind-row">
                                <div class="sh-bind-key">${key}</div>
                                <div class="sh-bind-action">${sequenceLabels.join(' <span class="sh-arrow">➔</span> ')}</div>
                            </div>
                        `;
                    }).join('');
                } else {
                    listItems = `<div style="text-align:center; padding: 10px; font-size: 11px; color:#9aa0a6;">Наразі немає жодного бінда.</div>`;
                }
                
                container.innerHTML = `
                    <div id="sh-adv-container-auto-questionnaire" class="sh-adv-container">
                        <div class="sh-bind-list">
                            ${listItems}
                        </div>
                    </div>
                    
                    <div class="sh-adv-toggle-wrap">
                        <span id="sh-adv-btn-auto-questionnaire" class="sh-adv-text">Детальніше</span>
                    </div>
                `;

                const advBtn = container.querySelector('#sh-adv-btn-auto-questionnaire') as HTMLElement;
                const advContainer = container.querySelector('#sh-adv-container-auto-questionnaire') as HTMLElement;
                if (advBtn && advContainer) {
                    advBtn.addEventListener('click', () => {
                        advContainer.classList.toggle('sh-expanded');
                    });
                }
            }
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

    function injectUI(): void {
        const hub = document.createElement('div');
        hub.id = 'sh-root';
        hub.innerHTML = `
            <style>
                ${HUB_STYLES}
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
        
        const panelEl = document.getElementById('sh-panel') as HTMLElement;
        
        function closePanel(): void {
            panelEl.classList.remove('sh-open');
            document.querySelectorAll('.sh-adv-container').forEach(el => el.classList.remove('sh-expanded'));
        }
        
        const closeBtn = document.getElementById('sh-close-btn');
        if (closeBtn) closeBtn.onclick = closePanel;

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
                    localStorage.setItem('sh_hub_dep', currentDep);
                    
                    if (window.__itemCounter) {
                        const newConfig = DEPARTMENT_CONFIG[currentDep];
                        if (newConfig) {
                            window.__itemCounter.updateSettings({ targetRate: newConfig.targetRate });
                            const targetInput = document.getElementById('sh-cfg-target') as HTMLInputElement;
                            if (targetInput) targetInput.value = newConfig.targetRate.toString();
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

        const visibleScripts = SCRIPTS.filter(script => !script.experimental || currentBranch === 'development' || currentBranch === 'ts-all-the-way');
        
        const updateMasterToggleState = (): void => {
            const chkAll = document.getElementById('sh-chk-all') as HTMLInputElement;
            if (!chkAll) return;
            const standardScripts = visibleScripts.filter(s => !s.experimental);
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
            chkAll.addEventListener('change', async (e: Event) => {
                const target = e.target as HTMLInputElement;
                const turnOn = target.checked;
                const togglePromises: Promise<void>[] = [];
                
                visibleScripts.forEach(script => {
                    if (script.experimental) return; 
                    const chk = document.getElementById(`sh-chk-${script.id}`) as HTMLInputElement;
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
        setTimeout(() => { panelEl.classList.add('sh-open'); }, 100);
    }
    
    injectUI();
}
