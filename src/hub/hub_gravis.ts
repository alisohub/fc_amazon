import { READY_STATE } from '@shared/constants';
import { setNativeValue, triggerEnter, sleep, showInitializationToast } from '@shared/dom';

const STRICT_ASIN_REGEX = /^([B0-9][A-Z0-9]{9})$/i;
let debugEnabled = false;
let currentReadyState = READY_STATE.NOT_STARTED;

function gLog(...args: any[]): void {
    if (!debugEnabled) return;
    console.log('%c[SH:gravis-tab]', 'color: #1a73e8; font-weight: bold;', ...args);
}

async function selectAngularDropdown(triggerSelector: string, exactOptionText: string): Promise<boolean> {
    const dropdown = document.querySelector(triggerSelector) as HTMLElement;
    if (!dropdown) return false;
    dropdown.click();
    await sleep(25);
    const options = Array.from(document.querySelectorAll('mat-option'));
    const targetOption = options.find(opt => {
        const text = (opt.textContent || '').trim().toLowerCase();
        return text === exactOptionText.toLowerCase();
    }) as HTMLElement | undefined;

    if (targetOption) {
        targetOption.click();
        return true;
    } else {
        dropdown.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        return false;
    }
}

function sendMessageToMain(type: string, payload: any = null): void {
    if (window.opener) {
        window.opener.postMessage({ type, payload }, '*');
    }
}
export function initGravis() {
    if (window.__gravisHubLoaded) {
        showInitializationToast('Gravis Automation', 'Скрипт вже був запущений');
    } else {
        window.__gravisHubLoaded = true;
        let storedAsin: string | null = null;
        let currentLpn: string = '';

        function handleParsedPayload(rawText: string | object | null): void {
            if (!rawText) {
                currentReadyState = READY_STATE.NOT_FOUND;
                return;
            }

            let responseBody: any = rawText;
            if (typeof rawText === 'string') {
                const trimmed = rawText.trim();
                if (!trimmed.startsWith('[') && !trimmed.startsWith('{')) {
                    currentReadyState = READY_STATE.NOT_FOUND;
                    return;
                }
                try {
                    responseBody = JSON.parse(trimmed);
                } catch {
                    currentReadyState = READY_STATE.NOT_FOUND;
                    return;
                }
            }

            if (Array.isArray(responseBody) && responseBody.length > 0) {
                const item = responseBody[0];
                const unitId = item?.returnUnitId;
                const asin = item?.returnUnitProductAttributes?.asin;

                gLog('Parsed array payload:', { unitId, asin, currentLpn });

                if (!unitId || !asin) {
                    currentReadyState = READY_STATE.NOT_FOUND;
                    return;
                }

                const isAsinValid = STRICT_ASIN_REGEX.test(asin);
                const isLpnMatching = !currentLpn || unitId.toLowerCase() === currentLpn;

                if (isLpnMatching && isAsinValid) {
                    storedAsin = asin.toUpperCase();
                    gLog('Stored valid ASIN:', storedAsin);
                } else {
                    currentReadyState = READY_STATE.NOT_FOUND;
                }
            } else {
                // Empty array [] or no return unit data found for this LPN
                currentReadyState = READY_STATE.NOT_FOUND;
            }
        }

        const originalOpen = XMLHttpRequest.prototype.open;
        const originalSend = XMLHttpRequest.prototype.send;

        XMLHttpRequest.prototype.open = function(method: string, url: string | URL, ...rest: any[]) {
            (this as any).__targetUrl = String(url);
            return (originalOpen as any).call(this, method, url, ...rest);
        };

        XMLHttpRequest.prototype.send = function(body?: Document | XMLHttpRequestBodyInit | null) {
            const targetUrl = String((this as any).__targetUrl || '');
            const lowerUrl = targetUrl.toLowerCase();

            // Only track XHRs that are actually calling getReturnUnitData
            const isReturnUnitReq = lowerUrl.includes('getreturnunitdata');

            if (isReturnUnitReq) {
                // As soon as the request is sent, mark state as IN_PROGRESS
                if (!currentLpn || lowerUrl.includes(currentLpn) || lowerUrl.includes(encodeURIComponent(currentLpn))) {
                    currentReadyState = READY_STATE.IN_PROGRESS;
                    gLog('getReturnUnitData request started -> IN_PROGRESS');
                }
            }

            this.addEventListener('readystatechange', function () {
                if (!isReturnUnitReq) return; // Ignore unrelated background XHRs!

                if (this.readyState === 4) {
                    try {
                        if (!currentLpn || lowerUrl.includes(currentLpn) || lowerUrl.includes(encodeURIComponent(currentLpn))) {
                            const raw = (this.responseType === '' || this.responseType === 'text')
                                ? this.responseText
                                : this.response;
                            handleParsedPayload(raw);
                        } else {
                            gLog('TargetUrl LPN mismatch -> NOT_FOUND', { lowerUrl, currentLpn });
                            currentReadyState = READY_STATE.NOT_FOUND;
                        }
                    } catch {
                        currentReadyState = READY_STATE.NOT_FOUND;
                    }
                }
            });

            return originalSend.call(this, body);
        };

        window.addEventListener('message', async (e: MessageEvent) => {
            if (e.source !== window.opener) return;
            const data = e.data;

            if (data?.type === 'SET_DEBUG') {
                debugEnabled = Boolean(data.payload);
                gLog('Debug mode enabled for Gravis tab');
            } else if (data?.type === 'SYNC_LPN') {
                const lpn = data.payload;
                if (!lpn) return;

                // Reset state for the new LPN and mark as IN_PROGRESS while dropdown & input run
                storedAsin = null;
                currentLpn = lpn.trim().toLowerCase();
                currentReadyState = READY_STATE.IN_PROGRESS;
                gLog('SYNC_LPN received:', currentLpn);

                await selectAngularDropdown('.mat-select-value', 'EU');
                const lpnInput = document.querySelector('input.mat-input-element') as HTMLInputElement;
                if (lpnInput) {
                    setNativeValue(lpnInput, lpn);
                    triggerEnter(lpnInput);
                } else {
                    currentReadyState = READY_STATE.NOT_FOUND;
                }
            } else if (data?.type === 'TRIGGER_ASIN_SEARCH') {
                gLog('TRIGGER_ASIN_SEARCH received:', { storedAsin, currentReadyState });
                if (storedAsin) {
                    const asinToSend = storedAsin;
                    storedAsin = null;
                    currentReadyState = READY_STATE.NOT_FOUND;
                    sendMessageToMain('FOUND_ASIN', asinToSend);
                } else {
                    sendMessageToMain('FOUND_ASIN', currentReadyState);
                }
            }
        });

        showInitializationToast('Gravis Automation', 'v1.0.5 Успішно запущений');
        sendMessageToMain('GRAVIS_READY');
        window.addEventListener('beforeunload', () => {
            sendMessageToMain('GRAVIS_CLOSED');
        });
    }
}
