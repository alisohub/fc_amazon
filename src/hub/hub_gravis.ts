import { setNativeValue, triggerEnter } from '@shared/dom';

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

// Helper for the Angular Dropdown
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

// 1. Listen for the LPN payload from the Main Tab
window.addEventListener('message', async (e: MessageEvent) => {
    if (e.source !== window.opener) return; 
    
    const data = e.data;
    
    if (data?.type === 'SYNC_LPN') {
        const lpn = data.payload;
        if (!lpn) return;

        // 2. Select EU from the dropdown
        await selectAngularDropdown('.mat-select-value', 'EU');
        
        // Give Angular a tiny moment to process the dropdown state
        await sleep(100);

        // 3. Find the input and paste the LPN
        const lpnInput = document.querySelector('input.mat-input-element') as HTMLInputElement;
        
        if (lpnInput) {
            setNativeValue(lpnInput, lpn);
            triggerEnter(lpnInput);
        }
    }
});

// Setup Ping to Main Tab
function sendMessageToMain(type: string, payload: any = null): void {
    if (window.opener) {
        window.opener.postMessage({ type, payload }, '*');
    }
}

sendMessageToMain('GRAVIS_READY');

window.addEventListener('beforeunload', () => {
    sendMessageToMain('GRAVIS_CLOSED');
});

// Dev Inspector Hook
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
