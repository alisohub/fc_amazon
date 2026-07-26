(() => {
    if (window.__counterLoaded) {
        console.log('⚡ Item Counter is already loaded in memory.');
        return;
    }
    window.__counterLoaded = true;

    // --- LOCAL STORAGE KEYS ---
    const STORAGE_KEY_COUNT = 'sh_item_counter_count';
    const STORAGE_KEY_SETTINGS = 'sh_item_counter_settings';

    // --- DEFAULT SETTINGS ---
    let settings = {
        barcodeRegex: '^tsx[a-z0-9]+',
        soundAlerts: true,
        overlayOpacity: 0.35
    };

    // Load saved settings if present
    try {
        const savedSettings = localStorage.getItem(STORAGE_KEY_SETTINGS);
        if (savedSettings) {
            settings = { ...settings, ...JSON.parse(savedSettings) };
        }
    } catch (e) {
        console.warn('Could not read settings from localStorage', e);
    }

    // --- KEYWORDS FOR NOTIFICATION DETECTION ---
    const SUCCESS_TEXTS = ['success', 'linked', 'pomyślnie', 'przypisano', 'успішно'];
    const ERROR_TEXTS = ['error', 'invalid', 'failed', 'błąd', 'nieprawidłow', 'помилка'];

    // --- STATE PERSISTENCE ---
    let itemCounter = 0;
    try {
        const savedCount = localStorage.getItem(STORAGE_KEY_COUNT);
        if (savedCount !== null) {
            itemCounter = parseInt(savedCount, 10) || 0;
        }
    } catch (e) {
        console.warn('Could not read count from localStorage', e);
    }

    let active = false;
    let cooldownUntil = 0;

    // Save count state
    function saveCount(count) {
        itemCounter = count;
        try {
            localStorage.setItem(STORAGE_KEY_COUNT, count.toString());
        } catch (e) {
            console.warn('Could not save count to localStorage', e);
        }
    }

    // --- HELPER: MODAL DETECTION ---
    function isInsideModal(el) {
        if (el.closest('dialog[open]')) return true;
        const modal = el.closest('[role="dialog"],[role="alertdialog"],.modal,.popup,.overlay,.dialog');
        if (modal) {
            const style = window.getComputedStyle(modal);
            if (style.display !== 'none' && style.visibility !== 'hidden') return true;
        }
        return false;
    }

    // --- DISCREET OVERLAY ---
    function createOrGetOverlay() {
        let overlay = document.getElementById('sh-item-overlay');
        if (overlay) return overlay;

        overlay = document.createElement('div');
        overlay.id = 'sh-item-overlay';

        Object.assign(overlay.style, {
            position: 'fixed',
            bottom: '15px',
            right: '15px',
            zIndex: '999999',
            backgroundColor: 'rgba(35, 47, 62, 0.4)',
            color: '#ffffff',
            padding: '4px 10px',
            borderRadius: '20px',
            fontFamily: 'monospace, Arial, sans-serif',
            fontSize: '12px',
            fontWeight: 'bold',
            letterSpacing: '0.5px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            backdropFilter: 'blur(3px)',
            userSelect: 'none',
            cursor: 'move',
            transition: 'opacity 0.2s ease, transform 0.2s ease, background-color 0.2s ease',
            opacity: settings.overlayOpacity.toString(),
            border: '1px solid rgba(255, 255, 255, 0.15)',
            display: active ? 'block' : 'none'
        });

        overlay.innerHTML = `📦 <span id="sh-overlay-count">${itemCounter}</span>`;

        overlay.addEventListener('mouseenter', () => { overlay.style.opacity = '0.9'; });
        overlay.addEventListener('mouseleave', () => { overlay.style.opacity = settings.overlayOpacity.toString(); });

        // Draggable logic
        let isDragging = false, startX, startY, initialLeft, initialTop;
        overlay.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            const rect = overlay.getBoundingClientRect();
            initialLeft = rect.left;
            initialTop = rect.top;
            overlay.style.right = 'auto';
            overlay.style.bottom = 'auto';
            overlay.style.left = `${initialLeft}px`;
            overlay.style.top = `${initialTop}px`;
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            overlay.style.left = `${initialLeft + (e.clientX - startX)}px`;
            overlay.style.top = `${initialTop + (e.clientY - startY)}px`;
        });

        document.addEventListener('mouseup', () => { isDragging = false; });

        document.body.appendChild(overlay);
        return overlay;
    }

    // --- UI BADGE UPDATER ---
    function updateCounterUI(count) {
        saveCount(count);

        const hubBadge = document.getElementById('sh-item-count');
        if (hubBadge) hubBadge.textContent = count;

        const overlayCount = document.getElementById('sh-overlay-count');
        if (overlayCount) overlayCount.textContent = count;

        const overlay = document.getElementById('sh-item-overlay');
        if (overlay) {
            overlay.style.opacity = '1';
            overlay.style.transform = 'scale(1.15)';
            overlay.style.backgroundColor = 'rgba(6, 125, 98, 0.8)';

            setTimeout(() => {
                overlay.style.transform = 'scale(1)';
                overlay.style.backgroundColor = 'rgba(35, 47, 62, 0.4)';
                overlay.style.opacity = settings.overlayOpacity.toString();
            }, 400);
        }
    }

    // --- OBSERVER ---
    function verifyAndCount(scannedBarcode) {
        let resolved = false;

        const observer = new MutationObserver(() => {
            if (resolved) return;

            const candidates = document.querySelectorAll('div, section, p, span, [role="alert"], [role="status"]');

            for (const el of candidates) {
                if (el.offsetParent === null || el.closest('#sh-root') || el.closest('#sh-item-overlay') || el.children.length > 0) continue;

                const text = el.textContent.toLowerCase().replace(/\s+/g, ' ').trim();
                if (!text || text.length > 200) continue;

                const hasError = ERROR_TEXTS.some(keyword => text.includes(keyword));
                if (hasError) {
                    resolved = true;
                    console.warn(`❌ Scan rejected [${scannedBarcode}]: "${text}"`);
                    cooldownUntil = 0;
                    observer.disconnect();
                    return;
                }

                const hasSuccess = SUCCESS_TEXTS.some(keyword => text.includes(keyword));
                if (hasSuccess) {
                    resolved = true;
                    saveCount(itemCounter + 1);
                    console.log(`✅ Success: [${scannedBarcode}] | Total: ${itemCounter}`);
                    updateCounterUI(itemCounter);
                    observer.disconnect();
                    return;
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true, characterData: true });

        setTimeout(() => {
            if (!resolved) observer.disconnect();
        }, 2500);
    }

    // --- SCAN EVENT HANDLER ---
    function handleScan(e) {
        if (!active) return;
        if (e.type === 'keydown' && e.key !== 'Enter') return;

        const input = e.target;
        if (input.closest('#sh-root')) return;
        if (!input.matches('input:not([type="hidden"]):not([disabled])') || isInsideModal(input)) return;

        const rawValue = input.value?.trim();
        if (!rawValue) return;

        // Dynamic Regex check based on settings
        const regex = new RegExp(settings.barcodeRegex, 'i');
        if (!regex.test(rawValue)) return;

        const now = Date.now();
        if (now < cooldownUntil) return;
        cooldownUntil = now + 1500;

        setTimeout(() => verifyAndCount(rawValue), 50);
    }

    document.addEventListener('keydown', handleScan, true);
    document.addEventListener('change', handleScan, true);

    createOrGetOverlay();

    // --- PUBLIC INTERFACE WITH SETTINGS ---
    window.__itemCounter = {
        enable: () => {
            active = true;
            const overlay = createOrGetOverlay();
            if (overlay) overlay.style.display = 'block';
            updateCounterUI(itemCounter);
            console.log('✅ Item Counter Enabled');
        },
        disable: () => {
            active = false;
            const overlay = document.getElementById('sh-item-overlay');
            if (overlay) overlay.style.display = 'none';
            console.log('⏸️ Item Counter Disabled');
        },
        isActive: () => active,
        getCount: () => itemCounter,
        resetCount: () => {
            updateCounterUI(0);
            console.log('🔄 Item Counter Reset to 0');
        },
        getSettings: () => settings,
        updateSettings: (newSettings) => {
            settings = { ...settings, ...newSettings };
            try {
                localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
            } catch (e) {
                console.warn('Failed to persist settings', e);
            }
            const overlay = document.getElementById('sh-item-overlay');
            if (overlay) overlay.style.opacity = settings.overlayOpacity.toString();
        }
    };

    window.__itemCounter.enable();
})();
