import { CNT_BTN_TSTID, LPN_INPT_TSTID, STORAGE_KEY_LPN, STORAGE_KEY_STATION, WS_INPT_TSTID } from "@shared/constants";
import { setNativeValue,  triggerEnter, findButtonByTestId, findInputByTestId } from "@shared/dom";

if (!window.__clearSessionLoaded) {
    window.__clearSessionLoaded = true;

    let active: boolean = false;
    let isProcessing: boolean = false;
    let keyBuffer: string = '';

    async function executeClearSession(): Promise<void> {
        if (isProcessing) return; 
        isProcessing = true;

        try {
            await fetch("/api/session/startClearSession", {
                method: "POST",
                headers: {
                    "accept": "application/json",
                    "content-type": "application/json"
                },
                body: "{}"
            });

            const cntBtn = await findButtonByTestId(CNT_BTN_TSTID, 2000) as HTMLButtonElement;
            if (cntBtn && !cntBtn.disabled) cntBtn.click();

            const lpnInp = await findInputByTestId(LPN_INPT_TSTID, 4000) as HTMLInputElement;
            if (lpnInp) {
                const savedLpn = localStorage.getItem(STORAGE_KEY_LPN);
                if (!savedLpn) {
                    alert("Żadna LPN nie została zapisana.");
                    return;
                }
                setNativeValue(lpnInp, savedLpn);
                triggerEnter(lpnInp);
            }

            const wsInp = await findInputByTestId(WS_INPT_TSTID, 5000) as HTMLInputElement;
            if (!wsInp) return;
            const savedWs = localStorage.getItem(STORAGE_KEY_STATION);
            if (!savedWs) {
                alert("Stacja robocza nie została zapisana.");
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
        enable: (): void => { active = true; },
        disable: (): void => { active = false; keyBuffer = ''; isProcessing = false},
        isActive: (): boolean => active
    };
}
