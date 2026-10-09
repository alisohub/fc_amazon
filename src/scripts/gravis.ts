import { ITM_SCN_INPT_LBL, CHS_ITM_LST_BTN_SPN } from '@shared/constants';
import { findInputByLabel, findButtonBySpan, setNativeValue, triggerEnter } from '@shared/dom';

if (!window.__gravisLoaded) {
    window.__gravisLoaded = true;
    
    let active: boolean = false;
    let gravisWindow: Window | null = null;
    let checkInterval: ReturnType<typeof setInterval> | null = null;

    function syncHubUI(isActive: boolean): void {
        const chk = document.getElementById('sh-chk-gravis') as HTMLInputElement | null;
        if (chk && chk.checked !== isActive) {
            chk.checked = isActive;
        }
    }

    function handleGravisDisconnect() {
        active = false;
        stopWindowMonitor();
        gravisWindow = null;
        syncHubUI(false);
    }

    function startWindowMonitor() {
        if (checkInterval) clearInterval(checkInterval);
        checkInterval = setInterval(() => {
            if (gravisWindow && gravisWindow.closed) {
                handleGravisDisconnect();
            }
        }, 500);
    }

    function stopWindowMonitor() {
        if (checkInterval) clearInterval(checkInterval);
        checkInterval = null;
    }

    // F8: Pre-checks for the input before waking up the Gravis tab
    document.addEventListener('keydown', async (e: KeyboardEvent) => {
        if (!active || !gravisWindow || gravisWindow.closed) return;
        
        if (e.key === 'F8') {
            e.preventDefault();
            
            const asinInput = await findInputByLabel(ITM_SCN_INPT_LBL);
            if (!asinInput) {
                console.log("No ASIN input found on Main Hub. Skipping Gravis search.");
                return;
            }

            gravisWindow.postMessage({ type: 'TRIGGER_ASIN_SEARCH' }, '*');
        }
    });

    window.__gravis = {
        enable: (): void => {
            active = true;
            if (!gravisWindow || gravisWindow.closed) {
                gravisWindow = window.open('https://eu-cretfc-tools-dub.dub.proxy.amazon.com/gravis', 'GravisApp');
            }
            startWindowMonitor();
        },
        disable: (): void => {
            active = false;
            stopWindowMonitor();
            if (gravisWindow && !gravisWindow.closed) {
                gravisWindow.close(); 
            }
            gravisWindow = null;
            syncHubUI(false);
        },
        isActive: (): boolean => active,
        
        sendLpn: (lpn: string): void => {
            if (active && gravisWindow && !gravisWindow.closed) {
                gravisWindow.postMessage({ type: 'SYNC_LPN', payload: lpn }, '*');
            }
        } 
    };

    window.addEventListener('message', async (e: MessageEvent) => {
        const data = e.data;
        
        if (data?.type === 'GRAVIS_READY') {
            active = true;
            syncHubUI(true);
            if (!gravisWindow) {
                gravisWindow = e.source as Window;
                startWindowMonitor();
            }
            
        } else if (data?.type === 'GRAVIS_CLOSED') {
            handleGravisDisconnect();
            
        } else if (data?.type === 'FOUND_ASIN') {
            if (data.payload === 'NOT_FOUND') {
                const noBarcodeBtn = await findButtonBySpan(CHS_ITM_LST_BTN_SPN) as HTMLButtonElement;
                if (noBarcodeBtn && !noBarcodeBtn.disabled) {
                    noBarcodeBtn.click();
                }
            } else {
                const asinInput = await findInputByLabel(ITM_SCN_INPT_LBL) as HTMLInputElement;
                if (asinInput) {
                    setNativeValue(asinInput, data.payload);
                    triggerEnter(asinInput);
                }
            }
        }
    });
}
