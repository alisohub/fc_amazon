import { LPN_ASGN_NEW_BTN_TSTID, LPN_OLD_LPN_INPT_TSTID, STORAGE_SAVED } from "@shared/constants";
import { findButtonByTestId, findInputByTestId, setNativeValue, triggerEnter } from "@shared/dom";
import { debugLog } from "@shared/utils";

if (!window.__refurbLpnLoaded) {
    window.__refurbLpnLoaded = true;
    
    let active: boolean = false;
    let isProcessing: boolean = false;

    const UI_STRINGS = {
        triggerBtn: LPN_ASGN_NEW_BTN_TSTID,
        oldLpnInput: LPN_OLD_LPN_INPT_TSTID
    };

    async function executeSequence(oldLpn: string | null): Promise<void> {
        debugLog('refurb-lpn', 'Starting old LPN auto-fill sequence');

        const oldLpnInput = await findInputByTestId(UI_STRINGS.oldLpnInput, 1000) as HTMLInputElement;
        if (!oldLpnInput) {
            debugLog('refurb-lpn', 'Old LPN input not found within 1000ms');
            return;
        }
        
        if (!oldLpn) {
            debugLog('refurb-lpn', 'No saved LPN in localStorage');
            alert("Жодна LPN ще не була записана, спробуйте з наступним товаром");
            return;
        }

        debugLog('refurb-lpn', `Filling old LPN input with: ${oldLpn}`);
        setNativeValue(oldLpnInput, oldLpn);
        triggerEnter(oldLpnInput);
    }

    document.addEventListener('click', (e: MouseEvent) => {
        if (!active) return;

        const target = e.target as HTMLElement;
        const button = target.closest('button');
        if (!button || button.disabled) return;

        if (isProcessing) return;
        isProcessing = true;

        const currentTestId = (button.getAttribute('data-testid') || '');
        try {
            if (currentTestId === UI_STRINGS.triggerBtn) {
                debugLog('refurb-lpn', 'Assign New LPN button click detected');
                executeSequence(localStorage.getItem(STORAGE_SAVED.current.lpn)); 
            }
        } finally {
            isProcessing = false;
        }
    }, true);

    
    window.addEventListener("refurb-lpn-updated", ((_: CustomEvent) => {
        if (!active) return;
        debugLog("refurb-lpn", "Captured event refurb-lpn-updated from hub");
        const asgnBtn = findButtonByTestId(UI_STRINGS.triggerBtn) as HTMLButtonElement;
        
        if (!asgnBtn || asgnBtn.disabled) return; 
            
        if (isProcessing) return;
        isProcessing = true;
        try {
            asgnBtn.click();
            debugLog('refurb-lpn', 'Assign New LPN input event detected');
            executeSequence(localStorage.getItem(STORAGE_SAVED.previous.lpn));
        } finally {
            isProcessing = false;
        }
    }) as EventListener);

    window.__refurbLpn = {
        enable: (): void => { active = true; debugLog('refurb-lpn', 'Enabled'); },
        disable: (): void => { active = false; isProcessing = false; debugLog('refurb-lpn', 'Disabled'); },
        isActive: (): boolean => active
    };
}
