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
    
    // Tracking for our 30-second warning ping
    let hasPinged: boolean = false; 
    let justPinged: boolean = false; 

    function clearAndStop(reason: 'success' | 'aborted'): void {
        settings.toteBarcode = '';
        timerStart = null;
        lastInputValue = '';
        hasPinged = false;
        justPinged = false;
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
        
        if (currentValue !== lastInputValue) {
            if (justPinged) {
                // Ignore the input change if it was just the system clearing our fake ping
                lastInputValue = currentValue;
                justPinged = false;
            } else {
                // The user actually typed something! Restart the timer completely.
                lastInputValue = currentValue;
                timerStart = Date.now(); 
                hasPinged = false;
                return;
            }
        }

        if (timerStart === null) {
            timerStart = Date.now();
            hasPinged = false;
            justPinged = false;
        }
        
        const elapsed = Date.now() - timerStart;
        const targetMins = settings.timeoutMins || 10; 
        const targetMs = targetMins * 60 * 1000;

        // ==========================================
        // FAKE PING (30 Seconds before final scan)
        // ==========================================
        // Ensure the timer is at least > 30 seconds to begin with so they don't overlap
        if (!hasPinged && targetMs > 30000 && elapsed >= (targetMs - 30000)) {
            const fakeBarcode = 't-ping'; 
            setNativeValue(targetInput, fakeBarcode);
            
            const enterEvent = new KeyboardEvent('keydown', {
                key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true, cancelable: true
            });
            targetInput.dispatchEvent(enterEvent);
            
            lastInputValue = fakeBarcode; // Update so we don't trigger a user-typing reset next tick
            hasPinged = true; 
            justPinged = true; 
        }
        // ==========================================

        if (elapsed >= targetMs) {
            setNativeValue(targetInput, settings.toteBarcode);
            const enterEvent = new KeyboardEvent('keydown', {
                key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true, cancelable: true
            });
            targetInput.dispatchEvent(enterEvent);
            clearAndStop('success');
        } else {
            window.dispatchEvent(new CustomEvent('sh-offtask-tick', { 
                detail: { remainingMs: targetMs - elapsed }
            }));
        }
    }

    setInterval(checkTick, 500);

    window.__offTask = {
        enable: (): void => { active = true; },
        disable: (): void => { active = false; timerStart = null; hasPinged = false; },
        isActive: (): boolean => active,
        getSettings: (): OffTaskSettings => settings,
        updateSettings: (newSettings: Partial<OffTaskSettings>): void => {
            settings = { ...settings, ...newSettings };
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)); } catch(e) {}
            
            // Instantly restart the timer when the user edits settings
            timerStart = Date.now(); 
            hasPinged = false;
            justPinged = false;
        }
    };
}
