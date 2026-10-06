import { LPN_ASGN_NEW_BTN_SPN, LPN_OLD_LPN_INPT_LBL, STORAGE_KEY_LPN } from "@shared/constants";
import {buildInputAriaSelector, setNativeValue, triggerEnter, waitForElement } from "@shared/dom";

if (!window.__refurbLpnLoaded) {
    window.__refurbLpnLoaded = true;
    
    let active: boolean = false;
    let isProcessing: boolean = false;

    const UI_STRINGS = {
        triggerBtn: LPN_ASGN_NEW_BTN_SPN,
        oldLpnInput: LPN_OLD_LPN_INPT_LBL
    };

    async function executeSequence(): Promise<void> {
        if (isProcessing) return;
        isProcessing = true;

        try {
            // 1. Find and fill old LPN
            const oldLpnSelector = buildInputAriaSelector(UI_STRINGS.oldLpnInput);
            const oldLpnInput = await waitForElement(oldLpnSelector) as HTMLInputElement;
            if (!oldLpnInput) return; // Silent abort
            
            const oldLpn = localStorage.getItem(STORAGE_KEY_LPN);
            if (!oldLpn) {
                alert("Жодна LPN ще не була записана, спробуйте з наступним товаром");
                return;
            }

            setNativeValue(oldLpnInput, oldLpn);
            triggerEnter(oldLpnInput);

        } finally {
            // This guarantees the lock is ALWAYS released, even if we hit a silent return above
            isProcessing = false;
        }
    }

    document.addEventListener('click', (e: MouseEvent) => {
        if (!active) return;
        const target = e.target as HTMLElement;
        
        let isTrigger = false;
        const directText = target.textContent?.trim();
        const childText = target.querySelector('span')?.textContent?.trim();

        // Check if the clicked target (or its child span) matches any of our trigger strings
        if (target.tagName.toLowerCase() === 'span' && directText && UI_STRINGS.triggerBtn.includes(directText)) {
            isTrigger = true;
        } else if (childText && UI_STRINGS.triggerBtn.includes(childText)) {
            isTrigger = true;
        }

        if (isTrigger) {
            // Give the browser 100ms to process the native click event before launching our sequence
            setTimeout(executeSequence, 100); 
        }
    }, true);

    window.__refurbLpn = {
        enable: (): void => { active = true; },
        disable: (): void => { active = false; isProcessing = false; },
        isActive: (): boolean => active
    };
}
