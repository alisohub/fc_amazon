import { LPN_RSGN_BTN_SPN } from '@shared/constants';
import { findButtonBySpan, isInsideModal } from '@shared/dom';
import { normalizeText } from '@shared/utils';

if (!window.__autoLpnLoaded) {
    window.__autoLpnLoaded = true;

    const IGNORED_PREFIXES: Set<string> = new Set(['t', 'w', 'c']);
    let cooldownUntil: number = 0;
    let active: boolean = false;

    // 3. Type the event as a standard Event
    const handleInput = async (e: Event): Promise<void> => {
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

        const lpn_reassign_btn = await findButtonBySpan(LPN_RSGN_BTN_SPN) as HTMLButtonElement;

        if (!lpn_reassign_btn || lpn_reassign_btn.disabled) return;
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
