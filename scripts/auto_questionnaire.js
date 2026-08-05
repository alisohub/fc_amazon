(() => {
    if (window.__autoQuestionnaireLoaded) {
        return;
    }
    window.__autoQuestionnaireLoaded = true;

    let active = false;
    let isRunning = false;
    let changeObserver = null;
    let fallbackTimer = null;

    // 1. The Hit List & Kill Switch
    // Note: "brak plomby" is placed before "brak" to ensure exact matches prioritize the longer phrase.
    const TARGET_WORDS = ["opinia", "brak plomby", "brak", "polybag", "nie"];
    const KILL_WORDS = ["tak, kontynuuj"];

    // Helper: Cleans up text to ignore weird Amazon spacing or capitalization
    function normalizeText(txt) {
        return (txt || '').replace(/\s+/g, ' ').trim().toLowerCase();
    }

    // Helper: Scans the page for buttons matching our lists
    function findButton(textList) {
        // Amazon uses standard <button>, elements with role="button", or custom awsui buttons
        const buttons = Array.from(document.querySelectorAll('button, [role="button"], .awsui-button'));
        
        for (let btn of buttons) {
            // Skip hidden buttons (width/height of 0)
            if (btn.offsetWidth === 0 || btn.offsetHeight === 0) continue;
            
            const btnText = normalizeText(btn.textContent);
            
            for (let target of textList) {
                // Check for exact match first, then fallback to partial match
                if (btnText === target || btnText.includes(target)) {
                    return btn;
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

        let domChanged = false;

        // Watch the webpage for any structural changes or loading animations
        changeObserver = new MutationObserver(() => {
            if (domChanged) return;
            domChanged = true;
            changeObserver.disconnect();
            clearTimeout(fallbackTimer);
            
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

        // 4. Deadlock Protection
        // If we clicked a button but the DOM didn't change within 3 seconds, assume an error occurred and stop.
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
        },
        isActive: () => active
    };
})();