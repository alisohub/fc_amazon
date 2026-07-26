(() => {
    if (window.__autoLpnLoaded) return;
    window.__autoLpnLoaded = true;
         
    const TARGET_TEXTS = ['перепризначте lpn', 'przypisz ponownie lpn'];
    const IGNORED_PREFIXES = new Set(['t', '1', '0', '2']);

    // Default 10-second cooldown
    const COOLDOWN_MS = 10000;
    let cooldownUntil = 0;

    /**
     * Helper function to detect if the currently focused input field
     * is sitting inside an active modal, dialog, or escalation popup window.
     */
    function isInsideModal(element) {
        if (element.closest('dialog[open]')) return true;

        const modalParent = element.closest(
            '[role="dialog"], [role="alertdialog"], .modal, .popup, .overlay, .dialog'
        );

        if (modalParent) {
            const style = window.getComputedStyle(modalParent);
            if (style.display !== 'none' && style.visibility !== 'hidden') {
                return true;
            }
        }

        return false;
    }

    /**
     * Locates a visible, enabled target button on the page matching TARGET_TEXTS.
     */
    function findLpnButton() {
        const selector = 'button, a, div[role="button"]';
        return Array.from(document.querySelectorAll(selector)).find(el => {
            if (el.disabled || el.offsetParent === null || !el.textContent) return false;
            const text = el.textContent.toLowerCase().replace(/\s+/g, ' ');
            return TARGET_TEXTS.some(target => text.includes(target));
        });
    }

    /**
     * Event listener: Fires instantly on scanner entry or typing
     */
    document.addEventListener('input', (e) => {
        const input = e.target;

        if (!input.matches('input:not([type="hidden"]):not([disabled])')) return;

        // Ignore inputs inside an open popup / escalation window
        if (isInsideModal(input)) return;

        const now = Date.now();
        if (now < cooldownUntil) return;

        // Clean invisible control characters added by hardware scanners
        const cleanValue = input.value.replace(/[^\x20-\x7E]/g, '').trim().toLowerCase();
        if (!cleanValue) return;

        const btn = findLpnButton();
        if (!btn) return;

        // Apply 10-second cooldown
        cooldownUntil = now + COOLDOWN_MS;

        // Trigger click only if the barcode doesn't start with an ignored prefix
        if (!IGNORED_PREFIXES.has(cleanValue.charAt(0))) {
            btn.click();
        }
    }, true);

    console.log('✅ [Auto LPN] Loaded and active');
})();
