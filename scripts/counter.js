(() => {
    if (window.__counterLoaded) {
        return;
    }
    window.__counterLoaded = true;
    
    const STORAGE_KEY_COUNT = 'sh_item_counter_count';
    const STORAGE_KEY_MANUAL_COUNT = 'sh_item_counter_manual_count';
    const STORAGE_KEY_SETTINGS = 'sh_item_counter_settings';
    
    // Default settings
    let settings = { 
        overlayOpacity: 0.8,
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
    let manualCounter = 0;
    try {
        const savedCount = localStorage.getItem(STORAGE_KEY_COUNT);
        if (savedCount !== null) itemCounter = parseInt(savedCount, 10) || 0;
        
        const savedManual = localStorage.getItem(STORAGE_KEY_MANUAL_COUNT);
        if (savedManual !== null) manualCounter = parseInt(savedManual, 10) || 0;
    } catch (e) {}
    
    let active = false;
    let overlayVisible = true;
    let cooldownUntil = 0;
    
    function saveCount(count) {
        itemCounter = count;
        try { localStorage.setItem(STORAGE_KEY_COUNT, count.toString()); } 
        catch (e) {}
    }

    function saveManualCount(count) {
        manualCounter = count;
        try { localStorage.setItem(STORAGE_KEY_MANUAL_COUNT, count.toString()); } 
        catch (e) {}
    }
    
    // --- TIME & RATE LOGIC ---
    function getEffectiveWorkTime() {
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
        if (elapsedMs <= 0) return { ms: 0, formatted: '0h0m' };
        
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
        
        // Format to hours and minutes
        const totalMinutes = Math.floor(effectiveMs / (1000 * 60));
        const h = Math.floor(totalMinutes / 60);
        const m = totalMinutes % 60;
        
        return { 
            ms: effectiveMs, 
            formatted: `${h}h${m}m` 
        };
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
        
        // Apply saved position or default to bottom-right
        if (settings.overlayLeft !== null && settings.overlayTop !== null) {
            overlay.style.left = `${settings.overlayLeft}px`;
            overlay.style.top = `${settings.overlayTop}px`;
            overlay.style.right = 'auto';
            overlay.style.bottom = 'auto';
        } else {
            overlay.style.bottom = 'auto';
            overlay.style.right = 'auto';
            overlay.style.left = '49px';
            overlay.style.top = '862px';
        }
        
        const timeData = getEffectiveWorkTime();
        overlay.innerHTML = `
            <span id="sh-overlay-count">${itemCounter}</span> 
            <span style="color:#aab7c4; font-weight:normal; margin: 0 4px;">|</span> 
            <span id="sh-overlay-manual-count" style="color:#f39c12;">${manualCounter}</span> 
            <span style="color:#aab7c4; font-weight:normal; margin: 0 4px;">|</span> 
            <span id="sh-overlay-uph">${calculateUPH()}</span>/h 
            <span style="color:#aab7c4; font-weight:normal; margin: 0 4px;">|</span> 
            <span id="sh-overlay-time">${timeData.formatted}</span>
        `;
        
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
    
    function updateCounterUI(count, manualCount = manualCounter) {
        saveCount(count);
        saveManualCount(manualCount);
                
        const overlayCount = document.getElementById('sh-overlay-count');
        if (overlayCount) overlayCount.textContent = count;
        
        const overlayManual = document.getElementById('sh-overlay-manual-count');
        if (overlayManual) overlayManual.textContent = manualCount;
        
        const overlayUPH = document.getElementById('sh-overlay-uph');
        if (overlayUPH) overlayUPH.textContent = calculateUPH();
        
        const overlayTime = document.getElementById('sh-overlay-time');
        if (overlayTime) overlayTime.textContent = getEffectiveWorkTime().formatted;
        
        const hubInput = document.getElementById('sh-cfg-count');
        if (hubInput && document.activeElement !== hubInput) {
            hubInput.value = count === 0 ? '' : count;
        }
    }
    
    // --- OBSERVATION LOGIC: Count ONLY when the aria-label changes away from the trigger ---
    function verifyAndCount(input) {
        const initialLabel = (input.getAttribute('aria-label') || '').toLowerCase();
        if (!initialLabel.includes('wprowadź pojemnik')) {
            return;
        }

        let resolved = false;

        // Polls every 50ms to catch the exact moment the aria-label text changes/disappears or input is destroyed
        const watchInterval = setInterval(() => {
            if (resolved) return;

            const isRemoved = !document.body.contains(input);
            const isHidden = input.offsetParent === null;
            const currentLabel = (input.getAttribute('aria-label') || '').toLowerCase();
            
            // Counts when the aria-label no longer contains "wprowadź pojemnik" (meaning it transitioned to the next screen)
            const labelChanged = !currentLabel.includes('wprowadź pojemnik');

            if (isRemoved || isHidden || labelChanged) {
                resolved = true;
                clearInterval(watchInterval);
                saveCount(itemCounter + 1);
                updateCounterUI(itemCounter, manualCounter);
            }
        }, 50);

        // Failsafe: stop watching after 3.5 seconds
        setTimeout(() => {
             if (!resolved) {
                resolved = true;
                clearInterval(watchInterval);
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
        
        setTimeout(() => verifyAndCount(input), 50);
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
            }
        } else if (e.key === 'F9') {
            e.preventDefault();
            manualCounter++;
            updateCounterUI(itemCounter, manualCounter);
        }
    });
    
    setInterval(() => {
        if (active && overlayVisible) {
            const uphEl = document.getElementById('sh-overlay-uph');
            if (uphEl) uphEl.textContent = calculateUPH();
            const timeEl = document.getElementById('sh-overlay-time');
            if (timeEl) timeEl.textContent = getEffectiveWorkTime().formatted;
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
            updateCounterUI(itemCounter, manualCounter);
        },
        disable: () => {
            active = false;
            const overlay = document.getElementById('sh-item-overlay');
            if (overlay) overlay.style.display = 'none';
        },
        isActive: () => active,
        getCount: () => itemCounter,
        getManualCount: () => manualCounter,
        setCount: (newCount) => updateCounterUI(newCount, manualCounter),
        setManualCount: (newManualCount) => updateCounterUI(itemCounter, newManualCount),
        getSettings: () => settings,
        updateSettings: (newSettings) => {
            settings = { ...settings, ...newSettings };
            try { localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings)); } catch (e) {}
                        
            const overlay = document.getElementById('sh-item-overlay');
            if (overlay && overlayVisible) overlay.style.opacity = settings.overlayOpacity.toString();
            updateCounterUI(itemCounter, manualCounter);
        }
    };
    
    window.__itemCounter.enable();
})();