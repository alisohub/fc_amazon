(() => {
    if (window.__counterLoaded) {
        return;
    }
    window.__counterLoaded = true;

    // Add your Ukrainian (and any other) translations here in lowercase
    const TARGET_LABELS = [
        'wprowadź pojemnik',
        'вкажіть транспортну тару',
        'введите тару'
    ];

    const STORAGE_KEY_COUNT = 'sh_item_counter_count';
    const STORAGE_KEY_SETTINGS = 'sh_item_counter_settings';

    let settings = {
        overlayOpacity: 0.35,
        counterOption: 1,
        overlayLeft: null,
        overlayTop: null
    };

    try {
        const savedSettings = localStorage.getItem(STORAGE_KEY_SETTINGS);
        if (savedSettings) settings = { ...settings, ...JSON.parse(savedSettings) };
    } catch (e) {}

    const TOTE_REGEX = /^ts[a-z0-9]+/i;

    let itemCounter = 0;

    try {
        const savedCount = localStorage.getItem(STORAGE_KEY_COUNT);
        if (savedCount !== null) itemCounter = parseInt(savedCount, 10) || 0;
    } catch (e) {}

    let active = false;
    let overlayVisible = true;
    let isProcessingScan = false;

    function saveCount(count) {
        itemCounter = count;
        try { localStorage.setItem(STORAGE_KEY_COUNT, count.toString()); }
        catch (e) {}
    }

    function getEffectiveWorkTime() {
        const now = new Date();
        const hours = now.getHours();
        const isNight = hours >= 17 || hours < 6;

        let shiftStart = new Date(now);
        if (isNight) {
            if (hours < 6) shiftStart.setDate(shiftStart.getDate() - 1);
            shiftStart.setHours(18, 30, 0, 0);
        } else {
            shiftStart.setHours(6, 30, 0, 0);
        }

        const elapsedMs = now - shiftStart;
        if (elapsedMs <= 0) return { ms: 0, formatted: '0h0m' };

        let breakStart = new Date(shiftStart);
        let breakEnd = new Date(shiftStart);
        const opt = settings.counterOption || 1;

        if (isNight) {
            if (opt === 1) { breakStart.setHours(23, 20, 0, 0); breakEnd.setHours(23, 50, 0, 0); }
            else if (opt === 2) { breakStart.setHours(23, 50, 0, 0); breakEnd.setDate(breakEnd.getDate()+1); breakEnd.setHours(0, 20, 0, 0); }
            else if (opt === 3) { breakStart.setDate(breakStart.getDate()+1); breakStart.setHours(0, 20, 0, 0); breakEnd.setDate(breakEnd.getDate()+1); breakEnd.setHours(0, 50, 0, 0); }
            else if (opt === 4) { breakStart.setDate(breakStart.getDate()+1); breakStart.setHours(0, 50, 0, 0); breakEnd.setDate(breakEnd.getDate()+1); breakEnd.setHours(1, 20, 0, 0); }
        } else {
            if (opt === 1) { breakStart.setHours(11, 20, 0, 0); breakEnd.setHours(11, 50, 0, 0); }
            else if (opt === 2) { breakStart.setHours(11, 50, 0, 0); breakEnd.setHours(12, 20, 0, 0); }
            else if (opt === 3) { breakStart.setHours(12, 20, 0, 0); breakEnd.setHours(12, 50, 0, 0); }
            else if (opt === 4) { breakStart.setHours(12, 50, 0, 0); breakEnd.setHours(13, 20, 0, 0); }
        }

        let effectiveMs = elapsedMs;
        if (now >= breakStart && now < breakEnd) {
            effectiveMs = breakStart - shiftStart;
        } else if (now >= breakEnd) {
            effectiveMs = elapsedMs - (30 * 60 * 1000);
        }

        const maxMs = 10 * 60 * 60 * 1000;
        if (effectiveMs > maxMs) effectiveMs = maxMs;

        const totalMinutes = Math.floor(effectiveMs / (1000 * 60));
        const h = Math.floor(totalMinutes / 60);
        const m = totalMinutes % 60;

        return { ms: effectiveMs, formatted: `${h}h${m}m` };
    }

    function calculateUPH() {
        if (itemCounter === 0) return "0.0";
        const timeData = getEffectiveWorkTime();
        if (timeData.ms <= 0) return "0.0";
        const hoursWorked = timeData.ms / (1000 * 60 * 60);
        return (itemCounter / hoursWorked).toFixed(1);
    }

    function isInsideModal(el) {
        if (el.closest('dialog[open]')) return true;
        const modal = el.closest('[role="dialog"],[role="alertdialog"],.modal,.popup,.overlay,.dialog');
        if (modal) {
            const style = window.getComputedStyle(modal);
            if (style.display !== 'none' && style.visibility !== 'hidden') return true;
        }
        return false;
    }

    function createOrGetOverlay() {
        let overlay = document.getElementById('sh-item-overlay');
        if (overlay) return overlay;

        overlay = document.createElement('div');
        overlay.id = 'sh-item-overlay';

        Object.assign(overlay.style, {
            position: 'fixed',
            zIndex: '999999',
            color: '#D3D3D3',
            fontFamily: 'monospace, sans-serif',
            fontSize: '13px',
            fontWeight: 'bold',
            userSelect: 'none',
            cursor: 'move',
            opacity: overlayVisible ? settings.overlayOpacity.toString() : '0',
            display: active ? 'block' : 'none'
        });

        if (settings.overlayLeft !== null && settings.overlayTop !== null) {
            overlay.style.left = `${settings.overlayLeft}px`;
            overlay.style.top = `${settings.overlayTop}px`;
        } else {
            overlay.style.left = '49px';
            overlay.style.top = '862px';
        }

        const timeData = getEffectiveWorkTime();
        
        // Manual counter completely removed from the overlay layout
        overlay.innerHTML = `
            <span id="sh-overlay-count">${itemCounter}</span>
            <span style="color:#aab7c4; font-weight:normal; margin: 0 4px;">|</span>
            <span id="sh-overlay-uph">${calculateUPH()}</span>/h
            <span style="color:#aab7c4; font-weight:normal; margin: 0 4px;">|</span>
            <span id="sh-overlay-time">${timeData.formatted}</span>
        `;

        overlay.addEventListener('mouseenter', () => { if (overlayVisible) overlay.style.opacity = '1'; });
        overlay.addEventListener('mouseleave', () => { if (overlayVisible) overlay.style.opacity = settings.overlayOpacity.toString(); });

        let isDragging = false, startX, startY, initialLeft, initialTop;

        function dragStart(e) {
            isDragging = true;
            const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
            startX = clientX;
            startY = clientY;
            const rect = overlay.getBoundingClientRect();
            initialLeft = rect.left;
            initialTop = rect.top;
        }

        function dragMove(e) {
            if (!isDragging) return;
            if (e.type === 'touchmove') e.preventDefault();
            const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
            overlay.style.left = `${initialLeft + (clientX - startX)}px`;
            overlay.style.top = `${initialTop + (clientY - startY)}px`;
        }

        function dragEnd() {
            if (isDragging) {
                isDragging = false;
                settings.overlayLeft = parseInt(overlay.style.left, 10) || 0;
                settings.overlayTop = parseInt(overlay.style.top, 10) || 0;
                try { localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings)); } catch (e) {}
            }
        }

        overlay.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', dragMove);
        document.addEventListener('mouseup', dragEnd);

        overlay.addEventListener('touchstart', dragStart, { passive: false });
        document.addEventListener('touchmove', dragMove, { passive: false });
        document.addEventListener('touchend', dragEnd);

        document.body.appendChild(overlay);
        return overlay;
    }

    function updateCounterUI(count) {
        saveCount(count);
        
        const overlayCount = document.getElementById('sh-overlay-count');
        if (overlayCount) overlayCount.textContent = count;
        
        const overlayUPH = document.getElementById('sh-overlay-uph');
        if (overlayUPH) overlayUPH.textContent = calculateUPH();
        
        const overlayTime = document.getElementById('sh-overlay-time');
        if (overlayTime) overlayTime.textContent = getEffectiveWorkTime().formatted;

        // --- RESTORED SYNC LOGIC ---
        const hubInput = document.getElementById('sh-cfg-count');
        if (hubInput && document.activeElement !== hubInput) {
            hubInput.value = count === 0 ? '' : count;
        }
    }

    // Helper function to check against all valid labels
    function hasTargetLabel(labelString) {
        const lowerLabel = (labelString || '').toLowerCase();
        return TARGET_LABELS.some(target => lowerLabel.includes(target));
    }

    function verifyAndCount(input) {
        const initialLabel = input.getAttribute('aria-label');
        if (!hasTargetLabel(initialLabel)) {
            isProcessingScan = false;
            return;
        }

        let resolved = false;

        const observer = new MutationObserver(() => {
            if (resolved) return;
            const isRemoved = !document.body.contains(input);
            const isHidden = input.offsetParent === null;
            const currentLabel = input.getAttribute('aria-label');
            const labelChanged = !hasTargetLabel(currentLabel);

            if (isRemoved || isHidden || labelChanged) {
                resolved = true;
                observer.disconnect();
                
                // 4-second strict lock applied here
                setTimeout(() => {
                    saveCount(itemCounter + 1);
                    updateCounterUI(itemCounter);
                    isProcessingScan = false;
                }, 4000);
            }
        });

        observer.observe(input, {
            attributes: true,
            attributeFilter: ['aria-label', 'disabled', 'class', 'style']
        });

        // Fallback in case observer misses the event
        setTimeout(() => {
            if (!resolved) {
                resolved = true;
                observer.disconnect();
                if (!document.body.contains(input)) {
                    saveCount(itemCounter + 1);
                    updateCounterUI(itemCounter);
                }
                isProcessingScan = false;
            }
        }, 4000);
    }

    function handleScan(e) {
        if (!active) return;
        if (e.key !== 'Enter') return;
        if (isProcessingScan) return; 

        const input = e.target;
        if (input.closest('#sh-root')) return;
        if (!input.matches('input:not([type="hidden"]):not([disabled])') || isInsideModal(input)) return;

        const rawValue = input.value?.trim();
        if (!rawValue || !TOTE_REGEX.test(rawValue)) return;

        isProcessingScan = true;
        verifyAndCount(input);
    }

    document.addEventListener('keydown', (e) => {
        if (!active) return;
        
        if (e.key === 'F10') {
            e.preventDefault();
            overlayVisible = !overlayVisible;
            const overlay = document.getElementById('sh-item-overlay');
            if (overlay) {
                overlay.style.opacity = overlayVisible ? settings.overlayOpacity.toString() : '0';
                overlay.style.display = overlayVisible ? 'block' : 'none';
                
                // Force an instant refresh of UPH and time when bringing it back on screen
                if (overlayVisible) {
                    updateCounterUI(itemCounter);
                }
            }
        }
        // F9 manual increment has been removed entirely
    });

    setInterval(() => {
        if (active && overlayVisible) {
            const uphEl = document.getElementById('sh-overlay-uph');
            if (uphEl) uphEl.textContent = calculateUPH();
            
            const timeEl = document.getElementById('sh-overlay-time');
            if (timeEl) timeEl.textContent = getEffectiveWorkTime().formatted;
        }
    }, 60000);

    document.addEventListener('keydown', handleScan, true);
    createOrGetOverlay();

    window.__itemCounter = {
        enable: () => {
            active = true;
            const overlay = createOrGetOverlay();
            if (overlay) overlay.style.display = overlayVisible ? 'block' : 'none';
            updateCounterUI(itemCounter);
        },
        disable: () => {
            active = false;
            const overlay = document.getElementById('sh-item-overlay');
            if (overlay) overlay.style.display = 'none';
        },
        isActive: () => active,
        getCount: () => itemCounter,
        setCount: (newCount) => updateCounterUI(newCount),
        getSettings: () => settings,
        updateSettings: (newSettings) => {
            settings = { ...settings, ...newSettings };
            try { localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings)); } catch (e) {}
            const overlay = document.getElementById('sh-item-overlay');
            if (overlay && overlayVisible) overlay.style.opacity = settings.overlayOpacity.toString();
            updateCounterUI(itemCounter);
        }
    };

    window.__itemCounter.enable();
})();
