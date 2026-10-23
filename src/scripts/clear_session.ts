import { CLR_BTN_TSTID, CNT_BTN_TSTID, LPN_INPT_TSTID, STORAGE_KEY_LPN, STORAGE_KEY_STATION, WS_INPT_TSTID } from "@shared/constants";
import { setNativeValue, triggerEnter, findButtonByTestId, findInputByTestId } from "@shared/dom";
import { debugLog } from "@shared/utils";

if (!window.__clearSessionLoaded) {
    window.__clearSessionLoaded = true;

    let active: boolean = false;
    let isProcessing: boolean = false;
    let keyBuffer: string = '';

    async function executeClearSession(): Promise<void> {
        if (isProcessing) return; 
        isProcessing = true;
        debugLog('clear-session', 'Triggered "us" sequence! Starting clear session flow');

        try {
            const clrSesBtn = findButtonByTestId(CLR_BTN_TSTID) as HTMLButtonElement;
            if (clrSesBtn && !clrSesBtn.disabled) {
                debugLog('clear-session', 'Clicking Clear Session icon');
                clrSesBtn.click();
            }

            const cntBtn = await findButtonByTestId(CNT_BTN_TSTID, 2000) as HTMLButtonElement;
            if (cntBtn && !cntBtn.disabled) {
                debugLog('clear-session', 'Clicking Continue button');
                cntBtn.click();
            }

            const lpnInp = await findInputByTestId(LPN_INPT_TSTID, 1000) as HTMLInputElement;
            if (lpnInp) {
                const savedLpn = localStorage.getItem(STORAGE_KEY_LPN);
                if (!savedLpn) {
                    debugLog('clear-session', 'Aborted: No saved LPN in localStorage');
                    alert("Ще жодної LPN не записано, спробуйте з наступним товаром.");
                    return;
                }
                debugLog('clear-session', `Re-entering saved LPN: ${savedLpn}`);
                setNativeValue(lpnInp, savedLpn);
                triggerEnter(lpnInp);
            }

            const wsInp = await findInputByTestId(WS_INPT_TSTID, 3000) as HTMLInputElement;
            if (!wsInp) {
                debugLog('clear-session', 'Workstation input not found within 3000ms');
                return;
            }

            const savedWs = localStorage.getItem(STORAGE_KEY_STATION);
            if (!savedWs) {
                debugLog('clear-session', 'Aborted: No saved Workstation in localStorage');
                alert("Робоча станція ще не була записана, спробуйте з наступним товаром.");
                return;
            }

            debugLog('clear-session', `Re-entering saved Workstation: ${savedWs}`);
            setNativeValue(wsInp, savedWs);
            triggerEnter(wsInp);
        } finally {
            isProcessing = false;
        }
    }

    function handleKeydown(e: KeyboardEvent): void {
        if (!active) return;

        if (e.key.length !== 1 || !/[a-z]/i.test(e.key)) {
            keyBuffer = '';
            return;
        }

        const target = e.target as HTMLElement;
        if (target && target.matches('input, textarea, [contenteditable="true"]')) {
            keyBuffer = '';
            return;
        }

        keyBuffer = (keyBuffer + e.key.toLowerCase()).slice(-2);

        if (keyBuffer === 'us') {
            keyBuffer = ''; 
            executeClearSession();
        }
    }

    document.addEventListener('keydown', handleKeydown, true);

    window.__clearSession = {
        enable: (): void => { active = true; debugLog('clear-session', 'Enabled'); },
        disable: (): void => { active = false; keyBuffer = ''; isProcessing = false; debugLog('clear-session', 'Disabled'); },
        isActive: (): boolean => active
    };
}
