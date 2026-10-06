import { LPN_RSGN_BTN_SPN } from '@shared/constants';
import { isInsideModal } from '@shared/dom';
import { normalizeText } from '@shared/utils';

if (!window.__autoLpnLoaded) {
    window.__autoLpnLoaded = true;

    const IGNORED_PREFIXES: Set<string> = new Set(['t', 'w', 'c']);
    let cooldownUntil: number = 0;
    let active: boolean = false;

    // 3. Type the event as a standard Event
    const handleInput = (e: Event): void => {
        if (!active) return;

        // 4. Cast the generic target specifically to an HTML Input Element
        const input = e.target as HTMLInputElement;

        // Safely ignore if the input doesn't support matches (e.g., if it's a weird node)
        if (!input.matches) return;

        // IGNORE inputs coming from inside the Script Hub UI
        if (input.closest('#sh-root')) return;

        // Ignore non-text inputs, hidden inputs, disabled inputs, or inputs inside modals
        if (!input.matches('input:not([type="hidden"]):not([disabled])') || isInsideModal(input)) return;

        const now: number = Date.now();
        if (now < cooldownUntil) return;

        const cleanValue: string = normalizeText(input.value);
        if (!cleanValue) return;

        // 5. Cast the found element to HTMLElement so TypeScript knows it has a .click() method
        const btn = Array.from(document.querySelectorAll('button, a, div[role="button"]')).find(el => {
            const htmlEl = el as HTMLElement;
            const btnEl = el as HTMLButtonElement; // specifically for the .disabled check
            
            if (btnEl.disabled || htmlEl.offsetParent === null || !htmlEl.textContent) return false;
            
            const text: string = normalizeText(htmlEl.textContent);
            return LPN_RSGN_BTN_SPN.some(target => text.includes(target));
        }) as HTMLElement | undefined;

        if (!btn) return;
        cooldownUntil = now + 10000;

        if (!IGNORED_PREFIXES.has(cleanValue.charAt(0))) {
            btn.click();
        }
    };

    document.addEventListener('input', handleInput, true);

    window.__autoLpn = {
        enable: (): void => { active = true; },
        disable: (): void => { active = false; },
        isActive: (): boolean => active
    };
}
