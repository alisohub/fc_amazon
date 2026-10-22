import { setNativeValue, triggerEnter, sleep, showInitializationToast } from '@shared/dom';

const STRICT_ASIN_REGEX = /^([B0-9][A-Z0-9]{9})$/i;
const MAX_REQUESTS_TO_WATCH = 6;
const WATCH_TIMEOUT_MS = 4000;

interface LpnWatchState {
    targetLpn: string;
    isWatching: boolean;
    remainingRequests: number;
    result: string;
    promise: Promise<string>;
    resolve: ((value: string) => void) | null;
    timeoutId: ReturnType<typeof setTimeout> | null;
}

const watchState: LpnWatchState = {
    targetLpn: '',
    isWatching: false,
    remainingRequests: 0,
    result: 'NOT_FOUND',
    promise: Promise.resolve('NOT_FOUND'),
    resolve: null,
    timeoutId: null
};

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

/**
 * Recursively searches a parsed JSON response for an "asin" field
 * and validates its value against STRICT_ASIN_REGEX.
 */
function findValidAsinInPayload(data: unknown): string | null {
    if (!data || typeof data !== 'object') return null;

    if (Array.isArray(data)) {
        for (const item of data) {
            const found = findValidAsinInPayload(item);
            if (found) return found;
        }
        return null;
    }

    const record = data as Record<string, unknown>;

    // 1. Check direct keys on the current object first
    for (const [key, value] of Object.entries(record)) {
        if (key.toLowerCase() === 'asin') {
            if (typeof value === 'string') {
                const cleaned = value.trim().toUpperCase();
                if (STRICT_ASIN_REGEX.test(cleaned)) {
                    return cleaned;
                }
            }
        }
    }

    // 2. Recurse into nested objects/arrays
    for (const value of Object.values(record)) {
        if (value && typeof value === 'object') {
            const found = findValidAsinInPayload(value);
            if (found) return found;
        }
    }

    return null;
}

function finishWatch(finalResult: string): void {
    watchState.isWatching = false;
    watchState.remainingRequests = 0;
    watchState.result = finalResult;

    if (watchState.timeoutId) {
        clearTimeout(watchState.timeoutId);
        watchState.timeoutId = null;
    }

    if (watchState.resolve) {
        const resolveFn = watchState.resolve;
        watchState.resolve = null;
        resolveFn(finalResult);
    }
}

function startLpnRequestWatch(lpn: string): void {
    // Cancel any previous pending watch before starting a fresh one
    finishWatch('NOT_FOUND');

    watchState.targetLpn = lpn.trim().toLowerCase();
    watchState.isWatching = true;
    watchState.remainingRequests = MAX_REQUESTS_TO_WATCH;
    watchState.result = 'NOT_FOUND';

    watchState.promise = new Promise<string>((resolve) => {
        watchState.resolve = resolve;
    });

    watchState.timeoutId = setTimeout(() => {
        if (watchState.isWatching) {
            finishWatch('NOT_FOUND');
        }
    }, WATCH_TIMEOUT_MS);
}

function handleInterceptedResponse(url: string, rawBody: unknown): void {
    if (!watchState.isWatching || !watchState.targetLpn) return;

    watchState.remainingRequests--;

    const lowerUrl = url.toLowerCase();
    const target = watchState.targetLpn;
    const encodedTarget = encodeURIComponent(target);

    // Matches if the endpoint URL contains the specific LPN (e.g. /items/LPNRR12345 or ?query=LPNRR12345)
    if (lowerUrl.includes(target) || lowerUrl.includes(encodedTarget)) {
        let parsedBody: unknown = rawBody;
        if (typeof rawBody === 'string') {
            try {
                parsedBody = JSON.parse(rawBody);
            } catch {
                parsedBody = null;
            }
        }

        const matchedAsin = findValidAsinInPayload(parsedBody);
        finishWatch(matchedAsin ?? 'NOT_FOUND');
        return;
    }

    // Exhausted the allowed number of requests without seeing the target LPN request
    if (watchState.remainingRequests <= 0) {
        finishWatch('NOT_FOUND');
    }
}

function installNetworkInterceptors(): void {
    // 1. Intercept XMLHttpRequest (used by Angular HttpClient)
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (method: string, url: string | URL, ...rest: any[]) {
        (this as any).__shTargetUrl = String(url);
        return (originalOpen as any).call(this, method, url, ...rest);
    };

    XMLHttpRequest.prototype.send = function (body?: Document | XMLHttpRequestBodyInit | null) {
        this.addEventListener('loadend', function () {
            if (!watchState.isWatching) return;
            const targetUrl = (this as any).__shTargetUrl || '';
            handleInterceptedResponse(targetUrl, this.response);
        });
        return originalSend.call(this, body);
    };

    // 2. Intercept window.fetch (fallback in case fetch is used)
    const originalFetch = window.fetch;
    window.fetch = async function (...args: Parameters<typeof fetch>): Promise<Response> {
        const response = await originalFetch.apply(this, args);

        if (watchState.isWatching) {
            const reqInput = args[0];
            const targetUrl = typeof reqInput === 'string'
                ? reqInput
                : reqInput instanceof URL
                    ? reqInput.href
                    : reqInput?.url || '';

            response.clone().text().then(text => {
                handleInterceptedResponse(targetUrl, text);
            }).catch(() => {
                handleInterceptedResponse(targetUrl, null);
            });
        }

        return response;
    };
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
    installNetworkInterceptors();

    window.addEventListener('message', async (e: MessageEvent) => {
        if (e.source !== window.opener) return; 

        const data = e.data;
        
        if (data?.type === 'SYNC_LPN') {
            const lpn = data.payload;
            if (!lpn) return;

            // 1. Select EU
            await selectAngularDropdown('.mat-select-value', 'EU');
            await sleep(50);

            // 2. Paste the LPN, hit Enter, and fire up the state-driven request watcher
            const lpnInput = document.querySelector('input.mat-input-element') as HTMLInputElement;
            if (lpnInput) {
                setNativeValue(lpnInput, lpn);
                triggerEnter(lpnInput);
                startLpnRequestWatch(lpn);
            }
        } 
        
        // Triggered when F8 is pressed in the main window
        else if (data?.type === 'TRIGGER_ASIN_SEARCH') {
            const result = watchState.isWatching
                ? await watchState.promise
                : watchState.result;

            sendMessageToMain('FOUND_ASIN', result);
        }
    });

    showInitializationToast('Gravis Automation', 'v1.0.5 Успішно запущений');
    sendMessageToMain('GRAVIS_READY');

    window.addEventListener('beforeunload', () => {
        sendMessageToMain('GRAVIS_CLOSED');
    });
}
