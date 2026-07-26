(() => {
  // Prevent duplicate execution/listeners
  if (window.__counterLoaded) {
    console.log('⚡ Tote Counter is already loaded in memory.');
    return;
  }
  window.__counterLoaded = true;

  // --- CONFIGURATION ---
  // Matches barcodes starting with 'tsx' followed by alphanumeric characters
  const TOTE_REGEX = /^tsx[a-z0-9]+/i;

  // Keywords used by workstation UI notifications (Multilingual: EN, PL, UK)
  const SUCCESS_TEXTS = [
    'success',
    'linked',
    'pomyślnie',
    'przypisano',
    'успішно'
  ];

  const ERROR_TEXTS = [
    'error',
    'invalid',
    'failed',
    'błąd',
    'nieprawidłow',
    'помилка'
  ];

  // --- STATE ---
  let itemCounter = 0;
  let active = false;
  let cooldownUntil = 0;

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

  // --- UI BADGE UPDATER ---
  function updateCounterUI(count) {
    const badge = document.getElementById('sh-tote-count');
    if (badge) {
      badge.textContent = count;
    }
  }

  // --- DOM OBSERVER FOR NOTIFICATIONS ---
  function verifyAndCount(scannedBarcode) {
    let resolved = false;

    const observer = new MutationObserver(() => {
      if (resolved) return;

      // Select visible candidate elements likely to contain notification text
      const candidates = document.querySelectorAll('div, section, p, span, [role="alert"], [role="status"]');

      for (const el of candidates) {
        // Skip hidden elements, elements inside our Hub, or huge structural blocks
        if (el.offsetParent === null || el.closest('#sh-root')) continue;

        const text = el.textContent.toLowerCase().replace(/\s+/g, ' ').trim();
        if (!text || text.length > 200) continue;

        // 1. CHECK FOR ERROR NOTIFICATION
        const hasError = ERROR_TEXTS.some(keyword => text.includes(keyword));
        if (hasError) {
          resolved = true;
          console.warn(`❌ Tote Scan rejected [${scannedBarcode}]: "${text}"`);
          cooldownUntil = 0; // Reset cooldown so operator can retry immediately
          observer.disconnect();
          return;
        }

        // 2. CHECK FOR SUCCESS NOTIFICATION
        const hasSuccess = SUCCESS_TEXTS.some(keyword => text.includes(keyword));
        if (hasSuccess) {
          resolved = true;
          itemCounter++;
          console.log(`✅ Successful Tote Linkage: [${scannedBarcode}] | Total: ${itemCounter}`);
          updateCounterUI(itemCounter);
          observer.disconnect();
          return;
        }
      }
    });

    // Start watching DOM changes right after input/submit
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });

    // Fallback: Stop observing after 2.5s if no notification appeared
    setTimeout(() => {
      if (!resolved) {
        observer.disconnect();
        console.log('⏱️ Verification timeout reached without explicit success/error message.');
      }
    }, 2500);
  }

  // --- CORE EVENT HANDLER ---
  function handleInput(e) {
    if (!active) return;

    const input = e.target;

    // 1. Ignore inputs inside the Script Hub UI
    if (input.closest('#sh-root')) return;

    // 2. Ignore non-inputs, hidden/disabled inputs, or inputs inside popups/modals
    if (!input.matches('input:not([type="hidden"]):not([disabled])') || isInsideModal(input)) return;

    const rawValue = input.value?.trim();
    if (!rawValue) return;

    // 3. Verify value matches Tote Regex (tsx...)
    if (!TOTE_REGEX.test(rawValue)) return;

    // 4. Rate-limiting check
    const now = Date.now();
    if (now < cooldownUntil) return;
    cooldownUntil = now + 1500; // 1.5s lockout window

    // 5. Trigger observer validation
    verifyAndCount(rawValue);
  }

  // Attach input capture listener
  document.addEventListener('input', handleInput, true);

  // --- PUBLIC HUB INTERFACE ---
  window.__toteCounter = {
    enable: () => {
      active = true;
      console.log('✅ Tote Counter Enabled');
    },
    disable: () => {
      active = false;
      console.log('⏸️ Tote Counter Disabled');
    },
    isActive: () => active,
    getCount: () => itemCounter,
    resetCount: () => {
      itemCounter = 0;
      updateCounterUI(0);
      console.log('🔄 Tote Counter Reset to 0');
    }
  };

  // Auto-enable when loaded via Hub
  window.__toteCounter.enable();
})();
