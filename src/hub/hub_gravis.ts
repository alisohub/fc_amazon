import { setNativeValue, triggerEnter } from '@shared/dom';

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

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

// NEW: This will poll the page for up to 6 seconds waiting for the ASIN to load
async function waitForAsin(timeoutMs = 6000): Promise<string | null> {
    const start = Date.now();
    // Using ^ and $ ensures we only match if the string is EXACTLY the 10-character ASIN and nothing else
    const strictAsinRegex = /^([B0-9][A-Z0-9]{9})$/; 

    while (Date.now() - start < timeoutMs) {
        // Since you noticed it's an anchor, we just grab all links on the page
        const links = Array.from(document.querySelectorAll('a'));
        
        for (const link of links) {
            const text = (link.textContent || '').trim().toUpperCase();
            
            // 1. Check if the text of the link itself is an ASIN
            const match = text.match(strictAsinRegex);
            if (match) {
                return match[1];
            }
            
            // 2. Fallback: Sometimes the link text is an icon or empty, 
            // but the URL (href) contains the ASIN (e.g., amazon.com/dp/B012345678)
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

        // 3. WAIT for the server to load the item data, then extract the ASIN
        const asin = await waitForAsin(6000); 
        
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
