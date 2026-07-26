(() => {
    // Prevent duplicate UI instances on multiple executions
    if (window.__scriptHubLoaded) {
        const panel = document.getElementById('sh-panel');
        if (panel) panel.classList.toggle('sh-open');
        return;
    }
    window.__scriptHubLoaded = true;

    // Base raw directory matching your exact GitHub path + scripts folder
    const REPO_BASE_URL = 'https://raw.githubusercontent.com/alisohub/fc_amazon/refs/heads/main/scripts';

    // ==========================================
    // 📦 SCRIPT REGISTRY
    // List only the filenames sitting inside your "scripts" folder!
    // ==========================================
    const SCRIPTS = [
        {
            id: 'auto-lpn',
            name: 'Auto Reassign LPN',
            file: 'auto_lpn.js',
            description: 'Auto-clicks LPN reassignment on scanner input.'
        },
        {
            id: 'future-tool',
            name: 'Future Automation',
            file: 'future_tool.js',
            description: 'Placeholder for your next workstation automation.'
        }
    ];

    /**
     * Fetches target script dynamically from your /scripts folder
     */
    async function fetchAndRunScript(scriptObj, btnElement) {
        const originalText = btnElement.innerText;
        btnElement.innerText = 'Downloading...';
        btnElement.disabled = true;

        // Build target URL: .../main/scripts/ + filename + cache-buster timestamp
        const fullUrl = `${REPO_BASE_URL}/${scriptObj.file}?cb=${Date.now()}`;

        try {
            const response = await fetch(fullUrl);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status} - Could not retrieve file 'scripts/${scriptObj.file}'`);
            }

            const jsCode = await response.text();

            // Inject script directly into current DOM context
            const scriptEl = document.createElement('script');
            scriptEl.textContent = jsCode;
            document.head.appendChild(scriptEl);

            btnElement.innerText = 'Active ✅';
            btnElement.style.background = '#16a34a';
        } catch (err) {
            alert(`⚠️ Failed to execute "${scriptObj.name}":\n${err.message}`);
            btnElement.innerText = originalText;
            btnElement.disabled = false;
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
        #sh-toggle {
          position: fixed;
          top: 100px;
          right: 0;
          z-index: 999999;
          background: #232f3e;
          color: #ffffff;
          border: 1px solid #3a4d61;
          border-right: none;
          border-radius: 6px 0 0 6px;
          padding: 8px 12px;
          cursor: pointer;
          font-weight: bold;
          box-shadow: -2px 2px 8px rgba(0,0,0,0.2);
          transition: background 0.2s;
        }
        #sh-toggle:hover { background: #37475a; }
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
        .sh-close {
          background: none;
          border: none;
          color: #aab7c4;
          font-size: 18px;
          cursor: pointer;
        }
        .sh-close:hover { color: white; }
        .sh-body { padding: 12px; overflow-y: auto; flex: 1; }
        .sh-card {
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 12px;
          margin-bottom: 10px;
          background: #f8fafc;
        }
        .sh-card-title { font-weight: bold; color: #0f172a; margin-bottom: 4px; }
        .sh-card-desc { font-size: 11px; color: #64748b; margin-bottom: 10px; line-height: 1.3; }
        .sh-btn {
          width: 100%;
          background: #0066cc;
          color: white;
          border: none;
          padding: 6px 10px;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }
        .sh-btn:hover { background: #0052a3; }
      </style>

      <button id="sh-toggle" title="Toggle Script Panel">⚡ Scripts</button>

      <div id="sh-panel">
        <div class="sh-header">
          <h3>⚡ Workstation Scripts</h3>
          <button class="sh-close" id="sh-close-btn">✕</button>
        </div>
        <div class="sh-body" id="sh-list"></div>
      </div>
    `;

        document.body.appendChild(hub);

        const toggleBtn = document.getElementById('sh-toggle');
        const closeBtn = document.getElementById('sh-close-btn');
        const panel = document.getElementById('sh-panel');
        const list = document.getElementById('sh-list');

        const togglePanel = () => panel.classList.toggle('sh-open');
        toggleBtn.onclick = togglePanel;
        closeBtn.onclick = togglePanel;

        // Render registered script cards
        SCRIPTS.forEach(script => {
            const card = document.createElement('div');
            card.className = 'sh-card';
            card.innerHTML = `
        <div class="sh-card-title">${script.name}</div>
        <div class="sh-card-desc">${script.description}</div>
        <button class="sh-btn" id="sh-run-${script.id}">Run Script</button>
      `;
            list.appendChild(card);

            const runBtn = card.querySelector(`#sh-run-${script.id}`);
            runBtn.onclick = () => fetchAndRunScript(script, runBtn);
        });
    }

    injectUI();
})();
