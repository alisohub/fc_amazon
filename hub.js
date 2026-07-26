(() => {
    if (window.__scriptHubLoaded) {
        const panel = document.getElementById('sh-panel');
        if (panel) panel.classList.toggle('sh-open');
        return;
    }
    window.__scriptHubLoaded = true;

    const REPO_BASE_URL = 'https://raw.githubusercontent.com/alisohub/fc_amazon/refs/heads/main/scripts';

    // Global Language State
    let currentLang = localStorage.getItem('sh_hub_lang') || 'EN';

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
            description: 'Tracks and counts linked items with local persistence.',
            getHandler: () => window.__itemCounter,
            renderSettings: (container) => {
                const handler = window.__itemCounter;
                if (!handler) return;
                const settings = handler.getSettings();
                const currentCount = handler.getCount();

                container.innerHTML = `
                    <div class="sh-settings-divider"></div>

                    <div class="sh-setting-row" title="Options & Manual Edit">
                        <span class="sh-emoji">🍴</span>

                        <div class="sh-opt-group">
                            <div class="sh-opt-btn ${settings.counterOption === 1 ? 'active' : ''}" data-val="1">1</div>
                            <div class="sh-opt-btn ${settings.counterOption === 2 ? 'active' : ''}" data-val="2">2</div>
                            <div class="sh-opt-btn ${settings.counterOption === 3 ? 'active' : ''}" data-val="3">3</div>
                            <div class="sh-opt-btn ${settings.counterOption === 4 ? 'active' : ''}" data-val="4">4</div>
                        </div>

                        <input type="number" id="sh-cfg-count" class="sh-input sh-input-small" min="0" value="${currentCount === 0 ? '' : currentCount}" placeholder="666" />
                    </div>

                    <div class="sh-setting-row" title="Overlay Opacity">
                        <span class="sh-emoji">👻</span>
                        <input type="range" id="sh-cfg-opacity" class="sh-range" min="0" max="1" step="0.05" value="${settings.overlayOpacity}" />
                    </div>
                `;

                // Handle Options Selection
                container.querySelectorAll('.sh-opt-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        container.querySelectorAll('.sh-opt-btn').forEach(b => b.classList.remove('active'));
                        e.target.classList.add('active');
                        const val = parseInt(e.target.getAttribute('data-val'), 10);
                        handler.updateSettings({ counterOption: val });
                    });
                });

                // Handle Manual Count Update (Prevent negative numbers)
                container.querySelector('#sh-cfg-count').addEventListener('input', (e) => {
                    let val = parseInt(e.target.value, 10);
                    if (isNaN(val)) val = 0;
                    if (val < 0) {
                        val = 0;
                        e.target.value = 0; // Revert visually in input
                    }
                    handler.setCount(val);
                });

                // Handle Opacity Slider
                container.querySelector('#sh-cfg-opacity').addEventListener('input', (e) => {
                    const val = parseFloat(e.target.value);
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
                #sh-root { font-family: 'Roboto', -apple-system, sans-serif; z-index: 999999; }

                /* Right-Side Panel */
                #sh-panel {
                    position: fixed; top: 0; right: -340px; width: 320px; height: 100vh;
                    z-index: 999998; background: #fafafa; box-shadow: -4px 0 24px rgba(0,0,0,0.12);
                    transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex; flex-direction: column;
                }
                #sh-panel.sh-open { right: 0; }

                /* Header */
                .sh-header {
                    background: #ffffff; padding: 14px 16px; display: flex;
                    justify-content: space-between; align-items: center;
                    border-bottom: 1px solid #e0e0e0; gap: 8px;
                }

                /* Language Dropdown */
                .sh-lang-dropdown {
                    background: #f1f3f4; border: 1px solid transparent; border-radius: 6px;
                    padding: 4px 6px; font-size: 12px; color: #444746; font-weight: 600;
                    cursor: pointer; outline: none; transition: background 0.2s, border 0.2s;
                }
                .sh-lang-dropdown:hover { background: #e8eaed; }
                .sh-lang-dropdown:focus { border-color: #1a73e8; background: #ffffff; }

                .sh-title-wrapper { flex: 1; display: flex; justify-content: center; overflow: hidden; }
                .sh-header h3 { margin: 0; font-size: 15px; font-weight: 500; color: #202124; white-space: nowrap; }

                .sh-close {
                    background: none; border: none; color: #5f6368; font-size: 20px;
                    cursor: pointer; display: flex; align-items: center; justify-content: center;
                    width: 28px; height: 28px; border-radius: 50%; padding: 0; line-height: 1;
                }
                .sh-close:hover { background: rgba(0,0,0,0.05); color: #202124; }

                /* Cards */
                .sh-body { padding: 16px; overflow-y: auto; flex: 1; }
                .sh-card {
                    background: #ffffff; border: 1px solid #dadce0; border-radius: 10px;
                    padding: 14px; margin-bottom: 12px; box-shadow: 0 1px 2px rgba(0,0,0,0.03);
                }
                .sh-card-top { display: flex; justify-content: space-between; align-items: flex-start; }
                .sh-card-info { flex: 1; padding-right: 12px; }
                .sh-card-title { font-weight: 500; font-size: 14px; color: #202124; margin-bottom: 4px; }
                .sh-card-desc { font-size: 12px; color: #5f6368; line-height: 1.3; }

                /* Settings UI */
                .sh-card-settings { display: none; margin-top: 10px; }
                .sh-settings-divider { height: 1px; background: #f1f3f4; margin: 10px 0; }
                .sh-setting-row { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
                .sh-emoji { font-size: 16px; line-height: 1; opacity: 0.8; }

                /* Option Buttons */
                .sh-opt-group { display: flex; gap: 4px; flex: 1; }
                .sh-opt-btn {
                    background: #ffffff; border: 1px solid #dadce0; border-radius: 6px;
                    color: #5f6368; font-size: 12px; font-weight: 600; padding: 4px 0;
                    flex: 1; text-align: center; cursor: pointer; transition: all 0.2s;
                }
                .sh-opt-btn:hover:not(.active) { background: #f1f3f4; }
                .sh-opt-btn.active { background: #1a73e8; border-color: #1a73e8; color: #ffffff; }

                /* Inputs */
                .sh-input {
                    padding: 6px 10px; font-size: 13px; border: 1px solid #dadce0;
                    border-radius: 6px; box-sizing: border-box; outline: none; transition: border 0.2s;
                }
                .sh-input:focus { border-color: #1a73e8; }
                .sh-input-small { width: 35%; flex: 0 0 35%; }

                .sh-range { flex: 1; accent-color: #1a73e8; cursor: pointer; }

                /* Switch */
                .sh-switch { position: relative; width: 34px; height: 20px; flex-shrink: 0; margin-top: 2px;}
                .sh-switch input { opacity: 0; width: 0; height: 0; }
                .sh-slider {
                    position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
                    background-color: #dadce0; transition: .3s; border-radius: 20px;
                }
                .sh-slider:before {
                    position: absolute; content: ""; height: 14px; width: 14px; left: 3px; bottom: 3px;
                    background-color: white; transition: .3s; border-radius: 50%; box-shadow: 0 1px 2px rgba(0,0,0,0.2);
                }
                input:checked + .sh-slider { background-color: #1a73e8; }
                input:checked + .sh-slider:before { transform: translateX(14px); }
            </style>

            <div id="sh-panel">
                <div class="sh-header">
                    <select id="sh-lang-select" class="sh-lang-dropdown">
                        <option value="EN" ${currentLang === 'EN' ? 'selected' : ''}>EN</option>
                        <option value="PL" ${currentLang === 'PL' ? 'selected' : ''}>PL</option>
                        <option value="UA" ${currentLang === 'UA' ? 'selected' : ''}>UA</option>
                    </select>

                    <div class="sh-title-wrapper">
                        <h3>🛠️ Workstation</h3>
                    </div>

                    <button class="sh-close" id="sh-close-btn" title="Close">✖</button>
                </div>
                <div class="sh-body" id="sh-list"></div>
            </div>
        `;
        document.body.appendChild(hub);

        const panel = document.getElementById('sh-panel');
        document.getElementById('sh-close-btn').onclick = () => panel.classList.toggle('sh-open');

        // Language Selector Logic
        const langSelect = document.getElementById('sh-lang-select');
        langSelect.addEventListener('change', (e) => {
            currentLang = e.target.value;
            localStorage.setItem('sh_hub_lang', currentLang);
            console.log(`🌍 Hub language set to: ${currentLang}`);
        });

        // Key buffer for opening menu (ignores input fields)
        let keyBuffer = '';
        document.addEventListener('keydown', (e) => {
            const tag = e.target.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

            if (e.key.length === 1) {
                keyBuffer += e.key.toLowerCase();
                if (keyBuffer.length > 5) keyBuffer = keyBuffer.slice(-5);
                if (keyBuffer.endsWith('menu')) {
                    panel.classList.toggle('sh-open');
                    keyBuffer = '';
                }
            }
        });

        // Render Cards
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
            document.getElementById('sh-list').appendChild(card);

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
