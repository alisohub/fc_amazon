import { setNativeValue, triggerEnter, sleep } from '@shared/dom';

function showInitializationToast(scriptName: string, message: string): void {
    if (document.getElementById('sh-script-toast')) return;

    const toast = document.createElement('div');
    toast.id = 'sh-script-toast';
    
    toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background-color: #323232; /* Material Snackbar default dark */
        color: rgba(255, 255, 255, 0.87);
        padding: 14px 16px;
        border-radius: 4px;
        box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2), 
                    0px 6px 10px 0px rgba(0, 0, 0, 0.14), 
                    0px 1px 18px 0px rgba(0, 0, 0, 0.12); /* Material Elevation 6 */
        font-family: Roboto, "Helvetica Neue", sans-serif;
        z-index: 999999;
        opacity: 0;
        transform: scale(0.95);
        transition: opacity 150ms cubic-bezier(0, 0, 0.2, 1), transform 150ms cubic-bezier(0, 0, 0.2, 1);
        pointer-events: none;
        display: flex;
        flex-direction: column;
        gap: 4px;
        min-width: 250px;
    `;

    toast.innerHTML = `
        <div style="font-size: 14px; font-weight: 500;">${scriptName}</div>
        <div style="font-size: 12px; color: rgba(255, 255, 255, 0.6);">${message}</div>
    `;

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'scale(1)';
    });

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'scale(0.95)';
        setTimeout(() => toast.remove(), 150); 
    }, 3500);
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

async function waitForAsin(timeoutMs = 1000): Promise<string | null> {
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

function scrubStaleAsins(): void {
    const strictAsinRegex = /^([B0-9][A-Z0-9]{9})$/; 
    const links = Array.from(document.querySelectorAll('a'));
    
    for (const link of links) {
        const text = (link.textContent || '').trim().toUpperCase();
        const href = link.href || '';
        
        // If the link text or URL contains an ASIN, nuke it
        if (text.match(strictAsinRegex) || href.match(/\/(?:dp|product)\/([B0-9][A-Z0-9]{9})/i)) {
            link.textContent = 'Not Available';
            link.removeAttribute('href');
        }
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

    window.addEventListener('message', async (e: MessageEvent) => {
        if (e.source !== window.opener) return; 
        const data = e.data;
        
        if (data?.type === 'SYNC_LPN') {
            const lpn = data.payload;
            if (!lpn) return;

            scrubStaleAsins();

            // 1. Select EU
            await selectAngularDropdown('.mat-select-value', 'EU');
            await sleep(50);

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

    showInitializationToast('Gravis Automation', 'v1.0.0 Успішно запущений');
    sendMessageToMain('GRAVIS_READY');

    window.addEventListener('beforeunload', () => {
        sendMessageToMain('GRAVIS_CLOSED');
    });
}
