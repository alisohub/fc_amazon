(() => {
    if (window.__counterLoaded) {
        return;
    }
    window.__counterLoaded = true;

    const STORAGE_KEY_COUNT = 'sh_item_counter_count';
    const STORAGE_KEY_SETTINGS = 'sh_item_counter_settings';

    // Default settings
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
    
    // Only looking for this specific text to disappear
    const TARGET_INSTRUCTION_TEXTS = ['сканування lpn', 'scan lpn', 'skanowanie lpn'];

    let itemCounter = 0;
    try {
        const savedCount = localStorage.getItem(STORAGE_KEY_COUNT);
        if (savedCount !== null) itemCounter = parseInt(savedCount, 10) || 0;
    } catch (e) {}

    let active = false;
    let overlayVisible = true;
    let cooldownUntil = 0;

    function saveCount(count) {
        itemCounter = count;
        try { localStorage.setItem(STORAGE_KEY_COUNT, count.toString()); } 
        catch (e) {}
    }

    // --- RATE LOGIC (UPH) ---
    function calculateUPH() {
        if (itemCounter === 0) return 0;

        const now = new Date();
        const hours = now.getHours();
        
        // Determine Shift (Night shift starts at 18:30, Day starts at 06:30)
        const isNight = hours >= 17 || hours < 6;
        let shiftStart = new Date(now);

        if (isNight) {
            if (hours < 6) shiftStart.setDate(shiftStart.getDate() - 1);
            shiftStart.setHours(18, 30, 0, 0);
        } else {
            shiftStart.setHours(6, 30, 0, 0);
        }

        const elapsedMs = now - shiftStart;
        if (elapsedMs <= 0) return 0;

        let breakStart = new Date(shiftStart);
        let breakEnd = new Date(shiftStart);
        const opt = settings.counterOption || 1;

        // Break Timetables
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

        // Break freezing logic
        if (now >= breakStart && now < breakEnd) {
            effectiveMs = breakStart - shiftStart;
        } else if (now >= breakEnd) {
            effectiveMs = elapsedMs - (30 * 60 * 1000);
        }

        const maxMs = 10 * 60 * 60 * 1000;
        if (effectiveMs > maxMs) effectiveMs = maxMs;

        const hoursWorked = effectiveMs / (1000 * 60 * 60);
        if (hoursWorked <= 0) return 0;

        return Math.round(itemCounter / hoursWorked);
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
            // backgroundColor: 'rgba(35, 47, 62, 0.5)',
            color: '#ffffff',
            // padding: '4px 12px',
            // borderRadius: '20px',
            fontFamily: 'monospace, sans-serif',
            fontSize: '13px',
            fontWeight: 'bold',
            // boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            // backdropFilter: 'blur(4px)',
            userSelect: 'none',
            cursor: 'move',
            // transition: 'opacity 0.2s ease',
            opacity: overlayVisible ? settings.overlayOpacity.toString() : '0',
            // border: '1px solid rgba(255, 255, 255, 0.15)',
            display: active ? 'block' : 'none'
        });

        // Apply saved position or default to bottom-right
        if (settings.overlayLeft !== null && settings.overlayTop !== null) {
            overlay.style.left = `${settings.overlayLeft}px`;
            overlay.style.top = `${settings.overlayTop}px`;
            overlay.style.right = 'auto';
            overlay.style.bottom = 'auto';
        } else {
            overlay.style.bottom = '15px';
            overlay.style.right = '15px';
            overlay.style.left = 'auto';
            overlay.style.top = 'auto';
        }

        overlay.innerHTML = `📦 <span id="sh-overlay-count">${itemCounter}</span> <span style="color:#aab7c4; font-weight:normal; margin: 0 4px;">|</span> ⚡ <span id="sh-overlay-uph">${calculateUPH()}</span>`;

        overlay.addEventListener('mouseenter', () => { 
            if (overlayVisible) overlay.style.opacity = '1'; 
        });
        overlay.addEventListener('mouseleave', () => { 
            if (overlayVisible) overlay.style.opacity = settings.overlayOpacity.toString(); 
        });

        // --- DRAGGING LOGIC (Mouse & Touch) ---
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
            
            overlay.style.right = 'auto';
            overlay.style.bottom = 'auto';
            overlay.style.left = `${initialLeft}px`;
            overlay.style.top = `${initialTop}px`;
        }

        function dragMove(e) {
            if (!isDragging) return;
            if (e.type === 'touchmove') e.preventDefault(); 
            
            const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
            
            let newLeft = initialLeft + (clientX - startX);
            let newTop = initialTop + (clientY - startY);
            
            const maxLeft = window.innerWidth - overlay.offsetWidth;
            const maxTop = window.innerHeight - overlay.offsetHeight;
            
            newLeft = Math.max(0, Math.min(newLeft, maxLeft));
            newTop = Math.max(0, Math.min(newTop, maxTop));
            
            overlay.style.left = `${newLeft}px`;
            overlay.style.top = `${newTop}px`;
        }

        function dragEnd() {
            if (isDragging) {
                isDragging = false;
                
                // Save coordinates when user finishes dragging
                settings.overlayLeft = parseInt(overlay.style.left, 10) || 0;
                settings.overlayTop = parseInt(overlay.style.top, 10) || 0;
                try { localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings)); } catch (e) {}
            }
        }

        overlay.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', dragMove);
        document.addEventListener('mouseup', dragEnd);

        overlay.addEventListener('touchstart', dragStart, { passive: true });
        document.addEventListener('touchmove', dragMove, { passive: false });
        document.addEventListener('touchend', dragEnd);

        window.addEventListener('resize', () => {
            if (!active) return;
            const rect = overlay.getBoundingClientRect();
            let changed = false;

            if (rect.right > window.innerWidth) {
                overlay.style.left = `${Math.max(0, window.innerWidth - rect.width - 15)}px`;
                changed = true;
            }
            if (rect.bottom > window.innerHeight) {
                overlay.style.top = `${Math.max(0, window.innerHeight - rect.height - 15)}px`;
                changed = true;
            }

            // Save new adjusted coordinates if window size squished the overlay out of bounds
            if (changed) {
                settings.overlayLeft = parseInt(overlay.style.left, 10) || 0;
                settings.overlayTop = parseInt(overlay.style.top, 10) || 0;
                try { localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings)); } catch (e) {}
            }
        });

        document.body.appendChild(overlay);
        return overlay;
    }

    function updateCounterUI(count) {
        saveCount(count);
        
        const overlayCount = document.getElementById('sh-overlay-count');
        if (overlayCount) overlayCount.textContent = count;

        const overlayUPH = document.getElementById('sh-overlay-uph');
        if (overlayUPH) overlayUPH.textContent = calculateUPH();

        const hubInput = document.getElementById('sh-cfg-count');
        if (hubInput && document.activeElement !== hubInput) {
            hubInput.value = count === 0 ? '' : count;
        }
    }

    // --- DOM OBSERVATION LOGIC ---
    function verifyAndCount(scannedBarcode) {
        let targetEl = null;

        // Locate the specific element holding the "Сканування LPN" text
        const candidates = document.querySelectorAll('div, section, p, span, h1, h2, h3, h4, h5');
        for (const el of candidates) {
            if (el.children.length > 0) continue; 
            
            const text = el.textContent.toLowerCase().trim();
            if (TARGET_INSTRUCTION_TEXTS.some(keyword => text.includes(keyword))) {
                targetEl = el;
                break;
            }
        }

        if (!targetEl) {
            return;
        }

        let resolved = false;

        const observer = new MutationObserver(() => {
            if (resolved) return;

            // Target element is removed from DOM or hidden
            if (!document.body.contains(targetEl) || targetEl.offsetParent === null) {
                resolved = true;
                saveCount(itemCounter + 1);
                updateCounterUI(itemCounter);
                observer.disconnect();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        setTimeout(() => { 
            if (!resolved) {
                observer.disconnect(); 
            }
        }, 3500); 
    }

    function handleScan(e) {
        if (!active) return;
        if (e.type === 'keydown' && e.key !== 'Enter') return;

        const input = e.target;
        if (input.closest('#sh-root')) return;
        if (!input.matches('input:not([type="hidden"]):not([disabled])') || isInsideModal(input)) return;

        const rawValue = input.value?.trim();
        if (!rawValue || !TOTE_REGEX.test(rawValue)) return;

        const now = Date.now();
        if (now < cooldownUntil) return;
        cooldownUntil = now + 1500;

        setTimeout(() => verifyAndCount(rawValue), 50);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'F10' && active) {
            e.preventDefault();
            overlayVisible = !overlayVisible;
            const overlay = document.getElementById('sh-item-overlay');
            if (overlay) {
                overlay.style.opacity = overlayVisible ? settings.overlayOpacity.toString() : '0';
                overlay.style.display = overlayVisible ? 'block' : 'none'; 
            }
        }
    });

    setInterval(() => {
        if (active && overlayVisible) {
            const uphEl = document.getElementById('sh-overlay-uph');
            if (uphEl) uphEl.textContent = calculateUPH();
        }
    }, 10000);

    document.addEventListener('keydown', handleScan, true);
    document.addEventListener('change', handleScan, true);
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
