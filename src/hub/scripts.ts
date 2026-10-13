import { DEPARTMENT_CONFIG } from "@shared/constants";

export const getScriptsConfig = (getCurrentDep: () => Department): ScriptDefinition[] => {
    return [
        {
            id: 'item-counter',
            name: 'Рахувальник',
            file: 'counter.js',
            description: 'Рахує пачки, можете сховати з екрану за допомогою F10. Виставте перерву.',
            getHandler: () => window.__itemCounter,
            renderSettings: (container: HTMLElement) => {
                const handler = window.__itemCounter;
                if (!handler) return;
                
                const currentDep = getCurrentDep();
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
                const currentDep = getCurrentDep();
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
            name: 'Aвто-LPN',
            file: 'auto_lpn_refurb.js',
            description: 'Автоматично заповнює стару LPN',
            excludeDeps: ['CRET', 'FAST', 'UG'],
            getHandler: () => window.__refurbLpn
        },
        {
            id: 'clear-session',
            name: 'Авто-скасуй',
            file: 'clear_session.js',
            description: 'Автоматично скасовує сесію при натисненні `us` на клавіатурі.',
            getHandler: () => window.__clearSession
        },
        {
            id: 'gravis',
            name: 'Gravis',
            file: 'gravis.js',
            description: 'Якщо штрих-код товару доступний в Gravis\nавтоматично вставляє його у відповідне поле при натиснені F8.\nПри відкритті вкладки з Gravis активуйте скрипт в ній також.',
            excludeDeps: ['REFURB', 'WHD'],
            getHandler: () => window.__gravis
        }
]};
