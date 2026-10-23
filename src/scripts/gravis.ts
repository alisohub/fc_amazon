import { CHS_ITM_LST_BTN_TSTID, ITM_SCN_INPT_TSTID } from '@shared/constants';
import { setNativeValue, triggerEnter, findInputByTestId, findButtonByTestId } from '@shared/dom';
import { debugLog, isDebugEnabled } from '@shared/utils';

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
        debugLog('gravis', 'Gravis tab disconnected/closed');
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

    document.addEventListener('keydown', async (e: KeyboardEvent) => {
        if (!active || !gravisWindow || gravisWindow.closed) return;
        
        if (e.key === 'F8') {
            e.preventDefault();
            
            const asinInput = findInputByTestId(ITM_SCN_INPT_TSTID);
            if (!asinInput) {
                debugLog('gravis', 'F8 pressed, but item scan input is not on screen');
                return;
            }
            debugLog('gravis', 'F8 pressed, requesting ASIN from Gravis tab');
            gravisWindow.postMessage({ type: 'TRIGGER_ASIN_SEARCH' }, '*');
        }
    });

    window.__gravis = {
        enable: (): void => {
            active = true;
            debugLog('gravis', 'Enabled');
            if (!gravisWindow || gravisWindow.closed) {
                gravisWindow = window.open('https://eu-cretfc-tools-dub.dub.proxy.amazon.com/gravis', 'GravisApp');
            }
            startWindowMonitor();
        },
        disable: (): void => {
            active = false;
            debugLog('gravis', 'Disabled');
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
                debugLog('gravis', `Sending SYNC_LPN to Gravis tab: ${lpn}`);
                gravisWindow.postMessage({ type: 'SYNC_LPN', payload: lpn }, '*');
            }
        },
        setDebug: (enabled: boolean): void => {
            if (gravisWindow && !gravisWindow.closed) {
                gravisWindow.postMessage({ type: 'SET_DEBUG', payload: enabled }, '*');
            }
        }
    };

    window.addEventListener('message', async (e: MessageEvent) => {
        const data = e.data;
        
        if (data?.type === 'GRAVIS_READY') {
            debugLog('gravis', 'Received GRAVIS_READY from Gravis tab');
            active = true;
            syncHubUI(true);
            if (!gravisWindow) {
                gravisWindow = e.source as Window;
                startWindowMonitor();
            }
            gravisWindow?.postMessage({ type: 'SET_DEBUG', payload: isDebugEnabled('gravis') }, '*');
        } else if (data?.type === 'GRAVIS_CLOSED') {
            handleGravisDisconnect();
        } else if (data?.type === 'FOUND_ASIN') {
            debugLog('gravis', `Received FOUND_ASIN payload: ${data.payload}`);
            if (data.payload === 'NOT_FOUND') {
                const noBarcodeBtn = findButtonByTestId(CHS_ITM_LST_BTN_TSTID) as HTMLButtonElement;
                if (noBarcodeBtn && !noBarcodeBtn.disabled) {
                    debugLog('gravis', 'Clicking Choose Item From List button');
                    noBarcodeBtn.click();
                }
            } else {
                const asinInput = findInputByTestId(ITM_SCN_INPT_TSTID) as HTMLInputElement;
                if (asinInput) {
                    debugLog('gravis', `Filling ASIN input with: ${data.payload}`);
                    setNativeValue(asinInput, data.payload);
                    triggerEnter(asinInput);
                }
            }
        }
    });
}
