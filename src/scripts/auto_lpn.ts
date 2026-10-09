import { LPN_RSGN_BTN_SPN } from '@shared/constants';
import { isInsideModal, hasTargetLabel, findButtonBySpan } from '@shared/dom'; 
import { normalizeText } from '@shared/utils';

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

        const lpn_reassign_btn = findButtonBySpan(LPN_RSGN_BTN_SPN) as HTMLButtonElement;

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

