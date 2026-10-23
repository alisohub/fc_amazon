import { LPN_RSGN_BTN_TSTID } from '@shared/constants';
import { isInsideModal, hasTargetLabel, findButtonByTestId } from '@shared/dom'; 
import { normalizeText, debugLog } from '@shared/utils';

if (!window.__autoLpnLoaded) {
    window.__autoLpnLoaded = true;

    const IGNORED_PREFIXES: Set<string> = new Set(['t', 'w', 'c']);
    let cooldownUntil: number = 0;
    let active: boolean = false;

    const handleInput = (e: Event): void => {
        if (!active) return;

        const input = e.target as HTMLInputElement;
        if (!input.matches || input.closest('#sh-root')) return;
        if (!input.matches('input:not([type="hidden"]):not([disabled])') || isInsideModal(input)) return;

        const inputLabel = input.getAttribute('aria-label');
        if (!hasTargetLabel(inputLabel)) return;

        const now: number = Date.now();
        if (now < cooldownUntil) {
            debugLog('auto-lpn', `Cooldown active (${cooldownUntil - now}ms remaining)`);
            return;
        }

        const cleanValue: string = normalizeText(input.value);
        if (!cleanValue) return;

        const lpn_reassign_btn = findButtonByTestId(LPN_RSGN_BTN_TSTID) as HTMLButtonElement;
        if (!lpn_reassign_btn || lpn_reassign_btn.disabled) {
            debugLog('auto-lpn', 'Reassign LPN button not found or disabled');
            return;
        }

        cooldownUntil = now + 10000;

        if (!IGNORED_PREFIXES.has(cleanValue.charAt(0))) {
            debugLog('auto-lpn', `Non-tote prefix scanned ("${cleanValue}"), clicking Reassign LPN button`);
            lpn_reassign_btn.click();
        } else {
            debugLog('auto-lpn', `Tote prefix detected ("${cleanValue}"), ignoring`);
        }
    };

    document.addEventListener('input', handleInput, true);

    window.__autoLpn = {
        enable: (): void => { active = true; debugLog('auto-lpn', 'Enabled'); },
        disable: (): void => { active = false; debugLog('auto-lpn', 'Disabled'); },
        isActive: (): boolean => active
    };
}
