(() => {
    if (window.__autoQuestionnaireLoaded) {
        return;
    }
    window.__autoQuestionnaireLoaded = true;

    let active = false;
    let isRunning = false;
    let changeObserver = null;
    let fallbackTimer = null;
    let enterTimer = null; // New timer for the Enter keypress

    // 1. The Hit List & Kill Switch
    // Note: "brak plomby" is placed before "brak" to ensure exact matches prioritize the longer phrase.
    const TARGET_WORDS = ["opinia", "brak plomby", "brak", "polybag", "nie"];
    const KILL_WORDS = ["tak, kontynuuj"];

    // Helper: Cleans up text to ignore weird Amazon spacing or capitalization
    function normalizeText(txt) {
        return (txt || '').replace(/\s+/g, ' ').trim().toLowerCase();
    }

    // Helper: Scans the page for matching elements
    function findButton(textList) {
        // Step 1: Search inside .answer-card specifically for a nested <p>
        const answerCards = document.querySelectorAll('div.answer-card');
        for (let card of answerCards) {
            const paragraphs = card.querySelectorAll('p');
            for (let p of paragraphs) {
                // Skip hidden elements
                if (p.offsetWidth === 0 || p.offsetHeight === 0) continue;
                
                const pText = normalizeText(p.textContent);
                
                for (let target of textList) {
                    // Exact match for most, but allow partial match (.includes) specifically for "opinia"
                    if (pText === target || (target === 'opinia' && pText.includes(target))) {
                        return p; // Return the specific <p> element to be clicked
                    }
                }
            }
        }

        // Step 2: Fallback for standard buttons (required for "tak, kontynuuj" and standard UI popups)
        const standardButtons = document.querySelectorAll('button, [role="button"], .awsui-button');
        for (let btn of standardButtons) {
            if (btn.offsetWidth === 0 || btn.offsetHeight === 0) continue;
            
            const btnText = normalizeText(btn.textContent);
            
            for (let target of textList) {
                // Fallback allows exact or partial match for standard buttons
                if (btnText === target || btnText.includes(target)) {
                    // 🚨 React fix: If the button has a nested span, click the span instead of the outer button
                    const innerSpan = btn.querySelector('span');
                    return innerSpan ? innerSpan : btn;
                }
            }
        }

        return null;
    }

    // 2. The Reactor Loop
    function processNext() {
        // Stop immediately if the script was disabled or cancelled
        if (!isRunning || !active) return;

        // Step A: Check for the Kill Switch
        const killBtn = findButton(KILL_WORDS);
        if (killBtn) {
            isRunning = false;
            return; // Job done, leave it on the "Tak, kontynuuj" screen
        }

        // Step B: Check for the Hit List
        const actionBtn = findButton(TARGET_WORDS);
        if (actionBtn) {
            actionBtn.click();
            waitForDustToSettle(); // Lock the script and wait for the screen to change
            return;
        }

        // Step C: Graceful Bailout (Unfamiliar screen)
        isRunning = false;
    }

    // 3. The Watcher (Prevents "Ghost Clicks")
    function waitForDustToSettle() {
        if (changeObserver) changeObserver.disconnect();
        clearTimeout(fallbackTimer);
        clearTimeout(enterTimer);

        let domChanged = false;

        // Watch the webpage for any structural changes or loading animations
        changeObserver = new MutationObserver(() => {
            if (domChanged) return;
            domChanged = true;
            changeObserver.disconnect();
            clearTimeout(fallbackTimer);
            clearTimeout(enterTimer);
            
            // Wait an extra 150ms after the DOM changes so React can finish rendering the new buttons
            setTimeout(() => {
                if (isRunning) processNext();
            }, 150);
        });

        changeObserver.observe(document.body, { 
            childList: true, 
            subtree: true, 
            attributes: true, 
            attributeFilter: ['disabled', 'class'] 
        });

        // 4a. The "Stuck UI" Fix: Press Enter if nothing happens after 1 second
        enterTimer = setTimeout(() => {
            if (!domChanged) {
                // Fire an Enter key event on the currently focused element (or the body)
                const targetEl = document.activeElement || document.body;
                
                targetEl.dispatchEvent(new KeyboardEvent('keydown', {
                    key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true, cancelable: true
                }));
                targetEl.dispatchEvent(new KeyboardEvent('keyup', {
                    key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true, cancelable: true
                }));
            }
        }, 500);

        // 4b. Deadlock Protection: Stop entirely if 3 seconds pass
        fallbackTimer = setTimeout(() => {
            if (!domChanged) {
                changeObserver.disconnect();
                isRunning = false; 
            }
        }, 3000);
    }

    // 5. The Trigger
    document.addEventListener('keydown', (e) => {
        if (!active) return;
        
        if (e.key === 'F1') {
            e.preventDefault(); // Prevent F1 from opening the browser's Help menu
            
            if (!isRunning) {
                isRunning = true;
                processNext();
            } else {
                // Emergency Stop: Pressing F1 while it's running forces it to cancel
                isRunning = false;
                if (changeObserver) changeObserver.disconnect();
                clearTimeout(fallbackTimer);
                clearTimeout(enterTimer);
            }
        }
    });

    // 6. Hub Integration Handlers
    window.__autoQuestionnaire = {
        enable: () => { 
            active = true; 
        },
        disable: () => { 
            active = false; 
            isRunning = false;
            if (changeObserver) changeObserver.disconnect();
            clearTimeout(fallbackTimer);
            clearTimeout(enterTimer);
        },
        isActive: () => active
    };
})();