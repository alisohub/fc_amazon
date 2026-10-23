import { setNativeValue, triggerEnter, sleep, showInitializationToast } from '@shared/dom';

const STRICT_ASIN_REGEX = /^([B0-9][A-Z0-9]{9})$/i;
let debugEnabled = false;

function gLog(...args: any[]): void {
    if (!debugEnabled) return;
    console.log('%c[SH:gravis-tab]', 'color: #1a73e8; font-weight: bold;', ...args);
}

async function selectAngularDropdown(triggerSelector: string, exactOptionText: string): Promise<boolean> {
    const dropdown = document.querySelector(triggerSelector) as HTMLElement;
    if (!dropdown) return false;
    
    dropdown.click();
    await sleep(100);
    
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

if (window.__gravisHubLoaded) {
    showInitializationToast('Gravis Automation', 'Скрипт вже був запущений');
} else {
    window.__gravisHubLoaded = true;
    let storedAsin: string | null = null;
    let currentLpn: string = '';

    function handleParsedPayload(rawText: string | object | null): void {
        if (!rawText) return;

        let responseBody: any = rawText;
        if (typeof rawText === 'string') {
            const trimmed = rawText.trim();
            if (!trimmed.startsWith('[') && !trimmed.startsWith('{')) return;
            try {
                responseBody = JSON.parse(trimmed);
            } catch {
                return;
            }
        }

        if (Array.isArray(responseBody) && responseBody.length > 0) {
            const item = responseBody[0];
            const unitId = item?.returnUnitId;
            const asin = item?.returnUnitProductAttributes?.asin;

            gLog('Parsed array payload:', { unitId, asin, currentLpn });
            if (!unitId || !asin) return;

            const isAsinValid = STRICT_ASIN_REGEX.test(asin);
            const isLpnMatching = !currentLpn || unitId.toLowerCase() === currentLpn;

            if (isLpnMatching && isAsinValid) {
                storedAsin = asin.toUpperCase();
                gLog('Stored valid ASIN:', storedAsin);
            }
        }
    }

    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.send = function(body?: Document | XMLHttpRequestBodyInit | null) {
        this.addEventListener('readystatechange', function () {
            if (this.readyState === 4) {
                try {
                    const raw = (this.responseType === '' || this.responseType === 'text')
                        ? this.responseText
                        : this.response;
                    handleParsedPayload(raw);
                } catch {}
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

            storedAsin = null;
            currentLpn = lpn.trim().toLowerCase();
            gLog('SYNC_LPN received:', currentLpn);

            await selectAngularDropdown('.mat-select-value', 'EU');
            await sleep(50);

            const lpnInput = document.querySelector('input.mat-input-element') as HTMLInputElement;
            if (lpnInput) {
                setNativeValue(lpnInput, lpn);
                triggerEnter(lpnInput);
            }
        } else if (data?.type === 'TRIGGER_ASIN_SEARCH') {
            gLog('TRIGGER_ASIN_SEARCH received, storedAsin:', storedAsin);
            if (storedAsin) {
                const asinToSend = storedAsin;
                storedAsin = null;
                sendMessageToMain('FOUND_ASIN', asinToSend);
            } else {
                sendMessageToMain('FOUND_ASIN', 'NOT_FOUND');
            }
        }
    });

    showInitializationToast('Gravis Automation', 'v1.0.5 Успішно запущений');
    sendMessageToMain('GRAVIS_READY');

    window.addEventListener('beforeunload', () => {
        sendMessageToMain('GRAVIS_CLOSED');
    });
}
