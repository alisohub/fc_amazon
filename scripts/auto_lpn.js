(() => {
    if (window.__autoLpnLoaded) {
        console.log('⚡ Auto-LPN is already initialized in memory.');
        return;
    }
    window.__autoLpnLoaded = true;

    const TARGET_TEXTS = [
        'перепризначте lpn', 
        'przypisz ponownie lpn'
    ];

    const IGNORED_PREFIXES = new Set(['t']);
    let cooldownUntil = 0;
    let active = false;

    function isInsideModal(el) {
        if (el.closest('dialog[open]')) return true;
        const p = el.closest('[role="dialog"],[role="alertdialog"],.modal,.popup,.overlay,.dialog');
        if (p) {
            const s = window.getComputedStyle(p);
            if (s.display !== 'none' && s.visibility !== 'hidden') return true;
        }
        return false;
    }

    function handleInput(e) {
        if (!active) return;

        const input = e.target;

        // 1. IGNORE inputs coming from inside the Script Hub UI
        if (input.closest('#sh-root')) return;

        // 2. Ignore non-text inputs, hidden inputs, disabled inputs, or inputs inside modals
        if (!input.matches('input:not([type="hidden"]):not([disabled])') || isInsideModal(input)) return;

        const now = Date.now();
        if (now < cooldownUntil) return;

        const cleanValue = input.value.replace(/[^\x20-\x7E]/g, '').trim().toLowerCase();
        if (!cleanValue) return;

        const btn = Array.from(document.querySelectorAll('button, a, div[role="button"]')).find(el => {
            if (el.disabled || el.offsetParent === null || !el.textContent) return false;
            const text = el.textContent.toLowerCase().replace(/\s+/g, ' ');
            return TARGET_TEXTS.some(target => text.includes(target));
        });

        if (!btn) return;
        cooldownUntil = now + 10000;

        if (!IGNORED_PREFIXES.has(cleanValue.charAt(0))) {
            btn.click();
        }
    }

    document.addEventListener('input', handleInput, true);

    window.__autoLpn = {
        enable: () => { active = true; console.log('✅ Auto-LPN Enabled'); },
        disable: () => { active = false; console.log('⏸️ Auto-LPN Disabled'); },
        isActive: () => active
    };

    window.__autoLpn.enable();
})();
