import { ITM_CMT_SCRTS, STORAGE_KEY_COUNT, STORAGE_KEY_COUNTER, STORAGE_KEY_DBL_COUNT_ID } from '@shared/constants';
import { findButtonByTestId } from '@shared/dom';
import { getEffectiveWorkTime, calculateUPH, calculatePercentageStr, calculateFreeTime } from '@shared/time';
import { debugLog } from '@shared/utils';

if (!window.__counterLoaded) {
    window.__counterLoaded = true;

    //TODO storage sync
    let settings: CounterSettings = {
        overlayOpacity: 0.4,
        lunchBreak: 1,
        overlayLeft: 40,
        overlayTop: 2,
        customStartTime: null,
    };

    try {
        const savedSettings = localStorage.getItem(STORAGE_KEY_COUNTER);
        if (savedSettings) {
            const parsed = JSON.parse(savedSettings);
            settings = { ...settings, ...parsed };
        }
    } catch (e) {}

    let itemCounter: number = 0;
    try {
        const savedCount = localStorage.getItem(STORAGE_KEY_COUNT);
        if (savedCount !== null) itemCounter = parseInt(savedCount, 10) || 0;
    } catch (e) {}

    let active: boolean = false;
    let overlayVisible: boolean = true;

    let psObserver: MutationObserver | null = null;
    let lastToastTime = 0;

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
            position: 'fixed', zIndex: '999999', color: '#D3D3D3',
            fontFamily: 'monospace, sans-serif', fontSize: '13px',
            fontWeight: 'bold', userSelect: 'none', cursor: 'move',
            opacity: overlayVisible ? settings.overlayOpacity.toString() : '0',
            display: active ? 'block' : 'none', whiteSpace: 'nowrap'
        });

        if (settings.overlayLeft !== null && settings.overlayTop !== null) {
            overlay.style.left = `${settings.overlayLeft}px`;
            overlay.style.top = `${settings.overlayTop}px`;
            overlay.style.right = 'auto'; overlay.style.bottom = 'auto';
        } else {
            overlay.style.left = '40px'; overlay.style.top = 'auto';
            overlay.style.right = 'auto'; overlay.style.bottom = '8px';
        }

        const timeData = getEffectiveWorkTime(settings.customStartTime, settings.lunchBreak);
        const currentUPH = calculateUPH(itemCounter, timeData.ms);
        const currentPct = calculatePercentageStr(currentUPH, settings.targetRate || 47);
        const currentFT = calculateFreeTime(itemCounter, timeData.ms, settings.targetRate || 47);

        overlay.innerHTML = `
            <span id="sh-overlay-count">${itemCounter}</span>
            <span style="color:#aab7c4; font-weight:normal; margin: 0 4px;">|</span>
            <span id="sh-overlay-uph">${currentUPH}/h</span> 
            <span id="sh-overlay-pct" style="margin-left:2px;">(${currentPct})</span>
            <span style="color:#aab7c4; font-weight:normal; margin: 0 4px;">|</span>
            <span id="sh-overlay-time">${timeData.formatted}</span>
            <span style="color:#aab7c4; font-weight:normal; margin: 0 4px;">|</span>
            <span id="sh-overlay-free-time">${currentFT}</span>
        `;

        overlay.addEventListener('mouseenter', () => { if (overlayVisible && overlay) overlay.style.opacity = '1'; });
        overlay.addEventListener('mouseleave', () => { if (overlayVisible && overlay) overlay.style.opacity = settings.overlayOpacity.toString(); });

        let isDragging: boolean = false;
        let startX: number = 0; let startY: number = 0;
        let initialLeft: number = 0; let initialTop: number = 0;

        const dragStart = (e: MouseEvent | TouchEvent): void => {
            isDragging = true;
            const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
            const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
            startX = clientX; startY = clientY;
            if (overlay) {
                const rect = overlay.getBoundingClientRect();
                initialLeft = rect.left; initialTop = rect.top;
            }
        };

        const dragMove = (e: MouseEvent | TouchEvent): void => {
            if (!isDragging || !overlay) return;
            if ('touches' in e && e.cancelable) e.preventDefault();
            const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
            const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
            
            const rect = overlay.getBoundingClientRect();
            const newX = Math.max(0, Math.min(initialLeft + (clientX - startX), window.innerWidth - rect.width));
            const newY = Math.max(0, Math.min(initialTop + (clientY - startY), window.innerHeight - rect.height));
            overlay.style.left = `${newX}px`;
            overlay.style.top = `${newY}px`;
        };

        const dragEnd = (): void => {
            if (isDragging && overlay) {
                isDragging = false;
                settings.overlayLeft = parseInt(overlay.style.left, 10) || 0;
                settings.overlayTop = parseInt(overlay.style.top, 10) || 0;
                debugLog('item-counter', 'Overlay position saved:', { left: settings.overlayLeft, top: settings.overlayTop });
                try { localStorage.setItem(STORAGE_KEY_COUNTER, JSON.stringify(settings)); } catch (e) {}
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
                debugLog('item-counter', 'Overlay clamped on window resize:', { left: settings.overlayLeft, top: settings.overlayTop });
                try { localStorage.setItem(STORAGE_KEY_COUNTER, JSON.stringify(settings)); } catch (e) {}
            }
        });

        document.body.appendChild(overlay);
        return overlay;
    }

    function updateCounterUI(count: number): void {
        saveCount(count);
        const overlayCount = document.getElementById('sh-overlay-count');
        if (overlayCount) overlayCount.textContent = count.toString();

        const timeData = getEffectiveWorkTime(settings.customStartTime, settings.lunchBreak);
        const currentUPH = calculateUPH(count, timeData.ms);
        const currentFT = calculateFreeTime(itemCounter, timeData.ms, settings.targetRate || 47);

        const overlayUPH = document.getElementById('sh-overlay-uph');
        if (overlayUPH) overlayUPH.textContent = `${currentUPH}/h`;

        const overlayPct = document.getElementById('sh-overlay-pct');
        if (overlayPct) overlayPct.textContent = `(${calculatePercentageStr(currentUPH, settings.targetRate || 47)})`;

        const overlayTime = document.getElementById('sh-overlay-time');
        if (overlayTime) overlayTime.textContent = timeData.formatted;

        const overlayFreeTime = document.getElementById('sh-overlay-free-time');
        if (overlayFreeTime) overlayFreeTime.textContent = currentFT;

        const hubInput = document.getElementById('sh-cfg-count') as HTMLInputElement | null;
        if (hubInput && document.activeElement !== hubInput) {
            hubInput.value = count === 0 ? '' : count.toString();
        }
        debugLog('item-counter', 'Counter UI updated:', { count, currentUPH, time: timeData.formatted, freeTime: currentFT });
    }

    async function clickBlueButton(): Promise<void> {
        const btn = await findButtonByTestId(ITM_CMT_SCRTS, 3000) as HTMLButtonElement;

        if (btn && !btn.disabled) {
            debugLog('item-counter', 'Clicking conformstion button');
            
            btn.click();
        }   
    }

    function startPSCounter() {
        if (psObserver) return; // Prevent multiple observers
        psObserver = new MutationObserver((mutations) => {
            if (!active) return; // Don't count if script is paused/off
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const el = node as HTMLElement;
                        const text = (el.innerText || el.textContent || '').toLowerCase();
                        const cls = (typeof el.className === 'string' ? el.className : '').toLowerCase();

                        // 1. Direct success confirmation text (e.g., Problem Solve item dispatch)
                        const hasSuccessText = text.includes('wysłano pomyślnie');

                        // 2. Generic toast/notification/alert success container
                        const isSuccessToast = cls.includes('success') && (
                            cls.includes('notification') ||
                            cls.includes('toast') ||
                            cls.includes('alert')
                        );

                        if (hasSuccessText || isSuccessToast) {
                            // Guard: Ignore session reset or clear actions
                            const isClearNotification = (
                                text.includes('wyczyszczony') ||
                                text.includes('wyczyszczono') ||
                                text.includes('cleared') ||
                                text.includes('clear')
                            );

                            if (!isClearNotification) {
                                const now = Date.now();
                                // 500ms cooldown to debounce multi-node DOM insertions
                                if (now - lastToastTime > 500) {
                                    lastToastTime = now;
                                    debugLog('item-counter', 'PS Toast/Success notification detected! Incrementing by +1');
                                    updateCounterUI(itemCounter + 1);
                                    return;
                                }
                            }
                        }
                    }
                }
            }
        });
        psObserver.observe(document.body, { childList: true, subtree: true });
        debugLog('item-counter', 'Started PS Toast Observer');
    }   

    if (!settings.isPS) {
        const originalOpen = XMLHttpRequest.prototype.open;
        const originalSend = XMLHttpRequest.prototype.send;

        XMLHttpRequest.prototype.open = function(method: string, url: string | URL, ...rest: any[]) {
            (this as any).__targetUrl = String(url);
            return (originalOpen as any).call(this, method, url, ...rest);
        };

        XMLHttpRequest.prototype.send = function(body: Document | XMLHttpRequestBodyInit | null) {
            if (typeof body === "string") {
                try {
                    (this as any).__requestBody = JSON.parse(body);
                } catch {
                    (this as any).__requestBody = null;
                }
            } else {
                (this as any).__requestBody = null;
            }

            this.addEventListener("load", function () {
                if (!active) return;

                const targetUrl = (this as any).__targetUrl;
                if (!targetUrl?.includes("/api/executeProcess")) {
                    return;
                }

                try {
                    const responseBody = typeof this.response === "string"
                        ? JSON.parse(this.response)
                        : this.response;

                    if (!responseBody) return;

                    let resPayload = responseBody.actionPayload;
                    if (typeof resPayload === "string") {
                        try { resPayload = JSON.parse(resPayload); } catch (e) {}
                    }

                    const requestBody = (this as any).__requestBody;
                    let reqPayload = requestBody?.actionPayload;
                    if (typeof reqPayload === "string") {
                        try { reqPayload = JSON.parse(reqPayload); } catch (e) {}
                    }

                    const pid = responseBody.processManagerId || resPayload?.processManagerId || requestBody?.processManagerId;
                    debugLog('item-counter', 'Intercepted /api/executeProcess:', {
                        action: requestBody?.action?.name,
                        status: this.status,
                        pid,
                        isInputScanned: reqPayload?.isInputScanned
                    });

                    if (settings.doubleCountMode) {
                        if (
                            resPayload?.listingConditionEvaluated === true &&
                            resPayload?.decantedUnit === true &&
                            resPayload?.sellable === true &&
                            typeof pid === "string"
                        ) {
                            debugLog('item-counter', 'Double-count eligible unit detected, saving PID:', pid);
                            try {
                                localStorage.setItem(STORAGE_KEY_DBL_COUNT_ID, pid);
                            } catch (e) {}
                        }
                    }

                    if (
                        this.status === 200 &&
                        requestBody?.action?.name === "SCAN_CONTAINER_IDENTIFIER" &&
                        reqPayload?.isInputScanned === true
                    ) {
                        let increment = 1;
                        try {
                            const savedPid = localStorage.getItem(STORAGE_KEY_DBL_COUNT_ID);
                            if (
                                settings.doubleCountMode &&
                                savedPid !== null &&
                                pid === savedPid
                            ) {
                                increment = 2;
                                localStorage.removeItem(STORAGE_KEY_DBL_COUNT_ID);
                                debugLog('item-counter', 'Matched double-count PID! Incrementing by 2');
                            }
                        } catch (e) {}

                        debugLog('item-counter', `Container scan succeeded! Incrementing count by +${increment}`);
                        updateCounterUI(itemCounter + increment);
                        if (settings.clickCount) {
                            debugLog('item-counter', 'setting active click count');
                            clickBlueButton().catch(err => debugLog('item-counter', 'Failed to click green button:', err));
                        }
                    }
                } catch (error) {
                    debugLog('item-counter', 'Error parsing executeProcess XHR:', error);
                }
            });

            return originalSend.call(this, body);
        };
    }


    document.addEventListener('keydown', (e: KeyboardEvent) => {
        if (!active) return;
        if (e.key === 'F10') {
            e.preventDefault();
            overlayVisible = !overlayVisible;
            debugLog('item-counter', 'F10 pressed, overlayVisible:', overlayVisible);
            const overlay = document.getElementById('sh-item-overlay');
            if (overlay) {
                overlay.style.opacity = overlayVisible ? settings.overlayOpacity.toString() : '0';
                overlay.style.display = overlayVisible ? 'block' : 'none';
                if (overlayVisible) updateCounterUI(itemCounter);
            }
        }
    });

    setInterval(() => {
        if (active && overlayVisible) {
            const timeData = getEffectiveWorkTime(settings.customStartTime, settings.lunchBreak);
            const currentUPH = calculateUPH(itemCounter, timeData.ms);
            const currentFT = calculateFreeTime(itemCounter, timeData.ms, settings.targetRate || 47);
            
            const uphEl = document.getElementById('sh-overlay-uph');
            if (uphEl) uphEl.textContent = `${currentUPH}/h`;
            
            const pctEl = document.getElementById('sh-overlay-pct');
            if (pctEl) pctEl.textContent = `(${calculatePercentageStr(currentUPH, settings.targetRate || 47)})`;

            const timeEl = document.getElementById('sh-overlay-time');
            if (timeEl) timeEl.textContent = timeData.formatted;

            const ftEl = document.getElementById('sh-overlay-free-time');
            if (ftEl) ftEl.textContent = currentFT;
        }
    }, 60000);

    createOrGetOverlay();

    window.__itemCounter = {
        enable: (): void => {
            active = true;
            debugLog('item-counter', 'Enabled');
            if (settings.isPS) {
                startPSCounter();
            }
            const overlay = createOrGetOverlay();
            if (overlay) overlay.style.display = overlayVisible ? 'block' : 'none';
            updateCounterUI(itemCounter);
        },
        disable: (): void => {
            active = false;
            if (psObserver) {
                psObserver.disconnect();
                psObserver = null;
            }
            debugLog('item-counter', 'Disabled');
            const overlay = document.getElementById('sh-item-overlay');
            if (overlay) overlay.style.display = 'none';
        },
        isActive: (): boolean => active,
        getCount: (): number => itemCounter,
        setCount: (newCount: number): void => updateCounterUI(newCount),
        getSettings: (): CounterSettings => settings,
        updateSettings: (newSettings: Partial<CounterSettings>): void => {
            settings = { ...settings, ...newSettings };
            debugLog('item-counter', 'Settings updated:', settings);
            try { localStorage.setItem(STORAGE_KEY_COUNTER, JSON.stringify(settings)); } catch (e) {}
            const overlay = document.getElementById('sh-item-overlay');
            if (overlay && overlayVisible) overlay.style.opacity = settings.overlayOpacity.toString();
            updateCounterUI(itemCounter);
        }
    };
}
