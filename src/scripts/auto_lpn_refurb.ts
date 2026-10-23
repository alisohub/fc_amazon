import { LPN_ASGN_NEW_BTN_SPN, LPN_OLD_LPN_INPT_TSTID, STORAGE_KEY_LPN } from "@shared/constants";
import { findInputByTestId, setNativeValue, triggerEnter } from "@shared/dom";
import { debugLog } from "@shared/utils";

if (!window.__refurbLpnLoaded) {
    window.__refurbLpnLoaded = true;
    
    let active: boolean = false;
    let isProcessing: boolean = false;

    const UI_STRINGS = {
        triggerBtn: LPN_ASGN_NEW_BTN_SPN,
        oldLpnInput: LPN_OLD_LPN_INPT_TSTID
    };

    async function executeSequence(): Promise<void> {
        if (isProcessing) return;
        isProcessing = true;
        debugLog('refurb-lpn', 'Starting old LPN auto-fill sequence');

        try {
            const oldLpnInput = await findInputByTestId(UI_STRINGS.oldLpnInput, 2000) as HTMLInputElement;
            if (!oldLpnInput) {
                debugLog('refurb-lpn', 'Old LPN input not found within 2000ms');
                return;
            }
            
            const oldLpn = localStorage.getItem(STORAGE_KEY_LPN);
            if (!oldLpn) {
                debugLog('refurb-lpn', 'No saved LPN in localStorage');
                alert("Жодна LPN ще не була записана, спробуйте з наступним товаром");
                return;
            }

            debugLog('refurb-lpn', `Filling old LPN input with: ${oldLpn}`);
            setNativeValue(oldLpnInput, oldLpn);
            triggerEnter(oldLpnInput);
        } finally {
            isProcessing = false;
        }
    }

    // TODO find by testid
    document.addEventListener('click', (e: MouseEvent) => {
        if (!active) return;

        const target = e.target as HTMLElement;
        let isTrigger = false;
        const directText = target.textContent?.trim();
        const childText = target.querySelector('span')?.textContent?.trim();

        if (target.tagName.toLowerCase() === 'span' && directText && UI_STRINGS.triggerBtn.includes(directText)) {
            isTrigger = true;
        } else if (childText && UI_STRINGS.triggerBtn.includes(childText)) {
            isTrigger = true;
        }

        if (isTrigger) {
            debugLog('refurb-lpn', 'Assign New LPN button click detected');
            setTimeout(executeSequence, 100); 
        }
    }, true);

    window.__refurbLpn = {
        enable: (): void => { active = true; debugLog('refurb-lpn', 'Enabled'); },
        disable: (): void => { active = false; isProcessing = false; debugLog('refurb-lpn', 'Disabled'); },
        isActive: (): boolean => active
    };
}
