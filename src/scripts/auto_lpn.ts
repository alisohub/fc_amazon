import { LPN_RSGN_BTN_SPN } from '@shared/constants';
import { isInsideModal, hasTargetLabel } from '@shared/dom'; // Removed findButtonBySpan from imports
import { normalizeText } from '@shared/utils';
// TODO: add toteid finder alternative
if (!window.__autoLpnLoaded) {
    window.__autoLpnLoaded = true;

    const IGNORED_PREFIXES: Set<string> = new Set(['t', 'w', 'c']);
    let cooldownUntil: number = 0;
    let active: boolean = false;

    const handleInput = (e: Event): void => {
        if (!active) return;

        const input = e.target as HTMLInputElement;
        if (!input.matches) return;
        if (input.closest('#sh-root')) return;
        if (!input.matches('input:not([type="hidden"]):not([disabled])') || isInsideModal(input)) return;

        const inputLabel = input.getAttribute('aria-label');
        if (!hasTargetLabel(inputLabel)) return;

        const now: number = Date.now();
        if (now < cooldownUntil) return;

        const cleanValue: string = normalizeText(input.value);
        if (!cleanValue) return;

        const lpn_reassign_btn = Array.from(document.querySelectorAll('button, a, div[role="button"]')).find(el => {
            const htmlEl = el as HTMLElement;
            const btnEl = el as HTMLButtonElement; 
            if (btnEl.disabled || htmlEl.offsetParent === null || !htmlEl.textContent) return false;
            
            const text = normalizeText(htmlEl.textContent);

            const targets = LPN_RSGN_BTN_SPN.map(t => normalizeText(t));
            return targets.some(target => text.includes(target));
        }) as HTMLButtonElement | undefined;

        if (!lpn_reassign_btn) return;

        cooldownUntil = now + 10000;

        if (!IGNORED_PREFIXES.has(cleanValue.charAt(0))) {
            lpn_reassign_btn.click();
        }
    };

    document.addEventListener('input', handleInput, true);

    window.__autoLpn = {
        enable: (): void => { active = true; },
        disable: (): void => { active = false; },
        isActive: (): boolean => active
    };
}

