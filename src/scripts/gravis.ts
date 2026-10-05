import { buildInputAriaSelector, setNativeValue, STORAGE_KEY_LPN, STORAGE_KEY_STATION, triggerEnter, waitForButtonBySpans, waitForElement } from "@shared/dom";

if (!window.__gravisLoaded) {
    window.__gravisLoaded = true;

    const CLR_BTN_LBL: string = "Usuń sesję"
    const CNT_BTN_SPN: string[] = ["Kontynuuj"]
    const LPN_INP_LBL: string[] = ["Wprowadź LPN"]
    const WS_INP_LBL: string[] = ["Wprowadź stację roboczą"]
     
    let active: boolean = false;
    let isProcessing: boolean = false;
    let keyBuffer: string = '';

    async function executeClearSession(): Promise<void> {
        if (isProcessing) return; 
        isProcessing = true;
        try {
            const clrSesSlr = `button[aria-label="${CLR_BTN_LBL}"]`;
            const clrSesBtn = await waitForElement(clrSesSlr) as HTMLButtonElement;
            if (clrSesBtn && !clrSesBtn.disabled) clrSesBtn.click();

            const cntBtn = await waitForButtonBySpans(CNT_BTN_SPN) as HTMLButtonElement;
            if (cntBtn) cntBtn.click();

            const lpnInpSlr = buildInputAriaSelector(LPN_INP_LBL);
            const lpnInp = await waitForElement(lpnInpSlr) as HTMLInputElement;
            if (!lpnInp) return;

            const savedLpn = localStorage.getItem(STORAGE_KEY_LPN);

            if (!savedLpn) {
                alert("Ще жодної LPN не записано, спробуйте з наступним товаром.");
                return;
            }

            setNativeValue(lpnInp, savedLpn);
            triggerEnter(lpnInp);

            const wsInpSlr = buildInputAriaSelector(WS_INP_LBL);
            const wsInp = await waitForElement(wsInpSlr) as HTMLInputElement;
            if (!wsInp) return;

            const savedWs = localStorage.getItem(STORAGE_KEY_STATION);

            if (!savedWs) {
                alert("Робоча станція ще не була записана, спробуйте з наступним товаром.");
                return;
            }

            setNativeValue(wsInp, savedWs);
            triggerEnter(wsInp);
        } finally {
            isProcessing = false;
        }

    }

    function handleKeydown(e: KeyboardEvent): void {
        if (!active) return;

        // 1. Exit early and reset buffer if they press space, numbers, or special keys
        if (e.key.length !== 1 || !/[a-z]/i.test(e.key)) {
            keyBuffer = '';
            return;
        }

        // 2. Exit early if actively typing in an input (prevents scanner misfires)
        const target = e.target as HTMLElement;
        if (target && target.matches('input, textarea, [contenteditable="true"]')) {
            keyBuffer = '';
            return;
        }

        // 3. Append the new key and slice to keep only the last 2 characters
        keyBuffer = (keyBuffer + e.key.toLowerCase()).slice(-2);

        // 4. Execute and consume buffer
        if (keyBuffer === 'us') {
            keyBuffer = ''; 
            executeClearSession();
        }
    }

    // Use capturing phase (true) to ensure global interception
    document.addEventListener('keydown', handleKeydown, true);

    window.__gravis = {
        enable: (): void => { active = true; },
        disable: (): void => { active = false; keyBuffer = ''; isProcessing = false},
        isActive: (): boolean => active
    };
}
