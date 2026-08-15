import { isInsideModal } from '@shared/dom';
import { getEffectiveWorkTime, calculateUPH, calculatePercentageStr } from '@shared/time';

if (!window.__counterLoaded) {
    window.__counterLoaded = true;

    const TARGET_LABELS: string[] = [
        'wprowadź pojemnik',
        'вкажіть транспортну тару',
        'введите тару'
    ];
    
    const STORAGE_KEY_COUNT = 'sh_item_counter_count';
    const STORAGE_KEY_SETTINGS = 'sh_item_counter_settings';
    
    // Uses the CounterSettings interface we defined in global.d.ts
    let settings: CounterSettings = {
        overlayOpacity: 0.3,
        counterOption: 1,
        overlayLeft: null,
        overlayTop: null,
        customStartTime: null,
        targetRate: 47 // Default fallback
    };
    
    try {
        const savedSettings = localStorage.getItem(STORAGE_KEY_SETTINGS);
        if (savedSettings) {
            const parsed = JSON.parse(savedSettings);
            // Ensure targetRate isn't overwritten incorrectly during load
            delete parsed.targetRate; 
            settings = { ...settings, ...parsed };
        }
    } catch (e) {}
    
    const TOTE_REGEX: RegExp = /^ts[a-z0-9]+/i;
    let itemCounter: number = 0;
    
    try {
        const savedCount = localStorage.getItem(STORAGE_KEY_COUNT);
        if (savedCount !== null) itemCounter = parseInt(savedCount, 10) || 0;
    } catch (e) {}
    
    let active: boolean = false;
    let overlayVisible: boolean = true;
    let isProcessingScan: boolean = false;
    
    function saveCount(count: number): void {
        itemCounter = count;
        try { localStorage.setItem(STORAGE_KEY_COUNT, count.toString()); }
        catch (e) {}
    }
    
    function createOrGetOverlay(): HTMLElement {
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
            display: active ? 'block' : 'none',
            whiteSpace: 'nowrap'
        });
        
        if (settings.overlayLeft !== null && settings.overlayTop !== null) {
            overlay.style.left = `${settings.overlayLeft}px`;
            overlay.style.top = `${settings.overlayTop}px`;
            overlay.style.right = 'auto';
            overlay.style.bottom = 'auto';
        } else {
            overlay.style.left = '45px';
            overlay.style.top = '862px';
            overlay.style.right = 'auto';
            overlay.style.bottom = 'auto';
        }
        
        // Use our imported shared utility functions
        const timeData = getEffectiveWorkTime(settings.customStartTime, settings.counterOption);
        const currentUPH = calculateUPH(itemCounter, timeData.ms);
        const currentPct = calculatePercentageStr(currentUPH, settings.targetRate || 47);
                
        overlay.innerHTML = `
            <span id="sh-overlay-count">${itemCounter}</span>
            <span style="color:#aab7c4; font-weight:normal; margin: 0 4px;">|</span>
            <span id="sh-overlay-uph">${currentUPH}/h</span> 
            <span id="sh-overlay-pct" style="margin-left:2px;">(${currentPct})</span>
            <span style="color:#aab7c4; font-weight:normal; margin: 0 4px;">|</span>
            <span id="sh-overlay-time">${timeData.formatted}</span>
        `;
        
        overlay.addEventListener('mouseenter', () => { if (overlayVisible && overlay) overlay.style.opacity = '1'; });
        overlay.addEventListener('mouseleave', () => { if (overlayVisible && overlay) overlay.style.opacity = settings.overlayOpacity.toString(); });
        
        let isDragging: boolean = false;
        let startX: number = 0;
        let startY: number = 0;
        let initialLeft: number = 0;
        let initialTop: number = 0;
        
        // Strict typing for Drag and Drop
        const dragStart = (e: MouseEvent | TouchEvent): void => {
            isDragging = true;
            const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
            const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
            
            startX = clientX;
            startY = clientY;
            
            if (overlay) {
                const rect = overlay.getBoundingClientRect();
                initialLeft = rect.left;
                initialTop = rect.top;
            }
        };
        
        const dragMove = (e: MouseEvent | TouchEvent): void => {
            if (!isDragging || !overlay) return;
            if ('touches' in e && e.cancelable) e.preventDefault();
            
            const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
            const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
            
            overlay.style.left = `${initialLeft + (clientX - startX)}px`;
            overlay.style.top = `${initialTop + (clientY - startY)}px`;
        };
        
        const dragEnd = (): void => {
            if (isDragging && overlay) {
                isDragging = false;
                settings.overlayLeft = parseInt(overlay.style.left, 10) || 0;
                settings.overlayTop = parseInt(overlay.style.top, 10) || 0;
                try { localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings)); } catch (e) {}
            }
        };
        
        overlay.addEventListener('mousedown', dragStart as EventListener);
        document.addEventListener('mousemove', dragMove as EventListener);
        document.addEventListener('mouseup', dragEnd);
        overlay.addEventListener('touchstart', dragStart as EventListener, { passive: false });
        document.addEventListener('touchmove', dragMove as EventListener, { passive: false });
        document.addEventListener('touchend', dragEnd);
        
        window.addEventListener('resize', () => {
            if (!active || !overlay) return;
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
            if (changed) {
                settings.overlayLeft = parseInt(overlay.style.left, 10) || 0;
                settings.overlayTop = parseInt(overlay.style.top, 10) || 0;
                try { localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings)); } catch (e) {}
            }
        });
        
        document.body.appendChild(overlay);
        return overlay;
    }
    
    function updateCounterUI(count: number): void {
        saveCount(count);
                
        const overlayCount = document.getElementById('sh-overlay-count');
        if (overlayCount) overlayCount.textContent = count.toString();
                
        const timeData = getEffectiveWorkTime(settings.customStartTime, settings.counterOption);
        const currentUPH = calculateUPH(count, timeData.ms);
                
        const overlayUPH = document.getElementById('sh-overlay-uph');
        if (overlayUPH) overlayUPH.textContent = `${currentUPH}/h`;
                
        const overlayPct = document.getElementById('sh-overlay-pct');
        if (overlayPct) overlayPct.textContent = `(${calculatePercentageStr(currentUPH, settings.targetRate || 47)})`;
                
        const overlayTime = document.getElementById('sh-overlay-time');
        if (overlayTime) overlayTime.textContent = timeData.formatted;
        
        const hubInput = document.getElementById('sh-cfg-count') as HTMLInputElement | null;
        if (hubInput && document.activeElement !== hubInput) {
            hubInput.value = count === 0 ? '' : count.toString();
        }
    }
    
    function hasTargetLabel(labelString: string | null): boolean {
        const lowerLabel = (labelString || '').toLowerCase();
        return TARGET_LABELS.some(target => lowerLabel.includes(target));
    }
    
    function verifyAndCount(input: HTMLInputElement): void {
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
    
    function handleScan(e: KeyboardEvent): void {
        if (!active) return;
        if (e.key !== 'Enter') return;
        if (isProcessingScan) return; 
        
        const input = e.target as HTMLInputElement;
        
        if (!input.matches) return; // Prevent crashes on non-DOM elements
        if (input.closest('#sh-root')) return;
        if (!input.matches('input:not([type="hidden"]):not([disabled])') || isInsideModal(input)) return;
        
        const rawValue = input.value?.trim();
        if (!rawValue || !TOTE_REGEX.test(rawValue)) return;
        
        isProcessingScan = true;
        verifyAndCount(input);
    }
    
    document.addEventListener('keydown', (e: KeyboardEvent) => {
        if (!active) return;
                
        if (e.key === 'F10') {
            e.preventDefault();
            overlayVisible = !overlayVisible;
            const overlay = document.getElementById('sh-item-overlay');
            if (overlay) {
                overlay.style.opacity = overlayVisible ? settings.overlayOpacity.toString() : '0';
                overlay.style.display = overlayVisible ? 'block' : 'none';
                                
                if (overlayVisible) {
                    updateCounterUI(itemCounter);
                }
            }
        }
    });
    
    setInterval(() => {
        if (active && overlayVisible) {
            const timeData = getEffectiveWorkTime(settings.customStartTime, settings.counterOption);
            const currentUPH = calculateUPH(itemCounter, timeData.ms);
                        
            const uphEl = document.getElementById('sh-overlay-uph');
            if (uphEl) uphEl.textContent = `${currentUPH}/h`;
                        
            const pctEl = document.getElementById('sh-overlay-pct');
            if (pctEl) pctEl.textContent = `(${calculatePercentageStr(currentUPH, settings.targetRate || 47)})`;
                        
            const timeEl = document.getElementById('sh-overlay-time');
            if (timeEl) timeEl.textContent = timeData.formatted;
        }
    }, 60000);
    
    document.addEventListener('keydown', handleScan as EventListener, true);
    createOrGetOverlay();
    
    window.__itemCounter = {
        enable: (): void => {
            active = true;
            const overlay = createOrGetOverlay();
            if (overlay) overlay.style.display = overlayVisible ? 'block' : 'none';
            updateCounterUI(itemCounter);
        },
        disable: (): void => {
            active = false;
            const overlay = document.getElementById('sh-item-overlay');
            if (overlay) overlay.style.display = 'none';
        },
        isActive: (): boolean => active,
        getCount: (): number => itemCounter,
        setCount: (newCount: number): void => updateCounterUI(newCount),
        getSettings: (): CounterSettings => settings,
        updateSettings: (newSettings: Partial<CounterSettings>): void => {
            settings = { ...settings, ...newSettings };
            try { localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings)); } catch (e) {}
            const overlay = document.getElementById('sh-item-overlay');
            if (overlay && overlayVisible) overlay.style.opacity = settings.overlayOpacity.toString();
            updateCounterUI(itemCounter);
        }
    };
    
    window.__itemCounter.enable();
}
