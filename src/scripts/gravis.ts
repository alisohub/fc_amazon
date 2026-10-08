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

    function startWindowMonitor() {
        if (checkInterval) clearInterval(checkInterval);
        checkInterval = setInterval(() => {
            if (gravisWindow && gravisWindow.closed) {
                window.__gravis?.disable();
            }
        }, 500);
    }

    function stopWindowMonitor() {
        if (checkInterval) {
            clearInterval(checkInterval);
            checkInterval = null;
        }
    }

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
            window.__gravis?.disable();
        }
    });
}
