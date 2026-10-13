import { STORAGE_KEY_DEV } from "@shared/constants";

if (!window.__devInspectorLoaded) {
    window.__devInspectorLoaded = true;
    let active: boolean = false;
    
    let settings: DevInspectorSettings = {
        htmlOutput: false,
        networkWiretap: false,
        wiretapOpacity: 0.9
    };

    try {
        const saved = localStorage.getItem(STORAGE_KEY_DEV);
        if (saved) settings = { ...settings, ...JSON.parse(saved) };
    } catch (e) {}

    // --- NETWORK LOGGER UI ---
    const logBox = document.createElement('div');
    logBox.style.cssText = `
        position: fixed; top: 20px; left: 20px; width: 450px; height: 350px;
        background: rgba(255, 255, 255, ${settings.wiretapOpacity}); color: #333;
        font-family: monospace; font-size: 12px; padding: 12px;
        overflow-y: auto; z-index: 9999999; border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15); border: 1px solid #ccc;
        pointer-events: auto; display: none; white-space: pre-wrap;
    `;
    logBox.innerHTML = '<strong style="color: #1a73e8;">📡 NETWORK WIRETAP ACTIVE</strong><br/><br/>';
    document.body.appendChild(logBox);

    function logReq(method: string, url: string) {
        if (!active || !settings.networkWiretap) return;
        if (url.includes('telemetry') || url.includes('metrics') || url.includes('ping')) return;
        
        const time = new Date().toLocaleTimeString();
        const entry = document.createElement('div');
        entry.style.borderBottom = '1px solid #eee';
        entry.style.paddingBottom = '4px';
        entry.style.marginBottom = '4px';
        entry.innerHTML = `<span style="color: #d32f2f; font-weight: bold;">[${method}]</span> <span style="color: #666;">${time}</span><br/>${url.substring(0, 150)}`;
        
        logBox.appendChild(entry);
        logBox.scrollTop = logBox.scrollHeight;
    }

    // 1. Intercept Fetch
    const originalFetch = window.fetch;
    window.fetch = async function(...args: any[]) {
        if (active && settings.networkWiretap) {
            const url = typeof args[0] === 'string' ? args[0] : (args[0] as Request).url;
            const method = args[1]?.method || 'GET';
            logReq(method, url);
        }
        return (originalFetch as any).apply(this, args);
    };

    // 2. Intercept XHR
    const originalXhrOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method: string, url: string | URL, ...rest: any[]) {
        if (active && settings.networkWiretap) {
            logReq(method, url.toString());
        }
        return (originalXhrOpen as any).call(this, method, url, ...rest);
    };

    // 3. HTML Output Click Listener
    function handleClick(e: MouseEvent): void {
        if (!active || !settings.htmlOutput) return;
        
        const target = e.target as HTMLElement;
        if (target.closest('#sh-root') || target === logBox || logBox.contains(target)) return;
        
        if (target.tagName.toLowerCase() === 'a' || target.closest('a')) e.preventDefault();
        
        alert(`🔍 HTML OUTPUT:\n\n${target.outerHTML.substring(0, 1000)}`);
    }

    document.addEventListener('click', handleClick, true);

    function updateUI() {
        if (active && settings.networkWiretap) {
            logBox.style.display = 'block';
            logBox.style.background = `rgba(255, 255, 255, ${settings.wiretapOpacity})`;
        } else {
            logBox.style.display = 'none';
        }
    }

    window.__devInspector = {
        enable: (): void => { active = true; updateUI(); },
        disable: (): void => { active = false; updateUI(); },
        isActive: (): boolean => active,
        getSettings: () => settings,
        updateSettings: (newSettings: Partial<DevInspectorSettings>): void => {
            // Force mutual exclusivity logic programmatically
            if (newSettings.htmlOutput && !settings.htmlOutput) newSettings.networkWiretap = false;
            if (newSettings.networkWiretap && !settings.networkWiretap) newSettings.htmlOutput = false;

            settings = { ...settings, ...newSettings };
            try { localStorage.setItem(STORAGE_KEY_DEV, JSON.stringify(settings)); } catch (e) {}
            updateUI();
        }
    };

    updateUI();
}
