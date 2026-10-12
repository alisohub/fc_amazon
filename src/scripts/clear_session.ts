import { CLR_BTN_TSTID, CNT_BTN_TSTID, LPN_INPT_TSTID, STORAGE_KEY_LPN, STORAGE_KEY_STATION, WS_INPT_TSTID } from "@shared/constants";
import { setNativeValue,  triggerEnter, findButtonByTestId, findInputByTestId } from "@shared/dom";

if (!window.__clearSessionLoaded) {
    window.__clearSessionLoaded = true;

    let active: boolean = false;
    let isProcessing: boolean = false;

    async function executeClearSession(): Promise<void> {
        if (isProcessing) return; 
        isProcessing = true;
        try {
            let clrSesBtn = findButtonByTestId(CLR_BTN_TSTID) as HTMLButtonElement;
            if (clrSesBtn && !clrSesBtn.disabled) clrSesBtn.click();

            const cntBtn = await findButtonByTestId(CNT_BTN_TSTID, 2000) as HTMLButtonElement;
            if (cntBtn && !cntBtn.disabled) cntBtn.click();


            const lpnInp = await findInputByTestId(LPN_INPT_TSTID, 4000) as HTMLInputElement;
            if (lpnInp) {
                const savedLpn = localStorage.getItem(STORAGE_KEY_LPN);

                if (!savedLpn) {
                    alert("Ще жодної LPN не записано, спробуйте з наступним товаром.");
                    return;
                }

                setNativeValue(lpnInp, savedLpn);
                triggerEnter(lpnInp);
            }

            const wsInp = await findInputByTestId(WS_INPT_TSTID, 5000) as HTMLInputElement;
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

    document.addEventListener('keydown', (e: KeyboardEvent) => {
        if (!active) return;
                        
        if (e.key === 'F9') {
            e.preventDefault();
            executeClearSession();
            }
    }, true);

    window.__clearSession = {
        enable: (): void => { active = true; },
        disable: (): void => { active = false; isProcessing = false},
        isActive: (): boolean => active
    };
}
