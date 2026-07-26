(() => {
    // If already loaded, toggle panel and return
    if (window.__scriptHubLoaded) {
        const panel = document.getElementById('sh-panel');
        if (panel) panel.classList.toggle('sh-open');
        return;
    }
    window.__scriptHubLoaded = true;

    const REPO_BASE_URL = 'https://raw.githubusercontent.com/alisohub/fc_amazon/refs/heads/main/scripts';

    // ==========================================
    // 📦 SCRIPT REGISTRY
    // ==========================================
    const SCRIPTS = [
        {
            id: 'auto-lpn',
            name: 'Auto Reassign LPN',
            file: 'auto_lpn.js',
            description: 'Auto-clicks LPN reassignment on scanner input.',
            getHandler: () => window.__autoLpn
        },
        {
          id: 'counter',
          name: 'Unit Counter',
          file: 'counter.js',
          description: 'Counts.',
          getHandler: () => window.__counter
        }
    ];

    /**
     * Downloads and enables or disables script on checkbox change
     */
    async function handleToggle(scriptObj, checkbox) {
        const isChecked = checkbox.checked;
        let handler = scriptObj.getHandler();

        // Fetch script dynamically if not in memory
        if (isChecked && !handler) {
            checkbox.disabled = true;
            const fullUrl = `${REPO_BASE_URL}/${scriptObj.file}?cb=${Date.now()}`;

            try {
                const response = await fetch(fullUrl);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);

                const jsCode = await response.text();
                const scriptEl = document.createElement('script');
                scriptEl.textContent = jsCode;
                document.head.appendChild(scriptEl);

                handler = scriptObj.getHandler();
                checkbox.disabled = false;
            } catch (err) {
                alert(`⚠️ Failed to load ${scriptObj.name}:\n${err.message}`);
                checkbox.checked = false;
                checkbox.disabled = false;
                return;
            }
        }

        // Trigger state change
        if (handler) {
            if (isChecked) {
                handler.enable();
            } else {
                handler.disable();
            }
        }
    }

    // ==========================================
    // 🎨 UI PANEL & STYLING
    // ==========================================
    function injectUI() {
        const hub = document.createElement('div');
        hub.id = 'sh-root';

        hub.innerHTML = `
      <style>
        #sh-root {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-size: 13px;
          z-index: 999999;
        }
        #sh-panel {
          position: fixed;
          top: 0;
          right: -320px;
          width: 300px;
          height: 100vh;
          z-index: 999998;
          background: #ffffff;
          border-left: 1px solid #e0e0e0;
          box-shadow: -4px 0 16px rgba(0,0,0,0.15);
          transition: right 0.25s ease-in-out;
          display: flex;
          flex-direction: column;
        }
        #sh-panel.sh-open { right: 0; }
        .sh-header {
          background: #232f3e;
          color: white;
          padding: 14px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .sh-header h3 { margin: 0; font-size: 15px; }
        .sh-close { background: none; border: none; color: #aab7c4; font-size: 18px; cursor: pointer; }
        .sh-close:hover { color: white; }
        .sh-body { padding: 12px; overflow-y: auto; flex: 1; }
        .sh-card {
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 12px;
          margin-bottom: 10px;
          background: #f8fafc;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .sh-card-info { flex: 1; padding-right: 10px; }
        .sh-card-title { font-weight: bold; color: #0f172a; margin-bottom: 4px; }
        .sh-card-desc { font-size: 11px; color: #64748b; line-height: 1.3; }

        /* Toggle Switch Styling */
        .sh-switch {
          position: relative;
          display: inline-block;
          width: 38px;
          height: 20px;
          flex-shrink: 0;
        }
        .sh-switch input { opacity: 0; width: 0; height: 0; }
        .sh-slider {
          position: absolute;
          cursor: pointer;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: #cbd5e1;
          transition: .2s;
          border-radius: 20px;
        }
        .sh-slider:before {
          position: absolute;
          content: "";
          height: 14px; width: 14px;
          left: 3px; bottom: 3px;
          background-color: white;
          transition: .2s;
          border-radius: 50%;
        }
        input:checked + .sh-slider { background-color: #16a34a; }
        input:checked + .sh-slider:before { transform: translateX(18px); }
        input:disabled + .sh-slider { opacity: 0.5; cursor: wait; }
      </style>

      <div id="sh-panel">
        <div class="sh-header">
          <h3>⚡ Workstation Tools</h3>
          <button class="sh-close" id="sh-close-btn">✕</button>
        </div>
        <div class="sh-body" id="sh-list"></div>
      </div>
    `;

        document.body.appendChild(hub);

        const closeBtn = document.getElementById('sh-close-btn');
        const panel = document.getElementById('sh-panel');
        const list = document.getElementById('sh-list');

        const togglePanel = () => panel.classList.toggle('sh-open');
        closeBtn.onclick = togglePanel;

        // Listen for F10 key globally
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F10') {
                e.preventDefault(); // Prevents default browser shortcut handling
                togglePanel();
            }
        });

        // Render checkbox cards
        SCRIPTS.forEach(script => {
            const handler = script.getHandler();
            const isCurrentlyActive = handler ? handler.isActive() : false;

            const card = document.createElement('div');
            card.className = 'sh-card';
            card.innerHTML = `
        <div class="sh-card-info">
          <div class="sh-card-title">${script.name}</div>
          <div class="sh-card-desc">${script.description}</div>
        </div>
        <label class="sh-switch">
          <input type="checkbox" id="sh-chk-${script.id}" ${isCurrentlyActive ? 'checked' : ''}>
          <span class="sh-slider"></span>
        </label>
      `;
            list.appendChild(card);

            const chk = card.querySelector(`#sh-chk-${script.id}`);
            chk.onchange = () => handleToggle(script, chk);
        });
    }

    injectUI();
})();
