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

    // F8: Pushes the LPN to the Gravis Tab to start the chain reaction
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
                gravisWindow = window.open('https://eu-cretfc-tools-dub.dub.proxy.amazon.com/gravis', 'GravisApp');
            }
            startWindowMonitor();
        },
        disable: (): void => {
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
            handleGravisDisconnect();
            
        // NEW: Receive the ASIN back from Gravis and alert it!
        } else if (data?.type === 'FOUND_ASIN') {
            if (data.payload === 'NOT_FOUND') {
                alert('ASIN не знайдено на вкладці Gravis.'); // ASIN not found
            } else {
                alert(`ASIN Знайдено: ${data.payload}`);
            }
        }
    });
}
