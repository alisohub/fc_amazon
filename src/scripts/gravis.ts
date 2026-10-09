import { STORAGE_KEY_LPN, ITM_SCN_INPT_LBL, CHS_ITM_LST_BTN_SPN } from '@shared/constants';
import { findInputByLabel, findButtonBySpan, setNativeValue, triggerEnter } from '@shared/dom';

if (!window.__gravisLoaded) {
    window.__gravisLoaded = true;
    
    let active: boolean = false;
    let gravisWindow: Window | null = null;
    let checkInterval: ReturnType<typeof setInterval> | null = null;
    let storageMonitorInterval: ReturnType<typeof setInterval> | null = null;
    let lastKnownLpn: string | null = localStorage.getItem(STORAGE_KEY_LPN);

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

        if (storageMonitorInterval) clearInterval(storageMonitorInterval);
        lastKnownLpn = localStorage.getItem(STORAGE_KEY_LPN); 
        storageMonitorInterval = setInterval(() => {
            if (!active || !gravisWindow || gravisWindow.closed) return;
            
            const currentLpn = localStorage.getItem(STORAGE_KEY_LPN);
            if (currentLpn && currentLpn !== lastKnownLpn) {
                lastKnownLpn = currentLpn;
                gravisWindow.postMessage({ type: 'SYNC_LPN', payload: currentLpn }, '*');
            }
        }, 250);
    }

    function stopWindowMonitor() {
        if (checkInterval) clearInterval(checkInterval);
        if (storageMonitorInterval) clearInterval(storageMonitorInterval);
        checkInterval = null;
        storageMonitorInterval = null;
    }

    // F8: Pre-checks for the input before waking up the Gravis tab
    document.addEventListener('keydown', async (e: KeyboardEvent) => {
        if (!active || !gravisWindow || gravisWindow.closed) return;
        
        if (e.key === 'F8') {
            e.preventDefault();
            
            // 1. Look for the ASIN input field on the Main Tab first (using a short timeout if supported, e.g., 500ms)
            const asinInput = await findInputByLabel(ITM_SCN_INPT_LBL);
            
            // 2. If no input is found, the page isn't ready for an ASIN. Abort the search.
            if (!asinInput) {
                return;
            }

            // 3. Input exists! Now trigger Gravis to find the ASIN.
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
        isActive: (): boolean => active
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
                // ASIN not found in Gravis: click the missing barcode button
                const noBarcodeBtn = await findButtonBySpan(CHS_ITM_LST_BTN_SPN) as HTMLButtonElement;
                if (noBarcodeBtn && !noBarcodeBtn.disabled) {
                    noBarcodeBtn.click();
                }
            } else {
                // ASIN found: we query the input again to ensure we have the fresh DOM element, then paste
                const asinInput = await findInputByLabel(ITM_SCN_INPT_LBL) as HTMLInputElement;
                if (asinInput) {
                    setNativeValue(asinInput, data.payload);
                    triggerEnter(asinInput);
                }
            }
        }
    });
}
