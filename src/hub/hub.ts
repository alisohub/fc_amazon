import { HUB_STYLES } from './styles';

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
            const check = async () => {
                const el = document.querySelector('p.user__username');
                if (el && el.textContent) {
                    resolve(await hashString(el.textContent.trim()));
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
        type Department = "FAST" | "CRET" | "UG" | "REFURB" | "WHD";

        interface DepartmentConfig {
            targetRate: number;
            offTaskMins: number;
            doubleCountMode: boolean;
            scanTimeoutMs: number;
        }
        
        const currentBranch: Branch = (window.__SH_BRANCH as Branch) || 'main';
        let isTrustedEnv = false;

        if (currentBranch === 'local') {
            isTrustedEnv = true;
        } else {
            const userHash = await getHashedUsername();
            isTrustedEnv = userHash ? ALLOWED_HASHES.includes(userHash) : false;
            
            if (currentBranch === 'development' && !isTrustedEnv) return;
        }

        const REPO_BASE_URL: string = currentBranch === 'local'
            ? 'http://localhost:3000/dist'
            : `https://raw.githubusercontent.com/alisohub/fc_amazon/refs/heads/${currentBranch}/dist`;
    
        const DEPARTMENT_CONFIG: Record<Department, DepartmentConfig> = {
            "CRET": { targetRate: 47, offTaskMins: 4, doubleCountMode: false, scanTimeoutMs: 6000 },
            "FAST": { targetRate: 100, offTaskMins: 10, doubleCountMode: false, scanTimeoutMs: 4000 },
            "UG":   { targetRate: 47, offTaskMins: 4, doubleCountMode: true, scanTimeoutMs: 6000 },
            "REFURB": { targetRate: 30, offTaskMins: 10, doubleCountMode: false, scanTimeoutMs: 6000 },
            "WHD": { targetRate: 20, offTaskMins: 5, doubleCountMode: false, scanTimeoutMs: 6000 }
        };

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
            isTrusted?: boolean;
            excludeDeps?: Department[]; 
        }
        
        const SCRIPTS: ScriptDefinition[] = [
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
                    const configDoubleCount = DEPARTMENT_CONFIG[currentDep] ? DEPARTMENT_CONFIG[currentDep].doubleCountMode : false;
                    const configTimeout = DEPARTMENT_CONFIG[currentDep] ? DEPARTMENT_CONFIG[currentDep].scanTimeoutMs : 6000;

                    const targetRate = settings.targetRate !== undefined ? settings.targetRate : configRate;
                                     
                    handler.updateSettings({ 
                        targetRate: targetRate, 
                        doubleCountMode: configDoubleCount,
                        scanTimeoutMs: configTimeout
                    });

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
                id: 'off-task',
                name: 'Авто-Введення (Off-Task)',
                file: 'off_task.js',
                description: 'Автоматично прибиває до тота через зазначений час.',
                getHandler: () => window.__offTask,
                renderSettings: (container: HTMLElement) => {
                    const handler = window.__offTask;
                    if (!handler) return;

                    // Pull the clean default directly from our global configuration!
                    const defaultMins = DEPARTMENT_CONFIG[currentDep].offTaskMins;

                    const settings = handler.getSettings();
                    const timeoutMins = settings.timeoutMins !== undefined ? settings.timeoutMins : defaultMins;
                    const toteBarcode = settings.toteBarcode || '';
                    
                    // Sync the default to the background script immediately so it doesn't wait 10 mins by mistake
                    if (settings.timeoutMins === undefined) {
                        handler.updateSettings({ timeoutMins: defaultMins });
                    }

                    container.innerHTML = `
                        <div class="sh-setting-row" style="align-items: center; gap: 6px; margin-bottom: 2px;">
                            <span class="sh-emoji" title="Тара">📦</span>
                            <input type="text" id="sh-ot-tote" class="sh-input sh-flex-1" style="min-width: 0;" value="${toteBarcode}" placeholder="ts... (пусто=вимк)" autocomplete="off">
                            <span class="sh-emoji" title="Хвилини">⏱️</span>
                            <input type="text" id="sh-ot-mins" class="sh-input sh-time-input-small" style="width: 50px; padding: 6px 2px;" value="${timeoutMins}" title="Таймер">
                        </div>
                    `;
                    
                    const toteInput = container.querySelector('#sh-ot-tote') as HTMLInputElement;
                    const minsInput = container.querySelector('#sh-ot-mins') as HTMLInputElement;

                    toteInput.addEventListener('input', (e) => {
                        const val = (e.target as HTMLInputElement).value.trim();
                        handler.updateSettings({ toteBarcode: val });
                        // Reset minute box to default setting visually if deactivated
                        if (!val) minsInput.value = handler.getSettings().timeoutMins?.toString() || defaultMins.toString();
                    });

                    // When user finishes typing in the timer box and clicks away or hits Enter
                    minsInput.addEventListener('change', (e) => {
                        const val = (e.target as HTMLInputElement).value.trim();
                        let newMins = defaultMins;

                        // Parse MM:SS or raw numbers
                        if (val.includes(':')) {
                            const parts = val.split(':');
                            newMins = parseInt(parts[0] || '0', 10) + (parseInt(parts[1] || '0', 10) / 60);
                        } else {
                            const parsed = parseFloat(val);
                            if (!isNaN(parsed) && parsed > 0) newMins = parsed;
                        }

                        handler.updateSettings({ timeoutMins: newMins });
                    });

                    // Prevent Enter key from doing anything weird while editing the timer
                    minsInput.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter') minsInput.blur();
                    });

                    const onUpdate = () => {
                        if (document.activeElement !== toteInput) {
                            toteInput.value = handler.getSettings().toteBarcode || '';
                        }
                        if (document.activeElement !== minsInput) {
                            minsInput.value = handler.getSettings().timeoutMins?.toString() || defaultMins.toString();
                            minsInput.style.color = ''; // Reset color
                        }
                    };

                    const onTick = (e: any) => {
                        // IF THE USER IS CLICKED INTO THE BOX, DO NOT UPDATE IT (LET THEM TYPE!)
                        if (document.activeElement === minsInput) return;
                        
                        if (!handler.getSettings().toteBarcode) return;
                        
                        const totalSec = Math.ceil(e.detail.remainingMs / 1000);
                        const m = Math.floor(totalSec / 60);
                        const s = String(totalSec % 60).padStart(2, '0');
                        
                        // Update the input box to show the live countdown!
                        minsInput.value = `${m}:${s}`;
                        
                        // Turn text red if under 30 seconds
                        minsInput.style.color = totalSec <= 30 ? '#d93025' : '#1a73e8';
                        minsInput.style.fontWeight = 'bold';
                    };

                    // MEMORY LEAK FIX: Abort old event listeners on UI re-render
                    if ((container as any)._abortController) {
                        (container as any)._abortController.abort();
                    }
                    const controller = new AbortController();
                    (container as any)._abortController = controller;

                    window.addEventListener('sh-offtask-update', onUpdate, { signal: controller.signal });
                    window.addEventListener('sh-offtask-tick', onTick, { signal: controller.signal });
                },
                isTrusted: true 
            },
            {
                id: 'binds',
                name: 'Бінди',
                file: 'binds.js',
                description: 'Автоматично проклікує при натисненні.<br>Натисніть на F-кнопку для запису(альтернативно F9 і F1-F7) або на слово, щоб видалити його.',
                getHandler: () => window.__binds,
                renderSettings: (container: HTMLElement) => {
                    const handler = window.__binds as BindsHandler;
                    if (!handler) return;
                    
                    let tempShortcuts = JSON.parse(JSON.stringify(handler.getShortcuts()));

                    if ((container as any)._abortController) {
                        (container as any)._abortController.abort();
                    }
                    const controller = new AbortController();
                    (container as any)._abortController = controller;
                    
                    // Keep the UI dynamically updated during recording!
                    window.addEventListener('sh-binds-update', () => {
                        tempShortcuts = JSON.parse(JSON.stringify(handler.getShortcuts()));
                        renderUI();
                    }, { signal: controller.signal });
                    
                    const renderUI = () => {
                        const keys = Object.keys(tempShortcuts);
                        const recordingKey = handler.getRecordingKey();
                        
                        let listItems = '';
                        if (keys.length > 0) {
                            listItems = keys.map(key => {
                                const sequenceLabels = tempShortcuts[key];
                                const isRecording = recordingKey === key;
                                
                                // Map each word to a clickable span that triggers deletion
                                const wordsHtml = sequenceLabels.map((val: string, idx: number) => {
                                    // Extract only the first two words for cleaner UI
                                    const displayVal = val.split(/\s+/).slice(0, 2).join(' ');
                                    
                                    // Keep the full value in the title so it shows on hover
                                    return `<span class="sh-bind-del-word" data-key="${key}" data-idx="${idx}" title="Видалити: ${val}">${displayVal}</span>`;
                                }).join(' <span class="sh-arrow">➔</span> ');
                                
                                const actionContent = sequenceLabels.length > 0 
                                    ? wordsHtml 
                                    : (isRecording ? '<i>Запис...</i>' : '');

                                // Add the sh-recording class dynamically
                                const keyClasses = isRecording ? 'sh-bind-key sh-recording' : 'sh-bind-key';

                                return `
                                    <div class="sh-bind-row">
                                        <div class="${keyClasses}" data-key="${key}" title="Запис / Зупинка">${key}</div>
                                        <div class="sh-bind-action">${actionContent}</div>
                                    </div>
                                `;
                            }).join('');
                        } else {
                            listItems = `<div style="text-align:center; padding: 10px; font-size: 11px; color:#9aa0a6;">Наразі немає жодного бінда.</div>`;
                        }
                        
                        container.innerHTML = `
                            <div id="sh-adv-container-binds" class="sh-adv-container ${container.querySelector('#sh-adv-container-binds')?.classList.contains('sh-expanded') ? 'sh-expanded' : ''}">
                                <div class="sh-bind-list">
                                    ${listItems}
                                </div>
                            </div>
                            <div class="sh-adv-toggle-wrap">
                                <span id="sh-adv-btn-binds" class="sh-adv-text" style="margin-left: auto;">Детальніше</span>
                            </div>
                        `;

                        // Listeners for recording on F-keys
                        container.querySelectorAll('.sh-bind-key').forEach(btn => {
                            btn.addEventListener('click', (e) => {
                                const target = e.target as HTMLElement;
                                const key = target.getAttribute('data-key');
                                if (!key) return;

                                if (handler.getRecordingKey() === key) {
                                    handler.stopRecording();
                                } else {
                                    handler.startRecording(key);
                                }
                            });
                        });

                        // Listeners for word deletion
                        container.querySelectorAll('.sh-bind-del-word').forEach(wordEl => {
                            wordEl.addEventListener('click', (e) => {
                                const target = e.target as HTMLElement;
                                const key = target.getAttribute('data-key');
                                const idxStr = target.getAttribute('data-idx');
                                
                                // Don't let users delete words while a macro is actively recording
                                if (key && idxStr !== null && !recordingKey) {
                                    const idx = parseInt(idxStr, 10);
                                    tempShortcuts[key].splice(idx, 1);
                                    handler.updateShortcuts(tempShortcuts); 
                                    renderUI();
                                }
                            });
                        });

                        const advBtn = container.querySelector('#sh-adv-btn-binds') as HTMLElement;
                        const advContainer = container.querySelector('#sh-adv-container-binds') as HTMLElement;
                        if (advBtn && advContainer) {
                            advBtn.addEventListener('click', () => {
                                advContainer.classList.toggle('sh-expanded');
                            });
                        }
                    };
                    
                    renderUI();
                }
            },  
            {
                id: 'auto-lpn',
                name: 'Авто-LPN',
                file: 'auto_lpn.js',
                description: 'Автоматично відкриває "перепризначити LPN" при скануванні LPN або будь-чого іншого, окрім тота',
                excludeDeps: ['REFURB', 'WHD'],
                getHandler: () => window.__autoLpn
            },
            {
                id: 'refurb-lpn',
                name: 'Авто-LPN',
                file: 'auto_lpn_refurb.js',
                description: 'Автоматично заповнює стару LPN',
                excludeDeps: ['CRET', 'FAST', 'UG'],
                getHandler: () => window.__refurbLpn
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
                        localStorage.setItem('sh_hub_dep', currentDep);
                        
                        const newConfig = DEPARTMENT_CONFIG[currentDep];
                        if (newConfig) {
                            
                            // 1. FORCE UPDATE COUNTER (Active or Inactive)
                            if (window.__itemCounter) {
                                window.__itemCounter.updateSettings({ 
                                    targetRate: newConfig.targetRate,
                                    doubleCountMode: newConfig.doubleCountMode,
                                    scanTimeoutMs: newConfig.scanTimeoutMs
                                });
                                const targetInput = document.getElementById('sh-cfg-target') as HTMLInputElement;
                                if (targetInput) targetInput.value = newConfig.targetRate.toString();
                            } else {
                                try {
                                    const ls = JSON.parse(localStorage.getItem('sh_item_counter_settings') || '{}');
                                    ls.targetRate = newConfig.targetRate;
                                    ls.doubleCountMode = newConfig.doubleCountMode;
                                    ls.scanTimeoutMs = newConfig.scanTimeoutMs;
                                    localStorage.setItem('sh_item_counter_settings', JSON.stringify(ls));
                                } catch(err) {}
                            }

                            // 2. FORCE UPDATE OFF-TASK (Active or Inactive)
                            if (window.__offTask) {
                                window.__offTask.updateSettings({ timeoutMins: newConfig.offTaskMins });
                                const minsInput = document.getElementById('sh-ot-mins') as HTMLInputElement;
                                if (minsInput) minsInput.value = newConfig.offTaskMins.toString();
                            } else {
                                try {
                                    const ls = JSON.parse(localStorage.getItem('sh_off_task_settings') || '{}');
                                    ls.timeoutMins = newConfig.offTaskMins;
                                    localStorage.setItem('sh_off_task_settings', JSON.stringify(ls));
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

            const visibleScripts = SCRIPTS.filter(script => {
                if (script.experimental && !['development', 'local'].includes(currentBranch)) return false;
                if (script.isTrusted && !isTrustedEnv) return false;
                return true;
            });
                     
            const updateMasterToggleState = (): void => {
                const chkAll = document.getElementById('sh-chk-all') as HTMLInputElement;
                if (!chkAll) return;
                
                const subDepSelect = document.getElementById('sh-sub-dep-select') as HTMLSelectElement | null;
                const currentDep = subDepSelect ? (subDepSelect.value as Department) : "UG";

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
                    
                    const subDepSelect = document.getElementById('sh-sub-dep-select') as HTMLSelectElement | null;
                    const currentDep = subDepSelect ? (subDepSelect.value as Department) : "UG";

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
