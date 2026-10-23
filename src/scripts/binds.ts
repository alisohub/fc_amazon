import { STORAGE_KEY_BINDS } from "@shared/constants";
import { setStatusDot, triggerEnter } from "@shared/dom";
import { normalizeText, debugLog } from "@shared/utils";

if (!window.__bindsLoaded) {
    window.__bindsLoaded = true;
    
    let currentShortcuts: Record<string, string[]> = {
        'F1': [], 'F2': [], 'F3': [], 'F4': [], 'F5': [], 'F6': [], 'F7': []
    };

    try {
        const saved = localStorage.getItem(STORAGE_KEY_BINDS);
        if (saved) {
            currentShortcuts = { ...currentShortcuts, ...JSON.parse(saved) };
        }
    } catch (e) {}

    let active: boolean = false;
    let isRunning: boolean = false;
    let activeTargets: string[] = []; 
    let recordingKey: string | null = null; 
    let awaitingF9: boolean = false;

    function updateRecordingDot(): void {
        setStatusDot('binds', '#d93025', Boolean(recordingKey));
    }
    
    let changeObserver: MutationObserver | null = null;
    let fallbackTimer: ReturnType<typeof setTimeout> | undefined;
    let enterTimer: ReturnType<typeof setTimeout> | undefined;

    function stopScript(): void {
        if (isRunning) debugLog('binds', 'Stopping bind playback');
        isRunning = false;
        activeTargets = [];
        if (changeObserver) changeObserver.disconnect();
        clearTimeout(fallbackTimer);
        clearTimeout(enterTimer);
    }

    function compileTargets(sequence: string[]): string[] {
        return sequence.map(word => word.trim().toLowerCase()).filter(w => w.length > 0);
    }

    document.addEventListener('click', (e: MouseEvent) => {
        if (!active || !recordingKey) return;
        
        const clickedElement = e.target as HTMLElement;
        if (clickedElement.closest('#sh-root')) return; 
        
        let targetP: HTMLElement | null = null;

        if (clickedElement.tagName.toLowerCase() === 'p') {
            targetP = clickedElement;
        } else {
            const children = clickedElement.children;
            for (let i = 0; i < children.length; i++) {
                if (children[i].tagName.toLowerCase() === 'p') {
                    targetP = children[i] as HTMLElement;
                    break;
                }
            }
            if (!targetP && clickedElement.parentElement) {
                const siblings = clickedElement.parentElement.children;
                for (let i = 0; i < siblings.length; i++) {
                    if (siblings[i].tagName.toLowerCase() === 'p') {
                        targetP = siblings[i] as HTMLElement;
                        break;
                    }
                }
            }
            if (!targetP) {
                const grandparent = clickedElement.parentElement?.parentElement;
                if (grandparent) {
                    const uncleChildren = grandparent.children;
                    for (let i = 0; i < uncleChildren.length; i++) {
                        if (uncleChildren[i].tagName.toLowerCase() === 'p') {
                            targetP = uncleChildren[i] as HTMLElement;
                            break;
                        }
                    }
                }
            }
        }

        if (targetP && targetP.closest('.answer-card')) {
            const text = normalizeText(targetP.textContent);
            if (text && currentShortcuts[recordingKey].length < 30) {
                currentShortcuts[recordingKey].push(text);
                debugLog('binds', `Recorded step for [${recordingKey}]: "${text}"`);
                try { localStorage.setItem(STORAGE_KEY_BINDS, JSON.stringify(currentShortcuts)); } catch (e) {}
                
                if (currentShortcuts[recordingKey].length >= 30) {
                    recordingKey = null;
                }
                
                window.dispatchEvent(new CustomEvent('sh-binds-update')); 
            }
        }
    }, true);

    function findAnswer(textList: string[]): { element: HTMLElement, matchedText: string } | null {
        const paragraphs = Array.from(document.querySelectorAll<HTMLElement>('.answer-card p'))
            .filter(p => p.offsetWidth > 0 && p.offsetHeight > 0);

        for (let target of textList) {
            for (let p of paragraphs) {
                const pText = normalizeText(p.textContent);
                if (pText === target) {
                    return { element: p, matchedText: target }; 
                }
            }
        }
        return null; 
    }

    function processNext(): void {
        if (!isRunning || !active || activeTargets.length === 0) {
            stopScript();
            return;
        }

        const actionMatch = findAnswer(activeTargets);
        if (actionMatch) {
            debugLog('binds', `Matched answer card: "${actionMatch.matchedText}", clicking`);
            const matchIndex = activeTargets.indexOf(actionMatch.matchedText);
            if (matchIndex > -1) activeTargets.splice(matchIndex, 1);
            actionMatch.element.click();
            waitForDustToSettle(); 
            return;
        }
        
        debugLog('binds', 'No matching answer card found for remaining targets:', activeTargets);
        stopScript();
    }

    function waitForDustToSettle(): void {
        if (changeObserver) changeObserver.disconnect();
        clearTimeout(fallbackTimer);
        clearTimeout(enterTimer);
        
        let domChanged = false;

        changeObserver = new MutationObserver(() => {
            if (domChanged) return;
            domChanged = true;
            if (changeObserver) changeObserver.disconnect();
            clearTimeout(fallbackTimer);
            clearTimeout(enterTimer);
            setTimeout(() => { if (isRunning) processNext(); }, 150);
        });
        
        changeObserver.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['disabled', 'class'] });
        
        enterTimer = setTimeout(() => {
            if (!domChanged) {
                debugLog('binds', 'No DOM change after 500ms, triggering Enter key');
                const targetEl = (document.activeElement as HTMLElement) || document.body;
                triggerEnter(targetEl);
            }
        }, 500);
        
        fallbackTimer = setTimeout(() => { if (!domChanged) stopScript(); }, 3000);
    }

    document.addEventListener('keydown', (e: KeyboardEvent) => {
        if (!active) return;
        
        if (e.key === 'F9') {
            awaitingF9 = true;
            debugLog('binds', 'F9 pressed, awaiting F1-F7 to toggle recording');
            return;
        }

        const isFKey = /^F[1-7]$/.test(e.key);

        if (awaitingF9) {
            awaitingF9 = false; 
            if (isFKey) {
                e.preventDefault();
                if (recordingKey === e.key) {
                    window.__binds?.stopRecording();
                } else {
                    window.__binds?.startRecording(e.key);
                }
                return;
            }
        }

        if (!isFKey) return;

        if (recordingKey) {
            e.preventDefault();
            if (e.key === recordingKey) {
                window.__binds?.stopRecording();
            }
            return;
        }
        
        if (currentShortcuts[e.key] && currentShortcuts[e.key].length > 0) {
            e.preventDefault();
            if (!isRunning) {
                isRunning = true;
                activeTargets = compileTargets(currentShortcuts[e.key]);
                debugLog('binds', `Starting playback for [${e.key}]:`, activeTargets);
                processNext();
            } else {
                stopScript();
            }
        }
    }, true);

    window.__binds = {
        enable: (): void => { active = true; debugLog('binds', 'Enabled'); },
        disable: (): void => { 
            active = false; 
            debugLog('binds', 'Disabled');
            stopScript(); 
            recordingKey = null; 
            window.dispatchEvent(new CustomEvent('sh-binds-update')); 
            updateRecordingDot(); 
        },
        isActive: (): boolean => active,
        getShortcuts: () => currentShortcuts,
        updateShortcuts: (newBinds: Record<string, string[]>): void => {
            currentShortcuts = { ...newBinds };
            debugLog('binds', 'Shortcuts updated:', currentShortcuts);
            try { localStorage.setItem(STORAGE_KEY_BINDS, JSON.stringify(currentShortcuts)); } catch (e) {}
        },
        getRecordingKey: () => recordingKey,
        startRecording: (key: string): void => {
            stopScript();
            recordingKey = key;
            currentShortcuts[key] = []; 
            debugLog('binds', `Started recording on [${key}]`);
            try { localStorage.setItem(STORAGE_KEY_BINDS, JSON.stringify(currentShortcuts)); } catch (e) {}
            window.dispatchEvent(new CustomEvent('sh-binds-update'));
            updateRecordingDot();
        },
        stopRecording: (): void => {
            debugLog('binds', `Stopped recording on [${recordingKey}]`);
            recordingKey = null;
            window.dispatchEvent(new CustomEvent('sh-binds-update'));
            updateRecordingDot();
        }
    };
}
