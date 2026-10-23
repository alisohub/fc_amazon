import { CHS_ITM_LST_BTN_TSTID, ITM_SCN_INPT_TSTID, READY_STATE, STORAGE_KEY_LPN } from '@shared/constants';
import { setNativeValue, triggerEnter, findInputByTestId, findButtonByTestId } from '@shared/dom';
import { debugLog, isDebugEnabled } from '@shared/utils';

if (!window.__gravisLoaded) {
    window.__gravisLoaded = true;
    let active: boolean = false;
    let gravisWindow: Window | null = null;
    let checkInterval: ReturnType<typeof setInterval> | null = null;
    let pollRetries: number = 0;
    const MAX_POLL_RETRIES = 4; // ~3 seconds max wait

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

    function clickChooseFromList(): void {
        const noBarcodeBtn = findButtonByTestId(CHS_ITM_LST_BTN_TSTID) as HTMLButtonElement;
        if (noBarcodeBtn && !noBarcodeBtn.disabled) {
            debugLog('gravis', 'Clicking Choose Item From List button');
            noBarcodeBtn.click();
        }
    }

    // Use capture phase (true) so we can intercept LPN scans into the item input BEFORE Socrates submits them
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
            pollRetries = 0;
            gravisWindow.postMessage({ type: 'TRIGGER_ASIN_SEARCH' }, '*');
            return;
        }

        if (e.key !== 'Enter') return;

        const input = e.target as HTMLInputElement;
        if (!input || !input.matches('input')) return;

        const val = input.value?.trim();
        if (!val) return;

        const currentTestId = (input.getAttribute('data-testid') || '').toLowerCase();
        try {
            const isItemScanInput = currentTestId.includes(ITM_SCN_INPT_TSTID.toLowerCase());
            const savedLpn = localStorage.getItem(STORAGE_KEY_LPN);

            if (isItemScanInput && savedLpn && savedLpn.toLowerCase() === val.toLowerCase()) {
                e.preventDefault();
                e.stopPropagation();
                setNativeValue(input, '');

                debugLog('gravis', 'LPN scanned in item input! Requesting ASIN from Gravis tab');
                pollRetries = 0;
                gravisWindow.postMessage({ type: 'TRIGGER_ASIN_SEARCH' }, '*');
            }
        } catch (err) {
            debugLog('gravis', 'Error handling LPN keydown:', err);
        }
    }, true);

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
            debugLog('gravis', `Received FOUND_ASIN payload: ${data.payload} (retry #${pollRetries})`);

            if (data.payload === READY_STATE.NOT_FOUND) {
                pollRetries = 0;
                clickChooseFromList();
            } else if (data.payload === READY_STATE.NOT_STARTED || data.payload === READY_STATE.IN_PROGRESS) {
                pollRetries++;
                if (pollRetries > MAX_POLL_RETRIES) {
                    debugLog('gravis', 'Max poll retries reached, falling back to Choose Item From List');
                    pollRetries = 0;
                    clickChooseFromList();
                    return;
                }
                const delay = data.payload === READY_STATE.IN_PROGRESS ? 250 : 400;
                setTimeout(() => {
                    if (!active || !gravisWindow || gravisWindow.closed) return;
                    gravisWindow.postMessage({ type: 'TRIGGER_ASIN_SEARCH' }, '*');
                }, delay);
            } else {
                pollRetries = 0;
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
