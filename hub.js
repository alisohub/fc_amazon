(() => {
    if (window.__scriptHubLoaded) {
        const panel = document.getElementById('sh-panel');
        if (panel) panel.classList.toggle('sh-open');
        return;
    }
    window.__scriptHubLoaded = true;

    const REPO_BASE_URL = 'https://raw.githubusercontent.com/alisohub/fc_amazon/refs/heads/main/scripts';

    // ==========================================
    //   SCRIPT REGISTRY
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
            id: 'item-counter',
            name: 'Item Counter',
            file: 'counter.js',
            description: 'Tracks and counts linked items/totes with local persistence.',
            getHandler: () => window.__itemCounter,
            renderSettings: (container) => {
                const handler = window.__itemCounter;
                if (!handler) return;
                const settings = handler.getSettings();
                const currentCount = handler.getCount();

                container.innerHTML = `
                    <div class="sh-settings-divider"></div>
                    <label class="sh-label">Manual Counter Edit:</label>
                    <input type="number" id="sh-cfg-count" class="sh-input" value="${currentCount === 0 ? '' : currentCount}" placeholder="666" />

                    <label class="sh-label" style="margin-top: 12px;">Overlay Opacity (<span id="sh-lbl-opacity">${settings.overlayOpacity}</span>):</label>
                    <input type="range" id="sh-cfg-opacity" class="sh-range" min="0" max="1" step="0.05" value="${settings.overlayOpacity}" />
                `;

                // Handle manual count update
                container.querySelector('#sh-cfg-count').addEventListener('input', (e) => {
                    const val = parseInt(e.target.value, 10);
                    handler.setCount(isNaN(val) ? 0 : val);
                });

                // Handle opacity update
                container.querySelector('#sh-cfg-opacity').addEventListener('input', (e) => {
                    const val = parseFloat(e.target.value);
                    container.querySelector('#sh-lbl-opacity').textContent = val;
                    handler.updateSettings({ overlayOpacity: val });
                });
            }
        }
    ];

    async function handleToggle(scriptObj, checkbox, settingsContainer) {
        const isChecked = checkbox.checked;
        let handler = scriptObj.getHandler();

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

        if (handler) {
            if (isChecked) {
                handler.enable();
                if (scriptObj.renderSettings && settingsContainer) {
                    settingsContainer.style.display = 'block';
                    scriptObj.renderSettings(settingsContainer);
                }
            } else {
                handler.disable();
                if (settingsContainer) {
                    settingsContainer.style.display = 'none';
                    settingsContainer.innerHTML = '';
                }
            }
        }
    }

    function injectUI() {
        const hub = document.createElement('div');
        hub.id = 'sh-root';
        hub.innerHTML = `
            <style>
                /* Material UI Reset & Base */
                #sh-root {
                    font-family: 'Roboto', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
                    z-index: 999999;
                }
                #sh-panel {
                    position: fixed;
                    top: 0;
                    right: -340px;
                    width: 320px;
                    height: 100vh;
                    z-index: 999998;
                    background: #f8f9fa; /* Material Surface */
                    box-shadow: -8px 0 24px rgba(0,0,0,0.12);
                    transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    flex-direction: column;
                }
                #sh-panel.sh-open { right: 0; }

                /* Header */
                .sh-header {
                    background: #ffffff;
                    padding: 16px 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid #e0e0e0;
                }
                .sh-header h3 {
                    margin: 0;
                    font-size: 16px;
                    font-weight: 500;
                    color: #202124;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .sh-close {
                    background: transparent;
                    border: none;
                    color: #5f6368;
                    font-size: 20px;
                    cursor: pointer;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.2s, color 0.2s;
                }
                .sh-close:hover {
                    background: rgba(0,0,0,0.04);
                    color: #202124;
                }

                /* Body & Cards */
                .sh-body {
                    padding: 16px;
                    overflow-y: auto;
                    flex: 1;
                }
                .sh-card {
                    background: #ffffff;
                    border: 1px solid #dadce0;
                    border-radius: 12px;
                    padding: 16px;
                    margin-bottom: 12px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
                    display: flex;
                    flex-direction: column;
                    transition: box-shadow 0.2s;
                }
                .sh-card:hover { box-shadow: 0 4px 8px rgba(0,0,0,0.08); }
                .sh-card-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                }
                .sh-card-info { flex: 1; padding-right: 16px; }
                .sh-card-title { font-weight: 500; color: #202124; font-size: 14px; margin-bottom: 4px; }
                .sh-card-desc { font-size: 12px; color: #5f6368; line-height: 1.4; }

                /* Material 3 Toggle Switch */
                .sh-switch { position: relative; display: inline-block; width: 36px; height: 20px; flex-shrink: 0; margin-top: 2px; }
                .sh-switch input { opacity: 0; width: 0; height: 0; }
                .sh-slider {
                    position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
                    background-color: #dadce0; transition: .3s; border-radius: 20px;
                }
                .sh-slider:before {
                    position: absolute; content: ""; height: 16px; width: 16px; left: 2px; bottom: 2px;
                    background-color: white; transition: .3s; border-radius: 50%; box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                }
                input:checked + .sh-slider { background-color: #1a73e8; }
                input:checked + .sh-slider:before { transform: translateX(16px); }
                input:disabled + .sh-slider { opacity: 0.5; cursor: not-allowed; }

                /* Settings Container Styles */
                .sh-card-settings { display: none; margin-top: 12px; }
                .sh-settings-divider { height: 1px; background: #f1f3f4; margin: 12px 0; }
                .sh-label { display: block; font-size: 12px; font-weight: 500; color: #5f6368; margin-bottom: 6px; }
                .sh-input {
                    width: 100%; padding: 8px 12px; font-size: 13px; color: #202124;
                    background: #ffffff; border: 1px solid #dadce0; border-radius: 6px;
                    box-sizing: border-box; transition: border 0.2s, box-shadow 0.2s; outline: none;
                }
                .sh-input:focus { border-color: #1a73e8; box-shadow: 0 0 0 1px #1a73e8 inset; }
                .sh-range { width: 100%; cursor: pointer; accent-color: #1a73e8; }
            </style>
            <div id="sh-panel">
                <div class="sh-header">
                    <h3>🛠️ Workstation Tools</h3>
                    <button class="sh-close" id="sh-close-btn" title="Close">✖</button>
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

        // Smart "menu" key buffer (Ignores inputs so you can scan/type freely)
        let keyBuffer = '';
        document.addEventListener('keydown', (e) => {
            // Ignore keystrokes if the user is typing inside an input box or text area
            const activeTag = e.target.tagName;
            if (activeTag === 'INPUT' || activeTag === 'TEXTAREA' || activeTag === 'SELECT') return;

            if (e.key.length === 1) {
                keyBuffer += e.key.toLowerCase();
                if (keyBuffer.length > 5) keyBuffer = keyBuffer.slice(-5);
                if (keyBuffer.endsWith('menu')) {
                    togglePanel();
                    keyBuffer = ''; // reset after opening
                }
            }
        });

        SCRIPTS.forEach(script => {
            const handler = script.getHandler();
            const isCurrentlyActive = handler ? handler.isActive() : false;

            const card = document.createElement('div');
            card.className = 'sh-card';
            card.innerHTML = `
                <div class="sh-card-top">
                    <div class="sh-card-info">
                        <div class="sh-card-title">${script.name}</div>
                        <div class="sh-card-desc">${script.description}</div>
                    </div>
                    <label class="sh-switch">
                        <input type="checkbox" id="sh-chk-${script.id}" ${isCurrentlyActive ? 'checked' : ''}>
                        <span class="sh-slider"></span>
                    </label>
                </div>
                <div class="sh-card-settings" id="sh-settings-${script.id}"></div>
            `;
            list.appendChild(card);

            const chk = card.querySelector(`#sh-chk-${script.id}`);
            const settingsContainer = card.querySelector(`#sh-settings-${script.id}`);

            if (isCurrentlyActive && script.renderSettings) {
                settingsContainer.style.display = 'block';
                script.renderSettings(settingsContainer);
            }

            chk.onchange = () => handleToggle(script, chk, settingsContainer);
        });
    }
    injectUI();
})();
