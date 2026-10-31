import { DEPARTMENT_CONFIG } from "@shared/constants";

function createSettingsDrawer(
    renderBody: (content: HTMLElement, signal: AbortSignal) => void
): (container: HTMLElement) => void {
    return (container: HTMLElement) => {
        if ((container as any)._abortController) {
            (container as any)._abortController.abort();
        }
        const controller = new AbortController();
        (container as any)._abortController = controller;

        container.innerHTML = `
            <div class="sh-adv-container"></div>
            <div class="sh-adv-toggle-wrap">
                <span class="sh-adv-text">Налаштування</span>
            </div>
        `;

        const content = container.querySelector('.sh-adv-container') as HTMLElement;
        const toggleBtn = container.querySelector('.sh-adv-text') as HTMLElement;

        toggleBtn.addEventListener('click', () => {
            content.classList.toggle('sh-expanded');
        }, { signal: controller.signal });

        renderBody(content, controller.signal);
    };
}

export const getScriptsConfig = (getCurrentDep: () => Department): ScriptDefinition[] => {
    return [
        {
            id: 'item-counter',
            name: 'Рахувальник',
            file: 'counter.js',
            description: 'Рахує пачки, можете сховати з екрану за допомогою F10. Виставте перерву.',
            getHandler: () => window.__itemCounter,
            renderSettings: createSettingsDrawer((content) => {
                const handler = window.__itemCounter;
                if (!handler) return;

                const currentDep = getCurrentDep();
                const settings = handler.getSettings();
                const currentCount = handler.getCount();

                const configRate = DEPARTMENT_CONFIG[currentDep] ? DEPARTMENT_CONFIG[currentDep].targetRate : 47;
                const configDoubleCount = DEPARTMENT_CONFIG[currentDep] ? DEPARTMENT_CONFIG[currentDep].doubleCountMode : false;
                const configClickCount = DEPARTMENT_CONFIG[currentDep] ? DEPARTMENT_CONFIG[currentDep].clickCount : false;

                const targetRate = settings.targetRate !== undefined ? settings.targetRate : configRate;
                const clickCount = settings.clickCount !== undefined ? settings.clickCount : false;

                const isPS = currentDep === 'PS' || currentDep === 'PS(CD)';

                handler.updateSettings({
                    targetRate: targetRate,
                    doubleCountMode: configDoubleCount,
                    clickCount: clickCount,
                    isPS: isPS
                });

                content.innerHTML = `
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
                    <div class="sh-setting-row" title="Target Rate">
                        <span class="sh-emoji">🎯</span>
                        <input type="number" id="sh-cfg-target" class="sh-input sh-flex-1" min="0" value="${targetRate}" placeholder="Необхідна норма" />
                    </div>
                    <div class="sh-setting-row sh-mt-8 sh-space-between" title="Власний час початку зміни" style="margin-bottom: 0;">
                        <div class="sh-flex-center-gap">
                            <span class="sh-emoji">⏱️</span>
                            <input type="text" id="sh-cfg-start-time" class="sh-input sh-time-input-small" value="${settings.customStartTime || ''}" placeholder="14:30" maxlength="5" />
                        </div>
                        <div class="sh-flex-gap">
                            <button id="sh-btn-start-now" class="sh-time-btn">Зараз</button>
                            <button id="sh-btn-start-reset" class="sh-time-btn">Скинути</button>
                        </div>
                    </div>

                    ${configClickCount ? `
                    <div class="sh-setting-row sh-space-between" title="Авто підтвердження">
                        <span style="font-size: 12px; color: #3c4043; font-weight: 500;">Авто підтвердження</span>
                        <label class="sh-switch">
                            <input type="checkbox" id="sh-cfg-count-click" ${clickCount ? 'checked' : ''}>
                            <span class="sh-slider"></span>
                        </label>
                    </div>
                    ` : ''}
                `;

                // Add listener for the new toggle
                const countClickToggle = content.querySelector('#sh-cfg-count-click') as HTMLInputElement;
                if (countClickToggle) {
                    countClickToggle.addEventListener('change', (e: Event) => {
                        const target = e.target as HTMLInputElement;
                        handler.updateSettings({ clickCount: target.checked });
                    });
                }

                // ... Keep all the other existing event listeners (lunchBreak, counts, opacity, targetRate, timeInputs) below this ...
                content.querySelectorAll('.sh-opt-btn').forEach(btn => {
                    btn.addEventListener('click', (e: Event) => {
                        const target = e.target as HTMLElement;
                        content.querySelectorAll('.sh-opt-btn').forEach(b => b.classList.remove('active'));
                        target.classList.add('active');
                        const val = parseInt(target.getAttribute('data-val') || '1', 10);
                        handler.updateSettings({ lunchBreak: val });
                    });
                });

                const countInput = content.querySelector('#sh-cfg-count') as HTMLInputElement;
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

                const opacityInput = content.querySelector('#sh-cfg-opacity') as HTMLInputElement;
                if (opacityInput) {
                    opacityInput.addEventListener('input', (e: Event) => {
                        const target = e.target as HTMLInputElement;
                        const val = parseFloat(target.value);
                        handler.updateSettings({ overlayOpacity: val });
                    });
                }

                const targetInput = content.querySelector('#sh-cfg-target') as HTMLInputElement;
                if (targetInput) {
                    targetInput.addEventListener('input', (e: Event) => {
                        const target = e.target as HTMLInputElement;
                        let val = parseFloat(target.value);
                        if (isNaN(val) || val < 0) val = 0;
                        handler.updateSettings({ targetRate: val });
                    });
                }

                const timeInput = content.querySelector('#sh-cfg-start-time') as HTMLInputElement;
                const btnNow = content.querySelector('#sh-btn-start-now') as HTMLButtonElement;
                const btnReset = content.querySelector('#sh-btn-start-reset') as HTMLButtonElement;

                if (timeInput && btnNow && btnReset) {
                    timeInput.addEventListener('input', (e: Event) => {
                        const target = e.target as HTMLInputElement;
                        const inputEvent = e as InputEvent;
                        const digits = target.value.replace(/\D/g, '').split('');
                        let out = '';

                        if (digits.length > 0) {
                            const d = digits.shift()!;
                            if (d >= '3') out += '0' + d;
                            else out += d;
                        }
                        if (digits.length > 0 && out.length === 1) {
                            const d = digits.shift()!;
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
                            const d = digits.shift()!;
                            if (d >= '6') out += '0' + d;
                            else out += d;
                        }
                        if (digits.length > 0 && out.length === 4) {
                            const d = digits.shift()!;
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
            })
        },
        {
            id: 'off-task',
            name: 'Авто-Введення (Off-Task)',
            file: 'off_task.js',
            description: 'Натисніть Alt+O, щоб задати час та відсканувати тот для авто-прибиття.',
            excludeDeps: ["PS", "PS(CD)"],
            getHandler: () => window.__offTask
        },
        {
            id: 'binds',
            name: 'Бінди',
            file: 'binds.js',
            description: 'Автоматично проклікує при натисненні.<br>Натисніть на F-кнопку для запису(альтернативно F9 і F1-F7) або на слово, щоб видалити його.',
            excludeDeps: ["PS", "PS(CD)", "CD"],
            getHandler: () => window.__binds,
            renderSettings: createSettingsDrawer((content, signal) => {
                const handler = window.__binds as BindsHandler;
                if (!handler) return;

                let tempShortcuts = JSON.parse(JSON.stringify(handler.getShortcuts()));

                const renderUI = () => {
                    const keys = Object.keys(tempShortcuts);
                    const recordingKey = handler.getRecordingKey();

                    const listItems = keys.length > 0
                        ? keys.map(key => {
                            const sequenceLabels = tempShortcuts[key];
                            const isRecording = recordingKey === key;

                            const wordsHtml = sequenceLabels.map((val: string, idx: number) => {
                                const displayVal = val.split(/\s+/).slice(0, 2).join(' ');
                                return `<span class="sh-bind-del-word" data-key="${key}" data-idx="${idx}" title="Видалити: ${val}">${displayVal}</span>`;
                            }).join(' <span class="sh-arrow">➔</span> ');

                            const actionContent = sequenceLabels.length > 0
                                ? wordsHtml
                                : (isRecording ? '<i>Запис...</i>' : '');

                            const keyClasses = isRecording ? 'sh-bind-key sh-recording' : 'sh-bind-key';

                            return `
                                <div class="sh-bind-row">
                                    <div class="${keyClasses}" data-key="${key}" title="Запис / Зупинка">${key}</div>
                                    <div class="sh-bind-action">${actionContent}</div>
                                </div>
                            `;
                        }).join('')
                        : `<div style="text-align:center; padding: 10px; font-size: 11px; color:#9aa0a6;">Наразі немає жодного бінда.</div>`;

                    content.innerHTML = `<div class="sh-bind-list">${listItems}</div>`;

                    content.querySelectorAll('.sh-bind-key').forEach(btn => {
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

                    content.querySelectorAll('.sh-bind-del-word').forEach(wordEl => {
                        wordEl.addEventListener('click', (e) => {
                            const target = e.target as HTMLElement;
                            const key = target.getAttribute('data-key');
                            const idxStr = target.getAttribute('data-idx');

                            if (key && idxStr !== null && !recordingKey) {
                                const idx = parseInt(idxStr, 10);
                                tempShortcuts[key].splice(idx, 1);
                                handler.updateShortcuts(tempShortcuts);
                                renderUI();
                            }
                        });
                    });
                };

                window.addEventListener('sh-binds-update', () => {
                    tempShortcuts = JSON.parse(JSON.stringify(handler.getShortcuts()));
                    renderUI();
                }, { signal });

                renderUI();
            })
        },
        {
            id: 'auto-lpn',
            name: 'Авто-LPN',
            file: 'auto_lpn.js',
            description: 'Автоматично відкриває "перепризначити LPN" при скануванні LPN або будь-чого іншого, окрім тота',
            excludeDeps: ['CD', 'REFURB', 'WHD', "PS", "PS(CD)"],
            getHandler: () => window.__autoLpn
        },
        {
            id: 'refurb-lpn',
            name: 'Aвто-LPN',
            file: 'auto_lpn_refurb.js',
            description: 'Автоматично заповнює стару LPN',
            excludeDeps: ['CD', 'CRET', 'FAST', 'UG', "PS", "PS(CD)"],
            getHandler: () => window.__refurbLpn
        },
        {
            id: 'clear-session',
            name: 'Авто-скасуй',
            file: 'clear_session.js',
            description: 'Автоматично скасовує сесію при натисненні `us` на клавіатурі.',
            excludeDeps: ['CD', "PS", "PS(CD)"],
            getHandler: () => window.__clearSession
        },
        {
            id: 'gravis',
            name: 'Gravis',
            file: 'gravis.js',
            description: 'Якщо штрих-код товару доступний в Gravis автоматично вставляє його у відповідне поле при натисненні F8 або при скануванні тієї самої LPN. При відкритті вкладки з Gravis активуйте скрипт в ній також.',
            excludeDeps: ['CD', 'REFURB', 'WHD', "PS", "PS(CD)"],
            getHandler: () => window.__gravis
        }
    ];
};




