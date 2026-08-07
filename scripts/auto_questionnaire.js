(() => {
    if (window.__autoQuestionnaireLoaded) {
        return;
    }
    window.__autoQuestionnaireLoaded = true;

    let active = false;
    let isRunning = false;
    let changeObserver = null;
    let fallbackTimer = null;
    let enterTimer = null; 

    // 1. The Hit List & Kill Switch
    const TARGET_WORDS = ["opinia", "brak plomby", "brak", "polybag", "nie"];
    const KILL_WORDS = ["tak, kontynuuj"];

    // Helper: Cleans up text to ignore weird Amazon spacing or capitalization
    function normalizeText(txt) {
        return (txt || '').replace(/\s+/g, ' ').trim().toLowerCase();
    }

    // Helper: Scans the page for buttons matching our lists
    function findButton(textList) {
        const buttons = Array.from(document.querySelectorAll('button, [role="button"], .awsui-button, p, .answer-card'));
        
        for (let btn of buttons) {
            if (btn.offsetWidth === 0 || btn.offsetHeight === 0) continue;
            
            const btnText = normalizeText(btn.textContent);
            
            for (let target of textList) {
                if (btnText === target || btnText.includes(target)) {
                    return btn;
                }
            }
        }
        return null;
    }

    // NEW Helper: Tricks React by firing a full sequence of human mouse events
    function simulateClick(element) {
        const events = ['mousedown', 'mouseup', 'click'];
        events.forEach(eventType => {
            const event = new MouseEvent(eventType, {
                bubbles: true,
                cancelable: true,
                view: window
            });
            element.dispatchEvent(event);
        });
    }

    // 2. The Reactor Loop
    function processNext() {
        if (!isRunning || !active) return;

        // Step A: Check for the Kill Switch
        const killBtn = findButton(KILL_WORDS);
        if (killBtn) {
            isRunning = false;
            return; 
        }

        // Step B: Check for the Hit List
        const actionBtn = findButton(TARGET_WORDS);
        if (actionBtn) {
            // Use the new human-simulated click instead of a basic .click()
            simulateClick(actionBtn);
            waitForDustToSettle(); 
            return;
        }

        // Step C: Graceful Bailout
        isRunning = false;
    }

    // 3. The Watcher
    function waitForDustToSettle() {
        if (changeObserver) changeObserver.disconnect();
        clearTimeout(fallbackTimer);
        clearTimeout(enterTimer);

        let domChanged = false;

        changeObserver = new MutationObserver(() => {
            if (domChanged) return;
            domChanged = true;
            changeObserver.disconnect();
            clearTimeout(fallbackTimer);
            clearTimeout(enterTimer);
            
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

        // 4a. The "Stuck UI" Fix
        enterTimer = setTimeout(() => {
            if (!domChanged) {
                const targetEl = document.activeElement || document.body;
                targetEl.dispatchEvent(new KeyboardEvent('keydown', {
                    key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true, cancelable: true
                }));
                targetEl.dispatchEvent(new KeyboardEvent('keyup', {
                    key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true, cancelable: true
                }));
            }
        }, 500);

        // 4b. Deadlock Protection
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
            e.preventDefault(); 
            
            if (!isRunning) {
                isRunning = true;
                processNext();
            } else {
                isRunning = false;
                if (changeObserver) changeObserver.disconnect();
                clearTimeout(fallbackTimer);
                clearTimeout(enterTimer);
            }
        }
    });

    // 6. Hub Integration Handlers
    window.__autoQuestionnaire = {
        enable: () => { active = true; },
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