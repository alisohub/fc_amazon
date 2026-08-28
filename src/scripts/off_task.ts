import { isInsideModal, hasTargetLabel, setNativeValue } from '@shared/dom';

if (!window.__offTaskLoaded) {
    window.__offTaskLoaded = true;

    const STORAGE_KEY = 'sh_off_task_settings';
    
    let active: boolean = false;
    let settings: OffTaskSettings = {
        toteBarcode: '',
        timeoutMins: undefined 
    };

    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) settings = { ...settings, ...JSON.parse(saved) };
    } catch(e) {}

    let timerStart: number | null = null;
    let lastInputValue: string = '';

    function clearAndStop(reason: 'success' | 'aborted'): void {
        settings.toteBarcode = '';
        timerStart = null;
        lastInputValue = '';
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)); } catch(e) {}
        
        window.dispatchEvent(new CustomEvent('sh-offtask-update', { detail: { reason } }));
    }

    function checkTick(): void {
        if (!active || !settings.toteBarcode) {
            timerStart = null;
            return;
        }

        const targetInput = document.querySelector('input[type="text"]:not([hidden]):not([disabled])') as HTMLInputElement | null;
        
        if (!targetInput || isInsideModal(targetInput) || !hasTargetLabel(targetInput.getAttribute('aria-label'))) {
            clearAndStop('aborted');
            return;
        }

        const currentValue = targetInput.value;
        
        // If the value changes, it means the user manually typed or scanned something. Restart timer.
        if (currentValue !== lastInputValue) {
            lastInputValue = currentValue;
            timerStart = Date.now(); 
            return;
        }

        if (timerStart === null) {
            timerStart = Date.now();
        }
        
        const elapsed = Date.now() - timerStart;
        const targetMins = settings.timeoutMins || 10; 
        const targetMs = targetMins * 60 * 1000;

        if (elapsed >= targetMs) {
            // Final tote scan
            setNativeValue(targetInput, settings.toteBarcode);
            const enterEvent = new KeyboardEvent('keydown', {
                key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true, cancelable: true
            });
            targetInput.dispatchEvent(enterEvent);
            clearAndStop('success');
        } else {
            // Update the UI timer in the Hub
            window.dispatchEvent(new CustomEvent('sh-offtask-tick', { 
                detail: { remainingMs: targetMs - elapsed }
            }));
        }
    }

    setInterval(checkTick, 500);

    window.__offTask = {
        enable: (): void => { 
            active = true; 
        },
        disable: (): void => { 
            active = false; 
            timerStart = null; 
        },
        isActive: (): boolean => active,
        getSettings: (): OffTaskSettings => settings,
        updateSettings: (newSettings: Partial<OffTaskSettings>): void => {
            settings = { ...settings, ...newSettings };
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)); } catch(e) {}
            
            // Instantly restart the timer when the user edits settings
            timerStart = Date.now(); 
        }
    };
}
