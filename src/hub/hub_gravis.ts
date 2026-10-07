window.addEventListener('message', (e: MessageEvent) => {
    if (e.source !== window.opener) return; // Ignore irrelevant messages
    
    const data = e.data;
    if (data?.type === 'SYNC_LPN') {
    }
});

// Helper to send messages back to the Main Tab
function sendMessageToMain(type: string, payload: any = null): void {
    if (window.opener) {
        window.opener.postMessage({ type, payload }, '*');
    }
}

// Ping the main tab to announce that Gravis is loaded and ready
sendMessageToMain('GRAVIS_READY');

// Detect when the tab is being closed or refreshed and warn the Main Tab
window.addEventListener('beforeunload', () => {
    sendMessageToMain('GRAVIS_CLOSED');
});

document.addEventListener('keydown', async (e: KeyboardEvent) => {
    if (e.key === 'F10') {
        e.preventDefault();
        
        if (!window.__devInspectorLoaded) {
            try {
                const branch = window.__SH_BRANCH || 'main';
                const url = branch === 'local' 
                    ? 'http://localhost:3000/dist/dev_inspector.js'
                    : `https://raw.githubusercontent.com/alisohub/fc_amazon/refs/heads/${branch}/dist/dev_inspector.js`;
                
                const response = await fetch(url);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const code = await response.text();
                
                const script = document.createElement('script');
                script.textContent = code;
                document.head.appendChild(script);
            } catch (err) {
                alert(`⚠️ Failed to load dev: ${err}`);
                return;
            }
        }

        if (window.__devInspector) {
            if (window.__devInspector.isActive()) {
                window.__devInspector.disable();
            } else {
                window.__devInspector.enable();
            }
        }
    }
});
