import { setNativeValue } from '@shared/dom';

if (!window.__refurbLpnLoaded) {
    window.__refurbLpnLoaded = true;
    
    let active: boolean = false;
    let isProcessing: boolean = false;

    // Dictionary for multi-language support (Ukrainian & Polish)
    const UI_STRINGS = {
        triggerBtn: ['Призначити новий LPN', 'Przypisz nowy LPN'],
        oldLpnInput: ['Введіть старий LPN', 'Wprowadź stary LPN'],
        newLpnInput: ['Введіть новий LPN', 'Wprowadź nowy LPN'],
        backBtn: ['Назад', 'Wstecz']
    };

    const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

    function generateRandomLPN(): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let res = 'LPN';
        for (let i = 0; i < 8; i++) {
            res += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return res;
    }

    function triggerEnter(el: HTMLElement): void {
        el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true, cancelable: true }));
        el.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true, cancelable: true }));
    }

    async function waitForElement(selector: string, timeout = 5000): Promise<HTMLElement | null> {
        const start = Date.now();
        while (Date.now() - start < timeout) {
            const el = document.querySelector(selector) as HTMLElement | null;
            if (el && el.offsetParent !== null) return el;
            await sleep(150);
        }
        return null;
    }

    async function waitForButtonBySpans(spanTexts: string[], timeout = 5000): Promise<HTMLElement | null> {
        const start = Date.now();
        while (Date.now() - start < timeout) {
            const spans = Array.from(document.querySelectorAll('button span, a span, div[role="button"] span'));
            const span = spans.find(s => {
                const text = s.textContent?.trim();
                return text && spanTexts.includes(text);
            });
            
            if (span) {
                const btn = span.closest('button, a, div[role="button"]') as HTMLElement;
                if (btn && btn.offsetParent !== null) return btn;
            }
            await sleep(150);
        }
        return null;
    }

    // Helper to build a multi-selector string (e.g., input[aria-label="X"], input[aria-label="Y"])
    function buildAriaSelector(labels: string[]): string {
        return labels.map(label => `input[aria-label="${label}"]`).join(', ');
    }

    async function executeSequence(): Promise<void> {
        if (isProcessing) return;
        isProcessing = true;

        try {
            // 1. Find and fill old LPN
            const oldLpnSelector = buildAriaSelector(UI_STRINGS.oldLpnInput);
            const oldLpnInput = await waitForElement(oldLpnSelector) as HTMLInputElement;
            if (!oldLpnInput) return; // Silent abort
            
            const randomLpn1 = generateRandomLPN();
            setNativeValue(oldLpnInput, randomLpn1);
            triggerEnter(oldLpnInput);

            // 2. Find and fill new LPN
            const newLpnSelector = buildAriaSelector(UI_STRINGS.newLpnInput);
            const newLpnInput = await waitForElement(newLpnSelector) as HTMLInputElement;
            if (!newLpnInput) return; 
            
            let randomLpn2 = generateRandomLPN();
            while (randomLpn2 === randomLpn1) randomLpn2 = generateRandomLPN();
            setNativeValue(newLpnInput, randomLpn2);
            triggerEnter(newLpnInput);

            // 3. Find Alert and Extract the 2nd LPN from the span
            const alertDiv = await waitForElement('div[id*="alert"]');
            if (!alertDiv) return;
            
            const spanEl = alertDiv.querySelector('span');
            if (!spanEl || !spanEl.textContent) return;

            const regex = /\[(LPN[a-zA-Z0-9]+)\]/g;
            const matches = Array.from(spanEl.textContent.matchAll(regex));
            if (matches.length < 2) return;
            
            const storedLpn = matches[1][1]; // Extract the alphanumeric string without brackets

            // 4. Click 'Назад' or 'Wstecz'
            const backBtn = await waitForButtonBySpans(UI_STRINGS.backBtn);
            if (!backBtn) return;
            backBtn.click();

            // 5. Wait for UI reset, find old LPN input again, and submit stored LPN
            await sleep(500); 
            const finalLpnInput = await waitForElement(oldLpnSelector) as HTMLInputElement;
            if (!finalLpnInput) return;
            
            setNativeValue(finalLpnInput, storedLpn);
            triggerEnter(finalLpnInput);

        } finally {
            // This guarantees the lock is ALWAYS released, even if we hit a silent return above
            isProcessing = false;
        }
    }

    document.addEventListener('click', (e: MouseEvent) => {
        if (!active) return;
        const target = e.target as HTMLElement;
        
        let isTrigger = false;
        const directText = target.textContent?.trim();
        const childText = target.querySelector('span')?.textContent?.trim();

        // Check if the clicked target (or its child span) matches any of our trigger strings
        if (target.tagName.toLowerCase() === 'span' && directText && UI_STRINGS.triggerBtn.includes(directText)) {
            isTrigger = true;
        } else if (childText && UI_STRINGS.triggerBtn.includes(childText)) {
            isTrigger = true;
        }

        if (isTrigger) {
            // Give the browser 100ms to process the native click event before launching our sequence
            setTimeout(executeSequence, 100); 
        }
    }, true);

    window.__refurbLpn = {
        enable: (): void => { active = true; },
        disable: (): void => { active = false; isProcessing = false; },
        isActive: (): boolean => active
    };
}
