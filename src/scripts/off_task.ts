import { TOTE_INPT_TSTID } from '@shared/constants';
import { findInputByTestId, isInsideModal, setNativeValue, setStatusDot, showInitializationToast, triggerEnter } from '@shared/dom';

if (!window.__offTaskLoaded) {
    window.__offTaskLoaded = true;

    const DOT_ID = 'off-task';
    const DOT_GREEN = '#1e8e3e';
    const POPUP_ID = 'sh-offtask-popup';

    let active: boolean = false;
    let timeoutMins: number | null = null;
    let toteBarcode: string = '';
    let timerStart: number | null = null;
    let lastInputValue: string = '';

    function parseMinutes(raw: string): number | null {
        const val = raw.trim().replace(',', '.');
        if (!val) return null;

        let mins = NaN;
        if (val.includes(':')) {
            const parts = val.split(':');
            const m = parseInt(parts[0] || '0', 10);
            const s = parseInt(parts[1] || '0', 10);
            if (!isNaN(m) && !isNaN(s) && m >= 0 && s >= 0) {
                mins = m + (s / 60);
            }
        } else {
            mins = parseFloat(val);
        }

        return !isNaN(mins) && mins > 0 ? mins : null;
    }

    function stopCountdown(): void {
        timeoutMins = null;
        toteBarcode = '';
        timerStart = null;
        lastInputValue = '';
        setStatusDot(DOT_ID, DOT_GREEN, false);
    }

    function closePopup(): void {
        const existing = document.getElementById(POPUP_ID);
        if (existing) existing.remove();
    }

    function openPopup(): void {
        closePopup();
        stopCountdown();

        let step: 1 | 2 = 1;
        let pendingMins: number = 0;

        const wrapper = document.createElement('div');
        wrapper.id = POPUP_ID;
        wrapper.setAttribute('role', 'dialog');
        Object.assign(wrapper.style, {
            position: 'fixed',
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#ffffff',
            border: '1px solid #dadce0',
            borderRadius: '10px',
            padding: '10px 12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            zIndex: '999999',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: "'Roboto', -apple-system, sans-serif"
        });

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Впишіть к-сть хв до прибиття';
        input.autocomplete = 'off';
        Object.assign(input.style, {
            padding: '6px 10px',
            fontSize: '13px',
            border: '1px solid #dadce0',
            borderRadius: '6px',
            outline: 'none',
            width: '215px',
            boxSizing: 'border-box',
            color: '#202124'
        });

        const okBtn = document.createElement('button');
        okBtn.type = 'button';
        okBtn.textContent = 'OK';
        Object.assign(okBtn.style, {
            background: '#1a73e8',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            height: '30px'
        });

        const advanceStep = (): void => {
            if (step === 1) {
                const parsed = parseMinutes(input.value);
                if (parsed === null) {
                    input.style.borderColor = '#d93025';
                    input.focus();
                    return;
                }
                pendingMins = parsed;
                step = 2;
                input.value = '';
                input.style.borderColor = '#dadce0';
                input.placeholder = 'Відскануйте тот';
                input.focus();
            } else {
                const scannedTote = input.value.trim();
                if (!scannedTote) {
                    input.style.borderColor = '#d93025';
                    input.focus();
                    return;
                }
                timeoutMins = pendingMins;
                toteBarcode = scannedTote;
                timerStart = Date.now();

                const targetInput = findInputByTestId(TOTE_INPT_TSTID) as HTMLInputElement | null;
                lastInputValue = targetInput ? targetInput.value : '';

                closePopup();
                showInitializationToast('Старт OFF_TASK', `Прибиття тота ${toteBarcode} через ${timeoutMins} хв`)
                setStatusDot(DOT_ID, DOT_GREEN, true);
            }
        };

        // Prevent keystrokes inside the popup from triggering Socrates or other scripts
        ['keydown', 'keyup', 'keypress', 'input'].forEach(evtType => {
            wrapper.addEventListener(evtType, (e: Event) => e.stopPropagation());
        });

        input.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                advanceStep();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                closePopup();
            }
        });

        okBtn.addEventListener('click', () => advanceStep());

        wrapper.appendChild(input);
        wrapper.appendChild(okBtn);
        document.body.appendChild(wrapper);
        input.focus();
    }

    document.addEventListener('mousedown', (e: MouseEvent) => {
        const popup = document.getElementById(POPUP_ID);
        if (popup && !popup.contains(e.target as Node)) {
            closePopup();
        }
    });

    document.addEventListener('keydown', (e: KeyboardEvent) => {
        if (!active) return;

        // Use e.code === 'KeyO' so Alt+O works regardless of Ukrainian/Polish/English layout
        if (e.altKey && (e.code === 'KeyO' || e.key.toLowerCase() === 'o')) {
            e.preventDefault();
            e.stopPropagation();

            if (document.getElementById(POPUP_ID)) {
                closePopup();
            } else {
                openPopup();
            }
        }
    }, true);

    function checkTick(): void {
        if (!active || !toteBarcode || timeoutMins === null || timerStart === null) {
            return;
        }

        const targetInput = findInputByTestId(TOTE_INPT_TSTID) as HTMLInputElement | null;
        if (!targetInput || isInsideModal(targetInput)) {
            stopCountdown();
            return;
        }

        const currentValue = targetInput.value;
        // Restart countdown if user manually scans/types into the tote field
        if (currentValue !== lastInputValue) {
            lastInputValue = currentValue;
            timerStart = Date.now();
            return;
        }

        const elapsed = Date.now() - timerStart;
        const targetMs = timeoutMins * 60 * 1000;

        if (elapsed >= targetMs) {
            setNativeValue(targetInput, toteBarcode);
            triggerEnter(targetInput);
            stopCountdown();
        }
    }

    setInterval(checkTick, 500);

    window.__offTask = {
        enable: (): void => {
            active = true;
        },
        disable: (): void => {
            active = false;
            closePopup();
            stopCountdown();
        },
        isActive: (): boolean => active
    };
}
