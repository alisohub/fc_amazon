import { STORAGE_KEY_LPN } from '@shared/constants';

if (!window.__gravisLoaded) {
    window.__gravisLoaded = true;
    
    let active: boolean = false;
    let gravisWindow: Window | null = null;
    let checkInterval: ReturnType<typeof setInterval> | null = null;

    function syncHubUI(isActive: boolean): void {
        const chk = document.getElementById('sh-chk-gravis') as HTMLInputElement | null;
        if (chk && chk.checked !== isActive) {
            chk.checked = isActive;
        }
    }

    // NEW: Safe disconnect logic that updates the Hub WITHOUT killing the tab
    function handleGravisDisconnect() {
        active = false;
        stopWindowMonitor();
        gravisWindow = null;
        syncHubUI(false);
    }

    function startWindowMonitor() {
        if (checkInterval) clearInterval(checkInterval);
        checkInterval = setInterval(() => {
            if (gravisWindow && gravisWindow.closed) {
                // Use safe disconnect instead of .disable()
                handleGravisDisconnect();
            }
        }, 500);
    }

    function stopWindowMonitor() {
        if (checkInterval) {
            clearInterval(checkInterval);
            checkInterval = null;
        }
    }

    document.addEventListener('keydown', (e: KeyboardEvent) => {
        if (!active || !gravisWindow || gravisWindow.closed) return;
        
        if (e.key === 'F8') {
            e.preventDefault();
            const savedLpn = localStorage.getItem(STORAGE_KEY_LPN);
            if (savedLpn) {
                gravisWindow.postMessage({ type: 'SYNC_LPN', payload: savedLpn }, '*');
            } else {
                alert("Немає збереженого LPN для відправки.");
            }
        }
    });

    window.__gravis = {
        enable: (): void => {
            active = true;
            
            if (!gravisWindow || gravisWindow.closed) {
                // This reconnects to the tab. It will cause a reload.
                gravisWindow = window.open('https://eu-cretfc-tools-dub.dub.proxy.amazon.com/gravis', 'GravisApp');
            }
            startWindowMonitor();
        },
        disable: (): void => {
            // ONLY execute this if the user manually toggles the switch OFF
            active = false;
            stopWindowMonitor();
            
            if (gravisWindow && !gravisWindow.closed) {
                gravisWindow.close(); 
            }
            gravisWindow = null;
            syncHubUI(false);
        },
        isActive: (): boolean => active
    };

    window.addEventListener('message', (e: MessageEvent) => {
        const data = e.data;
        
        if (data?.type === 'GRAVIS_READY') {
            active = true;
            syncHubUI(true);
            
            if (!gravisWindow) {
                gravisWindow = e.source as Window;
                startWindowMonitor();
            }
            
        } else if (data?.type === 'GRAVIS_CLOSED') {
            // Use safe disconnect instead of .disable() so the tab survives the reload
            handleGravisDisconnect();
        }
    });
}
