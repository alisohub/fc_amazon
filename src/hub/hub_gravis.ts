import { setNativeValue, triggerEnter, sleep } from '@shared/dom';

async function selectAngularDropdown(triggerSelector: string, exactOptionText: string): Promise<boolean> {
    const dropdown = document.querySelector(triggerSelector) as HTMLElement;
    if (!dropdown) return false;
    
    dropdown.click();
    await sleep(200);
    
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

// Timeout reduced to 2000ms (2 seconds)
async function waitForAsin(timeoutMs = 2000): Promise<string | null> {
    const start = Date.now();
    const strictAsinRegex = /^([B0-9][A-Z0-9]{9})$/; 

    while (Date.now() - start < timeoutMs) {
        const links = Array.from(document.querySelectorAll('a'));
        
        for (const link of links) {
            const text = (link.textContent || '').trim().toUpperCase();
            const match = text.match(strictAsinRegex);
            if (match) {
                return match[1];
            }
            
            const href = link.href || '';
            const hrefMatch = href.match(/\/(?:dp|product)\/([B0-9][A-Z0-9]{9})/i);
            if (hrefMatch) {
                return hrefMatch[1].toUpperCase();
            }
        }
        await sleep(250); 
    }
    return null;
}

function sendMessageToMain(type: string, payload: any = null): void {
    if (window.opener) {
        window.opener.postMessage({ type, payload }, '*');
    }
}

window.addEventListener('message', async (e: MessageEvent) => {
    if (e.source !== window.opener) return; 
    const data = e.data;
    
    if (data?.type === 'SYNC_LPN') {
        const lpn = data.payload;
        if (!lpn) return;

        // 1. Select EU
        await selectAngularDropdown('.mat-select-value', 'EU');
        await sleep(100);

        // 2. Paste the LPN and hit Enter
        const lpnInput = document.querySelector('input.mat-input-element') as HTMLInputElement;
        if (lpnInput) {
            setNativeValue(lpnInput, lpn);
            triggerEnter(lpnInput);
        }
    } 
    
    // Triggered independently when F8 is pressed
    else if (data?.type === 'TRIGGER_ASIN_SEARCH') {
        const asin = await waitForAsin(2000); 
        
        if (asin) {
            sendMessageToMain('FOUND_ASIN', asin);
        } else {
            sendMessageToMain('FOUND_ASIN', 'NOT_FOUND');
        }
    }
});

sendMessageToMain('GRAVIS_READY');

window.addEventListener('beforeunload', () => {
    sendMessageToMain('GRAVIS_CLOSED');
});

document.addEventListener('keydown', async (e: KeyboardEvent) => {
    if (e.key === 'F10') {
        e.preventDefault();
        if (!window.__devInspectorLoaded) {
            try {
                const branch = window.__SH_BRANCH || 'main';
                const url = branch === 'local' 
                    ? 'http://localhost:3000/dist/dev_inspector.js'
                    : `https://raw.githubusercontent.com/alisohub/fc_amazon/refs/heads/${branch}/dist/dev_inspector.js`;
                const response = await fetch(url);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const code = await response.text();
                const script = document.createElement('script');
                script.textContent = code;
                document.head.appendChild(script);
            } catch (err) {
                alert(`⚠️ Failed to load dev: ${err}`);
                return;
            }
        }
        if (window.__devInspector) {
            if (window.__devInspector.isActive()) {
                window.__devInspector.disable();
            } else {
                window.__devInspector.enable();
            }
        }
    }
});
